const sequelize = require('./db');
const Empleado = require('../models/empleados');
const Nomina = require('../models/nomina');

const syncDatabase = async () => {
    try {
        // Probar conexión
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');

        // Sincronizar modelos (alter: true actualiza las tablas sin borrar datos)
        await sequelize.sync({ alter: true });
        console.log('✅ Modelos sincronizados correctamente.');

        console.log('\n📋 Tablas creadas/actualizadas:');
        console.log('  - empleados');
        console.log('  - nominas');
        
    } catch (error) {
        console.error('❌ Error al sincronizar la base de datos:', error);
        process.exit(1);
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    syncDatabase().then(() => {
        console.log('\n✅ Sincronización completada. Puedes cerrar esta ventana.');
        process.exit(0);
    });
}

module.exports = syncDatabase;
