# 🏢 Sistema de Gestión de Nómina

Sistema completo para calcular y gestionar la nómina de empleados con características avanzadas de cálculo automático.

## 📋 Características

### Cálculos Automáticos
- ✅ **Salario Bruto** = horas trabajadas × valor por hora
- ✅ **Descuento** = salario bruto × (porcentaje de retención ÷ 100)
- ✅ **Salario Neto** = salario bruto - descuento
- ✅ **Comisión** = 5% adicional si horas trabajadas > 40
- ✅ **Bonificación** = 8.5% adicional si edad > 50 años

### Funcionalidades
- 👥 Gestión completa de empleados (CRUD)
- 💰 Cálculo automático de nóminas
- 📊 Estadísticas y totales de la empresa
- 🔍 Búsquedas dinámicas:
  - Empleados mejor pagados
  - Cumpleaños próximos (30 días)
  - Búsqueda por nombre
- 💾 Base de datos MySQL con Sequelize

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js v14 o superior
- MySQL 5.7 o superior
- npm o yarn

### Paso 1: Configurar la Base de Datos

1. Crear la base de datos en MySQL:
```sql
CREATE DATABASE nominaDB;
```

2. Verificar que el archivo `.env` en la carpeta `backend` tenga la configuración correcta:
```env
DB_NAME=nominaDB
DB_USER=root
DB_PORT=3306
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
PORT=5000
```

### Paso 2: Instalar Dependencias del Backend

```powershell
cd backend
npm install
```

### Paso 3: Sincronizar la Base de Datos

```powershell
npm run sync-db
```

Este comando creará todas las tablas necesarias en la base de datos.

### Paso 4: Iniciar el Backend

```powershell
npm run dev
```

El servidor estará corriendo en `http://localhost:5000`

### Paso 5: Instalar Dependencias del Frontend

Abre una nueva terminal:

```powershell
cd Frontend
npm install
```

### Paso 6: Iniciar el Frontend

```powershell
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📖 Uso del Sistema

### 1. Crear Empleados
- Ve a la pestaña "👥 Empleados"
- Completa el formulario con nombre y fecha de nacimiento
- Haz clic en "Crear Empleado"

### 2. Calcular Nómina
- En la lista de empleados, haz clic en "💰 Calcular Nómina"
- Ingresa:
  - Horas trabajadas
  - Valor por hora
  - Porcentaje de retención
- El sistema calculará automáticamente:
  - Salario bruto
  - Descuento
  - Comisión (si aplica)
  - Bonificación por edad (si aplica)
  - Salario neto final

### 3. Ver Historial de Nóminas
- Ve a la pestaña "💰 Nóminas"
- Verás todas las nóminas calculadas con detalles completos

### 4. Búsquedas Dinámicas
- Ve a la pestaña "🔍 Búsquedas"
- **Mejor Pagados**: Top 10 empleados con mejores salarios
- **Cumpleaños Próximos**: Empleados que cumplen años en los próximos 30 días
- **Buscar por Nombre**: Búsqueda rápida de empleados

## 🎯 Ejemplos de Cálculo

### Ejemplo 1: Empleado Normal
- Horas: 35
- Valor/hora: $20
- Retención: 10%
- Edad: 35 años

**Resultado:**
- Salario Bruto: $700
- Descuento: $70
- Salario Neto: $630

### Ejemplo 2: Empleado con Horas Extras
- Horas: 45
- Valor/hora: $25
- Retención: 12%
- Edad: 40 años

**Resultado:**
- Salario Bruto: $1,125
- Descuento: $135
- Salario Base: $990
- Comisión (5%): $49.50
- **Salario Neto: $1,039.50**

### Ejemplo 3: Empleado con Bonificación por Edad
- Horas: 48
- Valor/hora: $30
- Retención: 15%
- Edad: 55 años

**Resultado:**
- Salario Bruto: $1,440
- Descuento: $216
- Salario Base: $1,224
- Comisión (5%): $61.20
- Subtotal: $1,285.20
- Bonificación Edad (8.5%): $109.24
- **Salario Neto: $1,394.44**

## 🗂️ Estructura del Proyecto

```
Nomina/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── sync.js
│   │   ├── controllers/
│   │   │   └── empleados.js
│   │   ├── models/
│   │   │   ├── empleados.js
│   │   │   └── nomina.js
│   │   └── routes/
│   │       └── empleadoRoutes.js
│   ├── app.js
│   ├── package.json
│   └── .env
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Create.jsx
    │   │   ├── EmpleadosList.jsx
    │   │   ├── CalcularNomina.jsx
    │   │   ├── NominaList.jsx
    │   │   └── Busquedas.jsx
    │   ├── services/
    │   │   └── useService.js
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    └── package.json
```

## 🔧 Scripts Disponibles

### Backend
- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run sync-db` - Sincroniza la base de datos
- `npm start` - Inicia el servidor en modo producción

### Frontend
- `npm run dev` - Inicia el desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza la build de producción

## 📊 Endpoints de la API

### Empleados
- `GET /api/empleados` - Obtener todos los empleados
- `POST /api/empleados` - Crear nuevo empleado
- `PUT /api/empleados/:id` - Actualizar empleado
- `DELETE /api/empleados/:id` - Eliminar empleado

### Nóminas
- `POST /api/nomina/calcular` - Calcular y crear nómina
- `GET /api/nominas` - Obtener todas las nóminas
- `GET /api/nomina/total` - Obtener total de la empresa

### Búsquedas
- `GET /api/empleados/mejor-pagados?limit=10` - Top empleados mejor pagados
- `GET /api/empleados/cumpleanos-proximos` - Cumpleaños próximos
- `GET /api/empleados/buscar?q=nombre` - Buscar por nombre

## 🎨 Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- dotenv

### Frontend
- React.js
- Axios
- CSS3

## 📝 Notas Importantes

1. Asegúrate de que MySQL esté corriendo antes de iniciar el backend
2. La sincronización de base de datos debe ejecutarse al menos una vez
3. El backend debe estar corriendo para que el frontend funcione
4. Los puertos por defecto son 5000 (backend) y 5173 (frontend)

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verifica que MySQL esté corriendo
- Revisa las credenciales en el archivo `.env`
- Asegúrate de que la base de datos `nominaDB` exista

### Error en el frontend
- Verifica que el backend esté corriendo
- Revisa la consola del navegador para más detalles
- Asegúrate de que axios esté instalado correctamente

### Las tablas no existen
- Ejecuta `npm run sync-db` en la carpeta backend
- Verifica los logs para ver si hubo errores

## 👨‍💻 Autor

Desarrollado como sistema de gestión de nómina empresarial.

## 📄 Licencia

ISC
