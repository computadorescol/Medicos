import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToConsulta = () => {
    // Redirige a la página de nueva consulta (sin patientId, el usuario debe autenticarse o el flujo debe pasarlo)
    navigate('/nueva-consulta');
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8, textAlign: 'center' }}>
      <h2>¡Pago exitoso!</h2>
      <p>Tu pago fue procesado correctamente.</p>
      <button onClick={handleGoToConsulta} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: 4, margin: '16px 0', cursor: 'pointer' }}>
        Ir a Nueva Consulta
      </button>
      <div>
        <a href="/nueva-consulta" style={{ color: '#007bff', textDecoration: 'underline'}}>Ir a Nueva Consulta</a>
      </div>
    </div>
  );
};

export default Success;
