import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PiggyBank, CheckCircle, Clock } from 'lucide-react';
import { format, startOfMonth, getDate } from 'date-fns';

const frequencyMap = {
  monthly: 'Mensual',
  bimonthly: 'Bimensual',
  quarterly: 'Trimestral',
  semiannually: 'Semestral',
  annually: 'Anual',
};

const MonthlyExpensesView = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0 });
    const [totalSavings, setTotalSavings] = useState(0);

    const fetchMonthlyData = useCallback(async () => {
        setLoading(true);
        const today = new Date();
        const monthStart = startOfMonth(today);
        const monthStartString = format(monthStart, 'yyyy-MM-dd');

        // Generate expenses for the month
        const { error: generationError } = await supabase.rpc('generate_monthly_expenses_for_user', { p_user_id: user.id });
        if (generationError) {
            console.error('Error generating monthly expenses:', generationError);
        }
        
        // Fetch expenses
        const { data: expensesData, error: expensesError } = await supabase
            .from('monthly_expense_entries')
            .select(`*, fixed_expenses (concept, frequency, start_date)`)
            .eq('user_id', user.id)
            .eq('month', monthStartString);

        if (expensesError) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los gastos del mes.' });
            setMonthlyExpenses([]);
        } else {
            setMonthlyExpenses(expensesData);
            const total = expensesData.reduce((acc, expense) => acc + expense.amount, 0);
            const paid = expensesData.filter(e => e.status === 'paid').reduce((acc, expense) => acc + expense.amount, 0);
            setStats({ total, paid, pending: total - paid });
        }

        // Fetch total savings
        const { data: savingsData, error: savingsError } = await supabase
            .from('monthly_savings')
            .select('amount')
            .eq('user_id', user.id);

        if (savingsError) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar el ahorro total.' });
        } else {
            const total = savingsData.reduce((acc, s) => acc + s.amount, 0);
            setTotalSavings(total);
        }

        setLoading(false);
    }, [user.id, toast]);
    
    useEffect(() => {
        fetchMonthlyData();
    }, [fetchMonthlyData]);

    const handleTogglePaid = async (expense) => {
        const newStatus = expense.status === 'paid' ? 'pending' : 'paid';
        const { error } = await supabase.rpc('handle_expense_payment', {
            p_entry_id: expense.id,
            p_new_status: newStatus
        });
        
        if (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar el estado del gasto.' });
        } else {
            toast({ title: 'Éxito', description: 'Estado del gasto actualizado.' });
            fetchMonthlyData();
        }
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-60">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
            </div>
        );
    }
    
    return (
        <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-effect border-white/20 col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-white">Ahorro Total</CardTitle>
                        <PiggyBank className="h-5 w-5 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalSavings)}</div>
                        <p className="text-xs text-gray-400">Fondo acumulado</p>
                    </CardContent>
                </Card>
                <Card className="glass-effect border-white/20 col-span-2">
                     <CardHeader className="pb-2">
                         <CardTitle className="text-lg font-bold text-white">Gastos de Este Mes</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="flex justify-around items-center pt-2">
                            <div className="text-center">
                                <p className="text-sm text-gray-400">Total</p>
                                <p className="text-xl font-bold text-white">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(stats.total)}</p>
                            </div>
                             <div className="text-center">
                                <p className="text-sm text-gray-400">Pagados</p>
                                <p className="text-xl font-bold text-green-400">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(stats.paid)}</p>
                            </div>
                             <div className="text-center">
                                <p className="text-sm text-gray-400">Pendientes</p>
                                <p className="text-xl font-bold text-red-400">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(stats.pending)}</p>
                            </div>
                        </div>
                     </CardContent>
                </Card>
            </div>
            
            <Card className="glass-effect border-white/20">
                <CardContent className="p-0">
                    <div className="divide-y divide-gray-700">
                        {monthlyExpenses.map(expense => (
                            <div key={expense.id} className={`p-4 flex items-center justify-between transition-colors ${expense.status === 'paid' ? 'bg-green-900/20' : 'bg-red-900/30'}`}>
                                <div className="flex items-center space-x-4">
                                    {expense.status === 'paid' ? <CheckCircle className="h-6 w-6 text-green-400" /> : <Clock className="h-6 w-6 text-red-400" />}
                                    <div>
                                        <p className="font-semibold text-white">{expense.fixed_expenses.concept}</p>
                                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                                            <span>{frequencyMap[expense.fixed_expenses.frequency]}</span>
                                            <span className="h-1 w-1 bg-gray-500 rounded-full"></span>
                                            <span>Día {getDate(new Date(expense.fixed_expenses.start_date.replace(/-/g, '/')))}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="font-bold text-lg text-white">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(expense.amount)}</span>
                                    <Button onClick={() => handleTogglePaid(expense)} size="sm" variant={expense.status === 'paid' ? 'outline' : 'default'} className={expense.status === 'paid' ? 'border-green-500 text-green-500' : 'bg-green-600 hover:bg-green-700'}>
                                        {expense.status === 'paid' ? 'Pagado' : 'Marcar Pagado'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MonthlyExpensesView;