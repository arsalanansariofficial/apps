import Header from '@/components/header/header';
import Modal from '@/components/modal/modal';
import Posts from '@/components/posts/posts';

export const metadata = {
  title: 'Project 003',
  description: 'Home page'
};

export function generaterandom(params) {}

export default function Home() {
  return (
    <>
      <Modal />
      <Header />
      <Posts />
    </>
  );
}
