import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { PlusCircle, Edit, Save, Loader2, XCircle } from 'lucide-react';
import { es } from 'date-fns/locale';

export const BillingFormCard = ({
  formRef,
  editingBillingId,
  handleSubmit,
  submitting,
  resetForm,
  selectedDay,
  billedAmount,
  setBilledAmount,
  advanceAmount,
  setAdvanceAmount,
  km,
  setKm,
  hours,
  setHours,
}) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
    <Card className="glass-effect border-white/20 h-full" ref={formRef}>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
            {editingBillingId ? <Edit className="mr-2 h-5 w-5"/> : <PlusCircle className="mr-2 h-5 w-5"/>}
            {editingBillingId ? 'Editar Facturación' : 'Registrar Facturación'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-gray-300">Fecha seleccionada</Label>
            <p className="text-yellow-400 font-semibold">{selectedDay ? selectedDay.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Ninguna'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billed" className="text-gray-300">Facturado (€)</Label>
              <Input id="billed" type="number" step="0.01" value={billedAmount} onChange={(e) => setBilledAmount(e.target.value)} placeholder="0.00" className="bg-gray-800 border-gray-700 text-white" required />
            </div>
            <div>
              <Label htmlFor="advance" className="text-gray-300">Anticipo (€)</Label>
              <Input id="advance" type="number" step="0.01" value={advanceAmount} onChange={(e) => setAdvanceAmount(e.target.value)} placeholder="0.00" className="bg-gray-800 border-gray-700 text-white" />
            </div>
            <div>
              <Label htmlFor="km" className="text-gray-300">KM Recorridos</Label>
              <Input id="km" type="number" step="0.01" value={km} onChange={(e) => setKm(e.target.value)} placeholder="0.0" className="bg-gray-800 border-gray-700 text-white" />
            </div>
            <div>
              <Label htmlFor="hours" className="text-gray-300">Horas Trabajadas</Label>
              <Input id="hours" type="number" step="0.01" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="0.0" className="bg-gray-800 border-gray-700 text-white" />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="w-full taxi-gradient hover:opacity-90" disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingBillingId ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />)}
              {editingBillingId ? 'Guardar Cambios' : 'Registrar'}
            </Button>
            {editingBillingId && (
              <Button type="button" variant="outline" className="w-auto bg-gray-700 hover:bg-gray-600 border-gray-600" onClick={resetForm}>
                <XCircle className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  </motion.div>
);

export const CalendarCard = ({ selectedDay, setSelectedDay, date, setDate, workedDays }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 flex justify-center lg:justify-start">
        <Card className="glass-effect border-white/20 p-4 w-full max-w-sm">
        <CalendarComponent
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            month={date}
            onMonthChange={setDate}
            locale={es}
            modifiers={{ worked: workedDays }}
            modifiersClassNames={{
                worked: 'bg-green-500/30 text-white rounded-full',
            }}
            className="p-0"
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 w-full",
                caption: "flex justify-center pt-1 relative items-center mb-4",
                caption_label: "text-base font-medium text-white capitalize",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-full",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex justify-around mb-2",
                head_cell: "text-gray-400 rounded-md w-9 font-normal text-sm capitalize",
                row: "flex w-full mt-2 justify-around",
                cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal rounded-full text-white hover:bg-white/10 transition-colors",
                day_selected: "bg-yellow-500 text-black hover:bg-yellow-600 focus:bg-yellow-600 !opacity-100",
                day_today: "text-yellow-400",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_hidden: "invisible",
            }}
        />
        </Card>
    </motion.div>
);