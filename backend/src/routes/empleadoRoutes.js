const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleados');

// Rutas de empleados
router.get('/empleados', empleadoController.getEmpleados);
router.post('/empleados', empleadoController.createEmpleado);
router.put('/empleados/:id', empleadoController.updateEmpleado);
router.delete('/empleados/:id', empleadoController.deleteEmpleado);

// Rutas de nómina
router.post('/nomina/calcular', empleadoController.calcularYCrearNomina);
router.get('/nominas', empleadoController.getNominas);
router.get('/nomina/total', empleadoController.calcularNominaEmpresa);

// Búsquedas dinámicas
router.get('/empleados/mejor-pagados', empleadoController.getEmpleadosMejorPagados);
router.get('/empleados/cumpleanos-proximos', empleadoController.getCumpleanosProximos);
router.get('/empleados/buscar', empleadoController.buscarEmpleados);

module.exports = router;