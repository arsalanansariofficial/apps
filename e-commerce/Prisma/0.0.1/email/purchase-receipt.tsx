import {
  Body,
  Head,
  Html,
  Preview,
  Heading,
  Tailwind,
  Container
} from '@react-email/components';
import { OrderInformation } from './components/order-information';

interface Props {
  downloadVerificationId: string;
  order: { id: string; createdAt: Date; pricePaidInCents: number };
  product: { imagePath: string; name: string; description: string };
}

PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: 'Product 01',
    description: 'This is a Test Product 01',
    imagePath: '/products/product-01.jpg'
  },
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInCents: 1000
  },
  downloadVerificationId: crypto.randomUUID()
} satisfies Props;

export default function PurchaseReceiptEmail({
  product,
  order,
  downloadVerificationId
}: Props) {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="bg-white font-sans">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              order={order}
              product={product}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
