import fs from 'fs/promises';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/db/db';

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true, filePath: true }
  });

  if (product == null) return notFound();

  const { size } = await fs.stat(product.filePath);
  const file = await fs.readFile(product.filePath);
  const extension = product.filePath.split('.').pop();

  return new NextResponse(file, {
    headers: {
      'content-length': size.toString(),
      'content-disposition': `attachment; filename="${product.name}.${extension}"`
    }
  });
}
