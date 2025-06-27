import { loadStripe, Stripe } from '@stripe/stripe-js';


let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    console.log('Stripe Publishable Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // Debugging log
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }

  return stripePromise; 
};

export default getStripe;