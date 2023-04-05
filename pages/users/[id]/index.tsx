import Link from 'next/link'
// import styles from './page.module.css'
import { useRouter } from 'next/router'
import prisma from '@/prisma/client'
import React, { BaseSyntheticEvent, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from 'react-hot-toast';
import { IconContext } from 'react-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession, signOut } from 'next-auth/react';

export async function getServerSideProps({ params }) {
    const data = await prisma.user.findFirst({
        where: {
            id: params.id
        },
        include: {
            mentorShift: {
                include: {
                    date: true
                }
            },
            studentShift: {
                include: {
                    date: true
                }
            }
        }
    });   
    return {
        props: {
            data
        }
    }

}


function Shift(props) {
    const exists = props.user
    // console.log(exists);
    async function handleSubmit(e: BaseSyntheticEvent) {
        e.preventDefault();
        var id = ''
        var option = ''
        if(exists.mentorShift){ 
            id = exists.mentorShift.id
            option = 'mentor'
        }
        else if(exists.studentShift){ 
            id = exists.studentShift.id
            option = 'student'
        }
        const data = [id, option, exists.id]
        
        const userData = async () => {
            const response = await fetch('/api/dates/deleteShift', {
                method: 'POST',
                body: JSON.stringify(data)
            })
            
            return response;
        }
        userData().then((data) => {            
            if(data.status === 200)
                toast.success("Successfully cancelled your meeting!")
            else
                toast.error("Unable to cancel meeting!")
        })
        
    }
    
    if(exists) {
        if(exists.mentorShift) {
            return <>
                        <h2 className='text-white font-medium ml-5'>Shift from: {exists.mentorShift.from}-{exists.mentorShift.to} on 3/{exists.mentorShift.date}  </h2>
                        <form onSubmit={handleSubmit}><button>Cancel Appointment</button></form>
                    </>
        }
        else if(exists.studentShift) {
            return <>
                <h2 className='text-white font-medium ml-5'>Meeting from: {exists.studentShift.from}-{exists.studentShift.to} on 3/{exists.studentShift.date}  </h2>
                <form onSubmit={handleSubmit}><button>Cancel Appointment</button></form>
            </>
        }
        else {
            return <h2>Not currently signed up for a shift</h2>
            
        }
        
    }   
    else{
        return <h2>Not currently signed up for a shift</h2>
    }
}
function Delete(props) {
    const router = useRouter()
    const exists = props.user
    const {data: session} = useSession();
    async function handleSubmit(e: BaseSyntheticEvent) {
        e.preventDefault();
        const userData = async () => {
            const { id } = router.query;
            const response = await fetch("/api/users/deleteUser", {
                method: "POST",
                body: JSON.stringify({id}),
            });
            if(response.status === 200){
                toast.success("Succesfully Deleted Account!")
                signOut({
                    callbackUrl: '/'
                })
            }
            else if(response.status === 400) {
                toast.error("Unable to Delete Your Account")
                
            }
            return response.json();
        }
        userData().then(data => {
            router.push("/")
        })
    }

    if (exists) {
        return (<button onClick={handleSubmit} className="focus:outline-none text-black bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2.5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>)
    }
    else {
        return <h1>No User Found</h1>
    }
    
}
function SignUpMentor(props) {
    const exists = props.user
    return(exists && !exists.mentor && (
        <a href={`/users/${exists.id}/becomeAMentor`} className="border-2 border-green-500 no-underline inline-flex items-center justify-center p-5 text-base font-medium rounded-lg  hover:text-gray-900 hover:bg-green-500 text-white">
            <span className="w-full">Would you like to become a mentor?</span>
            <svg aria-hidden="true" className="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </a> )
    )
}


export default function Profile({ data }) {
    const router = useRouter()
    const { id } = router.query
    console.log(data)
    if(!data) {
        return <h1>No User Found</h1>
    }
    return (
        <main className='bg-main bg-cover'>
            {/* <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com">
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet"></link> */}

            <section className=" bg-black/40 flex font-medium items-center justify-center h-screen w-full">
                <section className=" mx-auto bg-[#20354b] rounded-2xl px-5 py-5 w-1/3 shadow-lg">
                    <div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">
                            <SignUpMentor user={data} />
                        </span>
                        <span className="text-emerald-400">
                            <Delete user={data}/>
                            <Link href={ `/users/${id}/edit`} className='inline no-underline text-black bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Edit</Link>
                        </span>
                    </div>
                    <div className="mt-6 w-fit mx-auto">
                        <img src={`${data.image}`} referrerPolicy='no-referrer' className="rounded-full w-28 " alt="profile picture" />
                    </div>
                    </div>
                    <div className='float-left mt-8'>
                        <div>
                            <h2 className="text-white font-bold text-2xl tracking-wide">{data.username}</h2>
                        </div>
                        <p className="text-emerald-400 font-semibold mt-2.5" >
                            {data.mentor ? ('Mentor') : ('Student')}
                        </p>
                        <p className='text-white font-medium text-md'>
                            {data.email}
                        </p>
                    </div>
                    <div className='float-right h-full mt-8'>
                            <img src="https://www.iconarchive.com/download/i103365/paomedia/small-n-flat/calendar.1024.png" className='w-10 float-left' alt="" />
                            <p className='text-white font-semibold inline-block ml-5 mt-2'>
                                {data.mentorShift ? (data.mentorShift.date.name) : (
                                    (data.studentShift ? (data.studentShift.date) : (
                                        <h1>No Shift</h1>
                                    ))
                                )}
                            </p>
                            {/* <Shift className='float-right' user={data}/> */}
                    </div>
                </section>
            </section>
        </main>
    )
}

