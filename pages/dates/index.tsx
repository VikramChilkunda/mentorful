
import prisma from '@/prisma/client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
export async function getStaticProps() {
    // alert('test')
    let data = await prisma.date.findMany({})
    console.log(data)
    if(!data || Math.abs(data[0].lastUpdated - new Date().getDate()) >= 5) {
        await fetch('/api/generateDates', {
            method: "GET"
        })
    }
    data = await prisma.date.findMany({})    
    
    let title = "Calendar"
    return {
        props: {
            data, title
        }
    }
}


export default function TestIndex({ data }) {
    console.log("dates: ", data);
    const monthDateObj = new Date()
    monthDateObj.setMonth(data[0].month)
    return (
        <main className='bg-main h-screen bg-cover'>
            <div className='bg-black/40 h-screen pt-10'>
                <div className="w-[90%] grid grid-cols-2 md:grid-cols-7 gap-4 content-center m-auto">
                    { data.map((date) => (
                        <div key={ date.id } className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                            <Link href={`/dates/${date.id}`} className="bg-white/50 block max-w-sm p-6 border border-gray-200 rounded-lg shadow text-center">
                                {date.name}
                            </Link>
                        </div>
                    )) }
                </div>
            </div>
        </main>
    )
}