'use client';

import Image from 'next/image';
import { useFormState } from 'react-dom';
import { Product } from '@prisma/client';

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createOrder } from '@/app/actions/orders';

export default function CheckoutForm(props: { product: Product }) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <div className="flex items-center gap-4">
        <div className="relative aspect-video w-1/3 flex-shrink-0">
          <Image
            fill
            className="object-cover"
            alt={props.product.name}
            src={props.product.imagePath}
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(props.product.priceInCents / 100)}
          </div>
          <h1 className="text-2xl font-bold">{props.product.name}</h1>
          <div className="line-clamp-3 text-lg text-slate-500">
            {props.product.description}
          </div>
        </div>
      </div>
      <Form product={props.product} />
    </div>
  );
}

function Form({ product }: { product: Product }) {
  const [error, action] = useFormState(createOrder.bind(null, product), {});

  return (
    <form action={action}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {typeof error === 'string' && (
            <p className="mt-2 text-destructive">
              You have already purchased the product, go to My Orders Page to
              download!
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Input required type="email" name="email" placeholder="Email" />
          {typeof error !== 'string' && (
            <p className="mt-2 text-destructive">{error.email}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button size="lg" type="submit" className="w-full">
            Purchase - {formatCurrency(product.priceInCents / 100)}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
