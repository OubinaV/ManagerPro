import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-react';

export const BillingHistoryTable = ({
  billings,
  loading,
  commissionRate,
  handleEditClick,
  handleDelete,
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full overflow-x-auto">
        <Card className="glass-effect border-white/20 h-full">
            <CardHeader>
                <CardTitle className="text-white">Historial de Facturación</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-white/20 hover:bg-transparent">
                                <TableHead className="text-white min-w-[120px]">Fecha</TableHead>
                                <TableHead className="text-white text-right min-w-[100px]">Facturado</TableHead>
                                <TableHead className="text-white text-right min-w-[100px]">Ganancia</TableHead>
                                <TableHead className="text-white text-right min-w-[100px]">Anticipos</TableHead>
                                <TableHead className="text-white text-right min-w-[80px]">KM</TableHead>
                                <TableHead className="text-white text-right min-w-[80px]">Horas</TableHead>
                                <TableHead className="text-white text-right min-w-[120px]">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan="7" className="text-center h-40"><Loader2 className="h-8 w-8 animate-spin text-yellow-400 mx-auto" /></TableCell></TableRow>
                            ) : billings.length === 0 ? (
                                <TableRow><TableCell colSpan="7" className="text-center text-gray-400 py-8">No hay registros de facturación para este mes.</TableCell></TableRow>
                            ) : (
                                billings.map((b) => (
                                    <TableRow key={b.id} className="border-b-white/10 hover:bg-white/5">
                                        <TableCell className="font-medium text-white flex items-center space-x-2">
                                            <CalendarIcon className="h-4 w-4 text-yellow-400" />
                                            <span>{new Date(b.billing_date).toLocaleDateString('es-ES', {timeZone: 'UTC'})}</span>
                                        </TableCell>
                                        <TableCell className="text-right text-blue-400 font-semibold">€{parseFloat(b.billed_amount).toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-green-400 font-semibold">€{(parseFloat(b.billed_amount) * commissionRate).toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-orange-400 font-semibold">-€{parseFloat(b.advance_amount || 0).toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-white">{parseFloat(b.km || 0).toFixed(1)}</TableCell>
                                        <TableCell className="text-right text-white">{parseFloat(b.hours || 0).toFixed(1)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <Button variant="ghost" size="icon" className="hover:bg-blue-500/20" onClick={() => handleEditClick(b)}><Edit className="h-4 w-4 text-blue-400" /></Button>
                                                <Button variant="ghost" size="icon" className="hover:bg-red-500/20" onClick={() => handleDelete(b.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </motion.div>
  );
};