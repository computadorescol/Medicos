import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../firebase';

interface UserProfile {
  id?: string;
  firebaseUid?: string;
  fullName?: string;
  email?: string;
  role?: string;
  specialty?: string;
  medicalLicense?: string;
  yearsExperience?: number;
  bio?: string;
  // Otros campos que puedas tener en el perfil
}

const AuthDetails: React.FC = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user) {
        setProfileError(null);
        setLoading(true);
        try {
          // Buscar perfil en Prisma vía API en vez de Firestore
          const res = await fetch(`/api/patients?firebaseUid=${user.uid}`);
          if (res.ok) {
            const data = await res.json();
            setUserProfile(data);
          } else {
            setUserProfile(null);
            setProfileError('No se encontró el perfil en la base de datos.');
          }
        } catch (err) {
          setUserProfile(null);
          setProfileError('Error al buscar el perfil.');
        } finally {
          setLoading(false);
        }
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Sesión cerrada exitosamente');
        // setAuthUser(null) y setUserProfile(null) ya se manejan por onAuthStateChanged
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  if (loading) {
    return <p>Cargando estado de autenticación...</p>;
  }

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
      <h4>Estado de Autenticación</h4>
      {authUser ? (
        <>
          <p>Email: {authUser.email}</p>
          <p>UID: {authUser.uid}</p>
          {userProfile ? (
            <p>Rol: {userProfile.role || "No especificado"}</p>
          ) : (
            <p>Cargando perfil...</p>
          )}
          {profileError && <p style={{color: 'orange'}}>Advertencia del perfil: {profileError}</p>}
          <button onClick={handleSignOut}>Cerrar Sesión</button>
        </>
      ) : (
        <p>No has iniciado sesión.</p>
      )}
      {userProfile && (
        <div style={{border: '1px solid #ccc', borderRadius: 8, padding: 16, margin: 16}}>
          <h3>Perfil de Usuario</h3>
          <p><b>Nombre:</b> {userProfile.fullName}</p>
          <p><b>Email:</b> {userProfile.email}</p>
          <p><b>Rol:</b> {userProfile.role}</p>
          {userProfile.role === 'doctor' && (
            <>
              <p><b>Especialidad:</b> {userProfile.specialty}</p>
              <p><b>Licencia Médica:</b> {userProfile.medicalLicense}</p>
              <p><b>Años de experiencia:</b> {userProfile.yearsExperience}</p>
              <p><b>Bio:</b> {userProfile.bio}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthDetails;