import React from 'react';
import getStripe from '../lib/getStripe';

const PayConsultation: React.FC<{ tierId: string; price: string }> = ({ tierId, price }) => {
  async function handleCheckout() {
    console.log('Stripe Price ID:', import.meta.env.VITE_STRIPE_PRICE_ID); // Debugging log
    const stripe = await getStripe();
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
    console.warn(error.message);
  }
  const handleCheckout1 = async () => {
    try {
      // 1. Create a Stripe Checkout Session on the server.
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tierId: tierId,
          price: price,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read the response as text
        try {
          const errorData = JSON.parse(errorText); // Try parsing as JSON
          throw new Error(errorData.message || 'Failed to create checkout session');
        } catch {
          throw new Error(errorText || 'Failed to create checkout session');
        }
      }

      const session = await response.json();

      // 2. Redirect to the Checkout URL.
      window.location.href = session.url;
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'An unexpected error occurred.'); // Or display the error in a user-friendly way
    }
  };

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