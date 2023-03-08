import Link from 'next/link'
import '../../app/globals.css'
// import styles from './page.module.css'

import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from "next";

export async function getStaticProps() {
    const response = await prisma.user.findMany({})
    const data = response;
    return {
        props: {
            data,
        },
    }
}

export default function Home({ data }) {
    console.log(data)
    return (
        <main className='py-4 px-48'>
            <Link className='bg-teal-500 text-black font-medium py-2 px-4 rounded-md' href={'/api/get'}>
				Go to the dashboard
			</Link>
            <br></br>
            <ul>
                { data.map((user) => (
                    <li key={user.id} className='list-disc'>
                        <Link href={`/users/${user.id}`}>{ user.username }: { user.email }</Link>    
                    </li>
                )) }
            </ul>
        </main>
    )
}

