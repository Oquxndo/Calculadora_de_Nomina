import React, { useState, useEffect } from 'react';
import { useService } from '../services/useService';

const NominaList = () => {
    const [nominas, setNominas] = useState([]);
    const [loading, setLoading] = useState(true);
    const service = useService();

    useEffect(() => {
        cargarNominas();
    }, []);

    const cargarNominas = async () => {
        try {
            setLoading(true);
            const data = await service.getNominas();
            setNominas(data);
        } catch (error) {
            console.error('Error al cargar nóminas:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">⏳ Cargando nóminas...</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Historial de Nóminas</h2>
            {nominas.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay nóminas registradas</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">$/Hora</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. Bruto</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comisión</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonif.</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. Neto</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {nominas.map((nomina) => (
                                <tr key={nomina.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{nomina.id}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {nomina.empleado?.nombre || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{nomina.empleado?.edad || 'N/A'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{nomina.horas_trabajadas}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${nomina.valor_hora}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">${nomina.salario_bruto}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">-${nomina.descuento}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">
                                        {nomina.comision_horas_extras > 0 
                                            ? `+$${nomina.comision_horas_extras}` 
                                            : '-'}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-600">
                                        {nomina.bonificacion_edad > 0 
                                            ? `+$${nomina.bonificacion_edad}` 
                                            : '-'}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-blue-600">${nomina.salario_neto}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(nomina.fecha_pago).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default NominaList;
