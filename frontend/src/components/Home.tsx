import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <h2>Bienvenido a MediConsulta Online</h2>
      <p>Tu plataforma para agendar citas médicas de forma fácil y rápida.</p>
      <nav>
        <Link to="/login" style={{ marginRight: '1rem' }}>Iniciar Sesión</Link>
        <Link to="/register">Registrarse</Link>
      </nav>
    </div>
  );
};

export default Home;