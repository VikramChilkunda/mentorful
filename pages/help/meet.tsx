import Link from 'next/link'

import prisma from '@/prisma/client'
import { BaseSyntheticEvent, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import ZoomMtgEmbedded from "@zoomus/websdk/embedded"




export default  function Home() {
    async function handleSubmit() {        
        const response = await fetch('/api/zoom/getUsers');
        console.log(await response.json());
    }
    return (
        <button onClick={handleSubmit} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Create Meeting</button>
    )
    
}

