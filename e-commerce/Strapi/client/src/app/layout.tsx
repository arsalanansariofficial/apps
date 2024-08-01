import './main.css';
import { ReactNode } from 'react';

export type App_Children = { children: ReactNode };

export default function RootLayout({ children }: App_Children) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
