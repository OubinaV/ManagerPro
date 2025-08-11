import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash2, Loader2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const frequencyMap = {
  monthly: 'Mensual',
  bimonthly: 'Bimensual',
  quarterly: 'Trimestral',
  semiannually: 'Semestral',
  annually: 'Anual',
};

const FixedExpensesSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    concept: '',
    amount: '',
    frequency: 'monthly',
    start_date: '',
    total_amount: '',
  });

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('fixed_expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los gastos fijos.' });
    } else {
      setExpenses(data);
    }
    setLoading(false);
  }, [user.id, toast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFrequencyChange = (value) => {
    setFormData(prev => ({ ...prev, frequency: value }));
  };

  const resetForm = () => {
    setEditingExpense(null);
    setFormData({
      concept: '',
      amount: '',
      frequency: 'monthly',
      start_date: '',
      total_amount: '',
    });
  };

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        concept: expense.concept,
        amount: expense.amount,
        frequency: expense.frequency,
        start_date: expense.start_date,
        total_amount: expense.total_amount || '',
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const expenseData = {
      user_id: user.id,
      concept: formData.concept,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      start_date: formData.start_date,
      total_amount: formData.total_amount ? parseFloat(formData.total_amount) : null,
      status: 'active',
    };

    if (editingExpense) {
        if(formData.start_date !== editingExpense.start_date) {
            expenseData.next_payment_date = formData.start_date;
        }
        // When editing, if total_amount changes, update remaining_amount
        if (formData.total_amount) {
            expenseData.remaining_amount = parseFloat(formData.total_amount);
        } else {
            expenseData.remaining_amount = null;
        }
    } else {
        expenseData.next_payment_date = formData.start_date;
        expenseData.remaining_amount = formData.total_amount ? parseFloat(formData.total_amount) : null;
    }


    let error;
    if (editingExpense) {
      const { error: updateError } = await supabase
        .from('fixed_expenses')
        .update(expenseData)
        .eq('id', editingExpense.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('fixed_expenses')
        .insert(expenseData);
      error = insertError;
    }

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el gasto.' });
    } else {
      toast({ title: 'Éxito', description: `Gasto ${editingExpense ? 'actualizado' : 'creado'} correctamente.` });
      fetchExpenses();
      setIsModalOpen(false);
      resetForm();
    }
  };

  const handleDelete = async (expenseId) => {
    const { error } = await supabase
      .from('fixed_expenses')
      .delete()
      .eq('id', expenseId);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar el gasto.' });
    } else {
      toast({ title: 'Éxito', description: 'Gasto eliminado correctamente.' });
      fetchExpenses();
    }
  };
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Activo</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">Finalizado</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">{status}</span>;
    }
  };

  return (
    <Card className="glass-effect border-white/20 mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Configuración de Gastos Fijos</CardTitle>
          <CardDescription className="text-gray-400">Gestión de gastos recurrentes por frecuencia.</CardDescription>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Gasto Fijo
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow>
                  <TableHead className="text-white text-sm font-semibold">Concepto</TableHead>
                  <TableHead className="text-white text-sm font-semibold">Cuota</TableHead>
                  <TableHead className="text-white text-sm font-semibold">Pendiente</TableHead>
                  <TableHead className="text-white text-sm font-semibold">Frecuencia</TableHead>
                  <TableHead className="text-white text-sm font-semibold">Próximo Pago</TableHead>
                  <TableHead className="text-white text-sm font-semibold">Estado</TableHead>
                  <TableHead className="text-white text-sm font-semibold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.concept}</TableCell>
                    <TableCell>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(expense.amount)}</TableCell>
                    <TableCell>
                      {expense.total_amount ? 
                        `${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(expense.remaining_amount)}`
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell>{frequencyMap[expense.frequency]}</TableCell>
                    <TableCell>
                      {expense.status === 'active' ?
                        format(new Date((expense.next_payment_date || expense.start_date).replace(/-/g, '/')), 'dd MMM yyyy', { locale: es })
                        : <CheckCircle className="h-5 w-5 text-green-400" />
                      }
                    </TableCell>
                    <TableCell>
                      {getStatusChip(expense.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(expense)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-effect text-white">
          <DialogHeader>
            <DialogTitle>{editingExpense ? 'Editar' : 'Nuevo'} Gasto Fijo</DialogTitle>
            <DialogDescription>
              Rellena los detalles de tu gasto recurrente.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="concept">Concepto</Label>
              <Input id="concept" name="concept" value={formData.concept} onChange={handleInputChange} required className="bg-gray-800/80 border-gray-700" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Cantidad (€)</Label>
                <Input id="amount" name="amount" type="number" step="0.01" value={formData.amount} onChange={handleInputChange} required className="bg-gray-800/80 border-gray-700" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">Fecha de Inicio de Pago</Label>
                <Input id="start_date" name="start_date" type="date" value={formData.start_date} onChange={handleInputChange} required className="bg-gray-800/80 border-gray-700" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frecuencia</Label>
              <Select onValueChange={handleFrequencyChange} value={formData.frequency}>
                <SelectTrigger className="bg-gray-800/80 border-gray-700">
                  <SelectValue placeholder="Selecciona una frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="bimonthly">Bimensual</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="semiannually">Semestral</SelectItem>
                  <SelectItem value="annually">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_amount">Total a Pagar (Opcional)</Label>
              <Input id="total_amount" name="total_amount" type="number" step="0.01" value={formData.total_amount} onChange={handleInputChange} placeholder="Dejar en blanco si es indefinido" className="bg-gray-800/80 border-gray-700" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Guardar Gasto</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FixedExpensesSettings;