import React, { useState } from 'react';
import DoctorProfile from './DoctorProfile';
import NewConsultationForm from './NewConsultationForm';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const DoctorProfileWithConsult: React.FC<{ doctorId: string }> = ({ doctorId }) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  // Removed unused doctorName state
  const navigate = useNavigate();

  if (!user) return (
    <div style={{textAlign: 'center', margin: '2rem'}}>
      <p>Debes iniciar sesión para agendar una consulta.</p>
      <button onClick={() => navigate('/login-paciente')} style={{padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer'}}>Ingresar como paciente</button>
    </div>
  );

  return (
    <div>
      <DoctorProfile
        doctorId={doctorId}
        onBook={(_id, _name) => {
          setShowForm(true);
        }}
      />
      {showForm && (
        <NewConsultationForm patientId={user.uid} assignedDoctorId={doctorId} />
      )}
    </div>
  );
};

export default DoctorProfileWithConsult;
