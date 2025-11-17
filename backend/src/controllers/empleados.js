const sequelize = require('../config/db');
const Empleado = require('../models/empleados');
const Nomina = require('../models/nomina');
const { Op } = require('sequelize');

// Función auxiliar para calcular edad
const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
};

// Función auxiliar para calcular nómina
const calcularDatosNomina = (horasTrabajadas, valorHora, porcentajeRetencion, edad) => {
    // 1. Salario bruto = horas trabajadas × valor por hora
    const salarioBruto = horasTrabajadas * valorHora;
    
    // 2. Descuento = salario bruto × (porcentaje de retención ÷ 100)
    const descuento = salarioBruto * (porcentajeRetencion / 100);
    
    // 3. Salario neto base = salario bruto - descuento
    let salarioNeto = salarioBruto - descuento;
    
    // 4. Comisión por horas extras (si horas > 40, comisión del 5%)
    let comisionHorasExtras = 0;
    if (horasTrabajadas > 40) {
        comisionHorasExtras = salarioNeto * 0.05;
        salarioNeto += comisionHorasExtras;
    }
    
    // 5. Bonificación por edad (si edad > 50, bonificación del 8.5%)
    let bonificacionEdad = 0;
    if (edad > 50) {
        bonificacionEdad = salarioNeto * 0.085;
        salarioNeto += bonificacionEdad;
    }
    
    return {
        salarioBruto: parseFloat(salarioBruto.toFixed(2)),
        descuento: parseFloat(descuento.toFixed(2)),
        comisionHorasExtras: parseFloat(comisionHorasExtras.toFixed(2)),
        bonificacionEdad: parseFloat(bonificacionEdad.toFixed(2)),
        salarioNeto: parseFloat(salarioNeto.toFixed(2))
    };
};

// Obtener todos los empleados
exports.getEmpleados = async (req, res) => {
    try {
        const empleados = await Empleado.findAll({
            include: [{
                model: Nomina,
                as: 'nominas',
                limit: 1,
                order: [['created_at', 'DESC']]
            }]
        });
        
        // Calcular edad para cada empleado
        const empleadosConEdad = empleados.map(emp => {
            const empleadoData = emp.toJSON();
            empleadoData.edad = calcularEdad(empleadoData.fecha_nacimiento);
            return empleadoData;
        });
        
        res.json(empleadosConEdad);
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        res.status(500).json({ message: 'Error al obtener empleados' });
    }
};

// Crear empleado
exports.createEmpleado = async (req, res) => {
    const { nombre, fecha_nacimiento } = req.body;
    try {
        if(!nombre || !fecha_nacimiento){
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        const nuevoEmpleado = await Empleado.create({
            nombre,
            fecha_nacimiento
        });
        
        const empleadoData = nuevoEmpleado.toJSON();
        empleadoData.edad = calcularEdad(empleadoData.fecha_nacimiento);
        
        res.status(201).json(empleadoData);
    } catch (error) {
        console.error('Error al crear empleado:', error);
        res.status(500).json({ message: 'Error al crear empleado' });
    }
};

// Calcular y crear registro de nómina
exports.calcularYCrearNomina = async (req, res) => {
    const { empleado_id, horas_trabajadas, valor_hora, porcentaje_retencion } = req.body;
    
    try {
        // Validar datos
        if (!empleado_id || !horas_trabajadas || !valor_hora || porcentaje_retencion === undefined) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }
        
        // Buscar empleado
        const empleado = await Empleado.findByPk(empleado_id);
        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }
        
        // Calcular edad
        const edad = calcularEdad(empleado.fecha_nacimiento);
        
        // Calcular nómina
        const datosNomina = calcularDatosNomina(
            parseFloat(horas_trabajadas),
            parseFloat(valor_hora),
            parseFloat(porcentaje_retencion),
            edad
        );
        
        // Crear registro de nómina
        const nuevaNomina = await Nomina.create({
            empleado_id,
            horas_trabajadas: parseFloat(horas_trabajadas),
            valor_hora: parseFloat(valor_hora),
            porcentaje_retencion: parseFloat(porcentaje_retencion),
            salario_bruto: datosNomina.salarioBruto,
            descuento: datosNomina.descuento,
            comision_horas_extras: datosNomina.comisionHorasExtras,
            bonificacion_edad: datosNomina.bonificacionEdad,
            salario_neto: datosNomina.salarioNeto,
            fecha_pago: new Date()
        });
        
        // Actualizar empleado con últimos datos
        await empleado.update({
            horas_trabajadas: parseFloat(horas_trabajadas),
            valor_hora: parseFloat(valor_hora),
            porcentaje_retencion: parseFloat(porcentaje_retencion)
        });
        
        res.status(201).json({
            ...nuevaNomina.toJSON(),
            empleado: {
                id: empleado.id,
                nombre: empleado.nombre,
                edad
            }
        });
    } catch (error) {
        console.error('Error al calcular nómina:', error);
        res.status(500).json({ message: 'Error al calcular nómina', error: error.message });
    }
};

