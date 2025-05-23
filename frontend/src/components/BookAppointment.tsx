import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface BookAppointmentProps {
  doctorId: string;
  doctorName: string;
  onBooked: () => void;
}

const BookAppointment: React.FC<BookAppointmentProps> = ({ doctorId, doctorName, onBooked }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { user } = useAuth();

  const handleBook = async () => {
    if (!date || !time) return;
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientUid: user.uid,
          doctorId,
          appointmentDateTime: `${date}T${time}`,
          status: 'scheduled',
          patientName: user.displayName,
          doctorName,
        }),
      });
      if (!res.ok) throw new Error('Error booking appointment');
      onBooked();
    } catch (err) {
      alert('Error al agendar la cita.');
    }
  };

  return (
    <div>
      <h4>Agendar cita con {doctorName}</h4>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <input type="time" value={time} onChange={e => setTime(e.target.value)} />
      <button onClick={handleBook}>Confirmar cita</button>
    </div>
  );
};

export default BookAppointment;
