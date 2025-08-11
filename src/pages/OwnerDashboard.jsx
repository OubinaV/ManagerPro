import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Users, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';

const OwnerDashboard = () => {
  const { toast } = useToast();

  const stats = [
    {
      title: 'Vehículos Activos',
      value: '0',
      change: '+0',
      icon: Car,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Conductores',
      value: '0',
      change: '+0',
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Ingresos Hoy',
      value: '$0.00',
      change: '0%',
      icon: DollarSign,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Viajes Completados',
      value: '0',
      change: '0%',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const handleFeatureClick = (feature) => {
    toast({
      title: "🚧 Funcionalidad en desarrollo",
      description: `${feature} estará disponible pronto. ¡Puedes solicitarla en tu próximo mensaje! 🚀`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Dashboard Propietario - TaxiManager</title>
        <meta name="description" content="Panel de control para propietarios de taxis. Gestiona tu flota, conductores y finanzas en tiempo real." />
      </Helmet>

      <div className="space-y-6 2xl:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl 2xl:text-4xl font-bold text-white mb-2">Dashboard Propietario</h1>
            <p className="text-gray-300 2xl:text-lg">Gestiona tu flota de taxis de manera eficiente</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button 
              onClick={() => handleFeatureClick('Agregar Vehículo')}
              className="owner-gradient hover:opacity-90 2xl:text-lg 2xl:px-6 2xl:py-6"
            >
              <span className="flex items-center justify-center">
                <Car className="h-4 w-4 2xl:h-5 2xl:w-5 mr-2" />
                Agregar Vehículo
              </span>
            </Button>
            <Button 
              onClick={() => handleFeatureClick('Nuevo Conductor')}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 2xl:text-lg 2xl:px-6 2xl:py-6"
            >
              <span className="flex items-center justify-center">
                <Users className="h-4 w-4 2xl:h-5 2xl:w-5 mr-2" />
                Nuevo Conductor
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
          {/* Fleet Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="glass-effect border-white/20">
              <CardHeader className="2xl:p-8">
                <CardTitle className="text-white flex items-center 2xl:text-2xl">
                  <Car className="h-5 w-5 2xl:h-6 2xl:w-6 mr-2" />
                  Estado de la Flota
                </CardTitle>
                <CardDescription className="2xl:text-base">
                  Añade tu primer vehículo para empezar a monitorear.
                </CardDescription>
              </CardHeader>
              <CardContent className="2xl:p-8 flex items-center justify-center h-48">
                 <p className="text-gray-400">No hay vehículos en tu flota.</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-effect border-white/20">
              <CardHeader className="2xl:p-8">
                <CardTitle className="text-white 2xl:text-2xl">Actividad Reciente</CardTitle>
                <CardDescription className="2xl:text-base">
                  No hay actividad reciente.
                </CardDescription>
              </CardHeader>
              <CardContent className="2xl:p-8 flex items-center justify-center h-48">
                <p className="text-gray-400">Las actualizaciones aparecerán aquí.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;