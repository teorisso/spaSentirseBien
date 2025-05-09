import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/dbConnect';
import { ServiceModel } from '../../../../models/Service';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const services = await ServiceModel.find({ available: true })
        .select('-image.data') // Excluir los datos de la imagen
        .lean(); // Convertir a objeto plano para mejor rendimiento

      // Agregar la URL de la imagen a cada servicio
      const servicesWithImageUrl = services.map(service => ({
        ...service,
        imageUrl: `/api/admin/servicios/${service._id}/image`
      }));

      return res.status(200).json(servicesWithImageUrl);
    } catch (error) {
      return res.status(500).json({ error: 'Error al cargar servicios' });
    }
  }

  if (req.method === 'POST') {
    try {
      const form = formidable({ multiples: false });
      const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      });

      console.log('Campos recibidos:', fields);
      console.log('Archivos recibidos:', files);

      const imagen = Array.isArray(files.image) ? files.image[0] : files.image;
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
      const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;

      if (!name || !description || !price || !category || !imagen) {
        console.error('Faltan campos obligatorios:', { name, description, price, category, imagen });
        return res.status(400).json({ error: 'Todos los campos son obligatorios y la imagen debe estar presente.' });
      }

      const priceNumber = Number(price);
      if (isNaN(priceNumber)) {
        console.error('El precio no es un número válido:', price);
        return res.status(400).json({ error: 'El precio debe ser un número válido.' });
      }

      // Validar que la categoría sea una de las permitidas
      const categoriasPermitidas = ['Masajes', 'Belleza', 'Tratamientos Faciales', 'Tratamientos Corporales', 'Servicios Grupales'];
      if (!categoriasPermitidas.includes(category.trim())) {
        return res.status(400).json({ error: 'La categoría seleccionada no es válida.' });
      }

      // Optimizar la imagen antes de guardarla
      const imageBuffer = await fs.readFile(imagen.filepath);
      const optimizedImage = await sharp(imageBuffer)
        .resize(800, 600, { // Redimensionar a un tamaño razonable
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 }) // Comprimir como JPEG con calidad 80%
        .toBuffer();

      const newService = new ServiceModel({
        name,
        description,
        price: priceNumber,
        category: category.trim(),
        image: {
          data: optimizedImage,
          contentType: 'image/jpeg'
        },
        available: true
      });

      const saved = await newService.save();
      return res.status(201).json(saved);
    } catch (error: any) {
      console.error('Error al crear servicio:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  return res.status(405).end();
}
