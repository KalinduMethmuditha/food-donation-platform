import RoleDashboardShell from '@/components/shared/RoleDashboardShell';
import { mockRoleDashboards } from '@/data/mockRoleDashboards';

export default function NgoDashboard() {
  return <RoleDashboardShell data={mockRoleDashboards.ngo} />;
}
