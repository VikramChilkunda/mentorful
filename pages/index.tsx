import Link from 'next/link'
import '../app/globals.css'
import { useSession, signIn, signOut } from "next-auth/react";
// import styles from './page.module.css'

import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from "next";

export default function Home() {
    const { data: session } = useSession();
    return (
        <main className='py-4 px-48'>
            <Link className='bg-teal-500 text-black font-medium py-2 px-4 rounded-md' href={'/api/get'}>
				Go to the dashboard
			</Link>
            {!session ? (
                <>
                <p>Not signed in</p>
                <br />
                <button onClick={() => signIn()}>Sign in</button>
                </>
            ) : (
                <div>
                    <h4>Signed in as {session.user.name}</h4>
                    <button onClick={() => signOut()}>Sign out</button>
                </div>
            )}
        </main>
        
    )
}

