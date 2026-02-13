import { cookies } from 'next/headers';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { AppSidebar } from '@/components/layout/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function DemoDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar
				basePath="/demo"
				demoUser={{
					name: 'Demo User',
					email: 'demo@vibecheck.app',
				}}
			/>
			<SidebarInset>
				<DashboardHeader />
				<div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
