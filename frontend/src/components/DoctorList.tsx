import React, { useEffect, useState } from 'react';

interface Doctor {
  id: string;
  fullName: string;
  specialty: string;
  description?: string;
  photoURL?: string;
}

const DoctorList: React.FC<{ onSelect: (doctor: Doctor) => void }> = ({ onSelect }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        let url = '/api/doctors';
        if (specialty) {
          url += `?specialty=${encodeURIComponent(specialty)}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error fetching doctors');
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        setDoctors([]);
      }
    };
    fetchDoctors();
  }, [specialty]);

  return (
    <div>
      <h3>Médicos disponibles</h3>
      <select value={specialty} onChange={e => setSpecialty(e.target.value)}>
        <option value="">Todas las especialidades</option>
        <option value="Cardiología">Cardiología</option>
        <option value="Dermatología">Dermatología</option>
        {/* ...otras especialidades */}
      </select>
      <ul>
        {doctors.map(doctor => (
          <li key={doctor.id} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <img
              src={doctor.photoURL || 'https://randomuser.me/api/portraits/med/men/1.jpg'}
              alt={doctor.fullName}
              style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%', border: '2px solid #4CAF50' }}
            />
            <div>
              <b>{doctor.fullName}</b> ({doctor.specialty})<br />
              {doctor.description}<br />
              <button onClick={() => onSelect(doctor)}>Ver perfil</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
