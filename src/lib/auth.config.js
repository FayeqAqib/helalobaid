export const runtime = "nodejs";

import { User } from "lucide-react";
import Credentials from "next-auth/providers/credentials";
// import { redirect } from "next/navigation"; //Unused import

// import { checkUserAction } from "@/actions/user";
const baseUrl = process.env.NEXTAUTH_URL || `https://helalobaid.mega-byte.info`;
const authConfig = {
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      // ...
      async authorize(credentials) {
        try {
          const res = await fetch(`${baseUrl}/api/checkUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          if (!res.ok) throw new Error("Failed to fetch user");
          const user = await res.json();

          if (user) {
            // Set user data in session
            return user;
          }

          return null;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  session: {
    maxAge: 86400,
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && token.user) {
        session.user = token.user;
      }

      return session;
    },
  },
};

export default authConfig;
