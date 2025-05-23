import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === 'POST') {
    try {
      const { 
        firebaseUid,
        fullName,
        email,
        medicalLicenseNumber,
        yearsOfExperience,
        professionalBio,
        specialty, // Nuevo campo para especialidad
      } = request.body;

      // Validación básica
      if (!firebaseUid || !fullName || !email || !medicalLicenseNumber || !yearsOfExperience || !specialty) {
        return response.status(400).json({ error: 'Faltan campos obligatorios.' });
      }

      const newDoctor = await prisma.doctor.create({
        data: {
          firebaseUid,
          fullName,
          email,
          medicalLicenseNumber,
          yearsOfExperience: Number(yearsOfExperience),
          professionalBio,
          doctorSpecialties: {
            create: [{ specialty: { connectOrCreate: {
              where: { name: specialty },
              create: { name: specialty }
            }}}]
          }
        },
        include: { doctorSpecialties: { include: { specialty: true } } }
      });

      response.status(201).json(newDoctor); // 201 Created
    } catch (error: any) {
      console.error("Error creating doctor profile in Prisma:", error);
      response.status(500).json({ error: 'Failed to create doctor profile in Prisma', details: error.message });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    response.status(405).json({ error: 'Method Not Allowed' }); // Handle other methods
  }
}