import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { RateLimiterMemory } from "rate-limiter-flexible";

import dbConnect from "@/db/connect";
import User from "@/db/models/User";

const rateLimiter = new RateLimiterMemory({
  points: 5,          
  duration: 60 * 5,   
});

export const authOptions = {
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email", placeholder: "your@email.com" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials, req) {
            const forwarded = req.headers["x-forwarded-for"];
            const ip = Array.isArray(forwarded)
              ? forwarded[0]
              : (forwarded || req.socket?.remoteAddress || "unknown_ip");

            if (!credentials) {
              throw new Error("Bitte gib deine Anmeldedaten ein.");
            }

            let { email, password } = credentials;

            if (!email || !password) {
              throw new Error("Bitte gib sowohl E-Mail als auch Passwort ein.");
            }

            email = email.trim().toLowerCase();

            try {
              await rateLimiter.consume(ip);
            } catch (rateLimiterRes) {
              throw new Error(
                "Zu viele Anfragen von deiner IP-Adresse. Bitte versuche es in 5 Minuten erneut."
              );
            }

            await dbConnect();

            const user = await User.findOne({ email });
            if (!user) {
              throw new Error("E-Mail oder Passwort ist falsch.");
            }

            const isValid = await user.comparePassword(password);
            if (!isValid) {
              throw new Error("E-Mail oder Passwort ist falsch.");
            }

            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              username: user.username,
            };
          },
        }),

        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code",
            },
          },
        }),
    ],

    callbacks: {
        async jwt({ token, account, user }) {
          if (account && user) {
            token.id = user.id;
            token.email = user.email;
            token.name = user.name;
            token.username = user.username;
          }
          return token;
        },

        async session({ session, token }) {
          session.user = session.user || {};
          session.user.id = token.id;
          session.user.email = token.email;
          session.user.name = token.name;
          session.user.username = token.username;
          return session;
        },

        async signIn({ user, account, profile, email, credentials }) {
          if (!account || account.provider !== "google") {
            return true;
          }
          await dbConnect();
          let userEmail =
            user?.email ||
            profile?.email ||
            (typeof email === "string" ? email : email?.email) ||
            "";

          userEmail = userEmail.trim().toLowerCase();

          if (!userEmail) {
            return false;
          }

          const baseUsername = (user?.name || profile?.name || userEmail.split("@")[0] || "user")
            .toLowerCase()
            .replace(/\s+/g, "_");

          const existingUser = await User.findOne({ email: userEmail });

          if (!existingUser) {
            const newUser = new User({
              email: userEmail,
              name: user?.name || profile?.name || "Google User",
              username: baseUsername,
              provider: "google",
            });

            await newUser.save();

            user.id = newUser._id.toString();
            user.username = newUser.username;
            user.name = newUser.name;
            user.email = newUser.email;
          } else {
            let needsUpdate = false;

            if (!existingUser.name && (user?.name || profile?.name)) {
              existingUser.name = user?.name || profile?.name;
              needsUpdate = true;
            }

            if (existingUser.provider !== "google") {
              existingUser.provider = "google";
              needsUpdate = true;
            }

            if (needsUpdate) {
              await existingUser.save();
            }

            user.id = existingUser._id.toString();
            user.username = existingUser.username;
            user.name = existingUser.name;
            user.email = existingUser.email;
          }

          return true;
      }

    },

    pages: {
      signIn: "/profile",
    },

    session: {
      strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
      encryption: true,
    },
};

export default NextAuth(authOptions);
