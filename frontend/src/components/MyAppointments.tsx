import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const MyAppointments: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`/api/appointments?patientUid=${user.uid}`);
        if (!res.ok) throw new Error('Error fetching appointments');
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, [user.uid]);

  return (
    <div>
      <h3>Mis citas</h3>
      <ul>
        {appointments.map((a, i) => (
          <li key={i}>
            {/* Format date if needed */}
            {a.appointmentDateTime ? new Date(a.appointmentDateTime).toLocaleString() : ''}
            {' - '}
            {a.doctorName} ({a.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyAppointments;
