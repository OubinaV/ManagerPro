import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Car, Crown, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SubscriptionPage = () => {
  return (
    <>
      <Helmet>
        <title>Suscripción - TaxiManager</title>
        <meta name="description" content="Desbloquea todas las funciones de TaxiManager con una suscripción." />
      </Helmet>
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-effect border border-white/20 rounded-2xl p-8 md:p-12 text-center max-w-2xl w-full shadow-lg"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="taxi-gradient p-4 rounded-full mb-4">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2">
              ¡Tu prueba ha terminado!
            </h1>
            <p className="text-lg text-gray-300">
              Para seguir disfrutando de todas las funciones de TaxiManager, por favor, suscríbete.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-yellow-400">Desbloquea el potencial completo:</h2>
            <ul className="list-none space-y-2 text-gray-200 text-left mx-auto max-w-sm">
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Gestión ilimitada de gastos</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Facturación y nóminas avanzadas</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Estadísticas y reportes detallados</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Soporte prioritario</li>
            </ul>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className="w-full py-3 text-xl font-bold taxi-gradient-orange"
              onClick={() => {
                // Placeholder for Stripe checkout or payment link
                alert("🚧 Esta función de pago no está implementada aún. ¡Puedes solicitarla en tu próximo prompt! 🚀");
              }}
            >
              <DollarSign className="mr-3 h-6 w-6" />
              Suscribirse Ahora
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default SubscriptionPage;