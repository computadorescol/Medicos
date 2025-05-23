import { PrismaClient } from '@prisma/client';

/**
 * @param {import('http').IncomingMessage & { body?: any; method?: string }} req
 * @param {import('http').ServerResponse & { setHeader: Function; status: Function; json: Function; end: Function }} res
 */
import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(
  req: IncomingMessage & { body?: any; method?: string },
  res: ServerResponse & { setHeader: Function; status: Function; json: Function; end: Function }
) {
  const prisma = new PrismaClient();

  if (req.method === 'POST') {
    try {
      let body = req.body;
      // Si el body viene como string (caso Vercel/Node), parsear
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      const { patientId, assignedDoctorId, description, consultationType } = body;
      if (!patientId || !assignedDoctorId || !description) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
      }
      // Buscar el id real de usuario y doctor en Prisma
      const user = await prisma.user.findUnique({ where: { firebaseUid: patientId } });
      const doctor = await prisma.doctor.findUnique({ where: { firebaseUid: assignedDoctorId } });
      if (!user || !doctor) {
        return res.status(404).json({ error: 'Usuario o doctor no encontrado en la base de datos.' });
      }
      // DEBUG: log ids y datos
      console.log('Creando consulta con:', {
        patientId: user.id,
        assignedDoctorId: doctor.id,
        description,
        consultationType
      });
      const consultation = await prisma.consultation.create({
        data: {
          patientId: user.id,
          assignedDoctorId: doctor.id,
          description,
          consultationType: consultationType || 'basic',
        },
      });
      return res.status(201).json(consultation);
    } catch (error) {
      console.error('Error al crear la consulta:', error);
      return res.status(500).json({ error: 'Error al crear la consulta', details: error instanceof Error ? error.message : error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
