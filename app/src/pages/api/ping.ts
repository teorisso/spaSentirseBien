import type { NextApiRequest, NextApiResponse } from 'next';

type PingResponse = {
  status: string;
  timestamp: string;
  environment: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PingResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Return basic health check information
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}