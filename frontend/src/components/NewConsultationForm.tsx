import React, { useState } from 'react';

interface FormData {
  fullName: string;
  email: string;
  age?: number;
  gender?: string;
  phone?: string;
  consultationText: string;
}

interface NewConsultationFormProps {
  patientId: string;
  assignedDoctorId: string;
}

const NewConsultationForm: React.FC<NewConsultationFormProps> = ({ patientId, assignedDoctorId }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    consultationText: '',
  });
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_WORDS = 500;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'age' ? (value === '' ? undefined : Number(value)) : value,
    }));

    if (name === 'consultationText') {
      const words = value.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (wordCount > MAX_WORDS) {
      alert(`La consulta no puede exceder las ${MAX_WORDS} palabras.`);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          assignedDoctorId,
          description: formData.consultationText,
          consultationType: 'basic',
        }),
      });
      if (!res.ok) throw new Error('Error al registrar la consulta');
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        consultationText: '',
        age: undefined,
        gender: undefined,
        phone: undefined,
      });
      setWordCount(0);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Nueva Consulta Médica</h2>
      {success && <div style={{ color: 'green', marginBottom: 10 }}>¡Consulta enviada correctamente!</div>}
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName">Nombre completo:*</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="email">Correo electrónico:*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="age">Edad:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age === undefined ? '' : formData.age}
            onChange={handleChange}
            min="0"
            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="gender">Género:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender === undefined ? '' : formData.gender}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
          >
            <option value="">Seleccionar...</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
            <option value="prefiero no decirlo">Prefiero no decirlo</option>
          </select>
        </div>
        <div>
          <label htmlFor="phone">Teléfono:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone === undefined ? '' : formData.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="consultationText">Describa su consulta o síntomas (Máx. {MAX_WORDS} palabras):*</label>
          <textarea
            id="consultationText"
            name="consultationText"
            value={formData.consultationText}
            onChange={handleChange}
            rows={8}
            placeholder="Describa sus síntomas, desde cuándo los tiene, tratamientos previos, alergias, medicamentos actuales y cualquier información médica relevante..."
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
          />
          <div style={{ textAlign: 'right', fontSize: '0.9em', color: wordCount > MAX_WORDS ? 'red' : '#555' }}>
            Palabras: {wordCount} / {MAX_WORDS}
          </div>
        </div>
        <button 
          type="submit" 
          disabled={wordCount > MAX_WORDS || loading}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}
        >
          {loading ? 'Enviando...' : 'Enviar Consulta'}
        </button>
      </form>
      <p style={{ fontSize: '0.8em', color: '#777', marginTop: '15px' }}>
        Su información será tratada con absoluta confidencialidad según nuestra política de privacidad.
      </p>
    </div>
  );
};

export default NewConsultationForm;