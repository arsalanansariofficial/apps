import Stripe from 'stripe';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/db/db';
import { RESPONSE_STATUS } from '@/lib/constants';
import PurchaseReceiptEmail from '@/email/purchase-receipt';

const resend = new Resend(process.env.RESEND_API_KEY as string);
const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET as string);

export async function POST(req: NextRequest) {
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('stripe-signature') as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object;
    const productId = charge.metadata.productId;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || !email) {
      return new NextResponse(RESPONSE_STATUS.BAD_REQUEST.text, {
        status: RESPONSE_STATUS.BAD_REQUEST.status
      });
    }

    const userFields = {
      email,
      orders: {
        create: { productId, pricePaidInCents }
      }
    };

    const {
      orders: [order]
    } = await prisma.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    const downloadVerification = await prisma.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(
          Date.now() + Number(process.env.NEXT_PUBLIC_EXPIRES_AT as string)
        )
      }
    });

    await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL as string}>`,
      to: email,
      subject: 'Order Confirmation',
      react: (
        <PurchaseReceiptEmail
          order={order}
          product={product}
          downloadVerificationId={downloadVerification.id}
        />
      )
    });
  }

  return new NextResponse();
}
