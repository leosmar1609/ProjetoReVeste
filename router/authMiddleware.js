import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.JWT_SECRET;

export default function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

    jwt.verify(token, secretKey, (err, usuario) => {
        if (err) return res.status(403).json({ message: 'Token inválido.' });
        req.usuario = usuario;
        next();
    });
}