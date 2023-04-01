
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
            <div className="grid grid-cols-7 gap-4">
                { data.map((date) => (
                    <div key={ date.id } className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                        <Link href={`/dates/${date.id}`} className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                            3/{date.date}
                        </Link>
                    </div>
                )) }
            </div>
        </main>
    )
}