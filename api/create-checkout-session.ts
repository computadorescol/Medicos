import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import NewConsultationForm from '../../NewConsultationForm.tsx';
//import Success from './components/Success.tsx';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-05-28.basil',
});

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Error: STRIPE_SECRET_KEY no está configurada en el archivo .env');
} else {
  console.log('STRIPE_SECRET_KEY loaded successfully:', process.env.STRIPE_SECRET_KEY.slice(0, 8) + '...'); // Log only part of the key for security
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { tierId, price } = req.body;

      // Validate the tierId and price (Important: Sanitize and validate inputs!)
      if (!tierId || !price) {
        console.error('Missing tierId or price');
        return res.status(400).json({ message: 'Missing tierId or price' });
      }

      // Convert price to cents (Stripe uses cents)
      const amountInCents = Math.round(parseFloat(price) * 100);

      console.log('Creating Stripe Checkout Session with:', { tierId, amountInCents });

      // Create a Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd', // Or your currency
              product_data: {
                name: tierId, // Use tierId as the product name (or a more descriptive name)
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}`, // Replace with your success URL 
        cancel_url: `${req.headers.origin}/cancel`, // Replace with your cancel URL
      });

      console.log('Stripe Checkout Session created:', session);

      res.status(200).json({ id: session.id, url: session.url });
    } catch (err: any) {
      console.error('Error creating Stripe Checkout Session:', err);
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    console.error('Method not allowed');
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