// Obtener todas las nóminas
exports.getNominas = async (req, res) => {
    try {
        const nominas = await Nomina.findAll({
            include: [{
                model: Empleado,
                as: 'empleado',
                attributes: ['id', 'nombre', 'fecha_nacimiento']
            }],
            order: [['created_at', 'DESC']]
        });
        
        // Agregar edad a cada nómina
        const nominasConEdad = nominas.map(nomina => {
            const nominaData = nomina.toJSON();
            if (nominaData.empleado) {
                nominaData.empleado.edad = calcularEdad(nominaData.empleado.fecha_nacimiento);
            }
            return nominaData;
        });
        
        res.json(nominasConEdad);
    } catch (error) {
        console.error('Error al obtener nóminas:', error);
        res.status(500).json({ message: 'Error al obtener nóminas' });
    }
};

// Calcular nómina total de la empresa
exports.calcularNominaEmpresa = async (req, res) => {
    try {
        const resultado = await Nomina.sum('salario_neto');
        const totalNomina = resultado || 0;
        
        const cantidadEmpleados = await Nomina.count({
            distinct: true,
            col: 'empleado_id'
        });
        
        res.json({
            totalNomina: parseFloat(totalNomina.toFixed(2)),
            cantidadEmpleados,
            promedioSalario: cantidadEmpleados > 0 
                ? parseFloat((totalNomina / cantidadEmpleados).toFixed(2)) 
                : 0
        });
    } catch (error) {
        console.error('Error al calcular nómina de la empresa:', error);
        res.status(500).json({ message: 'Error al calcular nómina de la empresa' });
    }
};

// BÚSQUEDAS DINÁMICAS

// Empleados mejor pagados
exports.getEmpleadosMejorPagados = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        const empleados = await Nomina.findAll({
            attributes: [
                'empleado_id',
                [sequelize.fn('MAX', sequelize.col('salario_neto')), 'max_salario'],
                [sequelize.fn('AVG', sequelize.col('salario_neto')), 'promedio_salario']
            ],
            include: [{
                model: Empleado,
                as: 'empleado',
                attributes: ['id', 'nombre', 'fecha_nacimiento']
            }],
            group: ['empleado_id', 'empleado.id', 'empleado.nombre', 'empleado.fecha_nacimiento'],
            order: [[sequelize.fn('MAX', sequelize.col('salario_neto')), 'DESC']],
            limit
        });
        
        res.json(empleados);
    } catch (error) {
        console.error('Error al obtener empleados mejor pagados:', error);
        res.status(500).json({ message: 'Error al obtener empleados mejor pagados' });
    }
};

