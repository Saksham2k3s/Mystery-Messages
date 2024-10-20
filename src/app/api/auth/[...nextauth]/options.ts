import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConntect";
import UserModal from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModal.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("Not User found with this email!");
          }

          if (!user.isVerified) {
            // Customize the error message to include the username
            const errorMessage = `Please verify your account first, ${user.username}.`;
            throw new Error(errorMessage);
          }

          const comparePassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (comparePassword) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id?.toString();
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessages;
        session.user.username = token.username;
        session.user.messages = token.messages;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
