import prisma from '@/prisma/client'
import Link from 'next/link'
import { BaseSyntheticEvent } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

export async function getServerSideProps({ params }) {
    const data = await prisma.date.findFirst({
        where: {
            id: parseInt(params.id)
        }
    })
    return {
        props: {
            data
        }
    }
}



export default function Show({ data }) {
    const { data: session } = useSession();
    async function handleClick(e: BaseSyntheticEvent) {
        const time = parseInt(e.target.outerText.substring(0, 2));
        const date = data.date;
        const passedData = {time, date, session}
		const postData = async () => {
			const response = await fetch('/api/dates/getShift', {
				method: "POST",
				body: JSON.stringify(passedData),
			});
			return response.json();
		}
		postData().then((data) => {
			alert('getting here')
		})
    }
    return(
        <>
            <h1> 
                {data.date}
            </h1>
            <div className='grid grid-cols-4 gap-4'>
                {data.times.map((time, index) => (
                    <div key={index} onClick={handleClick} className='bg-teal-500 p-5 rounded-md hover:cursor-pointer'>
                        {time}:00 - {time+1}:00
                    </div>
                ))}
            </div>
        </>
    )
}