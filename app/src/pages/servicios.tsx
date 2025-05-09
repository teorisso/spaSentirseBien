'use client';

import { useState, useEffect } from 'react';
import PageHero from '../components/PageHero';
import Servicios from '../components/Servicios';
import { IService } from '../models/Service';

// Create a simpler interface for frontend display
interface IServiceDisplay {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  imageUrl: string;
  available: boolean;
}

export default function ServiciosPage() {
  const [services, setServices] = useState<IServiceDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState(null);

  useEffect(() => {
    console.log('Comenzando fetch de servicios');
    fetch('/api/admin/servicios')
      .then(res => {
        console.log('Respuesta API:', res.status);
        if (!res.ok) throw new Error('Error al obtener servicios');
        return res.json();
      })
      .then((data) => {
        console.log('Datos recibidos de la API:', data);
        // Asegurarse de que cada servicio tenga una categoría válida
        const serviciosProcesados = data.map((service: any) => ({
          _id: service._id,
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          category: service.category ? service.category.trim() : 'Sin categoría',
          imageUrl: service.imageUrl,
          available: service.available
        }));
        console.log('Servicios procesados:', serviciosProcesados);
        setServices(serviciosProcesados);
        setRawData(data);
        setError(null);
      })
      .catch((e) => {
        console.error('Error cargando servicios:', e);
        setError('No se pudieron cargar los servicios. Intenta más tarde.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PageHero
        title="Nuestros Servicios"
        description="Descubrí todos los tratamientos que Sentirse Bien tiene para vos."
      />
      {loading && (
        <p className="text-center mt-8 text-gray-500">Cargando servicios...</p>
      )}
      {error && (
        <p className="text-center mt-8 text-red-500">{error}</p>
      )}
      {!loading && !error && services.length > 0 && (
        <Servicios services={services} />
      )}
      {!loading && !error && services.length === 0 && (
        <div className="text-center mt-10 p-4">
          <p className="text-amber-600">No hay servicios disponibles actualmente.</p>
          <details className="mt-4 text-left max-w-2xl mx-auto p-4 bg-gray-50 rounded">
            <summary className="cursor-pointer text-sm text-gray-500">Información de depuración</summary>
            <pre className="text-xs mt-2 overflow-auto p-2 bg-gray-100">{JSON.stringify(rawData, null, 2)}</pre>
          </details>
        </div>
      )}
    </>
  );
}