'use client';

import LandingPage from './Landing/page';
import { usePathname } from 'next/navigation';
import SignIn from './Signin/page';
import SignUp from './Signup/page';

const Page = () => {
  const pathname = usePathname();

  if (pathname === '/Signin') {
    return <SignInPage />;
  }

  if (pathname === '/Signup') {
    return <SignUpPage />;
  }

  if (pathname === '/pantry') {
    return <PantryPage />;
  }

  return <LandingPage />;
};

export default Page;