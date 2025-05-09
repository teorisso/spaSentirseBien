// pages/admin/dashboard.tsx
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-primary">Panel de Administración</h1>
        <p className="text-stone">Bienvenido, {user?.nombre}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Dashboard Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-medium text-dark mb-2">Citas Hoy</h3>
          <p className="text-3xl font-bold text-primary">12</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-medium text-dark mb-2">Clientes Nuevos</h3>
          <p className="text-3xl font-bold text-primary">5</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-medium text-dark mb-2">Ingresos</h3>
          <p className="text-3xl font-bold text-primary">$1,450</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-medium text-dark mb-2">Servicios</h3>
          <p className="text-3xl font-bold text-primary">8</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-dark mb-4">Próximas Citas</h2>
          <div className="divide-y">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">Cliente {i + 1}</p>
                  <p className="text-sm text-stone">Masaje Relajante • 60min</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">14:30</p>
                  <p className="text-sm text-stone">Hoy</p>
                </div>
              </div>
            ))}
            <button className="mt-4 text-primary hover:underline text-sm">
              Ver todas las citas
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-dark mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-primary hover:bg-opacity-90 text-white py-4 px-6 rounded-lg">
              Nueva Cita
            </button>
            <button className="bg-primary hover:bg-opacity-90 text-white py-4 px-6 rounded-lg">
              Nuevo Cliente
            </button>
            <button className="bg-primary hover:bg-opacity-90 text-white py-4 px-6 rounded-lg">
              Gestionar Servicios
            </button>
            <button className="bg-primary hover:bg-opacity-90 text-white py-4 px-6 rounded-lg">
              Ver Reportes
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}