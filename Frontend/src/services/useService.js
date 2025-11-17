import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiEmpleados = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const useService = () => {
    // Empleados
    const getEmpleados = async () => {
        const response = await apiEmpleados.get('/empleados');
        return response.data;
    };

    const createEmpleado = async (empleadoData) => {
        const response = await apiEmpleados.post('/empleados', empleadoData);
        return response.data;
    };

    const updateEmpleado = async (id, empleadoData) => {
        const response = await apiEmpleados.put(`/empleados/${id}`, empleadoData);
        return response.data;
    };

    const deleteEmpleado = async (id) => {
        const response = await apiEmpleados.delete(`/empleados/${id}`);
        return response.data;
    };

    // Nóminas
    const calcularNomina = async (nominaData) => {
        const response = await apiEmpleados.post('/nomina/calcular', nominaData);
        return response.data;
    };

    const getNominas = async () => {
        const response = await apiEmpleados.get('/nominas');
        return response.data;
    };

    const getNominaTotal = async () => {
        const response = await apiEmpleados.get('/nomina/total');
        return response.data;
    };

    // Búsquedas dinámicas
    const getEmpleadosMejorPagados = async (limit = 10) => {
        const response = await apiEmpleados.get(`/empleados/mejor-pagados?limit=${limit}`);
        return response.data;
    };

    const getCumpleanosProximos = async () => {
        const response = await apiEmpleados.get('/empleados/cumpleanos-proximos');
        return response.data;
    };

    const buscarEmpleados = async (query) => {
        const response = await apiEmpleados.get(`/empleados/buscar?q=${query}`);
        return response.data;
    };

    return {
        getEmpleados,
        createEmpleado,
        updateEmpleado,
        deleteEmpleado,
        calcularNomina,
        getNominas,
        getNominaTotal,
        getEmpleadosMejorPagados,
        getCumpleanosProximos,
        buscarEmpleados
    };
};