// Cumpleaños próximos (próximos 30 días)
exports.getCumpleanosProximos = async (req, res) => {
    try {
        const empleados = await Empleado.findAll();
        const hoy = new Date();
        const proximoMes = new Date();
        proximoMes.setDate(proximoMes.getDate() + 30);
        
        const cumpleanosProximos = empleados.filter(emp => {
            const fechaNacimiento = new Date(emp.fecha_nacimiento);
            const cumpleanosEsteAno = new Date(
                hoy.getFullYear(),
                fechaNacimiento.getMonth(),
                fechaNacimiento.getDate()
            );
            
            // Si ya pasó este año, mirar el próximo año
            if (cumpleanosEsteAno < hoy) {
                cumpleanosEsteAno.setFullYear(cumpleanosEsteAno.getFullYear() + 1);
            }
            
            return cumpleanosEsteAno >= hoy && cumpleanosEsteAno <= proximoMes;
        }).map(emp => {
            const empleadoData = emp.toJSON();
            const fechaNacimiento = new Date(emp.fecha_nacimiento);
            const cumpleanosEsteAno = new Date(
                hoy.getFullYear(),
                fechaNacimiento.getMonth(),
                fechaNacimiento.getDate()
            );
            
            if (cumpleanosEsteAno < hoy) {
                cumpleanosEsteAno.setFullYear(cumpleanosEsteAno.getFullYear() + 1);
            }
            
            const diasRestantes = Math.ceil((cumpleanosEsteAno - hoy) / (1000 * 60 * 60 * 24));
            empleadoData.edad = calcularEdad(empleadoData.fecha_nacimiento);
            empleadoData.diasHastaCumpleanos = diasRestantes;
            empleadoData.proximoCumpleanos = cumpleanosEsteAno.toISOString().split('T')[0];
            
            return empleadoData;
        }).sort((a, b) => a.diasHastaCumpleanos - b.diasHastaCumpleanos);
        
        res.json(cumpleanosProximos);
    } catch (error) {
        console.error('Error al obtener cumpleaños próximos:', error);
        res.status(500).json({ message: 'Error al obtener cumpleaños próximos' });
    }
};

// Buscar empleados (búsqueda dinámica por nombre)
exports.buscarEmpleados = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ message: 'Parámetro de búsqueda requerido' });
        }
        
        const empleados = await Empleado.findAll({
            where: {
                nombre: {
                    [Op.like]: `%${q}%`
                }
            },
            include: [{
                model: Nomina,
                as: 'nominas',
                limit: 1,
                order: [['created_at', 'DESC']]
            }]
        });
        
        const empleadosConEdad = empleados.map(emp => {
            const empleadoData = emp.toJSON();
            empleadoData.edad = calcularEdad(empleadoData.fecha_nacimiento);
            return empleadoData;
        });
        
        res.json(empleadosConEdad);
    } catch (error) {
        console.error('Error al buscar empleados:', error);
        res.status(500).json({ message: 'Error al buscar empleados' });
    }
};

// Actualizar empleado
exports.updateEmpleado = async (req, res) => {
    const { id } = req.params;
    const { nombre, fecha_nacimiento, horas_trabajadas, valor_hora, porcentaje_retencion } = req.body;
    try {
        const empleado = await Empleado.findByPk(id);
        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }
        
        await empleado.update({
            nombre,
            fecha_nacimiento,
            horas_trabajadas,
            valor_hora,
            porcentaje_retencion
        });
        
        const empleadoData = empleado.toJSON();
        empleadoData.edad = calcularEdad(empleadoData.fecha_nacimiento);
        
        res.json(empleadoData);
    } catch (error) {
        console.error('Error al actualizar empleado:', error);
        res.status(500).json({ message: 'Error al actualizar empleado' });
    }
};

// Eliminar empleado
exports.deleteEmpleado = async (req, res) => {
    const { id } = req.params;
    try {
        const empleado = await Empleado.findByPk(id);
        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }
        
        await empleado.destroy();
        res.json({ message: 'Empleado eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        res.status(500).json({ message: 'Error al eliminar empleado' });
    }
};