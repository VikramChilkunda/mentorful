import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/prisma/client'
const session = await unstable_getServerSession(req, res, authOptions)

export default async function newUser(req: NextApiRequest, res: NextApiResponse) {
	const data = await prisma.user.findMany({});
	res.send(data);
}