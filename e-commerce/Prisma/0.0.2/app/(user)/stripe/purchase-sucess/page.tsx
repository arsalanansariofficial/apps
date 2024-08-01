import Stripe from 'stripe';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import prisma from '@/db/db';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchaseSuccessPage(props: {
  searchParams: { payment_intent: string };
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    props.searchParams.payment_intent
  );

  if (!paymentIntent.metadata.productId) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: paymentIntent.metadata.productId }
  });

  if (!product) return notFound();

  const isSuccess = paymentIntent.status === 'succeeded';

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccess ? 'Success!' : 'Error!'}
      </h1>
      <div className="flex items-center gap-4">
        <div className="relative aspect-video w-1/3 flex-shrink-0">
          <Image
            fill
            className="object-cover"
            alt={product.name}
            src={product.imagePath}
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-lg text-slate-500">
            {product.description}
          </div>
          <Button className="mt-4" asChild size="lg">
            {isSuccess ? (
              <a
                href={`/products/download/${await createDownloadVerification(product.id)}`}
              >
                Download
              </a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

async function createDownloadVerification(productId: string) {
  return (
    await prisma.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
      }
    })
  ).id;
}
