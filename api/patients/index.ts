import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cambia este archivo para tu dominio: cliente, usuario, etc.

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Ejemplo: POST para crear un cliente
  // GET para listar clientes
  // Personaliza los campos y lógica según tu dominio

  if (request.method === 'POST') {
    try {
      const {
        firebaseUid,
        fullName,
        email,
        age,
        gender,
        phone
      } = request.body;

      // Validación básica
      if (!firebaseUid || !fullName || !email) {
        return response.status(400).json({ error: 'Faltan campos obligatorios.' });
      }

      const newPatient = await prisma.user.create({
        data: {
          firebaseUid,
          fullName,
          email,
          age: age !== undefined ? Number(age) : null,
          gender,
          phone,
          role: 'PATIENT',
        },
      });

      response.status(201).json(newPatient); // 201 Created
    } catch (error: any) {
      console.error('Error creating patient profile in Prisma:', error);
      response.status(500).json({ error: 'Failed to create patient profile in Prisma', details: error.message });
    } finally {
      await prisma.$disconnect();
    }
  } else if (request.method === 'GET') {
    try {
      const patients = await prisma.user.findMany({ where: { role: 'PATIENT' } });
      response.status(200).json(patients);
    } catch (error: any) {
      console.error('Error fetching patients from Prisma:', error);
      response.status(500).json({ error: 'Failed to fetch patients', details: error.message });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    response.status(405).json({ error: 'Method Not Allowed' });
  }
}
