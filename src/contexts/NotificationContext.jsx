import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Howl } from 'howler';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const { toast } = useToast();
    const { profile, updateProfile } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [shownNotifications, setShownNotifications] = useState(new Set());
    
    const notificationSound = new Howl({
        src: ['/sounds/notification.mp3'],
        volume: 0.5,
    });

    useEffect(() => {
        if (profile) {
            setNotificationsEnabled(profile.notifications_enabled);
        }
        
        const lastReset = localStorage.getItem('lastNotificationReset');
        const today = new Date().toDateString();
        if(lastReset !== today) {
            setShownNotifications(new Set());
            localStorage.setItem('lastNotificationReset', today);
        }

    }, [profile]);

    const toggleNotifications = async (enabled) => {
        setNotificationsEnabled(enabled);
        try {
            await updateProfile({ notifications_enabled: enabled });
            toast({
                title: `Notificaciones ${enabled ? 'activadas' : 'desactivadas'}`,
                description: `Tu preferencia se ha guardado correctamente.`,
            });
        } catch (error) {
            setNotificationsEnabled(!enabled); // Revert on error
            toast({
                title: "Error al guardar",
                description: "No se pudo guardar tu preferencia. Inténtalo de nuevo.",
                variant: "destructive",
            });
        }
    };
    
    const showNotification = useCallback(({id, title, description}) => {
        if (!notificationsEnabled || shownNotifications.has(id)) {
            return;
        }
        
        toast({
            title,
            description,
            duration: 10000,
        });
        
        notificationSound.play();
        setShownNotifications(prev => new Set(prev).add(id));

    }, [notificationsEnabled, toast, notificationSound, shownNotifications]);


    const value = {
        notificationsEnabled,
        toggleNotifications,
        showNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};