import type { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/prisma/client'


export default async function newUser(req: NextApiRequest, res: NextApiResponse) {
	const { username, email, password, id } = JSON.parse(req.body);
	console.log(email)
	const updateUsers = await prisma.user.updateMany({
		where: {
			id: id,
		},
		data: {
			username: username, 
			email: email, 
			password: password
		}
	})
	
	res.status(200).send(updateUsers);
}