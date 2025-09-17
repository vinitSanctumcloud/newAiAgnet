// app/lib/authOptions.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import mongoose from 'mongoose';
import connectDB from '../api/db';

interface User {
  _id: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model<User>('User', userSchema);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          return null;
        }
        return { id: user._id.toString(), email: user.email };
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      // user is of type `User` from authorize() return, so you can safely cast it
      token.id = (user as { id: string }).id;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user && token.id) {
      // session.user doesn't have `id` by default, so extend it with casting
      session.user = {
        ...session.user,
        id: token.id as string,
      };
    }
    return session;
  },
},

  secret: process.env.NEXTAUTH_SECRET,
};
