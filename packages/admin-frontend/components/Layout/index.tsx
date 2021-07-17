import React from 'react';
import { useRouter } from 'next/router';

import Header from './Header';
import Sidebar from './Sidebar';

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const router = useRouter();

  const showLayout: boolean = ![
    '/login',
    '/signup',
    '/_error',
    '/forgot-password',
    '/setup',
    '/',
  ].includes(router.pathname);

  return (
    <div className="flex justify-between w-full">
      {showLayout && <Sidebar />}
      <div className={`h-full w-full ${showLayout ? 'main-content' : ''}`}>
        {showLayout && <Header />}
        {children}
      </div>
    </div>
  );
};

export default Layout;
