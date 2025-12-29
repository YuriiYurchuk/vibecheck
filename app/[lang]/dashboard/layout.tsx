import { BackgroundSyncer } from '@/components/dashboard/background-syncer';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen overflow-hidden">
			<Sidebar />
			<div className="flex-1 flex flex-col overflow-hidden relative">
				<BackgroundSyncer />
				<DashboardHeader />
				<main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
			</div>
		</div>
	);
}
