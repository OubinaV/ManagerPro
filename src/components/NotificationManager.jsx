import React, { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useNotification } from '@/contexts/NotificationContext';
import { format, subMonths, startOfMonth, getDate, getDay } from 'date-fns';

const NotificationManager = () => {
    const { user } = useAuth();
    const { showNotification, notificationsEnabled } = useNotification();

    const checkExpenseNotifications = useCallback(async () => {
        if (!user) return;

        const today = new Date();
        const todayDayOfMonth = getDate(today);

        const { data: expenses, error } = await supabase
            .from('monthly_expense_entries')
            .select(`
                id,
                status,
                fixed_expenses ( concept, start_date )
            `)
            .eq('user_id', user.id)
            .eq('month', format(startOfMonth(today), 'yyyy-MM-dd'))
            .eq('status', 'pending');

        if (error) {
            console.error('Error fetching pending expenses for notifications:', error);
            return;
        }
        
        const dueToday = expenses.filter(expense => {
            const paymentDay = getDay(new Date(expense.fixed_expenses.start_date.replace(/-/g, '/')));
            return paymentDay === todayDayOfMonth;
        });

        dueToday.forEach(expense => {
            showNotification({
                id: `expense-${expense.id}`,
                title: 'Recordatorio de Pago',
                description: `Hoy es el día de pago para: ${expense.fixed_expenses.concept}.`,
            });
        });

    }, [user, showNotification]);

    const checkTransferNotification = useCallback(async () => {
        if (!user) return;

        const today = new Date();
        const prevMonth = startOfMonth(subMonths(today, 1));
        const prevMonthString = format(prevMonth, 'yyyy-MM-dd');
        
        const { data: transfer, error } = await supabase
            .from('savings_transfers')
            .select('id')
            .eq('user_id', user.id)
            .eq('month', prevMonthString)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching transfer status:', error);
            return;
        }

        if (!transfer) {
            showNotification({
                id: `transfer-${prevMonthString}`,
                title: 'Transferencia Pendiente',
                description: `Recuerda realizar la transferencia de ganancias del mes de ${format(prevMonth, 'MMMM')}.`,
            });
        }
    }, [user, showNotification]);

    useEffect(() => {
        if (!notificationsEnabled) return;

        const today = new Date();
        const lastCheck = localStorage.getItem('lastNotificationCheck');
        const todayString = today.toDateString();

        if (lastCheck !== todayString) {
            checkExpenseNotifications();

            // Only check for transfers at the start of the month for a few days
            if (today.getDate() <= 5) {
                checkTransferNotification();
            }

            localStorage.setItem('lastNotificationCheck', todayString);
        }
    }, [notificationsEnabled, checkExpenseNotifications, checkTransferNotification]);

    return null;
};

export default NotificationManager;