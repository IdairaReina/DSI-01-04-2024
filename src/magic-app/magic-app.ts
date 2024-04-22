import express, { Request, Response } from 'express';
import mongoose, { Document, Schema, Types  } from 'mongoose';
const { ObjectId } = Types;
import fs from 'fs';
import * as path from 'path';

// Definición de la interfaz para los datos de la carta
interface CardData extends Document {
    id: number;
    manaCost: number;
    color: string;
    type: string;
    rarity: string;
    rulesText: string;
    power?: number;
    toughness?: number;
    loyalty?: number;
    marketValue: number;
}

// Definición del esquema de la carta
const CardSchema = new Schema<CardData>({
    id: { type: Number, required: true },
    manaCost: { type: Number, required: true },
    color: { type: String, required: true },
    type: { type: String, required: true },
    rarity: { type: String, required: true },
    rulesText: { type: String, required: true },
    power: { type: Number },
    toughness: { type: Number },
    loyalty: { type: Number },
    marketValue: { type: Number, required: true }
});

// Modelo de la carta
const CardModel = mongoose.model<CardData>('Card', CardSchema);

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/magic-app', {
})
.then(() => {
    console.log('Connected to MongoDB');

    // Creación de la aplicación Express
    const app = express();

    // Middleware para el manejo de JSON
    app.use(express.json());

    // crear una carta
    app.post('/cards', async (req: Request, res: Response) => {
        const userId = req.query.userId as string;
        const cardData = req.body as CardData;
    
        if (!userId) {
            return res.status(400).json({ error: 'Se requiere el parámetro userId' });
        }
    
        if (!cardData) {
            return res.status(400).json({ error: 'Los datos de la carta son obligatorios en el cuerpo de la solicitud' });
        }
    
        try {
            // Crear la carta en la base de datos MongoDB
            const newCard = await CardModel.create(cardData);
    
            // el nombre de usuario se usa para crear el directorio y el nombre del archivo
            const userDir = path.join(process.cwd(), 'cards', userId);
            const cardFilePath = path.join(userDir, `${newCard.id}.json`);
    
            // Verificar si el directorio del usuario existe, si no, crearlo
            if (!fs.existsSync(userDir)) {
                fs.mkdirSync(userDir);
            }
    
            // Escribir los datos de la carta en el archivo JSON
            fs.writeFileSync(cardFilePath, JSON.stringify(newCard.toJSON(), null, 2));
    
            return res.status(201).json(newCard); // Devolver la nueva carta creada
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });
    
    app.delete('/cards/:cardId', async (req: Request, res: Response) => {
        const userId = req.query.userId as string;
        const cardId = req.params.cardId;
    
        if (!userId) {
            return res.status(400).json({ error: 'Se requiere el parámetro userId' });
        }
    
        try {
            // Convertir el ID de la carta a ObjectId
            const cardObjectId = new ObjectId(cardId);
    
            // Eliminar la carta de la base de datos MongoDB
            const deletedCard = await CardModel.findByIdAndDelete(cardObjectId);
    
            if (!deletedCard) {
                return res.status(404).json({ error: 'La carta no se encontró' });
            }
    
            // Obtener la ruta del archivo de la carta
            const userDir = path.join(process.cwd(), 'cards', userId);
            const cardFilePath = path.join(userDir, `${deletedCard.id}.json`);
    
            // Verificar si el archivo de la carta existe, si existe, eliminarlo
            if (fs.existsSync(cardFilePath)) {
                fs.unlinkSync(cardFilePath);
            }
    
            return res.json({ message: 'La carta fue eliminada correctamente' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });
    
    // Puerto en el que se ejecutará el servidor
    const PORT = process.env.PORT || 3000;

    // Inicia el servidor
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch(err => console.error('Error connecting to MongoDB:', err));
