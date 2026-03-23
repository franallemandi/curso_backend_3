import app from './app.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`);
    mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log('Conectado a MongoDB'));
});