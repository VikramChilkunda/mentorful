import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/prisma/client'

export default async function getAllDates(req: NextApiRequest, res: NextApiResponse) {
    // const {user, session} = JSON.parse(req.body)
    const body = req.body;

    console.log("searchng by subject: ", body)
    const shift = await prisma.shift.findMany({
        where: {
            mentor: {
                OR: {
                    username: body,
                    subjects: {
                        has: body
                    }
                }
            },
        }
    })
    res.json(shift);
}