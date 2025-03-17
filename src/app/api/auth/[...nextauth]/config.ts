import db from "@/lib/db";
import { compareSync } from "bcryptjs";
import { getServerSession, User } from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  export interface Session extends DefaultSession {
    user: User;
  }

  export interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    id: string;
  }
}

const options: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        username: {
          label: "Username",
        },
        password: {
          label: "Password",
        },
      },
      async authorize(credentials, req) {
        const user = await db.user.findFirst({
          where: {
            username: credentials!.username,
          },
        });

        if (!user) {
          return null;
        }

        if (compareSync(credentials!.password, user.password)) {
          return {
            id: user.username,
          };
        }

        return null;
      },
    }),
  ],
};

export async function getSession(): Promise<User | null> {
  const session = await getServerSession(options);
  return (session?.user as User) ?? null;
}

export default options;
