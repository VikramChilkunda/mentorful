import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from "next";

export default  async function deleteAllUsers(req: NextApiRequest, res: NextApiResponse) {
    const {secret, id, link, password} = JSON.parse(req.body)
    console.log("searching by id: ", id)
    const user = await prisma.user.findUnique({
        where: {id}
    })
    if(user && user.mentor) {
        res.status(400).send("You already are a mentor!")
    }
    if(secret === process.env.MENTOR_SECRET){
        let params = {}
        if(link) {
            if(password) {
                params = {
                    mentor: true, personal_meeting_url: link, meeting_password: password
                }
            }
            else params = {mentor: true, link}
        }
        else params = {mentor: true}
        const user = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
               ...params,
            }
        })
        if(user.studentShift) {
            await prisma.shift.delete({
                where: {
                    id: user.studentShift.id
                }
            })
        }

        
        console.log("now a mentor: ", user)
        res.status(200).send(user)   
    }
    else {
        res.status(403).send("Wrong secret key!")
    }
}