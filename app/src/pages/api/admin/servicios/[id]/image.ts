import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../../lib/dbConnect';
import { ServiceModel } from '../../../../../models/Service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    await dbConnect();
    const { id } = req.query;

    const service = await ServiceModel.findById(id).select('image');
    
    if (!service || !service.image || !service.image.data) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    // Configurar headers para caché
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache por 1 año
    res.setHeader('Content-Type', service.image.contentType);
    res.setHeader('Content-Length', service.image.data.length);

    return res.send(service.image.data);
  } catch (error) {
    console.error('Error al obtener imagen:', error);
    return res.status(500).json({ error: 'Error al obtener la imagen' });
  }
} 