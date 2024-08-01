import prisma from '@/db/db';
import { ProductForm } from '../../_components/product-form';
import { PageHeader } from '@/app/admin/_components/page-header';

export default async function EditProductPage(props: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: props.params.id }
  });

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
