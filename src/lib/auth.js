import NextAuth from "next-auth";

// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import clientPromise from "./simpleDB";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
});
