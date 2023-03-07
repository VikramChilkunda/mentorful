import type { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/prisma/client'
// export default function handler(req, res) {
// 	res.status(200).json({ name: 'John Doe' })
//   }

export default async function newUser(req: NextApiRequest, res: NextApiResponse) {
	const { username, email, password } = JSON.parse(req.body);
	const data = await prisma.user.create({
		data: {
			username: username, 
			email: email, 
			password: password
		}
	});
	res.send(data);
}