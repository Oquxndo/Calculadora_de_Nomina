const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Empleado = sequelize.define('Empleado', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: false },
    horas_trabajadas: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    valor_hora: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    porcentaje_retencion: { type: DataTypes.DECIMAL(5, 2), allowNull: true },

}, {
    tableName: 'empleados',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
}

)

module.exports = Empleado;