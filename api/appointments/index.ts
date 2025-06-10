import { PrismaClient } from '@prisma/client';

/**
 * @param {import('http').IncomingMessage & { body?: any; method?: string }} req
 * @param {import('http').ServerResponse & { setHeader: Function; status: Function; json: Function; end: Function }} res
 */
import type { IncomingMessage, ServerResponse } from 'http';

// Cambia este archivo para tu dominio: cita, consulta, reserva, etc.

const prisma = new PrismaClient();

// Ejemplo de handler genérico:
export default async function handler(
  req: any,
  res: any
) {
  if (req.method === 'POST') {
    try {
      const { patientId, assignedDoctorId, description, consultationType } = req.body;
      if (!patientId || !assignedDoctorId || !description) {
        // Log para debug
        console.warn('Solicitud POST inválida: faltan campos', req.body);
        return res.status(400).json({ error: 'Faltan campos obligatorios. Debes enviar patientId, assignedDoctorId y description.' });
      }
      // Buscar el id real de usuario y doctor en Prisma
      const user = await prisma.user.findUnique({ where: { firebaseUid: patientId } });
      const doctor = await prisma.doctor.findUnique({ where: { firebaseUid: assignedDoctorId } });
      if (!user || !doctor) {
        return res.status(404).json({ error: 'Usuario o doctor no encontrado en la base de datos.' });
      }
      const consultation = await prisma.consultation.create({
        data: {
          patientId: user.id,
          assignedDoctorId: doctor.id,
          description,
          consultationType: consultationType || 'basic',
          firebasePatientUid: patientId, // Guardar el UID de Firebase del paciente
          firebaseDoctorUid: assignedDoctorId, // Guardar el UID de Firebase del doctor
        },
      });
      return res.status(201).json(consultation);
    } catch (error) {
      return res.status(500).json({ error: 'Error al crear la consulta', details: error instanceof Error ? error.message : error });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'GET') {
    // Aquí puedes implementar la lógica para listar consultas
    return res.status(200).json([]);
  } else {
    // Log para debug
    console.warn('Método HTTP no permitido:', req.method);
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ error: `Método ${req.method} no permitido. Usa POST o GET.` });
  }
}
