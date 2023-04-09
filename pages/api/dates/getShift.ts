import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/prisma/client'

export default async function getAllDates(req: NextApiRequest, res: NextApiResponse) {
	const {time, date, session} = JSON.parse(req.body)
    
    //check if a shift already exists at this exact time, and if it does, prevent another from being created at this time
    const foundShift = await prisma.shift.findFirst({
        where: {
            from: time,
            student: null,
            dateId: date.id
        }
    })
    // console.log("shift was found: ", foundShift)
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
        //if the user already has a shift, don't allow them to create another
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
                            dateId: date.id
                        }
                    }
                }
            })
            // console.log("updated user: ", getUser)
            // const updatedUser = await prisma.user.findUnique({
            //     where: {
            //         id: session.user.id
            //     },
            //     include: {
            //         mentorShift: true
            //     }
            // })
            // const foundDate = await prisma.date.findUnique({
            //     where: {
            //         id: date.id
            //     }, 
            //     include: {
            //         shifts: true
            //     }
            // })
            // if(updatedUser && updatedUser.mentorShift)
            //     foundDate?.shifts.push(updatedUser.mentorShift)
            // if(foundDate && foundDate.shifts) {
            //     const modifiedDate = await prisma.date.update({
            //         where: {
            //             id: date.id
            //         },
            //         data: {
            //             shifts: foundDate.shifts
            //         }
            //     })
            //     console.log("the date that was modified was: ", modifiedDate)
            // }
            return res.status(201).send('succesfully created!')
        }
        else {
            res.status(401).send("You are not authorized to do that!")
        }
    }
}