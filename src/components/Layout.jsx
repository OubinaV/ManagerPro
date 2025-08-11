import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';
import { LogOut, Settings, Car, Users, BarChart3, DollarSign, Calendar, Clock, FileText, ShoppingCart, LineChart, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import NotificationManager from '@/components/NotificationManager';

const Layout = ({ children }) => {
  const { profile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date();
      
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = date.toLocaleDateString('es-ES', dateOptions);
      setCurrentDate(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));

      const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const formattedTime = date.toLocaleTimeString('es-ES', timeOptions);
      setCurrentTime(formattedTime);
    };

    updateDateTime();
    const timerId = setInterval(updateDateTime, 1000);

    return () => clearInterval(timerId);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const baseMenuItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/' },
  ];

  const ownerMenuItems = [
    ...baseMenuItems,
    { icon: Car, label: 'Vehículos', href: '#' },
    { icon: Users, label: 'Conductores', href: '#' },
    { icon: DollarSign, label: 'Finanzas', href: '#' },
    { icon: Calendar, label: 'Programación', href: '#' },
  ];

  const driverMenuItems = [
    ...baseMenuItems,
    { icon: FileText, label: 'Facturación', href: '/billing' },
    { icon: ShoppingCart, label: 'Gastos', href: '/expenses' },
    { icon: LineChart, label: 'Estadísticas', href: '/statistics' },
  ];

  const menuItems = profile.user_type === 'owner' ? ownerMenuItems : driverMenuItems;
  
  const commonMenuItems = [
    { icon: UserCircle, label: 'Mi Perfil', href: '/profile' },
    { icon: Settings, label: 'Configuración', href: '/settings' },
  ];

  const handleMenuClick = (item) => {
    if (item.href === '#') {
      toast({
        title: "🚧 Funcionalidad en desarrollo",
        description: `La sección ${item.label} estará disponible pronto. ¡Puedes solicitarla en tu próximo mensaje! 🚀`,
      });
    } else {
      navigate(item.href);
    }
  };

  const SidebarContent = () => (
    <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
      <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menú</p>
      {menuItems.map((item, index) => (
        <motion.button
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + index * 0.1, ease: 'easeOut' }}
          whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleMenuClick(item)}
          className={cn(
            'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white transition-colors duration-200 group',
            location.pathname === item.href && 'bg-white/10 text-white'
          )}
        >
          <item.icon className="h-5 w-5 2xl:h-6 2xl:w-6" />
          <span className="font-medium 2xl:text-lg">{item.label}</span>
        </motion.button>
      ))}
      <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cuenta</p>
      {commonMenuItems.map((item, index) => (
        <motion.button
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + menuItems.length * 0.1 + index * 0.1, ease: 'easeOut' }}
          whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleMenuClick(item)}
          className={cn(
            'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white transition-colors duration-200 group',
            location.pathname === item.href && 'bg-white/10 text-white'
          )}
        >
          <item.icon className="h-5 w-5 2xl:h-6 2xl:w-6" />
          <span className="font-medium 2xl:text-lg">{item.label}</span>
        </motion.button>
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden">
      <NotificationManager />

      <aside className="w-64 2xl:w-72 glass-effect border-r border-white/10 p-4 flex flex-col flex-shrink-0">
        <div className="flex items-center space-x-4 mb-8 flex-shrink-0">
            <motion.div 
              className="taxi-gradient p-3 rounded-xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Car className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl 2xl:text-2xl font-bold text-white">TaxiManager</h1>
            </div>
        </div>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-h-0">
        <motion.header 
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="glass-effect border-b border-white/10 z-30 flex-shrink-0"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div>
              <p className="text-lg 2xl:text-xl font-bold text-white capitalize">
                  {location.pathname.substring(1) || 'Dashboard'}
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden lg:flex items-center space-x-3 bg-gray-900/50 px-4 py-2 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <div className="text-right">
                      <p className="text-sm font-semibold text-white">{currentDate}</p>
                      <p className="text-xs text-gray-400 font-mono tracking-wider">{currentTime}</p>
                  </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/profile')} className="flex items-center space-x-3 rounded-full p-1.5 bg-gray-800/50 cursor-pointer">
                <Avatar className="h-9 w-9 2xl:h-10 2xl:w-10">
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                  <AvatarFallback className="bg-yellow-500 text-black">{profile.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col text-left pr-2">
                  <p className="text-sm 2xl:text-base font-semibold text-white leading-none">{profile.full_name}</p>
                </div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button onClick={handleLogout} variant="destructive" size="icon" className="rounded-full bg-red-600/80 hover:bg-red-600"><LogOut className="h-5 w-5" /></Button>
              </motion.div>
            </div>
          </div>
        </motion.header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="container mx-auto max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;