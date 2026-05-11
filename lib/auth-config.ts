
import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import * as bcryptjs from 'bcryptjs';
import { prisma } from './db';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('[AUTH] Attempt:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.error('[AUTH] Error: Missing email or password');
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase()
            }
          });

          if (!user) {
            console.error('[AUTH] Error: User not found:', credentials.email);
            return null;
          }

          console.log('[AUTH] User found:', user.email, '| Role:', user.role);

          // For the test account, we check directly without hashing
          if (credentials.email === 'john@doe.com' && credentials.password === 'johndoe123') {
            console.log('[AUTH] Success: Test account john@doe.com');
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }

          // Check if email is verified
          if (!user.emailVerified) {
            console.error('[AUTH] Failure: Email not verified for:', user.email);
            // Throwing a specific error that NextAuth can pass to the client
            throw new Error('EmailNotVerified');
          }

          // For other users, check hashed password
          const isValid = await bcryptjs.compare(credentials.password, user.password || '');
          console.log('[AUTH] Password check for', user.email, ':', isValid ? 'PASSED' : 'FAILED');

          if (!isValid) {
            console.error('[AUTH] Failure: Invalid password for:', user.email);
            throw new Error('InvalidPassword');
          }

          console.log('[AUTH] Success:', user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('[AUTH] Critical Error during authorize:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role;
      }
      if (account?.provider === 'google') {
        // For Google OAuth users, fetch role from database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub!;
        (session.user as any).role = token.role || 'STUDENT';
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Set default role for new Google OAuth users
      if (isNewUser && account?.provider === 'google') {
        await prisma.user.update({
          where: { email: user.email! },
          data: { role: 'STUDENT' },
        });
      }
    },
  },
};
