const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Empleado = require('./empleados');

const Nomina = sequelize.define('Nomina', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    empleado_id: { type: DataTypes.INTEGER, allowNull: false },
    horas_trabajadas: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    valor_hora: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    salario_bruto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    porcentaje_retencion: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    descuento: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    comision_horas_extras: { type: DataTypes.DECIMAL(10, 2), default: 0 },
    bonificacion_edad: { type: DataTypes.DECIMAL(10, 2), default: 0 },
    salario_neto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    fecha_pago: { type: DataTypes.DATE, allowNull: false },
}, {
    tableName: 'nominas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relación con Empleado
Nomina.belongsTo(Empleado, { foreignKey: 'empleado_id', as: 'empleado' });
Empleado.hasMany(Nomina, { foreignKey: 'empleado_id', as: 'nominas' });

module.exports = Nomina;