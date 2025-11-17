import React, { useState } from 'react';
import { useService } from '../services/useService';

const CalcularNomina = ({ empleado, onClose, onNominaCalculada }) => {
    const [horasTrabajadas, setHorasTrabajadas] = useState('');
    const [valorHora, setValorHora] = useState('');
    const [porcentajeRetencion, setPorcentajeRetencion] = useState('');
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const service = useService();

    const handleCalcular = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const datos = {
                empleado_id: empleado.id,
                horas_trabajadas: parseFloat(horasTrabajadas),
                valor_hora: parseFloat(valorHora),
                porcentaje_retencion: parseFloat(porcentajeRetencion)
            };

            const resultado = await service.calcularNomina(datos);
            setResultado(resultado);
        } catch (error) {
            console.error('Error al calcular nómina:', error);
            alert('Error al calcular nómina');
        } finally {
            setLoading(false);
        }
    };

    const handleCerrar = () => {
        if (resultado && onNominaCalculada) {
            onNominaCalculada();
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Calcular Nómina</h2>
                    <button 
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        onClick={handleCerrar}
                    >
                        ✖
                    </button>
                </div>

                <div className="p-6">
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h3 className="text-xl font-bold text-gray-800">{empleado.nombre}</h3>
                        <p className="text-gray-600">Edad: {empleado.edad} años</p>
                        {empleado.edad > 50 && (
                            <span className="inline-block mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                Elegible para bonificación por edad (8.5%)
                            </span>
                        )}
                    </div>

                    {!resultado ? (
                        <form onSubmit={handleCalcular} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Horas Trabajadas:
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={horasTrabajadas}
                                    onChange={(e) => setHorasTrabajadas(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {parseFloat(horasTrabajadas) > 40 && (
                                    <span className="text-sm text-green-600 mt-1 block">
                                        Horas extras: Comisión del 5%
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valor por Hora ($):
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={valorHora}
                                    onChange={(e) => setValorHora(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Porcentaje de Retención (%):
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={porcentajeRetencion}
                                    onChange={(e) => setPorcentajeRetencion(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="submit" 
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? '⏳ Calculando...' : '🧮 Calcular'}
                                </button>
                                <button 
                                    type="button" 
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                                    onClick={onClose}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <h3 className="text-xl font-bold text-green-600 mb-4">✅ Nómina Calculada</h3>
                            <div className="space-y-3">
                                <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                    <span className="text-gray-700 font-medium">Salario Bruto:</span>
                                    <span className="text-lg font-bold text-gray-900">${resultado.salario_bruto}</span>
                                </div>
                                <div className="bg-red-50 p-3 rounded-lg flex justify-between items-center">
                                    <span className="text-red-700 font-medium">Descuento ({porcentajeRetencion}%):</span>
                                    <span className="text-lg font-bold text-red-600">-${resultado.descuento}</span>
                                </div>
                                {resultado.comision_horas_extras > 0 && (
                                    <div className="bg-green-50 p-3 rounded-lg flex justify-between items-center">
                                        <span className="text-green-700 font-medium">Comisión Horas Extras (5%):</span>
                                        <span className="text-lg font-bold text-green-600">+${resultado.comision_horas_extras}</span>
                                    </div>
                                )}
                                {resultado.bonificacion_edad > 0 && (
                                    <div className="bg-purple-50 p-3 rounded-lg flex justify-between items-center">
                                        <span className="text-purple-700 font-medium">Bonificación Edad (8.5%):</span>
                                        <span className="text-lg font-bold text-purple-600">+${resultado.bonificacion_edad}</span>
                                    </div>
                                )}
                                <div className="bg-blue-100 p-4 rounded-lg flex justify-between items-center border-2 border-blue-300">
                                    <span className="text-blue-900 font-bold text-lg">Salario Neto Final:</span>
                                    <span className="text-2xl font-bold text-blue-700">${resultado.salario_neto}</span>
                                </div>
                            </div>
                            <button 
                                className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                onClick={handleCerrar}
                            >
                                Cerrar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalcularNomina;
