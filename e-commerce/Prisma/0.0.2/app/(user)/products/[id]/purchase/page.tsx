import Stripe from 'stripe';
import { notFound } from 'next/navigation';

import prisma from '@/db/db';
import CheckoutForm from './_components/checkout-form';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage(props: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: props.params.id }
  });

  if (!product) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: 'USD',
    metadata: { productId: product.id }
  });

  if (!paymentIntent.client_secret)
    throw new Error('Stripe failed to create payment intent');

  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  );
}
