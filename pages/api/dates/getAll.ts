import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/prisma/client'

export default async function getAllDates(req: NextApiRequest, res: NextApiResponse) {
	const data = await prisma.date.findMany({});
	res.send(data);
}