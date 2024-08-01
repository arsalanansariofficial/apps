import Link from 'next/link';
import { Suspense } from 'react';
import { Product } from '@prisma/client';
import { ArrowRight } from 'lucide-react';

import prisma from '@/db/db';
import { cache } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ProductCard, ProductCardStructure } from '@/components/product-card';

const getMostPopularProducts = cache(
  () => {
    return prisma.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: 'desc' } },
      take: 5
    });
  },
  ['/', 'getMostPopularProducts'],
  { revalidate: 60 * 60 * 24 }
);

const getLatestProducts = cache(
  () => {
    return prisma.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
  },
  ['/', 'getLatestProducts'],
  { revalidate: 60 * 60 * 24 }
);

export default function HomePage() {
  return (
    <main className="space-y-12">
      <ProductGridSectionGrid
        productsFetcher={getMostPopularProducts}
        title="Most Popular"
      />
      <ProductGridSectionGrid
        productsFetcher={getLatestProducts}
        title="Newest"
      />
    </main>
  );
}

function ProductGridSectionGrid(props: {
  title: string;
  productsFetcher: () => Promise<Product[]>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h1 className="text-3xl font-bold">{props.title}</h1>
        <Button variant="outline" asChild className="space-x-2">
          <Link href="/products">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense
          fallback={
            <>
              <ProductCardStructure />
              <ProductCardStructure />
              <ProductCardStructure />
            </>
          }
        >
          <ProductSuspense productsFetcher={props.productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense(props: {
  productsFetcher: () => Promise<Product[]>;
}) {
  const products = await props.productsFetcher();

  if (products.length === 0) {
    return <p>No products available.</p>;
  }

  return (await props.productsFetcher()).map(product => (
    <ProductCard key={product.id} {...product} />
  ));
}
