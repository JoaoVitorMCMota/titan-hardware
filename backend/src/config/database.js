import mongoose from 'mongoose';

async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI não está definida no arquivo .env');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB Atlas conectado com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar no MongoDB Atlas:', error.message);
    process.exit(1);
  }
}

export default connectDatabase;