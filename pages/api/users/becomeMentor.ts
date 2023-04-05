import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from "next";

export default  async function deleteAllUsers(req: NextApiRequest, res: NextApiResponse) {
    const {secret, id} = JSON.parse(req.body)
       
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })
    if(user && user.mentor) {
        res.status(400).send("You already are a mentor!")
    }
    if(secret === process.env.MENTOR_SECRET){
        const user = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                mentor: true
            }
        })
        
        res.status(200).send(user)   
    }
    else {
        res.status(403).send("Wrong secret key!")
    }
}