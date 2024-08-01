'use client';

import { Product } from '@prisma/client';
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
  LinkAuthenticationElement,
} from '@stripe/react-stripe-js';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import { Button } from '@/components/ui/button';
import { userOrderExists } from '@/app/actions/orders';
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function CheckoutForm(props: {
  product: Product;
  clientSecret: string;
}) {
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
      <Elements
        options={{ clientSecret: props.clientSecret }}
        stripe={stripePromise}
      >
        <Form product={props.product} />
      </Elements>
    </div>
  );
}

function Form({ product }: { product: Product }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (!stripe || !elements || !email) return;

    const orderExists = await userOrderExists(email, product.id);

    if (orderExists) {
      setErrorMessage(
        'You have already downloaded the product try downloading it from the My Orders page'
      );
      return setIsLoading(false);
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-sucess`
      }
    });

    if (error.type === 'card_error' || error.type === 'validation_error')
      setErrorMessage(error.message);
    else setErrorMessage('An unknown error occurred');

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <LinkAuthenticationElement
            className="mt-4"
            onChange={event => setEmail(event.value.email)}
          />
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" disabled={!stripe || !elements}>
            {isLoading
              ? 'Purchasing...'
              : `Purchase - ${formatCurrency(product.priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
