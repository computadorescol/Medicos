import React, { useState } from 'react';
import { auth } from '../firebase'; // Only use auth now
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Placeholder for specialties - this would ideally come from a DB or config
const medicalSpecialties = [
  "Cardiología",
  "Dermatología",
  "Endocrinología",
  "Gastroenterología",
  "Medicina General",
  "Neurología",
  "Pediatría",
  "Psiquiatría",
  "Otra",
];

interface DoctorFormData {
  fullName: string;
  email: string;
  password_raw: string; // For initial creation, will not be stored directly
  specialty: string;
  medicalLicense: string;
  yearsExperience: number;
  bio?: string;
  credentialsFile?: File | null;
}

const DoctorRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<DoctorFormData>({
    fullName: '',
    email: '',
    password_raw: '',
    specialty: '',
    medicalLicense: '',
    yearsExperience: 0,
    bio: '',
    credentialsFile: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      setFormData(prevData => ({
        ...prevData,
        [name]: files ? files[0] : null,
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: name === 'yearsExperience' ? (value === '' ? 0 : Number(value)) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password_raw || !formData.specialty || !formData.medicalLicense || formData.yearsExperience <= 0) {
      setError("Por favor, complete todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password_raw);
      const user = userCredential.user;
      console.log("Firebase user created:", user.uid);

      // Step 2: Send doctor profile data to backend (Prisma)
      try {
        const backendResponse = await fetch('/api/doctors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebaseUid: user.uid,
            fullName: formData.fullName,
            email: formData.email,
            medicalLicenseNumber: formData.medicalLicense,
            yearsOfExperience: formData.yearsExperience,
            professionalBio: formData.bio,
            specialty: formData.specialty
          })
        });
        if (!backendResponse.ok) throw new Error('Failed to save doctor profile in backend.');
        const backendData = await backendResponse.json();
        console.log('Doctor profile saved in backend (Prisma):', backendData);
      } catch (apiError: any) {
        console.error('Error sending data to backend:', apiError);
        setError(`Cuenta de autenticación creada, pero falló la subida de datos del perfil al backend: ${apiError.message}`);
      }

      // Step 2b: Handle credentials file upload if present (optional, not implemented)
      if (formData.credentialsFile) {
        const fileData = new FormData();
        fileData.append('credentials', formData.credentialsFile);
        fileData.append('uid', user.uid); // Associate file with user

        console.log("Attempting to upload credentials file:", formData.credentialsFile.name);
        // Simulate API call for file upload
        // const fileResponse = await fetch('/api/doctors/upload-credentials', {
        //   method: 'POST',
        //   body: fileData, // FormData is sent as multipart/form-data
        // });
        // if (!fileResponse.ok) throw new Error('Failed to upload credentials.');
        console.log("Simulated: Credentials file uploaded successfully.");
      }

      setSuccess("¡Registro exitoso! Su cuenta ha sido creada. Nuestro equipo verificará sus credenciales.");
      // Reset form
      setFormData({
        fullName: '', email: '', password_raw: '', specialty: '',
        medicalLicense: '', yearsExperience: 0, bio: '', credentialsFile: null
      });

    } catch (authError: any) {
      console.error("Error during Firebase Auth registration:", authError);
      if (authError.code === 'auth/email-already-in-use') {
        setError("Este correo electrónico ya está registrado.");
      } else if (authError.code === 'auth/weak-password') {
        setError("La contraseña es demasiado débil. Debe tener al menos 6 caracteres.");
      }
      else {
        setError(authError.message || "Ocurrió un error durante el registro de autenticación.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Registro de Profesionales Médicos</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <div>
          <label htmlFor="fullName">Nombre completo:*</label>
          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label htmlFor="email">Correo electrónico:*</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label htmlFor="password_raw">Contraseña:*</label>
          <input type="password" id="password_raw" name="password_raw" value={formData.password_raw} onChange={handleChange} required style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label htmlFor="specialty">Especialidad médica:*</label>
          <select id="specialty" name="specialty" value={formData.specialty} onChange={handleChange} required style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}>
            <option value="">Seleccione una especialidad...</option>
            {medicalSpecialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="medicalLicense">Número de licencia médica:*</label>
          <input type="text" id="medicalLicense" name="medicalLicense" value={formData.medicalLicense} onChange={handleChange} required style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label htmlFor="yearsExperience">Años de experiencia:*</label>
          <input type="number" id="yearsExperience" name="yearsExperience" value={formData.yearsExperience} onChange={handleChange} required min="0" style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label htmlFor="bio">Breve biografía profesional (Máx. 200 palabras):</label>
          <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} maxLength={1200} style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }} />
          {/* A proper word/char counter could be added here */}
        </div>
        <div>
          <label htmlFor="credentialsFile">Subida de documentos/credenciales:</label>
          <input type="file" id="credentialsFile" name="credentialsFile" onChange={handleChange} style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
          {loading ? 'Registrando...' : 'Registrarme como Médico'}
        </button>
      </form>
      <div style={{ marginTop: '20px', fontSize: '0.9em', borderTop: '1px solid #eee', paddingTop: '15px' }}>
        <h4>Información sobre el proceso:</h4>
        <p>"Tras completar el registro, nuestro equipo verificará sus credenciales."</p>
        <p>"Una vez aprobado, podrá recibir y responder consultas según su especialidad."</p>
      </div>
    </div>
  );
};

export default DoctorRegistrationForm;