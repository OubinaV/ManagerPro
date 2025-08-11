import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { StatsGrid, SettingsCard } from '@/components/billing/BillingStats';
import { BillingFormCard, CalendarCard } from '@/components/billing/BillingForm';
import { BillingHistoryTable } from '@/components/billing/BillingHistoryTable';
import { dateToISOLikeButLocal } from '@/lib/utils';
import { startOfMonth, endOfMonth, format } from 'date-fns';

const BillingPage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [billings, setBillings] = useState([]);
  const [date, setDate] = useState(new Date()); 
  const [selectedDay, setSelectedDay] = useState(new Date()); 
  const [billedAmount, setBilledAmount] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [km, setKm] = useState('');
  const [hours, setHours] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commissionRate, setCommissionRate] = useState(0.35);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [editingBillingId, setEditingBillingId] = useState(null);

  const formRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setCommissionRate(profile.commission_rate || 0.35);
      setMonthlySalary(profile.monthly_salary || 0);
    }
  }, [profile]);

  const fetchBillings = useCallback(async (monthDate) => {
    if (!user) return;
    setLoading(true);

    const firstDay = startOfMonth(monthDate);
    const lastDay = endOfMonth(monthDate);
    
    try {
      const { data, error } = await supabase
        .from('driver_billing')
        .select('*')
        .eq('user_id', user.id)
        .gte('billing_date', format(firstDay, 'yyyy-MM-dd'))
        .lte('billing_date', format(lastDay, 'yyyy-MM-dd'))
        .order('billing_date', { ascending: true });

      if (error) throw error;
      setBillings(data);
    } catch (error) {
      toast({ title: "Error", description: "No se pudo cargar la facturación.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchBillings(date);
  }, [fetchBillings, date]);
  
  const stats = useMemo(() => {
    const totalBilled = billings.reduce((sum, b) => sum + parseFloat(b.billed_amount), 0);
    const totalAdvances = billings.reduce((sum, b) => sum + parseFloat(b.advance_amount || 0), 0);
    const totalKm = billings.reduce((sum, b) => sum + parseFloat(b.km || 0), 0);
    const totalHours = billings.reduce((sum, b) => sum + parseFloat(b.hours || 0), 0);
    const totalEarnings = totalBilled * commissionRate;
    const netToReceive = totalEarnings - totalAdvances - monthlySalary;

    return { totalBilled, totalEarnings, totalAdvances, totalKm, totalHours, netToReceive };
  }, [billings, commissionRate, monthlySalary]);

  const workedDays = useMemo(() => {
    const dates = billings.map(b => {
      const [year, month, day] = b.billing_date.split('-').map(Number);
      return new Date(year, month - 1, day);
    });
    return dates;
  }, [billings]);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          commission_rate: commissionRate,
          monthly_salary: monthlySalary 
        })
        .eq('id', user.id);
      if (error) throw error;
      await refreshProfile(user);
      toast({ title: "Éxito", description: "Ajustes guardados correctamente." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron guardar los ajustes.", variant: "destructive" });
    } finally {
      setIsSavingSettings(false);
    }
  };
  
  const resetForm = () => {
    setBilledAmount('');
    setAdvanceAmount('');
    setKm('');
    setHours('');
    setEditingBillingId(null);
    setSelectedDay(new Date());
  };

  const handleEditClick = (billing) => {
    setEditingBillingId(billing.id);
    const [year, month, day] = billing.billing_date.split('-').map(Number);
    setSelectedDay(new Date(year, month - 1, day));
    setBilledAmount(billing.billed_amount);
    setAdvanceAmount(billing.advance_amount || '');
    setKm(billing.km || '');
    setHours(billing.hours || '');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !selectedDay || !billedAmount) {
      toast({ title: "Error", description: "Por favor, completa todos los campos requeridos (Fecha y Facturado).", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    
    const billingData = {
      user_id: user.id,
      billing_date: dateToISOLikeButLocal(selectedDay),
      billed_amount: parseFloat(billedAmount),
      advance_amount: parseFloat(advanceAmount || 0),
      km: parseFloat(km || 0),
      hours: parseFloat(hours || 0)
    };

    try {
      let error;
      if (editingBillingId) {
        const { error: updateError } = await supabase
          .from('driver_billing')
          .update(billingData)
          .eq('id', editingBillingId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
            .from('driver_billing')
            .insert(billingData);
        error = insertError;
      }
      
      if (error) throw error;
      
      toast({ title: "Éxito", description: `Facturación ${editingBillingId ? 'actualizada' : 'registrada'} correctamente.` });
      resetForm();
      fetchBillings(date);
    } catch (error) {
      toast({ title: "Error", description: `No se pudo ${editingBillingId ? 'actualizar' : 'registrar'} la facturación.`, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este registro?")) return;
    try {
      const { error } = await supabase.from('driver_billing').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Éxito", description: "Registro eliminado." });
      fetchBillings(date);
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar el registro.", variant: "destructive" });
    }
  };
  
  const handleMonthChange = (month) => {
    setDate(month);
    // Move selection to the first day of the new month if it's not the current month
    if (month.getMonth() !== new Date().getMonth() || month.getFullYear() !== new Date().getFullYear()) {
        setSelectedDay(new Date(month.getFullYear(), month.getMonth(), 1));
    } else {
        setSelectedDay(new Date());
    }
  };

  return (
    <>
      <Helmet>
        <title>Facturación - TaxiManager</title>
        <meta name="description" content="Gestiona tu facturación, registra viajes y consulta tu historial." />
      </Helmet>
      <div className="flex flex-col flex-1 gap-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatsGrid stats={stats} />
          <SettingsCard
            monthlySalary={monthlySalary}
            setMonthlySalary={setMonthlySalary}
            commissionRate={commissionRate}
            setCommissionRate={setCommissionRate}
            handleSaveSettings={handleSaveSettings}
            isSavingSettings={isSavingSettings}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CalendarCard
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            date={date}
            setDate={handleMonthChange}
            workedDays={workedDays}
          />
          <BillingFormCard
            formRef={formRef}
            editingBillingId={editingBillingId}
            handleSubmit={handleSubmit}
            submitting={submitting}
            resetForm={resetForm}
            selectedDay={selectedDay}
            billedAmount={billedAmount}
            setBilledAmount={setBilledAmount}
            advanceAmount={advanceAmount}
            setAdvanceAmount={setAdvanceAmount}
            km={km}
            setKm={setKm}
            hours={hours}
            setHours={setHours}
          />
        </div>
        
        <BillingHistoryTable
          billings={billings}
          loading={loading}
          commissionRate={commissionRate}
          handleEditClick={handleEditClick}
          handleDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default BillingPage;