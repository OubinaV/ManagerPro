import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Receipt, TrendingUp, MinusCircle, Route, Clock, CreditCard, FileText, Save, Loader2 } from 'lucide-react';

const CompactStatCard = ({ icon: Icon, title, value, colorClass, animationDelay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: animationDelay }}
    className="glass-effect border-white/20 p-4 rounded-lg flex items-center space-x-4 card-hover"
  >
    <div className={`p-3 rounded-lg bg-gray-800`}>
      <Icon className={`h-6 w-6 ${colorClass}`} />
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  </motion.div>
);

export const StatsGrid = ({ stats }) => {
  const statCards = [
    { icon: Receipt, title: 'Facturado', value: `€${stats.totalBilled.toFixed(2)}`, colorClass: 'text-blue-400' },
    { icon: TrendingUp, title: 'Ganancias', value: `€${stats.totalEarnings.toFixed(2)}`, colorClass: 'text-green-400' },
    { icon: MinusCircle, title: 'Anticipos', value: `€${stats.totalAdvances.toFixed(2)}`, colorClass: 'text-orange-400' },
    { icon: CreditCard, title: 'Neto a Cobrar', value: `€${stats.netToReceive.toFixed(2)}`, colorClass: 'text-yellow-400' },
    { icon: Route, title: 'KM', value: stats.totalKm.toFixed(1), colorClass: 'text-indigo-400' },
    { icon: Clock, title: 'Horas', value: stats.totalHours.toFixed(1), colorClass: 'text-pink-400' },
  ];

  return (
    <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
      {statCards.map((card, index) => <CompactStatCard key={card.title} {...card} animationDelay={index * 0.05} />)}
    </div>
  );
};

export const SettingsCard = ({
  monthlySalary,
  setMonthlySalary,
  commissionRate,
  setCommissionRate,
  handleSaveSettings,
  isSavingSettings
}) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-1">
    <Card className="glass-effect border-white/20 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center"><FileText className="mr-2 h-5 w-5" /> Ajustes de Cálculo</CardTitle>
        <CardDescription className="text-gray-400">Define tu nómina y comisión.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div>
            <Label htmlFor="monthlySalary" className="text-gray-300">Nómina Mensual (€)</Label>
            <Input 
              id="monthlySalary"
              type="number"
              step="0.01"
              value={monthlySalary} 
              onChange={(e) => setMonthlySalary(parseFloat(e.target.value) || 0)}
              className="bg-gray-800 border-gray-700 text-white"
            />
        </div>
        <div>
            <Label htmlFor="commissionRate" className="text-gray-300">Porcentaje Comisión (%)</Label>
            <Input 
              id="commissionRate"
              type="number"
              step="1"
              min="0"
              max="100"
              value={commissionRate * 100} 
              onChange={(e) => setCommissionRate(parseFloat(e.target.value) / 100 || 0)}
              className="bg-gray-800 border-gray-700 text-white"
            />
        </div>
        <Button onClick={handleSaveSettings} disabled={isSavingSettings} className="w-full taxi-gradient hover:opacity-90">
          {isSavingSettings ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar Ajustes
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);