// src/types/next-auth.d.ts
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    active: boolean;
    role: string;
    institution?: string | null;
    educationLevel?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      active: boolean;
      role: string;
      institution?: string | null;
      educationLevel?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string;
    active: boolean;
    role: string;
    institution?: string | null;
    educationLevel?: string | null;
  }
}