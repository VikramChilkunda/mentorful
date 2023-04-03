import prisma from '@/prisma/client'
import Link from 'next/link'
import { BaseSyntheticEvent } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

export async function getStaticProps({ params }) {
    console.log('getting here to the static props method');
    
    const data = await prisma.date.findFirst({
        where: {
            id: parseInt(params.id)
        }
    })
    const times = await prisma.shift.findMany({
        where: {
            date: data!.date
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
export async function getStaticPaths() {
    var paths = []
    // for(var i = 0; i < 31; i++) {
    //     paths[i] = {
    //         params: {
    //             id: i.toString()
    //         }
    //     }
    // }
    return {
        paths: paths,
        fallback: false, // can also be true or 'blocking'
      }
}


export default function Show({ data, times }) {  
    const { data: session } = useSession();
    console.log('testing')
    console.log(times);
    
    async function handleClick(e: BaseSyntheticEvent) { 
        if(session && session.user){
            const time = parseInt(e.target.outerText.substring(0, 2));
            const date = data.date;
            const passedData = {time, date, session}
            const postData = async () => {
                const response = await fetch('/api/dates/getShift', {
                    method: "POST",
                    body: JSON.stringify(passedData),
                });
                if(response.status === 401) {
                    alert("You need to be a mentor to do that!")
                }
                else if(response.status === 403) {
                    alert("You may only sign up for 1 shift per week!")  
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
    function addTime(time) {
        
        for(let i = 0; i < times.length; i++){            
            if(time === times[i].from) {
                
                return <>
                    <span className='text-black'>
                        {time}:00 - {time+1}:00
                    </span>
                    <div className='text-sm'>
                        <img referrerPolicy="no-referrer" src={`${times[i].mentor.image}`} className='inline mr-2 relative max-w-[7%] rounded-xl' alt="" />
                        <span className='text-black'>{`${times[i].mentor.username}`}</span>
                    </div>
                </>
            }
        }
        return <span className='text-black'>{time}:00 - {time+1}:00</span>
    }
    return(
        
        <div className='grid h-max place-items-center gap-y-20'>
            <h1 className='flex items-center text-5xl font-extrabold mt-10'> 
                March {data.date}
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
    )
}