import { JWT } from "next-auth/jwt"
import NextAuth, { DefaultSession } from "next-auth"
import { User } from "@prisma/client"

declare module "next-auth/jwt" {
	interface JWT {
		user: User
	}
}
declare module "next-auth" {

	interface Session {
	  user: User
	}
  }