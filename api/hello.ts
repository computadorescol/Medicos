import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { name = 'World carlos julio' } = request.query;
  response.status(200).json({
    message: `Hello today , ${name}!`,
    timestamp: new Date().toISOString(),
    platform: process.platform,
  });
}