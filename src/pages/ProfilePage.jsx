import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Shield, Info, Save, Loader2, Upload, Car, UserCircle, AlertTriangle, Mail } from 'lucide-react';

const ProfilePage = () => {
    const { user, profile, updateProfile, updatePassword, uploadAvatar, updateEmail } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isChangingAvatar, setIsChangingAvatar] = useState(false);

    const [profileData, setProfileData] = useState({ 
        displayName: '',
        email: '',
        dni_nie: '',
        taxi_license: '',
        license_plate: '',
        taxi_brand: '',
        taxi_model: '',
    });
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });

    useEffect(() => {
        if (profile && user) {
            setProfileData({ 
                displayName: profile.full_name || '',
                email: user.email || '',
                dni_nie: profile.dni_nie || '',
                taxi_license: profile.taxi_license || '',
                license_plate: profile.license_plate || '',
                taxi_brand: profile.taxi_brand || '',
                taxi_model: profile.taxi_model || '',
            });
        }
    }, [profile, user]);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.id]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
    };

    const handleAvatarButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast({ title: 'Archivo demasiado grande', description: 'Por favor, selecciona una imagen de menos de 5MB.', variant: 'destructive' });
            return;
        }

        setIsChangingAvatar(true);
        try {
            const avatarUrl = await uploadAvatar(file);
            await updateProfile({ avatar_url: avatarUrl });
            toast({ title: '¡Avatar actualizado!', description: 'Tu nueva imagen de perfil ha sido guardada.', variant: 'success' });
        } catch (error) {
            toast({ title: 'Error al subir avatar', description: error.message, variant: 'destructive' });
        } finally {
            setIsChangingAvatar(false);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const profileUpdates = { 
                full_name: profileData.displayName,
            };
            
            await updateProfile(profileUpdates);

            if (profileData.email !== user.email) {
                await updateEmail(profileData.email);
                toast({
                    title: '¡Revisa tu correo!',
                    description: 'Se ha enviado un enlace de confirmación a tu nueva dirección de correo para verificar el cambio.',
                    variant: 'success',
                    duration: 9000,
                });
            }

            toast({ title: '¡Éxito!', description: 'Tus datos personales han sido actualizados.', variant: 'success' });
        } catch (error) {
            toast({ title: 'Error', description: 'No se pudo actualizar el perfil.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleTaxiDataSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const taxiUpdates = {
                dni_nie: profileData.dni_nie,
                taxi_license: profileData.taxi_license,
                license_plate: profileData.license_plate,
                taxi_brand: profileData.taxi_brand,
                taxi_model: profileData.taxi_model,
            };
            await updateProfile(taxiUpdates);
            toast({ title: '¡Éxito!', description: 'Los datos del taxi han sido actualizados.', variant: 'success' });
        } catch (error) {
            toast({ title: 'Error', description: 'No se pudieron actualizar los datos del taxi.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({ title: 'Error', description: 'Las nuevas contraseñas no coinciden.', variant: 'destructive' });
            return;
        }
        if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
            toast({ title: 'Error', description: 'La nueva contraseña debe tener al menos 6 caracteres.', variant: 'destructive' });
            return;
        }

        setIsUpdatingPassword(true);
        try {
            await updatePassword(passwordData.newPassword);
            toast({ title: '¡Éxito!', description: 'Tu contraseña ha sido actualizada.', variant: 'success' });
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    if (!profile) return <div className="text-white">Cargando perfil...</div>;

    const renderTaxiData = () => {
        if (profile.user_type === 'owner') {
            return (
                 <Card className="glass-effect border-white/20 card-hover">
                    <form onSubmit={handleTaxiDataSubmit}>
                        <CardHeader>
                            <CardTitle className="flex items-center text-white 2xl:text-2xl"><Car className="mr-3 h-6 w-6" />Datos del Taxi</CardTitle>
                            <CardDescription className="2xl:text-base">Información del vehículo y licencia.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="dni_nie" className="text-gray-300">DNI/NIE del Propietario</Label>
                                <Input id="dni_nie" value={profileData.dni_nie} onChange={handleProfileChange} className="glass-input" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="taxi_license" className="text-gray-300">Licencia de Taxi</Label>
                                <Input id="taxi_license" value={profileData.taxi_license} onChange={handleProfileChange} className="glass-input" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="license_plate" className="text-gray-300">Matrícula</Label>
                                <Input id="license_plate" value={profileData.license_plate} onChange={handleProfileChange} className="glass-input" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="taxi_brand" className="text-gray-300">Marca del Vehículo</Label>
                                <Input id="taxi_brand" value={profileData.taxi_brand} onChange={handleProfileChange} className="glass-input" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="taxi_model" className="text-gray-300">Modelo del Vehículo</Label>
                                <Input id="taxi_model" value={profileData.taxi_model} onChange={handleProfileChange} className="glass-input" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full owner-gradient 2xl:text-lg" disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {isSaving ? 'Guardando...' : 'Guardar Datos del Taxi'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            );
        }

        if (profile.user_type === 'driver') {
            return (
                 <Card className="glass-effect border-white/20 card-hover">
                    <CardHeader>
                        <CardTitle className="flex items-center text-white 2xl:text-2xl"><Car className="mr-3 h-6 w-6" />Datos del Taxi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center text-center p-8 bg-black/20 rounded-lg">
                            <AlertTriangle className="h-12 w-12 text-yellow-400 mb-4" />
                            <h4 className="text-lg font-semibold text-white">No asignado a un vehículo</h4>
                            <p className="text-gray-400 mt-2 text-sm">Actualmente no estás vinculado a ningún propietario o taxi. Un propietario deberá asignarte a su vehículo para ver los detalles aquí.</p>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return null;
    }

    return (
        <>
            <Helmet>
                <title>Mi Perfil - TaxiManager</title>
                <meta name="description" content="Gestiona tu perfil, datos personales y configuración de la cuenta en TaxiManager." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <div>
                    <h1 className="text-3xl 2xl:text-4xl font-bold text-white">Configuración del Perfil</h1>
                    <p className="text-gray-300 2xl:text-lg">Actualiza tu información personal y de seguridad.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <div className="flex flex-col gap-6">
                        <Card className="glass-effect border-white/20 card-hover">
                            <form onSubmit={handleProfileSubmit}>
                                <CardHeader>
                                    <CardTitle className="flex items-center text-white 2xl:text-2xl">
                                        <UserCircle className="mr-3 h-6 w-6" />
                                        Datos Personales
                                    </CardTitle>
                                    <CardDescription className="2xl:text-base">Gestiona tu información pública y de contacto.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <Avatar className="h-20 w-20 border-2 border-yellow-400">
                                                <AvatarImage src={profile.avatar_url} alt={profile.full_name} key={profile.avatar_url} />
                                                <AvatarFallback className="bg-yellow-500 text-black text-2xl">{profile.full_name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/png, image/jpeg, image/gif" style={{ display: 'none' }}/>
                                            <Button type="button" size="icon" className="absolute bottom-0 right-0 rounded-full h-7 w-7 bg-white/20 hover:bg-white/30 backdrop-blur-sm" onClick={handleAvatarButtonClick} disabled={isChangingAvatar}>
                                                {isChangingAvatar ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Upload className="h-4 w-4 text-white" />}
                                            </Button>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{profile.full_name}</h3>
                                            <p className="text-sm text-gray-400">{profile.user_type === 'driver' ? 'Conductor' : 'Propietario'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="displayName" className="text-gray-300">Nombre a mostrar</Label>
                                        <Input id="displayName" value={profileData.displayName} onChange={handleProfileChange} className="glass-input" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-300">Correo Electrónico</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input id="email" type="email" value={profileData.email} onChange={handleProfileChange} className="glass-input pl-10" />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full owner-gradient 2xl:text-lg" disabled={isSaving}>
                                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        {isSaving ? 'Guardando...' : 'Guardar Datos Personales'}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                        
                        <Card className="glass-effect border-white/20 card-hover">
                            <form onSubmit={handlePasswordSubmit}>
                                <CardHeader>
                                    <CardTitle className="flex items-center text-white 2xl:text-2xl"><Shield className="mr-3 h-6 w-6" />Seguridad</CardTitle>
                                    <CardDescription className="2xl:text-base">Cambia tu contraseña para mantener tu cuenta segura.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">Nueva Contraseña</Label>
                                        <Input id="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} className="glass-input" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                                        <Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="glass-input" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full driver-gradient 2xl:text-lg" disabled={isUpdatingPassword}>
                                        {isUpdatingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
                                        {isUpdatingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                    <div className="flex flex-col gap-6">
                        {renderTaxiData()}
                        <Card className="glass-effect border-white/20 card-hover">
                            <CardHeader><CardTitle className="flex items-center text-white 2xl:text-2xl"><Info className="mr-3 h-6 w-6" />Configuración General</CardTitle></CardHeader>
                            <CardContent className="flex items-center justify-center h-48"><p className="text-gray-400">Próximamente... Ajustes de la aplicación.</p></CardContent>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default ProfilePage;