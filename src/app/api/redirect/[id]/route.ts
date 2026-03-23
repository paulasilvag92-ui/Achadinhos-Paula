import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;

  if (!idStr) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const id = parseInt(idStr, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    // Increment clicks atomically and fetch the link for EVERY request
    const product = await prisma.product.update({
      where: { id },
      data: { clicks: { increment: 1 } },
      select: { affiliate_link: true }
    });

    if (!product || !product.affiliate_link) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Redirect permanently (302 found / transient URL)
    return NextResponse.redirect(product.affiliate_link, 302);
  } catch (error) {
    console.error('Error redirecting & logging click:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
