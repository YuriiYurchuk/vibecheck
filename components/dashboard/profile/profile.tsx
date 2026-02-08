'use client';

import { useEffect, useState } from 'react';
import { FadeIn } from '@/components/ui/fade-in';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/lib/auth/client';
import { DeleteAccountSection } from './delete-account-section';
import { ProfileHeader } from './profile-header';
import { ProfileInfoGrid } from './profile-info-grid';
import { ProfileSkeleton } from './skeleton';

export const Profile = () => {
	const { data: session, isPending } = useSession();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted || isPending) {
		return <ProfileSkeleton />;
	}

	if (!session?.user) return null;

	return (
		<div className="space-y-8 w-full">
			<FadeIn delay={0}>
				<ProfileHeader
					name={session.user.name}
					email={session.user.email}
					image={session.user.image}
				/>
			</FadeIn>
			<Separator />
			<ProfileInfoGrid
				createdAt={session.user.createdAt}
				timezone={session.user.timezone}
				email={session.user.email}
			/>
			<FadeIn delay={400}>
				<DeleteAccountSection userName={session.user.name} />
			</FadeIn>
		</div>
	);
};
