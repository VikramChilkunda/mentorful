import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/prisma/client'
import { getSubjects } from "@/utils/subjects";

export default async function getAllDates(req: NextApiRequest, res: NextApiResponse) {
    // const {user, session} = JSON.parse(req.body)
    const body = req.body;
    const arr = body.split(" ");


    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

    }
    let subjects = getSubjects()
    let potentialMatches = []
    for(var i = 0; i < subjects.length; i++) {
        let temp = subjects[i].toLocaleLowerCase('en-US')
        console.log("checking if ", temp, " includes <", body.toLocaleLowerCase('en-US'), ">")
        if(temp.includes(body.toLocaleLowerCase('en-US')))
            potentialMatches.push(subjects[i])
    }
    console.log("potential matches: ", potentialMatches)
    const str2 = arr.join(" ");
    console.log(str2);
    const shift = await prisma.shift.findMany({
        where: {
            OR: [
                {
                    mentor: {
                        username: {
                            contains: str2,
                        },
                    },
                },
                {
                    mentor: {
                        subjects: {
                            hasSome: potentialMatches
                        }
                    }
                }
            ]
        },
        include: {
            mentor: true,
            date: true
        }
    })

    res.status(200).json(shift);
}