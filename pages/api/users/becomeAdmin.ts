import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from "next";

export default  async function deleteAllUsers(req: NextApiRequest, res: NextApiResponse) {
    const {secret, id} = JSON.parse(req.body)
    console.log("searching by id: ", id)
    const user = await prisma.user.findUnique({
        where: {id}
    })
    if(user && user.admin) {
        res.status(400).send("You already are an administrator!")
    }
    if(secret === process.env.ADMIN_SECRET){       
        const user = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
               admin: true
            }
        })
        res.status(200).send(user)   
    }
    else {
        res.status(403).send("Wrong secret key!")
    }
}