import React, { useEffect, useState } from 'react';

interface DoctorProfileProps {
  doctorId: string;
  onBook: (doctorId: string, doctorName: string) => void;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctorId, onBook }) => {
  const [doctor, setDoctor] = useState<any>(null);
  // const [availabilities, setAvailabilities] = useState<any[]>([]); // Commented out for now

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors?id=${doctorId}`);
        if (!res.ok) throw new Error('Error fetching doctor');
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        setDoctor(null);
      }
    };
    fetchDoctor();
    // If you have availabilities in your backend, fetch them here
    // const fetchAvail = async () => {
    //   const res = await fetch(`/api/availabilities?doctorId=${doctorId}`);
    //   ...
    // };
    // fetchAvail();
  }, [doctorId]);

  if (!doctor) return <div>Cargando perfil...</div>;

  return (
    <div>
      <h3>{doctor.fullName}</h3>
      <p>Especialidad: {doctor.specialty}</p>
      <p>{doctor.description}</p>
      {/*
      <h4>Disponibilidad:</h4>
      <ul>
        {availabilities.map((a, i) => (
          <li key={i}>{a.dayOfWeek}: {a.startTime} - {a.endTime}</li>
        ))}
      </ul>
      */}
      <button onClick={() => onBook(doctorId, doctor.fullName)}>Agendar cita</button>
    </div>
  );
};

export default DoctorProfile;
