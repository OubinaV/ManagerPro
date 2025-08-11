import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, ArrowRight, PiggyBank, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import { startOfMonth, endOfMonth, format, subMonths, addMonths, isLastDayOfMonth, isFuture } from 'date-fns';
import { es } from 'date-fns/locale';

const SavingsHistoryView = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [summary, setSummary] = useState({ totalBilled: 0, totalAdvances: 0, totalEarnings: 0, netToTransfer: 0 });
  const [loading, setLoading] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [transferCompleted, setTransferCompleted] = useState(false);

  const commissionRate = profile?.commission_rate || 0;
  const isTransferEnabled = isLastDayOfMonth(new Date());

  const fetchBillingSummary = useCallback(async (monthDate) => {
    if (!user || !profile) return;
    setLoading(true);
    setTransferCompleted(false);

    const firstDay = startOfMonth(monthDate);
    const lastDay = endOfMonth(monthDate);

    try {
      // Check if transfer already exists
      const { data: existingTransfer, error: transferError } = await supabase
        .from('savings_transfers')
        .select('id')
        .eq('user_id', user.id)
        .eq('month', format(firstDay, 'yyyy-MM-dd'))
        .maybeSingle();

      if (transferError && transferError.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine
        throw transferError;
      }
      
      if (existingTransfer) {
        setTransferCompleted(true);
        setSummary({ totalBilled: 0, totalAdvances: 0, totalEarnings: 0, netToTransfer: 0 });
        setLoading(false);
        return;
      }

      // Fetch billing data for the month
      const { data: billings, error: billingsError } = await supabase
        .from('driver_billing')
        .select('billed_amount, advance_amount')
        .eq('user_id', user.id)
        .gte('billing_date', format(firstDay, 'yyyy-MM-dd'))
        .lte('billing_date', format(lastDay, 'yyyy-MM-dd'));

      if (billingsError) throw billingsError;

      const totalBilled = billings.reduce((sum, b) => sum + parseFloat(b.billed_amount), 0);
      const totalAdvances = billings.reduce((sum, b) => sum + parseFloat(b.advance_amount || 0), 0);
      const totalEarnings = totalBilled * commissionRate;
      const netToTransfer = totalEarnings - totalAdvances;

      setSummary({ totalBilled, totalAdvances, totalEarnings, netToTransfer });

    } catch (error) {
      toast({
        title: 'Error al cargar resumen',
        description: 'No se pudo obtener el resumen de facturación.',
        variant: 'destructive',
      });
      setSummary({ totalBilled: 0, totalAdvances: 0, totalEarnings: 0, netToTransfer: 0 });
    } finally {
      setLoading(false);
    }
  }, [user, profile, commissionRate, toast]);

  useEffect(() => {
    fetchBillingSummary(currentMonth);
  }, [currentMonth, fetchBillingSummary]);

  const handleTransfer = async () => {
    setTransferring(true);
    try {
      const { error } = await supabase.rpc('transfer_earnings_to_savings', {
        p_user_id: user.id,
        p_month: format(startOfMonth(currentMonth), 'yyyy-MM-dd'),
      });

      if (error) throw error;

      toast({
        title: '¡Transferencia Exitosa!',
        description: `Se han transferido ${summary.netToTransfer.toFixed(2)}€ a tus ahorros.`,
      });
      fetchBillingSummary(currentMonth);
    } catch (error) {
      toast({
        title: 'Error en la Transferencia',
        description: error.message || 'No se pudo completar la transferencia.',
        variant: 'destructive',
      });
    } finally {
      setTransferring(false);
    }
  };

  const changeMonth = (direction) => {
    setCurrentMonth(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const isFutureMonth = isFuture(startOfMonth(currentMonth));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <PiggyBank className="mr-2 h-6 w-6 text-yellow-400" />
            Transferir Ganancias a Ahorros
          </CardTitle>
          <CardDescription className="text-gray-400">
            Calcula las ganancias del mes y transfiérelas a tu cuenta de ahorros.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50">
            <Button variant="ghost" onClick={() => changeMonth('prev')}>&lt; Anterior</Button>
            <span className="text-lg font-semibold text-white capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </span>
            <Button variant="ghost" onClick={() => changeMonth('next')}>Siguiente &gt;</Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
            </div>
          ) : transferCompleted ? (
            <div className="text-center p-6 bg-green-900/30 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-green-300">Transferencia completada</p>
              <p className="text-gray-400">Las ganancias de este mes ya han sido transferidas.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400">Ganancias Totales</p>
                  <p className="text-2xl font-bold text-green-400">€{summary.totalEarnings.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400">Anticipos</p>
                  <p className="text-2xl font-bold text-orange-400">- €{summary.totalAdvances.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-500">
                  <p className="text-sm text-yellow-300">Neto a Transferir</p>
                  <p className="text-2xl font-bold text-yellow-400">€{summary.netToTransfer.toFixed(2)}</p>
                </div>
              </div>

              {summary.netToTransfer > 0 && !isFutureMonth ? (
                !isTransferEnabled ? (
                  <div className="text-center p-4 bg-gray-800 rounded-lg flex items-center justify-center gap-3">
                    <Lock className="h-5 w-5 text-yellow-400" />
                    <p className="text-gray-300">La transferencia se habilitará el último día del mes.</p>
                  </div>
                ) : (
                  <Button
                    onClick={handleTransfer}
                    disabled={transferring}
                    className="w-full taxi-gradient text-lg py-6"
                  >
                    {transferring ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-5 w-5" />
                    )}
                    Confirmar Transferencia
                  </Button>
                )
              ) : (
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-400">No hay ganancias netas para transferir este mes.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavingsHistoryView;