import './header.scss';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      <header>
        <nav className="hr-nav py-3">
          <div className="mx-auto d-flex justify-content-between align-items-center gap-1 container">
            <Link href="/" className="text-center">
              Project 003
            </Link>
            <Link href="#" className="hr-navigation-button">
              Posts
            </Link>
            <Link href="#">
              <i className="fa fa-github"></i>
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
