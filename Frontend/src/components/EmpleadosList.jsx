import React, { useState, useEffect } from 'react';
import { useService } from '../services/useService';
import CalcularNomina from './CalcularNomina';

const EmpleadosList = ({ onActualizacion }) => {
    const [empleados, setEmpleados] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const service = useService();

    const cargarEmpleados = async () => {
        try {
            setLoading(true);
            const data = await service.getEmpleados();
            setEmpleados(data);
        } catch (error) {
            console.error('Error al cargar empleados:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEmpleados();
    }, []);

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
            try {
                await service.deleteEmpleado(id);
                cargarEmpleados();
                if (onActualizacion) onActualizacion();
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert('Error al eliminar empleado');
            }
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">⏳ Cargando empleados...</div>;
    }

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Lista de Empleados</h2>
            {empleados.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay empleados registrados</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {empleados.map((emp) => (
                        <div key={emp.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-gray-800">{emp.nombre}</h3>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {emp.edad} años
                                </span>
                            </div>
                            <div className="space-y-2 mb-4 text-sm text-gray-600">
                                <p><strong className="text-gray-700">ID:</strong> {emp.id}</p>
                                <p><strong className="text-gray-700">Fecha Nacimiento:</strong> {emp.fecha_nacimiento}</p>
                                {emp.nominas && emp.nominas.length > 0 && (
                                    <div className="bg-green-50 p-2 rounded mt-2">
                                        <p className="text-green-800">
                                            <strong>Último Salario:</strong> ${emp.nominas[0].salario_neto}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition-colors text-sm font-medium"
                                    onClick={() => setEmpleadoSeleccionado(emp)}
                                >
                                    💰 Calcular Nómina
                                </button>
                                <button 
                                    className="bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700 transition-colors text-sm font-medium"
                                    onClick={() => handleEliminar(emp.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {empleadoSeleccionado && (
                <CalcularNomina 
                    empleado={empleadoSeleccionado}
                    onClose={() => setEmpleadoSeleccionado(null)}
                    onNominaCalculada={() => {
                        setEmpleadoSeleccionado(null);
                        cargarEmpleados();
                        if (onActualizacion) onActualizacion();
                    }}
                />
            )}
        </div>
    );
};

export default EmpleadosList;
