
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
    
    // console.log(data)
    // const data = [{}]
    return {
        props: {
            data
        }
    }
}


export default function TestIndex({ data }) {
    console.log("dates: ", data);
    const monthDateObj = new Date()
    monthDateObj.setMonth(data[0].month)
    return (
        <main className='py-4 px-48'>
            <div className="grid grid-cols-7 gap-4">
                { data.map((date) => (
                    <div key={ date.id } className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                        <Link href={`/dates/${date.id}`} className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                            {date.name}
                        </Link>
                    </div>
                )) }
            </div>
        </main>
    )
}