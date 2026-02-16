const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conexión exitosa a la base de datos: users_bank');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Detiene el servidor si no hay conexión
  }
};

connectDB();