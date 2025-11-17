import React, { useState } from "react";
import { useService } from "../services/useService";

const Create = ({ onEmpleadoCreado }) => {
    const [nombre, setNombre] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [mensaje, setMensaje] = useState('');
    const service = useService();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (!nombre || !fechaNacimiento) {
                setMensaje('⚠️ Por favor completa todos los campos');
                return;
            }

            await service.createEmpleado({
                nombre,
                fecha_nacimiento: fechaNacimiento
            });

            setMensaje('✅ Empleado creado exitosamente');
            setNombre('');
            setFechaNacimiento('');
            
            if (onEmpleadoCreado) {
                onEmpleadoCreado();
            }

            setTimeout(() => setMensaje(''), 3000);
        } catch (error) {
            console.error('Error al crear empleado:', error);
            setMensaje('❌ Error al crear empleado');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">➕ Registrar Nuevo Empleado</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo:
                    </label>
                    <input
                        type="text"
                        placeholder="Ej: Juan Pérez"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Nacimiento:
                    </label>
                    <input
                        type="date"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Crear Empleado
                </button>
                {mensaje && (
                    <div className={`p-3 rounded-lg text-center font-medium ${
                        mensaje.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {mensaje}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Create;
