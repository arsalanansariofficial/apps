import fs from 'fs/promises';
import prisma from '@/db/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  props: { params: { downloadVerificationId: string } }
) {
  const data = await prisma.downloadVerification.findUnique({
    where: {
      id: props.params.downloadVerificationId,
      expiresAt: { gt: new Date() }
    },
    select: { product: { select: { filePath: true, name: true } } }
  });

  if (!data)
    return NextResponse.redirect(
      new URL('/products/download/expired', req.url)
    );

  const { size } = await fs.stat(data.product.filePath);
  const file = await fs.readFile(data.product.filePath);
  const extension = data.product.filePath.split('.').pop();

  return new NextResponse(file, {
    headers: {
      'content-length': size.toString(),
      'content-disposition': `attachment; filename="${data.product.name}.${extension}"`
    }
  });
}
