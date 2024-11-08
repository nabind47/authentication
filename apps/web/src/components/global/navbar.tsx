import Link from "next/link";

import { getSession } from "@/lib/sessions";

const Navbar = async () => {
  const session = await getSession();

  return (
    <div>
      {session && session?.user ? (
        <>
          <h1>Welcome, {session.user.name}</h1>
          <Link href="/dashboard">Dashboard</Link>
          <br />
          <Link href="/profile">Profile</Link>
          <br />
          <Link href="/api/auth/signout">Sign Out</Link>
        </>
      ) : (
        <Link href="/auth/signin">Sign In</Link>
      )}
    </div>
  );
};

export default Navbar;
