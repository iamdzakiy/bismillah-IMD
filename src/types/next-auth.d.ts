import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    active: boolean;
    role: string;
    institution?: string;
    educationLevel?: string;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      active: boolean;
      role: string;
      institution?: string;
      educationLevel?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string;
    active: boolean;
    role: string;
    institution?: string;
    educationLevel?: string;
  }
}