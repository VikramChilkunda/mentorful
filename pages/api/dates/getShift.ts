import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/prisma/client'

export default async function getAllDates(req: NextApiRequest, res: NextApiResponse) {
	const {time, date, session} = JSON.parse(req.body)
    
    //if a shift exists that doesn't have a student, it must be a mentor shift
    const foundShift = await prisma.shift.findFirst({
        where: {
            from: time,
            date: {
                date: 2
            },
            student: null
        }
    })
    if(foundShift){
        res.send(foundShift)
    }
    else {
        const currUser = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            include: {
                mentorShift: true
            }
        })
        if(currUser && currUser.mentorShift) {
            res.status(403).send(currUser)
        }
        else if(currUser?.mentor){   
            const getUser = await prisma.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    mentorShift: {
                        create: {
                            from: time,
                            to: time+1,
                            date: date,
                        }
                    }
                }
            })
            return res.status(201).send('succesfully created!')
        }
        else {
            res.status(401).send("You are not authorized to do that!")
        }
    }
}