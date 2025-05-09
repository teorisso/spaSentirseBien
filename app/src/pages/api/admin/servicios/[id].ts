
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../lib/dbConnect'
import { ServiceModel } from '../../../../models/Service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  await dbConnect()

  if (req.method === 'PUT') {
    try {
      const updated = await ServiceModel.findByIdAndUpdate(id, req.body, { new: true })
      return res.status(200).json(updated)
    } catch {
      return res.status(400).json({ error: 'Error al actualizar servicio' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await ServiceModel.findByIdAndDelete(id)
      return res.status(204).end()
    } catch {
      return res.status(400).json({ error: 'Error al eliminar servicio' })
    }
  }

  return res.status(405).end()
}
