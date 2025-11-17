# 🏢 Sistema de Gestión de Nómina

Sistema completo de gestión de nómina con cálculo automático de salarios, bonificaciones y búsquedas dinámicas.

## 📋 Características

### Cálculos Automáticos:
- ✅ **Salario Bruto** = horas trabajadas × valor por hora
- ✅ **Descuento** = salario bruto × (porcentaje de retención ÷ 100)
- ✅ **Salario Neto** = salario bruto - descuento
- ✅ **Comisión por Horas Extras** = 5% del salario neto (si horas > 40)
- ✅ **Bonificación por Edad** = 8.5% del salario neto (si edad > 50 años)

### Funcionalidades:
- 👥 Gestión completa de empleados (crear, listar, eliminar)
- 💰 Cálculo y registro de nóminas
- 📊 Resumen total de nómina de la empresa
- 🔍 Búsquedas dinámicas:
  - Top empleados mejor pagados
  - Cumpleaños próximos (30 días)
  - Búsqueda por nombre

## 🛠️ Tecnologías

### Backend:
- Node.js + Express
- MySQL + Sequelize ORM
- CORS habilitado

### Frontend:
- React + Vite
- Tailwind CSS
- Axios

## 📦 Requisitos Previos

- Node.js versión **22.12+** o **20.19+**
- MySQL Server
- Git (opcional)

## 🚀 Instalación y Configuración

### 1. Configurar Base de Datos

Crea una base de datos MySQL:

```sql
CREATE DATABASE nominaDB;
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Verifica el archivo `.env`:
```env
DB_NAME=nominaDB
DB_USER=root
DB_PORT=3306
DB_PASSWORD=12345
DB_HOST=localhost
PORT=5000
```

Sincroniza los modelos con la base de datos:
```bash
npm run sync-db
```

### 3. Configurar Frontend

```bash
cd Frontend
npm install
```

## ▶️ Ejecución

### Iniciar Backend (Terminal 1):
```bash
cd backend
node app.js
```
El backend estará disponible en: `http://localhost:5000`

### Iniciar Frontend (Terminal 2):
```bash
cd Frontend
npm run dev
```
El frontend estará disponible en: `http://localhost:5173` (o el puerto que indique Vite)

## 📡 API Endpoints

### Empleados
- `GET /api/empleados` - Listar todos los empleados
- `POST /api/empleados` - Crear empleado
- `PUT /api/empleados/:id` - Actualizar empleado
- `DELETE /api/empleados/:id` - Eliminar empleado

### Nóminas
- `POST /api/nomina/calcular` - Calcular y crear nómina
- `GET /api/nominas` - Listar todas las nóminas
- `GET /api/nomina/total` - Obtener total de nómina empresa

### Búsquedas
- `GET /api/empleados/mejor-pagados?limit=10` - Top empleados mejor pagados
- `GET /api/empleados/cumpleanos-proximos` - Cumpleaños próximos
- `GET /api/empleados/buscar?q=nombre` - Buscar por nombre

## 💡 Uso del Sistema

### 1. Registrar Empleado
- Ve a la pestaña "👥 Empleados"
- Completa el formulario con nombre y fecha de nacimiento
- Click en "Crear Empleado"

### 2. Calcular Nómina
- En la lista de empleados, click en "💰 Calcular Nómina"
- Ingresa:
  - Horas trabajadas
  - Valor por hora
  - Porcentaje de retención
- El sistema calculará automáticamente:
  - Salario bruto
  - Descuentos
  - Comisión por horas extras (si aplica)
  - Bonificación por edad (si aplica)
  - Salario neto final

### 3. Ver Historial de Nóminas
- Ve a la pestaña "💰 Nóminas"
- Verás todas las nóminas calculadas con detalle completo

### 4. Búsquedas Dinámicas
- Ve a la pestaña "🔍 Búsquedas"
- Opciones:
  - **Mejor Pagados**: Top 10 empleados con mayores salarios
  - **Cumpleaños Próximos**: Empleados que cumplen años en los próximos 30 días
  - **Buscar por Nombre**: Búsqueda personalizada

## 📊 Estructura del Proyecto

```
Nomina/
├── backend/
│   ├── app.js
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── config/
│       │   ├── db.js
│       │   └── sync.js
│       ├── controllers/
│       │   └── empleados.js
│       ├── models/
│       │   ├── empleados.js
│       │   └── nomina.js
│       └── routes/
│           └── empleadoRoutes.js
└── Frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── components/
        │   ├── Create.jsx
        │   ├── EmpleadosList.jsx
        │   ├── CalcularNomina.jsx
        │   ├── NominaList.jsx
        │   └── Busquedas.jsx
        └── services/
            └── useService.js
```

## 🎨 Capturas de Pantalla

El sistema incluye:
- ✅ Interfaz moderna con Tailwind CSS
- ✅ Diseño responsive
- ✅ Modales para cálculo de nómina
- ✅ Tarjetas informativas con colores diferenciados
- ✅ Tablas con formato profesional

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verifica que MySQL esté corriendo
- Revisa las credenciales en el archivo `.env`
- Asegúrate de que la base de datos `nominaDB` exista

### Error CORS
- Verifica que el backend esté corriendo en el puerto 5000
- Revisa la configuración de CORS en `app.js`

### Errores de Vite
- Actualiza Node.js a la versión 22.12+ o 20.19+
- Borra `node_modules` y ejecuta `npm install` nuevamente

## 👨‍💻 Autor

Desarrollado como sistema de gestión de nómina empresarial.

## 📄 Licencia

ISC

---

¿Necesitas ayuda? Revisa la documentación o contacta con el desarrollador.
