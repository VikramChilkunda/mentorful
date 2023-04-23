
import prisma from '@/prisma/client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import generate from '@/utils/generateDates'

export async function getServerSideProps() {
    // alert('test')
    

    let data = await prisma.date.findMany({})
    if(!data[0] || Math.abs(data[0].lastUpdated - new Date().getDate()) >= 5 || data.length > 7) {
        const date = new Date()
        const deletedShifts = await prisma.shift.deleteMany({})
        const deletedDates = await prisma.date.deleteMany({})

        const results = generate(date.getDay(), date)
        const currDates = await prisma.date.findMany({})
        console.log("dates before update: ", currDates)
        console.log("outputted from method: ", results)
        let dates = []
        for(const result of results) {
            const addDate = await prisma.date.create({
                data: {
                    date: result.date,
                    name: result.name,
                    lastUpdated: date.getDate(),
                    times: [
                        8,9,10,11,12,13,14,15,16,17,18,19,20
                    ],
                    month: result.month
                }
            })
            dates.push(addDate)
        }
        console.log("array pushed: ", dates)
        data = await prisma.date.findMany({})    
    }
    
    let title = "Calendar"
    return {
        props: {
            data, title
        }
    }
}


export default function TestIndex({ data }) {
    const monthDateObj = new Date()
    monthDateObj.setMonth(data[0].month)
    return (
        <main className='bg-main h-screen bg-cover'>
            <div className='bg-black/40 h-full pt-10'>
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