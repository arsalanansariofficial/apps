'use server';

import { z } from 'zod';
import { Product } from '@prisma/client';
import { redirect } from 'next/navigation';

import prisma from '@/db/db';

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  email: z.string().email().min(1),
  priceInCents: z.coerce.number().int().min(1)
});

export async function createOrder(
  product: Product,
  _prevState: unknown,
  formdata: FormData
) {
  const email = formdata.get('email') as string;
  const result = createSchema.safeParse({ email, ...product });

  if (!result.success) return result.error.formErrors.fieldErrors;

  const orderExists = await prisma.order.findFirst({
    where: {
      user: { email },
      productId: product.id
    }
  });

  if (orderExists) return orderExists.id;

  const userFields = {
    email,
    orders: {
      create: { productId: product.id, pricePaidInCents: product.priceInCents }
    }
  };

  await prisma.user.upsert({
    where: { email },
    create: userFields,
    update: userFields
  });

  redirect(`/stripe/${product.id}`);
}
