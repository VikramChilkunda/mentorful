import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/prisma/client'

export default async function getAllDates(req: NextApiRequest, res: NextApiResponse) {
    // const {user, session} = JSON.parse(req.body)
    const body = JSON.parse(req.body);
    const user = body[0]
    const session = body[1]
    const mentorShift = body[2]

    const userShift = await prisma.shift.findFirst({
        where: {
            studentId: session.user.id,

        },

    })
        
    
    //user = user that created the shift
    //session.user = user that wishes to get mentored during that shift
    if(mentorShift && !mentorShift.filled) {  
        if(!userShift){
            const updatedShift = await prisma.shift.update({
                where: {
                    id: mentorShift.id
                },
                data: {
                    studentId: session.user.id,
                    filled: true
                }
            })
            // console.log('shift has been updated to add a student:');
            
            // console.log(updatedShift);
            // console.log('end update section');
            res.send(200).send("Succesfully signed up for a 1-on-1 session!")
        }
        else {
            res.status(403).send("You already have a 1-on-1 session for this week!")
        }
    }
    else {
        res.status(403).send("That person has already found a student to mentor during that shift!")
    }
}