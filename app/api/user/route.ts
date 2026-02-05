import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

export async function DELETE() {
	try {
		const session = await requireSession();
		const userId = session.user.id;

		await prisma.user.delete({
			where: { id: userId },
		});

		return NextResponse.json({ success: true });
	} catch (err) {
		if (err instanceof Error && err.message === 'Unauthorized') {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
