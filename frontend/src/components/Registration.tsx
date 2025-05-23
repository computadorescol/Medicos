import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Only use auth now

const Registration: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password || !role) {
      setError("Por favor, completa todos los campos, incluyendo el rol.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuario registrado en Auth:", user);

      // Guardar información adicional del usuario en el backend (Prisma)
      try {
        const res = await fetch(`/api/${role === 'doctor' ? 'doctors' : 'patients'}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebaseUid: user.uid,
            email: user.email,
            fullName: email.split('@')[0], // Puedes pedir el nombre real en el formulario si lo deseas
            role
          })
        });
        if (!res.ok) throw new Error('Error al guardar el usuario en el backend');
        alert('¡Registro exitoso! Usuario guardado.');
        setEmail('');
        setPassword('');
      } catch (apiError) {
        console.error('Error guardando usuario en backend:', apiError);
        setError('Registro exitoso en Auth, pero falló al guardar datos adicionales. Por favor, contacta a soporte.');
      }
    } catch (err: any) {
      console.error("Error en el registro:", err);
      setError(err.message || "Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Registro de Nuevo Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div>
          <label htmlFor="role">Soy un:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value as 'patient' | 'doctor')} required>
            <option value="patient">Paciente</option>
            <option value="doctor">Médico</option>
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default Registration;