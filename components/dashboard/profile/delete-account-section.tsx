import { Loader2, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl'; // 1. Імпорт
import { useState } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth/client';

type DeleteAccountSectionProps = {
	userName?: string | null;
};

export const DeleteAccountSection = ({
	userName,
}: DeleteAccountSectionProps) => {
	const tDanger = useTranslations('dashboard.pages.profile.dangerZone');
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleDeleteAccount = async () => {
		setIsDeleting(true);
		try {
			const response = await fetch('/api/user', { method: 'DELETE' });
			if (!response.ok) throw new Error('Failed to delete account');

			setIsDialogOpen(false);
			await signOut();
		} catch (error) {
			console.error(error);
			setIsDeleting(false);
			setIsDialogOpen(false);
		}
	};

	return (
		<div>
			<div className="rounded-lg border border-red-900/20 bg-red-500/5 p-6 md:p-8">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="flex items-start gap-4">
						<div className="p-3 rounded-full bg-red-500/10 text-red-600 hidden md:block">
							<ShieldAlert className="size-6" />
						</div>
						<div className="space-y-1 text-center md:text-left">
							<h4 className="text-lg font-semibold text-red-600 dark:text-red-500">
								{tDanger('title')}
							</h4>
							<p className="text-sm text-muted-foreground max-w-xl">
								{tDanger('description')}
							</p>
						</div>
					</div>
					<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<AlertDialogTrigger asChild>
							<Button
								variant="destructive"
								size="lg"
								className="w-full md:w-auto font-semibold shadow-red-500/20 shadow-lg cursor-pointer"
							>
								{tDanger('button')}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>{tDanger('modalTitle')}</AlertDialogTitle>
								<AlertDialogDescription>
									{tDanger.rich('modalDescription', {
										name: userName ?? 'User',
										bold: (chunks) => <strong>{chunks}</strong>,
									})}
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel disabled={isDeleting}>
									{tDanger('cancel')}
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={(e) => {
										e.preventDefault();
										handleDeleteAccount();
									}}
									disabled={isDeleting}
									className="bg-red-600 hover:bg-red-700 text-white"
								>
									{isDeleting ? (
										<Loader2 className="mr-2 size-4 animate-spin" />
									) : (
										tDanger('confirm')
									)}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</div>
	);
};
