import { useState, useEffect } from 'react';
import Create from './components/Create';
import NominaList from './components/NominaList';
import EmpleadosList from './components/EmpleadosList';
import Busquedas from './components/Busquedas';
import { useService } from './services/useService';

function App() {
  const [view, setView] = useState('empleados');
  const [nominaTotal, setNominaTotal] = useState(null);
  const service = useService();

  const cargarNominaTotal = async () => {
    try {
      const data = await service.getNominaTotal();
      setNominaTotal(data);
    } catch (error) {
      console.error('Error al cargar nómina total:', error);
    }
  };

  useEffect(() => {
    cargarNominaTotal();
  }, [view]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Sistema de Gestión de Nómina</h1>
          <nav className="flex gap-2 flex-wrap">
            <button 
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                view === 'empleados' 
                  ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setView('empleados')}
            >
            Empleados
            </button>
            <button 
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                view === 'nominas' 
                  ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setView('nominas')}
            >
              Nóminas
            </button>
            <button 
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                view === 'busquedas' 
                  ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setView('busquedas')}
            >
              Búsquedas
            </button>
          </nav>
        </div>
      </header>

      {nominaTotal && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">📊 Resumen Total de Nómina</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <span className="block text-sm font-medium mb-1">Total Nómina:</span>
                <span className="text-2xl font-bold">${nominaTotal.totalNomina.toFixed(2)}</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <span className="block text-sm font-medium mb-1">Empleados con Nómina:</span>
                <span className="text-2xl font-bold">{nominaTotal.cantidadEmpleados}</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <span className="block text-sm font-medium mb-1">Promedio por Empleado:</span>
                <span className="text-2xl font-bold">${nominaTotal.promedioSalario.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-6">
        {view === 'empleados' && (
          <div>
            <Create onEmpleadoCreado={cargarNominaTotal} />
            <EmpleadosList onActualizacion={cargarNominaTotal} />
          </div>
        )}
        {view === 'nominas' && <NominaList />}
        {view === 'busquedas' && <Busquedas />}
      </main>
    </div>
  );
}

export default App;
