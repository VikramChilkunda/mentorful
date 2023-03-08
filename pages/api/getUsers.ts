import type { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/prisma/client'

export default async function newUser(req: NextApiRequest, res: NextApiResponse) {
	const data = await prisma.user.findMany({});
	res.send(data);
}