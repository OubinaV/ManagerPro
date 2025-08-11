import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MonthlyExpensesView from '@/components/expenses/MonthlyExpensesView';
import FixedExpensesSettings from '@/components/expenses/FixedExpensesSettings';
import SavingsHistoryView from '@/components/expenses/SavingsHistoryView';
import ExtraMovements from '@/components/expenses/ExtraMovements';
import MonthlyMovements from '@/components/expenses/MonthlyMovements';

const ExpensesPage = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  const [viewKey, setViewKey] = useState(Date.now());

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === 'monthly') {
      setViewKey(Date.now());
    }
  }

  return (
    <>
      <Helmet>
        <title>Gestión de Gastos - TaxiManager</title>
        <meta name="description" content="Registra y controla tus gastos mensuales." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col flex-1 gap-6"
      >
        <h1 className="text-3xl font-bold text-white">Gestión de Gastos y Ahorros</h1>

        <Tabs defaultValue="monthly" className="w-full flex-1 flex flex-col" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 bg-gray-800/80 rounded-lg p-1">
            <TabsTrigger 
              value="monthly" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-colors duration-300"
            >
              Gastos del Mes
            </TabsTrigger>
            <TabsTrigger 
              value="movements" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-colors duration-300"
            >
              Movimientos
            </TabsTrigger>
            <TabsTrigger 
              value="extra" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-colors duration-300"
            >
              Mov. Extra
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-colors duration-300"
            >
              Transferencias
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-colors duration-300"
            >
              Configuración
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="mt-2 flex-1"
            >
              <TabsContent value="monthly" forceMount={activeTab !== 'monthly' ? true : undefined} className={activeTab !== 'monthly' ? 'hidden' : ''}>
                <MonthlyExpensesView key={viewKey} />
              </TabsContent>
              <TabsContent value="movements" forceMount={activeTab !== 'movements' ? true : undefined} className={activeTab !== 'movements' ? 'hidden' : ''}>
                <MonthlyMovements />
              </TabsContent>
              <TabsContent value="extra" forceMount={activeTab !== 'extra' ? true : undefined} className={activeTab !== 'extra' ? 'hidden' : ''}>
                <ExtraMovements />
              </TabsContent>
              <TabsContent value="history" forceMount={activeTab !== 'history' ? true : undefined} className={activeTab !== 'history' ? 'hidden' : ''}>
                <SavingsHistoryView />
              </TabsContent>
              <TabsContent value="settings" forceMount={activeTab !== 'settings' ? true : undefined} className={activeTab !== 'settings' ? 'hidden' : ''}>
                <FixedExpensesSettings />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </>
  );
};

export default ExpensesPage;