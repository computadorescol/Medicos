import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import PayConsultation from './PayConsultation'; // Import the PayConsultation component

// Placeholder data for pricing tiers
const pricingTiers = [
  {
    name: "Consulta Básica",
    price: "25 USD", // Example price
    description: "Respuesta detallada a tu consulta médica general.",
    features: ["Respuesta en 24-48 horas", "Médico general asignado"],
    id: "basic",
  },
  {
    name: "Consulta Prioritaria",
    price: "45 USD", // Example price
    description: "Atención más rápida para tus inquietudes urgentes (no emergencias).",
    features: ["Respuesta en 6-12 horas", "Prioridad en asignación"],
    id: "priority",
  },
  {
    name: "Consulta de Seguimiento",
    price: "15 USD", // Example price
    description: "Para pacientes recurrentes que necesitan seguimiento de una consulta previa.",
    features: ["Requiere consulta previa", "Continuidad con tu médico (si es posible)"],
    id: "follow-up",
  },
  {
    name: "Plan Mensual (Próximamente)",
    price: "99 USD/mes", // Example price
    description: "Acceso a múltiples consultas y beneficios adicionales.",
    features: ["Hasta 4 consultas básicas al mes", "Descuentos en consultas prioritarias", "Acceso a contenido exclusivo (Próximamente)"],
    id: "monthly",
    comingSoon: true,
  },
];

const paymentMethods = [
  { name: "Bancolombia", link: "#" }, // Replace # with actual payment links or info pages
  { name: "Efecty", link: "#" },
  { name: "PayPal", link: "#" },
  { name: "Stripe (Tarjetas)", link: "#" },
];

const PricingPage: React.FC = () => {
  // Basic inline styles - can be replaced with CSS classes if/when styling system is in place

  
const handleCheckout = async (tierId: string, price: string  ) => {
  try {
    // Extraer solo el número del precio (ej: "25 USD" -> 25)
    const numericPrice = parseFloat(price.replace(/[^\d.]/g, ''));
    // 1. Create a Stripe Checkout Session on the server.
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tierId: tierId,
        price: numericPrice,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create checkout session');
    }

    const session = await response.json();

    // 2. Redirect to Checkout.
    const stripe = await loadStripe('pk_test_51Hxxxxxxxxxxxxxxxxxxxxxxxx'); // Replace with your actual key
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    // 3. If `redirectToCheckout` fails due to network issues, display the error.
    if (error) {
      console.error(error);
      alert(error.message); // Or display the error in a user-friendly way
    }
  } catch (error: any) {
    console.error(error);
    alert(error.message || 'An unexpected error occurred.'); // Or display the error in a user-friendly way
  }
};
  const styles = {
    container: { maxWidth: '900px', margin: '20px auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
    header: { textAlign: 'center' as 'center', marginBottom: '40px' },
    title: { fontSize: '2.5em', color: '#333', marginBottom: '10px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' },
    tierCard: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    tierName: { fontSize: '1.5em', color: '#007bff', marginBottom: '10px' },
    tierPrice: { fontSize: '2em', fontWeight: 'bold', marginBottom: '15px' },
    tierDescription: { fontSize: '0.9em', color: '#555', marginBottom: '15px', minHeight: '40px' },
    tierFeature: { fontSize: '0.9em', marginBottom: '5px', listStyle: 'none', paddingLeft: 0 },
    comingSoonBadge: { backgroundColor: '#ffc107', color: '#333', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold', display: 'inline-block', marginLeft: '10px' },
    paymentSection: { marginBottom: '30px', borderTop: '1px solid #eee', paddingTop: '20px' },
    paymentTitle: { fontSize: '1.2em', marginBottom: '10px' },
    paymentList: { listStyle: 'none', padding: 0, display: 'flex', gap: '15px', flexWrap: 'wrap' as 'wrap' },
    paymentLink: { textDecoration: 'none', color: '#007bff', padding: '8px 12px', border: '1px solid #007bff', borderRadius: '4px', transition: 'background-color 0.2s, color 0.2s' },
    // Add hover style for paymentLink if needed, e.g. by managing state or using CSS classes

    refundPolicy: { fontSize: '0.9em', color: '#555', marginBottom: '20px', borderTop: '1px solid #eee', paddingTop: '20px' },
    note: { fontSize: '0.8em', color: '#777', fontStyle: 'italic' as 'italic', marginTop: '20px', textAlign: 'center' as 'center' },
    payButton: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1em',
      marginTop: '15px',
    },
  };


  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Tarifas de Consulta</h1>
      </header>

      <div style={styles.grid}>
        {pricingTiers.map((tier) => (
          <div key={tier.id} style={styles.tierCard}>
            <h3 style={styles.tierName}>

              {tier.name}
              {tier.comingSoon && <span style={styles.comingSoonBadge}>Próximamente</span>}
            </h3>
            <PayConsultation />
            <p style={styles.tierPrice}>{tier.price}</p>
            <p style={styles.tierDescription}>{tier.description}</p>
            <ul style={styles.tierFeature}>
              {tier.features.map((feature, index) => (
                <li key={index}>✓ {feature}</li>
              ))}
            </ul>
            {!tier.comingSoon && (
              <button
                style={styles.payButton}
                onClick={() => handleCheckout(tier.id, tier.price)}
              >
                Pagar
              </button>
            )}
          </div>
              ))}

      <section style={styles.paymentSection}>
        <h3 style={styles.paymentTitle}>Métodos de Pago Aceptados</h3>
        <ul style={styles.paymentList}>
          {paymentMethods.map(method => (
            <li key={method.name}>
              <a href={method.link} target="_blank" rel="noopener noreferrer" style={styles.paymentLink}>
                {method.name}
              </a>
            </li>
          ))}
          </ul>
        <p style={{fontSize: '0.9em', color: '#555', marginTop: '10px'}}>
          Serás redirigido a la plataforma de pago correspondiente.
        </p>
      </section>

      <section style={styles.refundPolicy}>
        <h4>Política de Reembolso</h4>
        <p>
          Ofrecemos reembolsos completos en caso de que no recibas una respuesta a tu consulta dentro del plazo estipulado para el tipo de consulta seleccionada. 
          Por favor, contacta a nuestro equipo de soporte para iniciar el proceso.
        </p>
      </section>

      <p style={styles.note}>
        Nota: Los precios pueden variar según la especialidad del médico consultado y están sujetos a cambios.
      </p>
          </div>
          </div>
  );
};

export default PricingPage