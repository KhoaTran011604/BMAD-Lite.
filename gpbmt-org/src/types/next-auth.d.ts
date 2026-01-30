import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    roleName: string;
    permissions: string[];
    parish?: string;
    parishName?: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    roleName: string;
    permissions: string[];
    parish?: string;
    parishName?: string;
  }
}
