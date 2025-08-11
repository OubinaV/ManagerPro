import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, PlusCircle, MinusCircle } from 'lucide-react';

const ExtraMovements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [movementType, setMovementType] = useState('income'); // 'income' or 'withdrawal'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !description) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor, introduce una cantidad y una descripción.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const movementAmount = movementType === 'income' ? parseFloat(amount) : -parseFloat(amount);

    try {
      const { error } = await supabase.rpc('add_extra_movement', {
        p_user_id: user.id,
        p_amount: movementAmount,
        p_description: description,
      });

      if (error) throw error;

      toast({
        title: '¡Movimiento registrado!',
        description: `Se ha ${movementType === 'income' ? 'añadido' : 'retirado'} ${Math.abs(movementAmount).toFixed(2)}€ a/de tus ahorros.`,
      });
      setAmount('');
      setDescription('');
    } catch (error) {
      toast({
        title: 'Error al registrar movimiento',
        description: error.message || 'No se pudo completar la operación.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="glass-effect border-white/20 mt-6">
        <CardHeader>
          <CardTitle className="text-white">Movimientos Extra</CardTitle>
          <CardDescription className="text-gray-400">
            Añade o retira fondos de tu cuenta de ahorros manualmente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => setMovementType('income')}
                className={`${movementType === 'income' ? 'bg-green-600' : 'bg-gray-700'} text-white`}
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Ingreso
              </Button>
              <Button
                type="button"
                onClick={() => setMovementType('withdrawal')}
                className={`${movementType === 'withdrawal' ? 'bg-red-600' : 'bg-gray-700'} text-white`}
              >
                <MinusCircle className="mr-2 h-5 w-5" /> Retirada
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white">Cantidad (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej: 50.00"
                required
                className="bg-gray-800/80 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Descripción</Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Aporte extra para vacaciones"
                required
                className="bg-gray-800/80 border-gray-700 text-white"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full taxi-gradient text-lg py-6">
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                'Confirmar Movimiento'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExtraMovements;