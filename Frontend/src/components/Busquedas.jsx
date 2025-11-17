import React, { useState, useEffect } from 'react';
import { useService } from '../services/useService';

const Busquedas = () => {
    const [vista, setVista] = useState('mejor-pagados');
    const [mejorPagados, setMejorPagados] = useState([]);
    const [cumpleanos, setCumpleanos] = useState([]);
    const [busquedaNombre, setBusquedaNombre] = useState('');
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    const [loading, setLoading] = useState(false);
    const service = useService();

    useEffect(() => {
        if (vista === 'mejor-pagados') {
            cargarMejorPagados();
        } else if (vista === 'cumpleanos') {
            cargarCumpleanos();
        }
    }, [vista]);

    const cargarMejorPagados = async () => {
        try {
            setLoading(true);
            const data = await service.getEmpleadosMejorPagados(10);
            setMejorPagados(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const cargarCumpleanos = async () => {
        try {
            setLoading(true);
            const data = await service.getCumpleanosProximos();
            setCumpleanos(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const buscarPorNombre = async () => {
        if (!busquedaNombre.trim()) return;
        
        try {
            setLoading(true);
            const data = await service.buscarEmpleados(busquedaNombre);
            setResultadosBusqueda(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Búsquedas Dinámicas</h2>
            
            <div className="flex gap-2 mb-6 flex-wrap">
                <button 
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        vista === 'mejor-pagados' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => setVista('mejor-pagados')}
                >
                    Mejor Pagados
                </button>
                <button 
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        vista === 'cumpleanos' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => setVista('cumpleanos')}
                >
                    Cumpleaños Próximos
                </button>
                <button 
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        vista === 'buscar' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => setVista('buscar')}
                >
                    Buscar por Nombre
                </button>
            </div>

            {loading && <div className="text-center py-8 text-gray-600">⏳ Cargando...</div>}

            {vista === 'mejor-pagados' && !loading && (
                <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Top 10 Empleados Mejor Pagados</h3>
                    {mejorPagados.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No hay datos disponibles</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mejorPagados.map((emp, index) => (
                                <div key={emp.empleado_id} className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-gray-800">{emp.empleado?.nombre || 'N/A'}</h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p><strong className="text-green-600">Salario Máximo:</strong> ${parseFloat(emp.max_salario).toFixed(2)}</p>
                                            <p><strong className="text-blue-600">Promedio:</strong> ${parseFloat(emp.promedio_salario).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {vista === 'cumpleanos' && !loading && (
                <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">🎂 Cumpleaños en los Próximos 30 Días</h3>
                    {cumpleanos.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No hay cumpleaños próximos</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cumpleanos.map((emp) => (
                                <div key={emp.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-purple-200">
                                    <div className="text-4xl text-center mb-2">🎉</div>
                                    <h4 className="text-lg font-bold text-gray-800 text-center mb-2">{emp.nombre}</h4>
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <p><strong>Edad actual:</strong> {emp.edad} años</p>
                                        <p><strong>Cumplirá:</strong> {emp.edad + 1} años</p>
                                        <p><strong>Fecha:</strong> {emp.proximoCumpleanos}</p>
                                        <p className={`font-bold mt-2 ${emp.diasHastaCumpleanos === 0 ? 'text-red-600' : 'text-purple-600'}`}>
                                            {emp.diasHastaCumpleanos === 0 
                                                ? '🎊 ¡Hoy es su cumpleaños!' 
                                                : `Faltan ${emp.diasHastaCumpleanos} días`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {vista === 'buscar' && (
                <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">🔎 Buscar Empleado por Nombre</h3>
                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="Escribe el nombre del empleado..."
                            value={busquedaNombre}
                            onChange={(e) => setBusquedaNombre(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && buscarPorNombre()}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button 
                            onClick={buscarPorNombre} 
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Buscar
                        </button>
                    </div>

                    {resultadosBusqueda.length > 0 && (
                        <div>
                            <h4 className="text-lg font-semibold mb-3 text-gray-700">
                                Resultados encontrados: {resultadosBusqueda.length}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {resultadosBusqueda.map((emp) => (
                                    <div key={emp.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">{emp.nombre}</h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p><strong>Edad:</strong> {emp.edad} años</p>
                                            <p><strong>Fecha Nacimiento:</strong> {emp.fecha_nacimiento}</p>
                                            {emp.nominas && emp.nominas.length > 0 && (
                                                <p className="text-green-600 font-semibold">
                                                    <strong>Último Salario:</strong> ${emp.nominas[0].salario_neto}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Busquedas;
