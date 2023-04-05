import NextAuth, { Account, User } from "next-auth"
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import prisma from '@/prisma/client'
import type { NextAuthOptions } from 'next-auth'
import ZoomProvider, { ZoomProfile } from "next-auth/providers/zoom"
import { log } from "console";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
     // Configure one or more authentication providers
     providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        ZoomProvider({
            clientId: process.env.ZOOM_CLIENT_ID!,
            clientSecret: process.env.ZOOM_CLIENT_SECRET!
          })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile}: {user: User | AdapterUser, account: Account | null, profile?: ZoomProfile | GoogleProfile}) {
            if(!user.name || !user.email || !user.image || !account)
                return false;
            return true;
        },
        async jwt({ token, account, profile }: {token: JWT, account: Account | null, profile?: ZoomProfile | GoogleProfile}) {
            if(!profile) {
                return token;
            }
            const newData = {
                username: profile.name ?? profile.display_name,
                email: profile.email,
                image: profile.image,
                mentor: false,
                admin: false,
                personal_meeting_url: account?.provider === "zoom" && profile ? profile.personal_meeting_url : undefined
            }
            const user = await prisma.user.upsert({
                where: {
                    email: profile.email
                },
                update: newData,
                create: newData
                
            })
            return {user}
        },
        async session({ session, token, user }) {
            
            session.user = token.user
            console.log("Session", session.user)
            
            return session
        },
    },
    pages: {
        signIn: '/auth/signin',
    }
}

export default NextAuth(authOptions)
