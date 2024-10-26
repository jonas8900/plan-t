import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
          }
      })

  ],

    callbacks: {
      async jwt({ token, account, user }) {
        if (account && user) {
          token.id = user.id; 
        }
        return token;
      },
      async session({ session, token }) {
        session.user.id = token.id;
        return session;
      }
    },
    pages: {
      signIn: "/profile", 
    },
  

}

export default NextAuth(authOptions)