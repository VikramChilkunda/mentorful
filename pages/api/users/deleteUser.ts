import type { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/prisma/client'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"


export default async function newUser(req: NextApiRequest, res: NextApiResponse) {
	const id = JSON.parse(req.body).id

	
	const session = await getServerSession(req, res, authOptions)
	if(session?.user.id !== id)
		res.status(404).send("You are not authorized to do that!")
	const deleteUser = await prisma.user.delete({
		where: {
			id: id,
		}
	})
	
	res.status(200).send(deleteUser);
}