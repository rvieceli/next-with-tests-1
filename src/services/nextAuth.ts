import {
  signIn as NextAuthSignIn,
  signOut,
  useSession,
  getSession,
} from "next-auth/react";

const signIn = () => NextAuthSignIn("github");

export { useSession, signIn, signOut, getSession };
