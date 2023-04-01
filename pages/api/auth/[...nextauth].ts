import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import prisma from '@/prisma/client'
import type { NextAuthOptions } from 'next-auth'
import ZoomProvider from "next-auth/providers/zoom"
import { log } from "console";

export const authOptions: NextAuthOptions = {
     // Configure one or more authentication providers
     providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        ZoomProvider({
            clientId: process.env.ZOOM_CLIENT_ID,
            clientSecret: process.env.ZOOM_CLIENT_SECRET
          })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // console.log(account)
            // console.log(profile)
            if(account.provider === 'google'){
                const data = await prisma.user.findUnique({
                    where: {
                        id: user.id
                    }
                })
                if(data){
                    console.log('existing user: ');
                    console.log(data);
                    return true;
                } else {
                    const data = await prisma.user.create({
                        data: {
                            username: user.name,
                            id: user.id,
                            email: user.email,
                            image: user.image,
                            mentor: false,
                            admin: false
                        }
                    })     
                    console.log('creating new user here:');           
                    return true;
                }
            }
            else if (account.provider === 'zoom') {
                console.log(user);
                console.log(account);
                console.log(profile);
                const data = await prisma.user.update({
                    where: {
                        email: profile.email
                    }, 
                    data: {
                        personal_meeting_url: profile.personal_meeting_url
                    }
                })
                
                
                
                return true;
            }
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            // console.log(token);
            session.user.id = token.sub
            
            
            return session
        },
        async jwt({ token, account, profile }) {
            return token
        }
        // async zoom() {

        // }
    }
}

export default NextAuth(authOptions)
