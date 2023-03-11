
import prisma from '@/prisma/client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
export async function getStaticProps() {
    const data = await prisma.date.findMany({})
    // const data = [{}]
    return {
        props: {
            data
        }
    }
}


export default function TestIndex({ data }) {
     // console.log(data);
    return (
        <main className='py-4 px-48'>
            { data.map((date) => (
                <h5 key={ date.id } className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <Link href={`/dates/${date.id}`} className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        {date.date}
                    </Link>
                </h5>
            )) }
        </main>
    )
}