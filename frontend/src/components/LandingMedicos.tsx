import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  id: string;
  fullName: string;
  photoURL?: string;
}

const LandingMedicos: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulación de imágenes de médicos (sin base de datos)
    const fakeDoctors = [
      {
        id: '1',
        fullName: 'Dra. Ana Cardio',
        photoURL: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      {
        id: '2',
        fullName: 'Dr. Juan Dermato',
        photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      {
        id: '3',
        fullName: 'Dra. Laura Pediatra',
        photoURL: 'https://randomuser.me/api/portraits/women/65.jpg',
      },
      {
        id: '4',
        fullName: 'Dr. Carlos General',
        photoURL: 'https://randomuser.me/api/portraits/men/76.jpg',
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
    navigate(`/doctor/${doctor.id}`);
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingMedicos;
