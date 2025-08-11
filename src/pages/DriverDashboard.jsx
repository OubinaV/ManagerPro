import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Star, 
  Navigation, 
  Fuel,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const DriverDashboard = () => {
  const { toast } = useToast();
  const { profile } = useAuth();

  const stats = [
    {
      title: 'Ganancias Hoy',
      value: '$0.00',
      change: '0%',
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Viajes Completados',
      value: '0',
      change: '0',
      icon: CheckCircle,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Horas Trabajadas',
      value: '0h',
      change: '0h',
      icon: Clock,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Calificación',
      value: 'N/A',
      change: '',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const recentTrips = [];

  const handleFeatureClick = (feature) => {
    toast({
      title: "🚧 Funcionalidad en desarrollo",
      description: `${feature} estará disponible pronto. ¡Puedes solicitarla en tu próximo mensaje! 🚀`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Dashboard Conductor - TaxiManager</title>
        <meta name="description" content="Panel de control para conductores de taxi. Gestiona tus viajes, ganancias y horarios de trabajo." />
      </Helmet>

      <div className="space-y-6 2xl:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl 2xl:text-4xl font-bold text-white mb-2">¡Bienvenido, {profile?.name}!</h1>
            <p className="text-gray-300 2xl:text-lg">Gestiona tus viajes y maximiza tus ganancias</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button 
              onClick={() => handleFeatureClick('Ir en Línea')}
              className="driver-gradient hover:opacity-90 2xl:text-lg 2xl:px-6 2xl:py-6"
            >
              <span className="flex items-center justify-center">
                <Navigation className="h-4 w-4 2xl:h-5 2xl:w-5 mr-2" />
                Ir en Línea
              </span>
            </Button>
            <Button 
              onClick={() => handleFeatureClick('Ver Mapa')}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 2xl:text-lg 2xl:px-6 2xl:py-6"
            >
              <span className="flex items-center justify-center">
                <MapPin className="h-4 w-4 2xl:h-5 2xl:w-5 mr-2" />
                Ver Mapa
              </span>
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6 2xl:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect border-white/20 card-hover">
                <CardContent className="p-6 2xl:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm 2xl:text-base text-gray-400 mb-1">{stat.title}</p>
                      <p className="text-2xl 2xl:text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm 2xl:text-base text-green-400 mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 2xl:p-4 rounded-xl bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="h-6 w-6 2xl:h-8 2xl:w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 2xl:gap-8">
          {/* Vehicle Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect border-white/20">
              <CardHeader className="2xl:p-8">
                <CardTitle className="text-white flex items-center 2xl:text-2xl">
                  <Navigation className="h-5 w-5 2xl:h-6 2xl:w-6 mr-2" />
                  Estado del Vehículo
                </CardTitle>
                <CardDescription className="2xl:text-base">
                  Vehículo no asignado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 2xl:p-8">
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 2xl:h-6 2xl:w-6 text-red-400" />
                    <span className="text-red-400 font-medium 2xl:text-lg">Fuera de Línea</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleFeatureClick('Reportar Problema')}
                  variant="outline" 
                  className="w-full 2xl:text-lg 2xl:py-6"
                >
                  <AlertCircle className="h-4 w-4 2xl:h-5 2xl:w-5 mr-2" />
                  Reportar Problema
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Trips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="glass-effect border-white/20">
              <CardHeader className="2xl:p-8">
                <CardTitle className="text-white 2xl:text-2xl">Viajes Recientes</CardTitle>
                <CardDescription className="2xl:text-base">
                  No hay viajes recientes para mostrar.
                </CardDescription>
              </CardHeader>
              <CardContent className="2xl:p-8 flex items-center justify-center h-48">
                 <p className="text-gray-400">Completa tu primer viaje para verlo aquí.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-effect border-white/20">
            <CardHeader className="2xl:p-8">
              <CardTitle className="text-white 2xl:text-2xl">Acciones Rápidas</CardTitle>
              <CardDescription className="2xl:text-base">
                Herramientas para optimizar tu trabajo
              </CardDescription>
            </CardHeader>
            <CardContent className="2xl:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 2xl:gap-6">
                <Button 
                  onClick={() => handleFeatureClick('Ver Ganancias')}
                  variant="outline" 
                  className="h-20 2xl:h-24 flex-col space-y-2"
                >
                  <TrendingUp className="h-6 w-6 2xl:h-8 2xl:w-8" />
                  <span className="text-xs 2xl:text-sm">Ver Ganancias</span>
                </Button>
                <Button 
                  onClick={() => handleFeatureClick('Programar Horario')}
                  variant="outline" 
                  className="h-20 2xl:h-24 flex-col space-y-2"
                >
                  <Calendar className="h-6 w-6 2xl:h-8 2xl:w-8" />
                  <span className="text-xs 2xl:text-sm">Programar Horario</span>
                </Button>
                <Button 
                  onClick={() => handleFeatureClick('Historial de Viajes')}
                  variant="outline" 
                  className="h-20 2xl:h-24 flex-col space-y-2"
                >
                  <MapPin className="h-6 w-6 2xl:h-8 2xl:w-8" />
                  <span className="text-xs 2xl:text-sm">Historial de Viajes</span>
                </Button>
                <Button 
                  onClick={() => handleFeatureClick('Soporte')}
                  variant="outline" 
                  className="h-20 2xl:h-24 flex-col space-y-2"
                >
                  <AlertCircle className="h-6 w-6 2xl:h-8 2xl:w-8" />
                  <span className="text-xs 2xl:text-sm">Soporte</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default DriverDashboard;