import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ContentPlaceholder = ({ data }) => (
  <Card className="glass-effect border-white/20 mt-6">
    <CardHeader>
      <CardTitle className="text-white">{data.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-300">{data.description}</p>
      <p className="text-yellow-400 mt-4">
        ¡Esta sección está en construcción! Dime qué quieres añadir aquí y lo construiré para ti. 🚀
      </p>
    </CardContent>
  </Card>
);

export default ContentPlaceholder;