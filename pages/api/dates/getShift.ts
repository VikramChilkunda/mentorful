import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/prisma/client'

export default async function getAllDates(req: NextApiRequest, res: NextApiResponse) {
	const {time, date, session} = JSON.parse(req.body)
    
    const foundShift = await prisma.shift.findFirst({
        where: {
            from: time,
            date: date
        }
    })
    if(foundShift){
        res.send(foundShift)
    }
    else {
        const getUser = await prisma.user.update({
            where: {
                email: session.user.email
            },
            data: {
                shift: {
                    create: {
                        from: time,
                        to: time+1,
                        date: date,
                    }
                }
            }
        })
        
        res.send(getUser)
    }
}