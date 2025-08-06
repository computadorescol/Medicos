import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

interface Doctor {
  id: string;
  fullName: string;
  photoURL?: string;
  specialty: string;
}

const LandingMedicos: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const navigate = useNavigate();
  // const { user } = useAuth(); // Get the authenticated user

  useEffect(() => {
    // Simulación de imágenes de médicos (sin base de datos)
    const fakeDoctors = [
      {
        id: '1',
        fullName: 'Dra. Ana Cardio',
        photoURL: 'https://randomuser.me/api/portraits/women/44.jpg',
        specialty: 'Cardiología',
      },
      {
        id: '2',
        fullName: 'Dr. Juan Dermato',
        photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
        specialty: 'Dermatología',
      },
      {
        id: '3',
        fullName: 'Dra. Laura Pediatra',
        photoURL: 'https://randomuser.me/api/portraits/women/65.jpg',
        specialty: 'Pediatría',
      },
      {
        id: '4',
        fullName: 'Dr. Carlos General',
        photoURL: 'https://randomuser.me/api/portraits/men/76.jpg',
        specialty: 'Medicina General',
      },
    ];
    setDoctors(fakeDoctors);
    // Si quieres volver a usar la API, comenta la línea anterior y descomenta lo de abajo
    /*
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
        if (!res.ok) throw new Error('Error fetching doctors');
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        setDoctors([]);
      }
    };
    fetchDoctors();
    */
  }, []);

  const handleDoctorClick = (doctor: Doctor) => {
    navigate('/pricing')
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Nuestros Médicos</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            style={{
              width: '90px',
              margin: '10px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
            onClick={() => handleDoctorClick(doctor)}
          >
            <img
              src={doctor.photoURL || 'https://randomuser.me/api/portraits/med/men/1.jpg'}
              alt={doctor.fullName}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '20%',
                border: '3px solid #4CAF50',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                marginBottom: '8px',
              }}
            />
            <div style={{ fontSize: '0.95em', fontWeight: 500 }}>{doctor.fullName}</div>
            <div style={{ fontSize: '0.85em', color: '#555' }}>{doctor.specialty}</div>
          </div>
        ))}
      </div>
      {selectedDoctor && (
        <div style={{ marginTop: '40px', textAlign: 'center', border: '1px solid #eee', borderRadius: '8px', padding: '24px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <img
            src={selectedDoctor.photoURL || 'https://randomuser.me/api/portraits/med/men/1.jpg'}
            alt={selectedDoctor.fullName}
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '20%', border: '3px solid #4CAF50', marginBottom: '16px' }}
          />
          <h3 style={{ marginBottom: '10px' }}>{selectedDoctor.fullName}</h3>
          <p>ID: {selectedDoctor.id}</p>
          <p>Especialidad: {selectedDoctor.specialty}</p>
          {/* Aquí puedes agregar más información del doctor si la tienes */}
          <button style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', marginTop: '16px' }} onClick={() => setSelectedDoctor(null)}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default LandingMedicos;
