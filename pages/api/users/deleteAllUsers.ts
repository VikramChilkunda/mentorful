import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from "next";

export default  async function deleteAllUsers(req: NextApiRequest, res: NextApiResponse) {
    const data = await prisma.user.deleteMany({})
    res.send(data)
}