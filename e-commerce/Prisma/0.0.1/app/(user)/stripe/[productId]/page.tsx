import Image from 'next/image';
import { notFound } from 'next/navigation';

import prisma from '@/db/db';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default async function PurchaseSuccessPage(props: {
  params: { productId: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: props.params.productId }
  });

  if (!product) return notFound();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <h1 className="text-4xl font-bold">{product ? 'Success!' : 'Error!'}</h1>
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
            <a
              href={`/products/download/${await createDownloadVerification(product.id)}`}
            >
              Download
            </a>
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
