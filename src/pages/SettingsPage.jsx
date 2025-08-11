import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Shield, Download, RefreshCw, AlertTriangle, BadgeCheck, Settings, Palette, Globe, Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotification } from '@/contexts/NotificationContext';

const SettingsPage = () => {
    const { toast } = useToast();
    const { notificationsEnabled, toggleNotifications } = useNotification();

    const handleNotImplemented = () => {
      toast({
        title: "🚧 Funcionalidad no implementada",
        description: "Esta opción aún no está disponible, ¡pero puedes solicitarla en tu próximo mensaje! 🚀",
      });
    };

    return (
        <>
            <Helmet>
                <title>Configuración - TaxiManager</title>
                <meta name="description" content="Ajustes y configuración de la aplicación TaxiManager." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                <div>
                    <h1 className="text-3xl 2xl:text-4xl font-bold text-white">Configuración del Sistema</h1>
                    <p className="text-gray-300 2xl:text-lg">Gestiona la base de datos y la seguridad de tu cuenta.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="glass-effect border-white/20">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white text-xl">
                                <Database className="mr-3 h-6 w-6 text-yellow-400" />
                                Base de Datos PostgreSQL
                            </CardTitle>
                            <CardDescription>
                                Estado y mantenimiento de la base de datos de la aplicación.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="glass-effect-inner p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-400 mb-2">Estado de Conexión</h3>
                                    <div className="flex items-center justify-center text-green-400">
                                        <BadgeCheck className="h-5 w-5 mr-2" />
                                        <p className="font-bold text-lg">Conectado</p>
                                    </div>
                                    <p className="text-sm text-gray-500">PostgreSQL</p>
                                </div>
                                <div className="glass-effect-inner p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-400 mb-2">Registros Totales</h3>
                                    <p className="font-bold text-2xl text-white">1,234</p>
                                    <p className="text-sm text-gray-500">en 5 tablas</p>
                                </div>
                                <div className="glass-effect-inner p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-400 mb-2">Último Backup</h3>
                                    <p className="font-bold text-lg text-white">Hoy, 14:30</p>
                                    <p className="text-sm text-gray-500">Automático</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10 justify-center">
                                <Button onClick={handleNotImplemented} className="bg-blue-600/80 hover:bg-blue-600 text-white"><RefreshCw className="mr-2 h-4 w-4" />Sincronizar</Button>
                                <Button onClick={handleNotImplemented} className="bg-green-600/80 hover:bg-green-600 text-white"><Download className="mr-2 h-4 w-4" />Backup Manual</Button>
                                <Button onClick={handleNotImplemented} variant="destructive" className="bg-red-600/80 hover:bg-red-600 text-white"><AlertTriangle className="mr-2 h-4 w-4" />Mantenimiento</Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card className="glass-effect border-white/20">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white text-xl">
                                <Shield className="mr-3 h-6 w-6 text-yellow-400" />
                                Configuración de Seguridad
                            </CardTitle>
                            <CardDescription>
                                Gestiona las sesiones activas y la autenticación de tu cuenta.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-lg text-white mb-3">Sesiones Activas</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between glass-effect-inner p-3 rounded-lg">
                                        <div>
                                            <p className="font-medium text-white">Victor Oubiña Faubel (Actual)</p>
                                            <p className="text-sm text-gray-400">Navegador Web - A Coruña, ES</p>
                                        </div>
                                        <span className="text-sm font-semibold text-green-400">Activa</span>
                                    </div>
                                    <div className="flex items-center justify-between glass-effect-inner p-3 rounded-lg opacity-70">
                                        <div>
                                            <p className="font-medium text-white">Dispositivo Móvil</p>
                                            <p className="text-sm text-gray-400">App Android - Madrid, ES</p>
                                        </div>
                                        <Button variant="link" size="sm" className="text-red-400 hover:text-red-500 p-0" onClick={handleNotImplemented}>Cerrar</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h3 className="font-semibold text-lg text-white mb-3">Configuración de Sesión</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="session-expiration" className="text-gray-300">Tiempo de Expiración</Label>
                                    <Select defaultValue="8" onValueChange={handleNotImplemented}>
                                        <SelectTrigger id="session-expiration" className="w-full bg-gray-900/50 border-gray-700 text-white">
                                            <SelectValue placeholder="Seleccionar tiempo..." />
                                        </SelectTrigger>
                                        <SelectContent className="glass-effect">
                                            <SelectItem value="1">1 hora</SelectItem>
                                            <SelectItem value="8">8 horas</SelectItem>
                                            <SelectItem value="24">24 horas</SelectItem>
                                            <SelectItem value="7d">7 días</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between glass-effect-inner p-4 rounded-lg">
                                    <Label htmlFor="2fa-switch" className="text-gray-200 font-medium">Autenticación de 2 factores (2FA)</Label>
                                    <Switch id="2fa-switch" onCheckedChange={handleNotImplemented} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Card className="glass-effect border-white/20">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white text-xl">
                                <Settings className="mr-3 h-6 w-6 text-yellow-400" />
                                Configuración General
                            </CardTitle>
                            <CardDescription>
                                Ajustes generales de la aplicación.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="theme-select" className="text-gray-300">Tema</Label>
                                <Select defaultValue="system" onValueChange={handleNotImplemented}>
                                    <SelectTrigger id="theme-select" className="w-full bg-gray-900/50 border-gray-700 text-white">
                                        <SelectValue placeholder="Seleccionar tema..." />
                                    </SelectTrigger>
                                    <SelectContent className="glass-effect">
                                        <SelectItem value="light">Claro</SelectItem>
                                        <SelectItem value="dark">Oscuro</SelectItem>
                                        <SelectItem value="system">Sistema</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language-select" className="text-gray-300">Idioma</Label>
                                <Select defaultValue="es" onValueChange={handleNotImplemented}>
                                    <SelectTrigger id="language-select" className="w-full bg-gray-900/50 border-gray-700 text-white">
                                        <SelectValue placeholder="Seleccionar idioma..." />
                                    </SelectTrigger>
                                    <SelectContent className="glass-effect">
                                        <SelectItem value="es">Español</SelectItem>
                                        <SelectItem value="en">Inglés</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between glass-effect-inner p-4 rounded-lg">
                                <Label htmlFor="notifications-switch" className="text-gray-200 font-medium flex items-center">
                                    <Bell className="mr-2 h-4 w-4" />
                                    Notificaciones
                                </Label>
                                <Switch 
                                    id="notifications-switch" 
                                    checked={notificationsEnabled}
                                    onCheckedChange={toggleNotifications}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

            </motion.div>
        </>
    );
};

export default SettingsPage;