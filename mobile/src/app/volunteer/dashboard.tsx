import RoleDashboardShell from '@/components/shared/RoleDashboardShell';
import { mockRoleDashboards } from '@/data/mockRoleDashboards';

export default function VolunteerDashboard() {
  return <RoleDashboardShell data={mockRoleDashboards.volunteer} />;
}
