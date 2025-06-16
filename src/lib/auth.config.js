export const runtime = "nodejs";

import Credentials from "next-auth/providers/credentials";
// import { redirect } from "next/navigation"; //Unused import

// import { checkUserAction } from "@/actions/user";

const authConfig = {
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      // ...
      async authorize(credentials) {
        try {
          const protocol =
            process.env.NODE_ENV === "production" ? "https" : "http";
          const baseUrl = process.env.NEXTAUTH_URL || `http://localhost:3000`;
          const res = await fetch(`${protocol}://${baseUrl}/api/checkUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          if (!res.ok) throw new Error("Failed to fetch user");
          const user = await res.json();

          if (user) {
            // Set user data in session
            return {
              id: user.id,
              username: user.username,
              role: user.role, // Include the user role
              // Add other user properties as needed
            };
          }

          return null;
        } catch (err) {
          return null;
        }
      },
    }),
  ],

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
