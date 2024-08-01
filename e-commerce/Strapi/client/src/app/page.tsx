import Header from '@/components/header-admin';

export default function HomePage() {
  return (
    <main>
      <h1>Home Page</h1>
      <Header user={null} handleLogout={() => {}} />
    </main>
  );
}
