import Home from '@/components/home';
import { loginAdmin } from '@/lib/actions';
import processEnv from '../../../../next-env';

export const metadata = {
  title: 'Project 007',
  description: 'created by Arsalan Ansari'
};

export default function HomePage() {
  return (
    <Home
      loginAdmin={loginAdmin}
      sessionTime={Number(processEnv.SESSION_TIME)}
    />
  );
}
