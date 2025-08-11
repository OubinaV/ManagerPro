import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, TrendingUp, TrendingDown, CalendarDays, Euro, Star, Target, History, ArrowRightLeft as CompareArrows } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, parseISO, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';

const StatCard = ({ icon: Icon, title, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card className="glass-effect border-white/20 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  </motion.div>
);

const StatisticsPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ workedDays: 0, dailyAverage: 0, bestDay: 0 });
  const [monthlyHistory, setMonthlyHistory] = useState([]);
  const [allAvailableMonths, setAllAvailableMonths] = useState([]);
  const [availableMonths1, setAvailableMonths1] = useState([]);
  const [availableMonths2, setAvailableMonths2] = useState([]);
  const [compareMonth1, setCompareMonth1] = useState(null);
  const [compareMonth2, setCompareMonth2] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);

  const commissionRate = useMemo(() => profile?.commission_rate || 0.35, [profile]);

  const fetchAllBillingData = useCallback(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('driver_billing')
      .select('billing_date, billed_amount')
      .eq('user_id', user.id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los datos de facturación.' });
      return [];
    }
    return data;
  }, [user, toast]);

  const processData = useCallback((data) => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    
    const currentMonthData = data.filter(d => startOfMonth(parseISO(d.billing_date)).getTime() === currentMonthStart.getTime());
    
    const workedDays = new Set(currentMonthData.map(d => d.billing_date)).size;
    const totalBilledCurrentMonth = currentMonthData.reduce((acc, curr) => acc + curr.billed_amount, 0);
    const dailyAverage = workedDays > 0 ? totalBilledCurrentMonth / workedDays : 0;
    const bestDay = Math.max(0, ...currentMonthData.map(d => d.billed_amount));

    setStats({ workedDays, dailyAverage, bestDay });

    const history = data.reduce((acc, curr) => {
      const month = format(parseISO(curr.billing_date), 'yyyy-MM-01');
      if (!acc[month]) {
        acc[month] = { totalBilled: 0, entries: 0 };
      }
      acc[month].totalBilled += curr.billed_amount;
      acc[month].entries++;
      return acc;
    }, {});

    const formattedHistory = Object.entries(history)
      .map(([month, values]) => ({
        month,
        totalBilled: values.totalBilled,
        commission: values.totalBilled * commissionRate,
      }))
      .sort((a, b) => new Date(b.month) - new Date(a.month));
    
    const historyWithTrend = formattedHistory.map((item, index) => {
        const prevMonth = formattedHistory[index + 1];
        let trend = 0;
        if (prevMonth) {
            trend = item.totalBilled - prevMonth.totalBilled;
        }
        return {...item, trend};
    });

    setMonthlyHistory(historyWithTrend);
    const allMonths = formattedHistory.map(item => ({
        value: item.month,
        label: format(new Date(item.month), 'MMMM yyyy', { locale: es })
    }));
    setAllAvailableMonths(allMonths);
    setAvailableMonths1(allMonths);
    setAvailableMonths2(allMonths);

    setLoading(false);
  }, [commissionRate]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const allData = await fetchAllBillingData();
      processData(allData);
    };
    loadData();
  }, [fetchAllBillingData, processData]);
  
  const handleMonth1Change = (value) => {
    setCompareMonth1(value);
    const selectedDate = new Date(value);
    setAvailableMonths2(allAvailableMonths.filter(m => isAfter(new Date(m.value), selectedDate)));
    if (compareMonth2 && !isAfter(new Date(compareMonth2), selectedDate)) {
        setCompareMonth2(null);
    }
  };

  const handleMonth2Change = (value) => {
    setCompareMonth2(value);
    const selectedDate = new Date(value);
    setAvailableMonths1(allAvailableMonths.filter(m => isBefore(new Date(m.value), selectedDate)));
     if (compareMonth1 && !isBefore(new Date(compareMonth1), selectedDate)) {
        setCompareMonth1(null);
    }
  };


  useEffect(() => {
    if (compareMonth1 && compareMonth2) {
      const data1 = monthlyHistory.find(h => h.month === compareMonth1);
      const data2 = monthlyHistory.find(h => h.month === compareMonth2);

      if (data1 && data2) {
        setComparisonData({
          month1Label: format(new Date(data1.month), 'MMMM yyyy', { locale: es }),
          month2Label: format(new Date(data2.month), 'MMMM yyyy', { locale: es }),
          billing: {
            val1: data1.totalBilled,
            val2: data2.totalBilled,
            diff: data2.totalBilled - data1.totalBilled,
            diffPercent: data1.totalBilled !== 0 ? ((data2.totalBilled - data1.totalBilled) / data1.totalBilled) * 100 : (data2.totalBilled > 0 ? 100 : 0),
          },
          commission: {
            val1: data1.commission,
            val2: data2.commission,
            diff: data2.commission - data1.commission,
            diffPercent: data1.commission !== 0 ? ((data2.commission - data1.commission) / data1.commission) * 100 : (data2.commission > 0 ? 100 : 0),
          }
        });
      }
    } else {
      setComparisonData(null);
    }
  }, [compareMonth1, compareMonth2, monthlyHistory]);

  const TrendArrow = ({ value }) => {
    if (value > 0) return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (value < 0) return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <span className="text-gray-500">-</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Estadísticas - TaxiManager</title>
        <meta name="description" content="Análisis de rendimiento y tendencias del negocio." />
      </Helmet>
      <div className="flex flex-col flex-1 gap-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white">Estadísticas</h1>
          <p className="text-gray-400">Análisis de rendimiento y tendencias del negocio</p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={CalendarDays} title="Días Trabajados (Mes Actual)" value={stats.workedDays} color="text-green-400" delay={0.1} />
          <StatCard icon={Euro} title="Promedio Diario (Mes Actual)" value={`€${stats.dailyAverage.toFixed(2)}`} color="text-blue-400" delay={0.2} />
          <StatCard icon={Star} title="Mejor Día (Mes Actual)" value={`€${stats.bestDay.toFixed(2)}`} color="text-yellow-400" delay={0.3} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center"><CompareArrows className="mr-2" /> Comparación entre Meses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={compareMonth1} onValueChange={handleMonth1Change}>
                  <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white"><SelectValue placeholder="Selecciona el primer mes" /></SelectTrigger>
                  <SelectContent>{allAvailableMonths.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={compareMonth2} onValueChange={handleMonth2Change}>
                  <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white"><SelectValue placeholder="Selecciona el segundo mes" /></SelectTrigger>
                  <SelectContent>{allAvailableMonths.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {comparisonData && (
                <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-white min-w-[100px]">Métrica</TableHead>
                          <TableHead className="text-white text-right capitalize min-w-[120px]">{comparisonData.month1Label}</TableHead>
                          <TableHead className="text-white text-right capitalize min-w-[120px]">{comparisonData.month2Label}</TableHead>
                          <TableHead className="text-white text-right min-w-[150px]">Diferencia</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium text-white">Facturación</TableCell>
                          <TableCell className="text-right text-white">€{comparisonData.billing.val1.toFixed(2)}</TableCell>
                          <TableCell className="text-right text-white">€{comparisonData.billing.val2.toFixed(2)}</TableCell>
                          <TableCell className={`text-right font-semibold ${comparisonData.billing.diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            €{comparisonData.billing.diff.toFixed(2)} ({comparisonData.billing.diffPercent.toFixed(1)}%)
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-white">Comisión</TableCell>
                          <TableCell className="text-right text-white">€{comparisonData.commission.val1.toFixed(2)}</TableCell>
                          <TableCell className="text-right text-white">€{comparisonData.commission.val2.toFixed(2)}</TableCell>
                          <TableCell className={`text-right font-semibold ${comparisonData.commission.diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            €{comparisonData.commission.diff.toFixed(2)} ({comparisonData.commission.diffPercent.toFixed(1)}%)
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center"><History className="mr-2" /> Historial Completo de Meses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white min-w-[120px]">Mes</TableHead>
                      <TableHead className="text-white text-right min-w-[120px]">Facturación</TableHead>
                      <TableHead className="text-white text-right min-w-[100px]">Comisión</TableHead>
                      <TableHead className="text-white text-right min-w-[100px]">Tendencia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyHistory.map((item) => (
                      <TableRow key={item.month}>
                        <TableCell className="font-medium text-white capitalize">{format(new Date(item.month), 'MMMM yyyy', { locale: es })}</TableCell>
                        <TableCell className="text-right text-blue-400">€{item.totalBilled.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-green-400">€{item.commission.toFixed(2)}</TableCell>
                        <TableCell className="text-right flex justify-end items-center">
                          <TrendArrow value={item.trend} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default StatisticsPage;