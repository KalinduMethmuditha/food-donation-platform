import RoleDashboardShell from '@/components/shared/RoleDashboardShell';
import { mockRoleDashboards } from '@/data/mockRoleDashboards';

export default function HouseholdDashboard() {
  return <RoleDashboardShell data={mockRoleDashboards.household} />;
}
