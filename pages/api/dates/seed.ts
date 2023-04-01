import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/prisma/client'

export default async function seedDates(req: NextApiRequest, res: NextApiResponse) {
    let array = []
    let timeList = [
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