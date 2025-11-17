const express = require('express');
const app = express();
require('dotenv').config();
const empleadoRoutes = require('./src/routes/empleadoRoutes');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api', empleadoRoutes);


const PORT = process.env.PORT;


app.get('/', (req, res) => {
    res.json('API funcionando correctamente ✅')
})

app.listen(PORT, async () => {
    console.log(`Server running on port http://localhost:${PORT}`);
})