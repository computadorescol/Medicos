import React from 'react';
import getStripe from '../lib/getStripe';

const PayConsultation: React.FC = () => {
  async function handleCheckout() {
    console.log('Stripe Price ID:', import.meta.env.VITE_STRIPE_PRICE_ID); // Debugging log
    const stripe = await getStripe();
    if (!stripe) {
      alert('Stripe no se pudo inicializar.');
      return;
    }
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: 'price_1RVgnUPKmTkujnnUwVN4PiyP', // Updated to use the valid default_price value
          quantity: 1,
        },
      ],
      mode: 'payment',
      successUrl: `http://localhost:3000/success`,
      cancelUrl: `http://localhost:3000/cancel`,
      customerEmail: 'customer@email.com',
    });
    if (error) {
      console.warn(error.message);
    }
  }

  return (
    <div>
      <button style={styles.payButton} onClick={handleCheckout}>
        Pagar Consulta 
      </button>
    </div>
  );
};

const styles = {
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

export default PayConsultation;