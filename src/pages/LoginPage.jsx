import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, User, ArrowRight, BarChart3, FileText, Wallet, TrendingUp, Loader2, UserPlus, Shield, Briefcase, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';

const Feature = ({ icon: Icon, title, description, color }) => (
  <div className="flex items-start space-x-4">
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div>
      <p className="font-semibold text-white">{title}</p>
      <p className="text-sm text-gray-400 whitespace-nowrap">{description}</p>
    </div>
  </div>
);

const LoginForm = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast(); // Add useToast here

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password }); // Pass as object
      // No es necesario cambiar loading a false aquí, porque el componente se desmontará en caso de éxito.
    } catch (error) {
      toast({ // Use toast for error
        title: "Error de inicio de sesión",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="inline-block taxi-gradient-orange p-4 rounded-full mb-4">
          <User className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white">¡Bienvenido!</h3>
        <p className="text-sm text-gray-400">
          ¿No tienes cuenta?{' '}
          <button onClick={onSwitch} className="font-semibold text-orange-400 hover:text-orange-300">
            Regístrate aquí
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">Email</Label>
          <Input id="email" type="email" placeholder="Introduce tu email" value={email} onChange={(e) => setEmail(e.target.value)} required className="glass-input" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
          <Input id="password" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="glass-input" />
        </div>
        <Button type="submit" className="w-full taxi-gradient-orange text-white font-bold py-3 text-base" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : 'Iniciar Sesión'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>
    </motion.div>
  );
};

const RegisterForm = ({ onSwitch }) => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState({
    user_type: '',
    full_name: '',
    dni_nie: '',
    taxi_license: '',
    license_plate: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setFormData({ ...formData, user_type: type });
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const goBack = () => {
    if (step === 2) {
        setStep(1);
        setUserType(null);
    } else {
        onSwitch();
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada.",
        variant: "success",
      });
      onSwitch();
    } catch (error) {
      toast({
        title: "Error de registro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 0 }}
        transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
         <div className="inline-block taxi-gradient-blue p-4 rounded-full mb-4">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white">Crear Nueva Cuenta</h3>
        <p className="text-sm text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <button onClick={onSwitch} className="font-semibold text-orange-400 hover:text-orange-300">
            Inicia sesión
          </button>
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-center text-white">Selecciona tu tipo de cuenta</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-28 flex-col justify-center items-center space-y-2 bg-slate-900/20 border-slate-700 hover:bg-slate-800/40" onClick={() => handleUserTypeSelect('owner')}>
                    <Briefcase className="h-8 w-8 text-blue-400"/>
                    <span className="text-base font-bold text-white">Propietario</span>
                </Button>
                <Button variant="outline" className="h-28 flex-col justify-center items-center space-y-2 bg-slate-900/20 border-slate-700 hover:bg-slate-800/40" onClick={() => handleUserTypeSelect('driver')}>
                    <Shield className="h-8 w-8 text-green-400"/>
                    <span className="text-base font-bold text-white">Conductor</span>
                </Button>
            </div>
          </motion.div>
        )}
        
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
             <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="full_name" placeholder="Nombre completo" value={formData.full_name} onChange={handleChange} required className="glass-input" />
                {userType === 'owner' && (
                  <>
                    <Input id="dni_nie" placeholder="DNI/NIE" value={formData.dni_nie} onChange={handleChange} required className="glass-input" />
                    <Input id="taxi_license" placeholder="Licencia Taxi" value={formData.taxi_license} onChange={handleChange} required className="glass-input" />
                    <Input id="license_plate" placeholder="Matrícula" value={formData.license_plate} onChange={handleChange} required className="glass-input" />
                  </>
                )}
                <Input id="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="glass-input" />
                <Input id="password" type="password" placeholder="Contraseña (mínimo 6 caracteres)" value={formData.password} onChange={handleChange} required className="glass-input" />
                
                <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" onClick={goBack} className="w-auto glass-input">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button type="submit" className="w-full taxi-gradient-blue text-white font-bold py-3 text-base" disabled={loading}>
                      {loading ? <Loader2 className="animate-spin" /> : 'Crear Cuenta'}
                      <UserPlus className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Helmet>
        <title>Acceso - TaxiManager</title>
        <meta name="description" content="Plataforma completa para propietarios y conductores. Controla ingresos, gastos, mantenimiento y estadísticas." />
      </Helmet>
      
      <div className="h-full w-full login-bg flex flex-col p-4 overflow-y-auto">
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col justify-center text-center lg:text-left"
            >
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                <div className="taxi-gradient-orange p-4 rounded-xl">
                  <Car className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">TaxiManager</h1>
                  <p className="text-blue-300">Sistema de Gestión Profesional</p>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-white mb-4">
                Gestiona tu flota
              </h2>
              <h2 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-white mb-4 -mt-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
                de forma inteligente
              </h2>
              <p className="text-base md:text-lg text-gray-300 max-w-lg mx-auto lg:mx-0">
                Plataforma completa para propietarios y conductores. Controla ingresos, gastos, mantenimiento y estadísticas con facilidad profesional desde cualquier lugar.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="login-card p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
                <AnimatePresence mode="wait">
                    {isLogin 
                        ? <LoginForm key="login" onSwitch={() => setIsLogin(false)} /> 
                        : <RegisterForm key="register" onSwitch={() => setIsLogin(true)} />
                    }
                </AnimatePresence>
                <p className="text-xs text-gray-500 text-center mt-8">
                  © {new Date().getFullYear()} TaxiManager Pro • Todos los derechos reservados
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.footer 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="w-full flex-shrink-0"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-between">
            <Feature icon={BarChart3} title="Control de Taxi" description="Gestión diaria completa" color="bg-green-500/80" />
            <Feature icon={FileText} title="Facturación Inteligente" description="Registro de ingresos y comisiones" color="bg-blue-500/80" />
            <Feature icon={Wallet} title="Nómina e IRPF" description="Cálculos y reportes fiscales" color="bg-purple-500/80" />
            <Feature icon={TrendingUp} title="Estadísticas" description="Análisis y reportes" color="bg-yellow-500/80" />
          </div>
        </motion.footer>
      </div>
    </>
  );
};

export default LoginPage;