import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from "next";

export default  async function deleteAllUsers(req: NextApiRequest, res: NextApiResponse) {
    const {secret, id} = JSON.parse(req.body)
       
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })

    if(secret === 'infinitepower'){
        const user = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                mentor: true
            }
        })
        res.send(user)
        
    }
}