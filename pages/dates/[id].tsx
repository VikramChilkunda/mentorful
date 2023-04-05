import prisma from '@/prisma/client'
import Link from 'next/link'
import { BaseSyntheticEvent } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { InferGetStaticPropsType } from 'next';
import { toast } from 'react-hot-toast';

export async function getServerSideProps({ params }) {
    
    const data = await prisma.date.findFirst({
        where: {
            id: parseInt(params.id)
        }
    })
    
    // const times = []
    if(!data){
        return {
            props: {
                data, times: []
            }
        }
    }
    const times = await prisma.shift.findMany({
        where: {
            dateId: data.id 
        },
        include: {
            //only need to include mentors since this page is meant for mentors to sign up
            mentor: true
        }
    })


    return {
        props: {
            data, times
        }
    }
}


export default function Show({ data, times }: InferGetStaticPropsType<typeof getServerSideProps>) {  
    const { data: session } = useSession();
   
    async function handleClick(e: BaseSyntheticEvent) { 
        if(session && session.user){
            const time = parseInt(e.target.outerText.substring(0, 2));
            if(!data) return;
            const date = data.date;
            // console.log("data.date in [id]", date)
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
                else{
                    return response.json();
                }
            }
            postData()
        }
        else{
            alert('Need to be signed in')
        }
    }
    function addTime(time: number) {
        
        for(let i = 0; i < times.length; i++){            
            
            if(time === times[i].from) {
                return <>
                    <span className='text-black'>
                        {time}:00 - {time+1}:00
                    </span>
                    <div className='text-sm'>
                        <img referrerPolicy="no-referrer" src={`${times[i].mentor?.image}`} className='inline mr-2 relative max-w-[7%] rounded-xl' alt="" />
                        <span className='text-black'>{`${times[i].mentor?.username}`}</span>
                    </div>
                </>
            }
        }
        return <span className='text-black'>{time}:00 - {time+1}:00</span>
    }
    // console.log(data)
    if(!data) {
        return <h1>Something Broke!</h1>
    }
    
    console.log(data)
    return(
        
        <div className='grid place-items-center gap-y-20 bg-main h-screen bg-cover'>
            <div className='bg-white/10 grid px-10 py-10 gap-y-20 place-items-center'>
                <h1 className='flex items-center text-5xl font-extrabold mt-10'> 
                    {data.name.substring(0, data.name.length-2)}
                </h1>
                <div className='flex justify-center items-center h-screen"'>
                    <div className='grid grid-cols-6 gap-5 max-w-[75%] '>
                        {data.times.map((time, index) => (
                            <div key={index} onClick={handleClick} className='bg-teal-500 p-5 rounded-md hover:cursor-pointer hover:scale-110 transition ease-in-out '>
                                <div>
                                    {addTime(time)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
    
}