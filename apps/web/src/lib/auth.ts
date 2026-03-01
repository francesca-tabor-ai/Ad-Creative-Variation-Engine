// Auth.js v5 configuration stub
// TODO: Configure providers (credentials, OAuth, SSO) in Phase 4

import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
  pages: {
    signIn: "/login",
  },
};
