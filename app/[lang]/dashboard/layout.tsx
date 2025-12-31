import { BackgroundSyncer } from '@/components/dashboard/background-syncer';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { AppSidebar } from '@/components/layout/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<BackgroundSyncer />
				<DashboardHeader />
				<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
