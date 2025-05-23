import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const PatientAuth: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      let userCredential;
      if (isRegister) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Llamada al backend para guardar el paciente en Prisma
        await fetch('/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebaseUid: userCredential.user.uid,
            fullName: email.split('@')[0], // Puedes pedir el nombre real en el formulario si lo deseas
            email: userCredential.user.email
          })
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Error de autenticación');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>{isRegister ? 'Registro de Paciente' : 'Ingreso de Paciente'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', marginBottom: 12 }}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', marginBottom: 12 }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: 10, background: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}>
          {isRegister ? 'Registrarme' : 'Ingresar'}
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        {isRegister ? (
          <span>¿Ya tienes cuenta? <button onClick={() => setIsRegister(false)} style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}>Inicia sesión</button></span>
        ) : (
          <span>¿No tienes cuenta? <button onClick={() => setIsRegister(true)} style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}>Regístrate</button></span>
        )}
      </div>
    </div>
  );
};

export default PatientAuth;
