import { Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ProfileHeaderProps = {
	name?: string | null;
	email?: string | null;
	image?: string | null;
};

export const ProfileHeader = ({ name, email, image }: ProfileHeaderProps) => {
	return (
		<div className="flex flex-col md:flex-row items-center md:items-end gap-6 pb-2">
			<Avatar className="size-32 border-4 border-background shadow-2xl">
				<AvatarImage src={image || ''} className="object-cover" />
				<AvatarFallback className="text-4xl bg-muted">
					{name?.charAt(0)}
				</AvatarFallback>
			</Avatar>
			<div className="space-y-1 text-center md:text-left mb-2">
				<h2 className="text-4xl font-bold tracking-tight">{name}</h2>
				<div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground font-medium">
					<Mail className="size-4" />
					<span>{email}</span>
				</div>
			</div>
		</div>
	);
};
