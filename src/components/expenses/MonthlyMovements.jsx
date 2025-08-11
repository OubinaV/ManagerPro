import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, ArrowUpRight, ArrowDownLeft, Repeat, PiggyBank } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

const MonthlyMovements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [totalSavings, setTotalSavings] = useState(0);

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    try {
      // Fetch savings transfers
      const { data: transfers, error: transfersError } = await supabase
        .from('savings_transfers')
        .select('created_at, amount, month')
        .eq('user_id', user.id)
        .gte('created_at', format(monthStart, 'yyyy-MM-dd'))
        .lte('created_at', format(monthEnd, 'yyyy-MM-dd'));
      if (transfersError) throw transfersError;

      // Fetch extra movements
      const { data: extra, error: extraError } = await supabase
        .from('extra_movements')
        .select('created_at, amount, description')
        .eq('user_id', user.id)
        .gte('movement_date', format(monthStart, 'yyyy-MM-dd'))
        .lte('movement_date', format(monthEnd, 'yyyy-MM-dd'));
      if (extraError) throw extraError;

      // Fetch paid expenses
      const { data: paidExpenses, error: expensesError } = await supabase
        .from('monthly_expense_entries')
        .select('updated_at, amount, fixed_expenses (concept)')
        .eq('user_id', user.id)
        .eq('month', format(monthStart, 'yyyy-MM-dd'))
        .eq('status', 'paid');
      if (expensesError) throw expensesError;
      
      // Fetch total savings
      const { data: savingsData, error: savingsError } = await supabase
        .from('monthly_savings')
        .select('amount')
        .eq('user_id', user.id);
      if (savingsError) throw savingsError;
      const total = savingsData.reduce((acc, s) => acc + s.amount, 0);
      setTotalSavings(total);

      const formattedTransfers = transfers.map(t => ({
        date: t.created_at,
        description: `Transferencia de ganancias (${format(new Date(t.month.replace(/-/g, '/')), 'MMMM', { locale: es })})`,
        amount: t.amount,
        type: 'transfer',
      }));

      const formattedExtra = extra.map(e => ({
        date: e.created_at,
        description: e.description,
        amount: e.amount,
        type: e.amount > 0 ? 'income' : 'withdrawal',
      }));

      const formattedExpenses = paidExpenses.map(p => ({
        date: p.updated_at,
        description: `Pago: ${p.fixed_expenses.concept}`,
        amount: -p.amount,
        type: 'payment',
      }));

      const allMovements = [...formattedTransfers, ...formattedExtra, ...formattedExpenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setMovements(allMovements);

    } catch (error) {
      toast({
        title: 'Error al cargar movimientos',
        description: error.message || 'No se pudieron obtener los movimientos del mes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user.id, toast, currentMonth]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  const getMovementIcon = (type) => {
    switch (type) {
      case 'transfer': return <Repeat className="h-5 w-5 text-blue-400" />;
      case 'income': return <ArrowUpRight className="h-5 w-5 text-green-400" />;
      case 'withdrawal': return <ArrowDownLeft className="h-5 w-5 text-orange-400" />;
      case 'payment': return <ArrowDownLeft className="h-5 w-5 text-red-400" />;
      default: return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full">
       <Card className="glass-effect border-white/20 mt-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white">Movimientos Mensuales</CardTitle>
              <CardDescription className="text-gray-400">
                Historial de todas las transacciones de tus ahorros este mes.
              </CardDescription>
            </div>
            <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <CardTitle className="text-sm font-medium text-white">Ahorro Total</CardTitle>
                    <PiggyBank className="h-5 w-5 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-yellow-400">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalSavings)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
            </div>
          ) : movements.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No hay movimientos este mes.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead className="w-[100px] text-white">Fecha</TableHead>
                    <TableHead className="min-w-[180px] text-white">Descripción</TableHead>
                    <TableHead className="text-right min-w-[100px] text-white">Cantidad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement, index) => (
                    <TableRow key={index}>
                      <TableCell>{format(new Date(movement.date), 'dd MMM', { locale: es })}</TableCell>
                      <TableCell className="flex items-center gap-3">
                        {getMovementIcon(movement.type)}
                        <span>{movement.description}</span>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${movement.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {movement.amount > 0 ? '+' : ''}{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(movement.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MonthlyMovements;