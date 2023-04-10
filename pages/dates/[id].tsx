import prisma from '@/prisma/client'
import Link from 'next/link'
import { BaseSyntheticEvent } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { InferGetStaticPropsType } from 'next';
import { toast } from 'react-hot-toast';
import Head from 'next/head';

export async function getServerSideProps({ params }) {
    
    const paramDate = await prisma.date.findFirst({
        where: {
            id: parseInt(params.id)
        },
        include: {
            shifts: {
                include: {
                    mentor: true
                }
            }
        }
    })
    let title = `${paramDate?.name}`
    
    return {
        props: {
            paramDate, title
        }
    }
}


export default function Show({ paramDate }: InferGetStaticPropsType<typeof getServerSideProps>) {  
    const { data: session } = useSession();
    console.log(paramDate)
   if(!paramDate) return <h1>Something Broke</h1>
    async function handleClick(e: BaseSyntheticEvent) { 
        if(session && session.user){
            const time = parseInt(e.target.outerText.substring(0, 2));
            if(!paramDate) return;
            const date = paramDate;
            const passedData = {time, date, session}
            const postData = async () => {
                const response = await fetch('/api/dates/getShift', {
                    method: "POST",
                    body: JSON.stringify(passedData),
                });
                if(response.status === 401) {
                    toast.error("You need to be a mentor to do that!")
                }
                else if(response.status === 403) {
                    toast.error("You may only sign up for 1 shift per week!")
                }
                else if(response.status === 201){
                    location.reload()
                    toast.success("Succesfully signed up for that shift!")
                }
            }
            postData()
        }
        else{
            alert('Need to be signed in')
        }
    }
    function addTime(time: number) {
        const shifts = paramDate.shifts
        for(let i = 0; paramDate  && i < paramDate.times.length; i++){ 
            const i = shifts.findIndex(e => e.from === time);
            if (i > -1) {
                return <>
                    <span className='text-black'>
                        {time}:00 - {time+1}:00
                    </span>
                    <div className='text-sm'>
                        <img referrerPolicy="no-referrer" src={`${shifts[i].mentor?.image}`} className='inline mr-2 relative max-w-[7%] rounded-xl' alt="" />
                        <span className='text-black'>{`${shifts[i].mentor?.username}`}</span>
                    </div>
                </>
            }  
        }
        return <span className='text-black'>{time}:00 - {time+1}:00</span>
    }
    
    return(
        <>
            <Head>
                <title>{paramDate.name}</title>
            </Head>
            <div className='bg-main bg-cover h-screen'>
                <div className='grid place-items-center gap-y-20 min-h-full bg-black/40'>
                    <div className=' grid px-10 py-10 gap-y-20 place-items-center'>
                        <h1 className='text-6xl text-white font-extrabold mt-10'> 
                            {paramDate.name.substring(0, paramDate.name.length-2)}
                        </h1>
                        <div className='flex justify-center items-center h-screen"'>
                            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5'>
                                {paramDate.times.map((time, index) => (
                                    <div key={index} onClick={handleClick} className='bg-teal-500 p-5 rounded-md hover:cursor-pointer hover:scale-110 transition ease-in-out '>
                                            {addTime(time)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    
}