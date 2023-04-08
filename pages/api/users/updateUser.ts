import type { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/prisma/client'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

export default async function newUser(req: NextApiRequest, res: NextApiResponse) {
	const body = JSON.parse(req.body)
	const id = body[0], subjects = body[1]
	const session = await getServerSession(req, res, authOptions)

	const user = await prisma.user.findUnique({
		where: {
			id
		}
	})

	if(session?.user.id !== id)
		res.status(404).send('You are not authorized to do that!')
	if(subjects.length === 0 || subjects.length > 3)
		res.status(400).send("Choose a valid amount of subjects!")
	else if(!user?.mentor) res.status(403).send("You cannot do that!")
	const updateUsers = await prisma.user.update({
		where: {
			id
		},
		data: {
			subjects
		}
	})
	
	res.status(200).send(updateUsers);
}