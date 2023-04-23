import type { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/prisma/client'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

export default async function newUser(req: NextApiRequest, res: NextApiResponse) {
	const body = JSON.parse(req.body)

    const newReport = await prisma.bugReport.create({
        data: {
            text: body
        }
    })
    res.status(200).send(newReport)
	
}