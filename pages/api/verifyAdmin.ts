import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/prisma/client'

export default async function verifyAdmin(req: NextApiRequest, res: NextApiResponse) {
	res.send(req.body);
}