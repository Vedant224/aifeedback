import  "next-auth";
import  "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
    token?: string;
  }

  interface Session {
    accessToken?: string;
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
  }
}