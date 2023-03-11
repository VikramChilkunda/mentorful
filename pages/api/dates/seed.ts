import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/prisma/client'

export default async function seedDates(req: NextApiRequest, res: NextApiResponse) {
    let array = []
    let timeList = [
        // {time: 8},
        // {time: 9},
        // {time: 10},
        // {time: 11},
        // {time: 12},
        // {time: 13},
        // {time: 14},
        // {time: 15},
        // {time: 16},
        // {time: 17},
        // {time: 18},
        // {time: 19},
        // {time: 20},
        8,9,10,11,12,13,14,15,16,17,18,19,20
        
    ]
    for(let i = 1; i < 15; i++){
        array.push({id: i, date: i, times: timeList})
    }
    await prisma.date.deleteMany({})
	const data = await prisma.date.createMany({
        data: array
    });
	res.send(data);
}