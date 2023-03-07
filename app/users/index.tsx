import Link from 'next/link'
// import styles from './page.module.css'

import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from "next";

export async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// console.log('test') 
	// console.log('getting here getPosts prisma file')
	console.log('data')
	try {
		const data = await prisma.post.findMany()
		// console.log('inside try/catch')
		// console.log('outside')
		return res.json(data)
	} catch(err) {
		return res.status(500).json(err)
	}
} 

async function getPosts() {
	const data = await prisma.post.findMany();
	return data;
}

export default async function Home() {
	const data = await getPosts()
	console.log(data)
	return (
		<main className='py-4 px-48'>
			<Link className='bg-teal-500 text-black font-medium py-2 px-4 rounded-md' href={'/'}>
				Go to the dashboard
			</Link>
            data.map(function(post) {
                console.log('gh')
            })
		</main>
	)
}

