'use client';

import Image from 'next/image';
import { signIn, signOut, useSession } from '@/lib/auth/client';

export default function Home() {
	const { data: session } = useSession();

	return (
		<div>
			<main>
				<h1>Welcome to VibeCheck</h1>

				{!session ? (
					<button
						type="button"
						className="py-3 px-4 bg-green-700 rounded-2xl text-white"
						onClick={() => signIn.social({ provider: 'spotify' })}
					>
						Sign In
					</button>
				) : (
					<div className="flex flex-col gap-4">
						<p>Signed in as {session.user.email}</p>
						<Image
							src={session.user.image || ''}
							alt="User Avatar"
							width={100}
							height={100}
							className="rounded-full"
						/>
						<p>{session.user.name}</p>
						<button
							type="button"
							className="py-3 px-4 bg-red-700 rounded-2xl text-white"
							onClick={() => signOut()}
						>
							Log Out
						</button>
					</div>
				)}
			</main>
		</div>
	);
}
