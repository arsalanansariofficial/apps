import { Suspense } from 'react';

import prisma from '@/db/db';
import { cache } from '@/lib/utils';
import { ProductCard, ProductCardStructure } from '@/components/product-card';

const getProducts = cache(
  () => {
    return prisma.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { name: 'desc' }
    });
  },
  ['/', 'getLatestProducts'],
  { revalidate: 60 * 60 * 24 }
);

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Suspense
        fallback={
          <>
            <ProductCardStructure />
            <ProductCardStructure />
            <ProductCardStructure />
            <ProductCardStructure />
            <ProductCardStructure />
          </>
        }
      >
        <ProductSuspense />
      </Suspense>
    </div>
  );
}

async function ProductSuspense() {
  const products = await getProducts();

  if (products.length === 0) {
    return <p>No products available.</p>;
  }

  return products.map(product => <ProductCard key={product.id} {...product} />);
}
