import type { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/prisma/client'


export default async function newUser(req: NextApiRequest, res: NextApiResponse) {
    console.log("body: ", req.body)
    const id = JSON.parse(req.body)[0]

    console.log("searching for user with id: ", id)
	
	const foundUser = await prisma.user.findUnique({
		where: {
			id: id
		}
	})
    if(foundUser) {
        res.status(200).send(foundUser);
    }
    else{
        res.status(400).send("Could not find that user")
    }
    
}