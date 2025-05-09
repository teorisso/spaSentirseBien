'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

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

interface ServiciosProps {
  services: IServiceDisplay[];
}

export default function Servicios({ services }: ServiciosProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000 });

  // ✅ Validación: si services es undefined o no es array, mostramos mensaje de error
  if (!services || !Array.isArray(services)) {
    return (
      <div className="text-center mt-10 text-red-500">
        No se pudieron cargar los servicios. Intenta más tarde.
      </div>
    );
  }

  console.log('Todos los servicios recibidos:', services);
  const categoriasUnicas = Array.from(new Set(services.map(s => s.category))).filter(Boolean);
  console.log('Categorías únicas encontradas:', categoriasUnicas);

  const servicesGroupedByCategory = services.reduce((acc: Record<string, IServiceDisplay[]>, service) => {
    const category = service.category.trim();
    console.log('Procesando servicio:', service.name, 'con categoría:', category);
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {});

  console.log('Servicios agrupados por categoría:', servicesGroupedByCategory);
  
  const filtered = Object.entries(servicesGroupedByCategory).map(([category, items]) => ({
    category,
    services: items.filter(service => {
      const price = Number(service.price);
      console.log('Filtrando servicio:', service.name, 'categoría:', category, 'precio:', price, 'rango:', priceRange);
      const matchesCategory = !selectedCategory || selectedCategory === category;
      const matchesPrice = !isNaN(price) && price >= priceRange.min && price <= priceRange.max;
      return matchesCategory && matchesPrice;
    }),
  }));

  console.log('Servicios filtrados:', filtered);

  return (
    <main className="relative min-h-screen font-roboto">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8">

          <div className="md:w-64 w-full bg-white/80 rounded-xl shadow-lg p-6 h-fit backdrop-blur-sm border border-accent/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-lora font-semibold text-primary">Filtrar por</h3>
              {(selectedCategory || priceRange.max < 100000) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setPriceRange({ min: 0, max: 100000 });
                  }}
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-primary/80 mb-2">Categoría</h4>
              <div className="space-y-2">
                {categoriasUnicas.map(category => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() =>
                        setSelectedCategory(selectedCategory === category ? null : category)
                      }
                      className="text-accent focus:ring-accent cursor-pointer"
                    />
                    <span className="text-sm group-hover:text-accent transition-colors">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-primary/80 mb-2">Rango de Precio</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="w-full"
                  title="Rango de precio máximo"
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.flatMap(({ category, services }) =>
                services.map((service, idx) => {
                  console.log('Servicio:', service.name, 'imageUrl:', service.imageUrl);
                  return (
                    <motion.div
                      key={`${category}-${idx}`}
                      className="relative rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={service.imageUrl || '/images/default-service.jpg'}
                          alt={service.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={idx < 3}
                        />
                      </div>

                      <div className="relative h-full flex flex-col">
                        <div className="w-full h-40 relative">
                          <div className="absolute inset-0 bg-black/20"></div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between p-4 bg-white/80">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-lora font-bold">{service.name}</h4>
                              <span className="bg-accent/30 text-primary text-base font-semibold px-3 py-1.5 rounded-full border border-accent/30">
                                ${service.price}
                              </span>
                            </div>
                            <p className="text-sm text-primary/80 mb-3 line-clamp-2">{service.description}</p>
                          </div>
                          <div className="flex justify-end">
                            <Link href="/reserva">
                              <button className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition-all text-sm font-medium">
                                Reservar
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

