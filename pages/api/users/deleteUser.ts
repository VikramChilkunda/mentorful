import type { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/prisma/client'


export default async function newUser(req: NextApiRequest, res: NextApiResponse) {
	const id = JSON.parse(req.body).id

	
	const deleteUser = await prisma.user.delete({
		where: {
			id: id,
		}
	})
	
	res.status(200).send(deleteUser);
}