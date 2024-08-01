import { ProductForm } from '../_components/product-form';
import { PageHeader } from '../../_components/page-header';

export default function NewProductPage() {
  return (
    <>
      <PageHeader>Add Product</PageHeader>
      <ProductForm />
    </>
  );
}
