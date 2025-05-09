'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { IService } from '../../models/Service'

export default function AdminServiciosPage() {
  const [services, setServices] = useState<IService[]>([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: null as File | null,
    category: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/admin/servicios')
      .then(res => res.json())
      .then((data: IService[]) => setServices(data))
      .catch(() => alert('Error al cargar servicios'))
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement
      setForm(prev => ({ ...prev, image: fileInput.files ? fileInput.files[0] : null }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('price', form.price)
      formData.append('category', form.category)
      if (form.image) formData.append('image', form.image)

      const res = await fetch('/api/admin/servicios', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Error en la creación')

      const newService: IService = await res.json()
      setServices(prev => [...prev, newService])
      setForm({ name: '', description: '', price: '', image: null, category: '' })
    } catch {
      alert('Error al crear servicio')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este servicio?')) return
    const res = await fetch(`/api/admin/servicios/${id}`, { method: 'DELETE' })
    if (res.status === 204) {
      setServices(prev => prev.filter(s => (s as any)._id !== id))
    } else {
      alert('Error al eliminar')
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <form onSubmit={handleCreate} className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-semibold text-[#436E6C]">Nuevo Servicio</h2>
          <input
            name="name" value={form.name} onChange={handleChange}
            placeholder="Nombre" required className="w-full border p-2 rounded"
          />
          <textarea
            name="description" value={form.description} onChange={handleChange}
            placeholder="Descripción" required className="w-full border p-2 rounded"
          />
          <input
            name="price" type="number" value={form.price} onChange={handleChange}
            placeholder="Precio" required className="w-full border p-2 rounded"
          />
          <div>
            <label htmlFor="image" className="block mb-2">Imagen del servicio</label>
            <input
              id="image"
              name="image" 
              type="file" 
              accept="image/*" 
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block mb-2">Categoría</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Seleccionar categoría</option>
              <option value="Masajes">Masajes</option>
              <option value="Belleza">Belleza</option>
              <option value="Tratamientos Faciales">Tratamientos Faciales</option>
              <option value="Tratamientos Corporales">Tratamientos Corporales</option>
              <option value="Servicios Grupales">Servicios Grupales</option>
            </select>
          </div>
          <button
            disabled={loading}
            className="bg-[#436E6C] text-white px-4 py-2 rounded hover:bg-[#365854]"
          >
            {loading ? 'Creando…' : 'Crear Servicio'}
          </button>
        </form>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-[#436E6C] mb-4">Servicios Existentes</h2>
          <ul className="space-y-3">
            {services.map(s => (
              <li key={(s as any)._id} className="flex justify-between items-center">
                <div>
                  <strong>{s.name}</strong> — ${s.price}
                </div>
                <button
                  onClick={() => handleDelete((s as any)._id)}
                  className="text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
