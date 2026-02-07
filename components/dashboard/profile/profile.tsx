'use client';

import { Separator } from '@/components/ui/separator';
import { useSession } from '@/lib/auth/client';
import { DeleteAccountSection } from './delete-account-section';
import { ProfileHeader } from './profile-header';
import { ProfileInfoGrid } from './profile-info-grid';

export const Profile = () => {
	const { data: session } = useSession();

	if (!session?.user) return null;

	return (
		<div className="space-y-8 w-full">
			<ProfileHeader
				name={session.user.name}
				email={session.user.email}
				image={session.user.image}
			/>
			<Separator />
			<ProfileInfoGrid
				createdAt={session.user.createdAt}
				timezone={session.user.timezone}
				email={session.user.email}
			/>
			<DeleteAccountSection userName={session.user.name} />
		</div>
	);
};
