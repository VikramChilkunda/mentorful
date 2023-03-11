import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import prisma from '@/prisma/client'


export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            const data = await prisma.user.findUnique({
                where: {
                    id: user.id
                }
            })
            if(data){
                console.log('existing user: ');
                return true;
            } else {
                const data = await prisma.user.create({
                    data: {
                        username: user.name,
                        id: user.id,
                        email: user.email
                    }
                })     
                console.log('creating new user here:');           
                return true;
            }
        }
    }
})
