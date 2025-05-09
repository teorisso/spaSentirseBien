import { NextApiRequest, NextApiResponse } from 'next';

// Define types for the request body
interface ContactFormData {
  nombre: string;
  email: string;
  mensaje: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { nombre, email, mensaje } = req.body as ContactFormData;

      // Validate required fields
      if (!nombre || !email || !mensaje) {
        return res.status(400).json({ error: 'Faltan datos en el formulario.' });
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido.' });
      }

      // Sanitize inputs
      const sanitizedData = {
        nombre: nombre.trim(),
        email: email.trim(),
        mensaje: mensaje.trim()
      };

      console.log('Consulta recibida:', sanitizedData);

      // Return success response immediately (without delay)
      res.status(200).json({ mensaje: 'Tu mensaje fue recibido correctamente.' });
    } catch (error) {
      console.error('Error al procesar el formulario de contacto:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido.`);
  }
}