import { notFound } from 'next/navigation';

import prisma from '@/db/db';
import CheckoutForm from './_components/checkout-form';

export default async function PurchasePage(props: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: props.params.id }
  });

  if (!product) return notFound();

  return <CheckoutForm product={product} />;
}
