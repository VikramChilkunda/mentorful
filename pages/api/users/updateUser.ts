import type { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/prisma/client'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

export default async function newUser(req: NextApiRequest, res: NextApiResponse) {
	const body = JSON.parse(req.body)
	const id = body[0], subjects = body[1], personal_meeting_url = body[2], meeting_password = body[3]
	console.log("selected subjects: ", subjects)
	const session = await getServerSession(req, res, authOptions)

	const user = await prisma.user.findUnique({
		where: {
			id
		}
	})

	if(session?.user.id !== id)
		res.status(404).send('You are not authorized to do that!')
	else if(!user?.mentor) res.status(403).send("You cannot do that!")
	else{
		let params = {}
		if(personal_meeting_url) {
			if(meeting_password) {
				params = {
					subjects, personal_meeting_url, meeting_password
				}
			}
			else params = {subjects, personal_meeting_url, meeting_password:null}
		}
		else params = {subjects, personal_meeting_url:null, meeting_password:null}
		const updateUsers = await prisma.user.update({
			where: {
				id
			},
			data: {
				...params
			}
		})
		if(personal_meeting_url) {
			session.user.personal_meeting_url = personal_meeting_url
			if(meeting_password)
				session.user.meeting_password = meeting_password
			console.log("getting here")
		}
		
		res.status(200).send(updateUsers);
	}
}