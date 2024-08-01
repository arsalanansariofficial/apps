import { getSales } from '@/lib/actions';
import processEnv from '../../../../next-env';
import Dashboard from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <Dashboard
      getSales={getSales}
      sessionTime={Number(processEnv.SESSION_TIME)}
    />
  );
}
