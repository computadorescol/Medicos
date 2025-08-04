/// <reference types="react" />
import React from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';
import Registration from './components/Registration';
import Login from './components/Login';
import AuthDetails from './components/AuthDetails';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
//import NewConsultationForm from './components/NewConsultationForm'; // Import the new form
import DoctorRegistrationForm from './components/DoctorRegistrationForm'; // Import doctor registration form
import PricingPage from './components/PricingPage'; // Import the pricing page
import LandingMedicos from './components/LandingMedicos'; // Import LandingMedicos
import PatientAuth from './components/PatientAuth'; // Import PatientAuth
import DoctorProfileWithConsult from './components/DoctorProfileWithConsult';
import NewConsultationForm from './components/NewConsultationForm';
import Success from './components/Success';


// Wrapper para extraer el doctorId de la URL y pasar a DoctorProfileWithConsult
const DoctorProfileWithConsultWrapper: React.FC = () => {
  const { doctorId } = useParams();
  if (!doctorId) return <div>Doctor no encontrado</div>;
  return <DoctorProfileWithConsult doctorId={doctorId} />;
};

// Wrapper para extraer el patientId de la URL y pasar a NewConsultationForm
const NuevaConsultaWrapper: React.FC = () => {
  const { patientId } = useParams();
  if (!patientId) return <div>Paciente no encontrado</div>;
  return <NewConsultationForm  />;
};

// Componente para rutas protegidas
// (Eliminado porque no se usa actualmente)


function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 className="app-title">MediConsulta Online</h1>
        </Link>
        <nav style={{ marginTop: '1rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Inicio</Link>
          <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
          <Link to="/nueva-consulta" style={{ marginRight: '1rem' }}>Nueva Consulta</Link>
          <Link to="/login-paciente" style={{ marginRight: '1rem' }}>Ingreso Paciente</Link>
          <Link to="/landing-medicos" style={{ marginRight: '1rem' }}>Lista Médicos</Link>
          <Link to="/register-doctor" style={{ marginRight: '1rem' }}>Soy Médico</Link>
          
          <Link to="/pricing" style={{ marginRight: '1rem' }}>Precios</Link>
          {/* Podríamos añadir más links aquí o moverlos a Home/Dashboard */}
        </nav>
        <AuthDetails /> {/* Mantenemos AuthDetails visible globalmente por ahora */}
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-paciente" element={<PatientAuth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nueva-consulta/:patientId" element={<NuevaConsultaWrapper />} /> 
          <Route path="/nueva-consulta" element={<NewConsultationForm />} /> 
          <Route path="/landing-medicos" element={<LandingMedicos />} />
          <Route path="/register-doctor" element={<DoctorRegistrationForm />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/doctor/:doctorId" element={<DoctorProfileWithConsultWrapper />} />
                    <Route path="/success" element={<Success />} />

          {/* Puedes añadir una ruta para Not Found (404) aquí */}
          <Route path="*" element={<div>pagina 404</div> } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
