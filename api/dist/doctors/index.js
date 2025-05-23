"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function handler(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        if (request.method === 'POST') {
            try {
                const { firebaseUid, fullName, email, medicalLicenseNumber, yearsOfExperience, professionalBio, specialty, // Nuevo campo para especialidad
                 } = request.body;
                // Validación básica
                if (!firebaseUid || !fullName || !email || !medicalLicenseNumber || !yearsOfExperience || !specialty) {
                    return response.status(400).json({ error: 'Faltan campos obligatorios.' });
                }
                const newDoctor = yield prisma.doctor.create({
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
                                        } } }]
                        }
                    },
                    include: { doctorSpecialties: { include: { specialty: true } } }
                });
                response.status(201).json(newDoctor); // 201 Created
            }
            catch (error) {
                console.error("Error creating doctor profile in Prisma:", error);
                response.status(500).json({ error: 'Failed to create doctor profile in Prisma', details: error.message });
            }
            finally {
                yield prisma.$disconnect();
            }
        }
        else {
            response.status(405).json({ error: 'Method Not Allowed' }); // Handle other methods
        }
    });
}
