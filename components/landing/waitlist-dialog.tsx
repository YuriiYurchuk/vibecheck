'use client';

import emailjs from '@emailjs/browser';
import { CheckCircle2, Loader2, Ticket } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function WaitlistDialog() {
	const t = useTranslations('landing.hero.waitlist');
	const [open, setOpen] = useState(false);
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle');

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStatus('loading');

		const form = e.currentTarget;

		try {
			await emailjs.sendForm(
				process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
				process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
				form,
				process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
			);

			setStatus('success');
			form.reset();
		} catch (error) {
			console.error(error);
			setStatus('error');
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="lg"
					className="w-full sm:w-auto h-12 px-8 text-base font-medium rounded-full border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary transition-all min-w-40"
				>
					<Ticket className="mr-2 size-4" />
					{t('triggerButton')}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-106.25 border-border/50 bg-background/95 backdrop-blur-xl">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold flex items-center gap-2">
						{t('title')}
					</DialogTitle>
					<DialogDescription>{t('description')}</DialogDescription>
				</DialogHeader>
				{status === 'success' ? (
					<div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in">
						<div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
							<CheckCircle2 className="size-8 text-green-500" />
						</div>
						<h3 className="text-xl font-bold text-green-500">
							{t('successTitle')}
						</h3>
						<p className="text-muted-foreground mt-2 text-sm">
							{t('successMessage')}
						</p>
						<Button
							onClick={() => {
								setOpen(false);
								setTimeout(() => setStatus('idle'), 300);
							}}
							variant="secondary"
							className="mt-6 w-full"
						>
							{t('closeButton')}
						</Button>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="user_name">{t('form.nameLabel')}</Label>
							<Input
								id="user_name"
								name="user_name"
								placeholder={t('form.namePlaceholder')}
								required
								disabled={status === 'loading'}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="user_email">{t('form.emailLabel')}</Label>
							<Input
								id="user_email"
								name="user_email"
								type="email"
								placeholder={t('form.emailPlaceholder')}
								required
								disabled={status === 'loading'}
							/>
						</div>
						{status === 'error' && (
							<p className="text-red-500 text-sm text-center">
								{t('errorMessage')}
							</p>
						)}
						<Button
							type="submit"
							disabled={status === 'loading'}
							className="w-full mt-2"
						>
							{status === 'loading' ? (
								<Loader2 className="animate-spin size-4" />
							) : (
								t('submitButton')
							)}
						</Button>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
