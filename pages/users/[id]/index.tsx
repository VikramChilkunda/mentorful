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
import { timeToText } from '@/utils/timeToString';

export async function getServerSideProps({ params }) {
    const foundUser = await prisma.user.findFirst({
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
            foundUser
        }
    }

}

function Shift(props: User) {
    const exists = props.user
    const router = useRouter()
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
            if(data.status === 200){
                toast.success("Succesfully cancelled your meeting!")
                router.push(`/users/${exists.id}`)
            }
            else
                toast.error("Unable to cancel meeting!")
        })
        
    }
    if(exists) {
        if(exists.mentorShift) {
            return <div className='flex flex-col ml-2 items-end'>
                        <h2 className='font-semibold inline-block text-yellow-400'>{timeToText(exists.mentorShift.from)} - {timeToText(exists.mentorShift.to)} on {exists.mentorShift.date.month+1  }/{exists.mentorShift.date.date}</h2>
                        <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 mt-1  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={handleSubmit}>Cancel</button>
                    </div>
        }
        else if(exists.studentShift) {
            return <div className='flex flex-col ml-2 items-end'>
                <h2 className=' font-semibold text-yellow-400'>{timeToText(exists.studentShift.from)} - {timeToText(exists.studentShift.to)} on {exists.studentShift.date.month+1}/{exists.studentShift.date.date}</h2>
                <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 mt-1  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={handleSubmit}>Cancel</button>
            </div>
        }
        else {
            return <h2 className='font-medium text-red-500'>Not registered for a meeting</h2>  
        } 
    }   
    else{
        return <h2 className='font-medium text-red-500'>Not registered for a meeting</h2>
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
        }
        userData().then(data => {
            router.push("/")
        })
    }

    if (exists && session?.user.id === exists.id) {
        return (<button onClick={handleSubmit} className="focus:outline-none text-black bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2.5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>)
    }
    else {
        return <></>
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
//for when the logged in user is viewing their own profile
function ProfileIfLoggedUser (user, id) {
    const data = user.user
    return(
    <main className='bg-main bg-cover'>
        <section className=" bg-black/40 flex font-medium items-center justify-center h-screen w-full">
            <section className=" mx-auto bg-[#20354b] rounded-2xl p-9 w-1/3 shadow-lg relative">
                <div>
                    <div className="flex flex-row-reverse items-baseline ml-auto">
                        {data.subjects.length? (
                            <ul>
                                {data.subjects.map((subject: string) => (
                                    <li className='text-md text-white uppercase font-semibold'>{subject}</li>
                                ))}
                            </ul>
                        ): (
                            <></>
                        )}
                        
                        <span className="text-emerald-400">
                            <Delete user={data}/>
                            {data.mentor? (
                                <Link href={ `/users/${data.id}/edit`} className='inline no-underline text-black bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Edit</Link> 
                            ): (
                                <></>
                            )}
                            
                        </span>
                    </div>
                    <div className="mt-6 w-fit mx-auto">
                        <img src={`${data.image}`} referrerPolicy='no-referrer' className="rounded-full w-28 " alt="profile picture" />
                    </div>
                </div>
                <div className='flex w-full mt-8 justify-start items-end'>
                    <div>
                        <div>
                            <h2 className="text-white font-bold text-2xl tracking-wide">{data.username}</h2>
                        </div>
                        <p className="text-emerald-400 font-semibold mt-2.5" >{data.mentor ? ('Mentor') : ('Student')}</p>
                        <p className='text-white font-medium text-md'>{data.email}</p>
                    </div>
                    <div className='flex relative w-fit mt-auto ml-auto items-center h-fit'>
                        {/* <img src="https://www.iconarchive.com/download/i103365/paomedia/small-n-flat/calendar.1024.png" className='w-10 h-10' alt="" /> */}
                        <Shift user={data} />
                    </div>
                </div>
            </section>
        </section>
    </main>
    )
}

//for when the logged in user is viewing someone else's profile
function ProfileIfDiffUser(user, id) {
    const data = user.user
    console.log("different user, : ", data)
    if(!data) return <></>
    if(data.mentor) {
        return(
            <main className='bg-main bg-cover'>
                <section className=" bg-black/40 flex font-medium items-center justify-center h-screen w-full">
                    <section className=" mx-auto bg-[#20354b] rounded-2xl p-9 w-1/3 shadow-lg">
                        <div className='flex'>
                            <span>
                                <div className=" w-1/2 ">
                                    <img src={`${data.image}`} referrerPolicy='no-referrer' className="rounded-full w-28 " alt="profile picture" />
                                </div>
                                <div className='float-left mt-8'>
                                    <div>
                                        <h2 className="text-white font-bold text-2xl tracking-wide">{data.username}</h2>
                                    </div>
                                    <p className="text-emerald-400 font-semibold mt-2.5" >{data.mentor ? ('Mentor') : ('Student')}</p>
                                    <p className='text-white font-medium text-md'>{data.email}</p>
                                </div>
                            </span>
                            <div className='flex flex-col ml-auto max-w-[40%]'>
                                <div className="ml-auto text-end">
                                    {data?.subjects.length? (
                                        <ul>
                                            {data.subjects.map((subject: string) => (
                                                <li className='text-md text-white uppercase font-semibold'>{subject}</li>
                                            ))}
                                        </ul>
                                    ): (
                                        <p className='text-white font-semibold text-xl'>
                                            This mentor currently has no subjects selected.
                                        </p>
                                    )}
                                </div>
                                <div className='flex relative w-fit mt-auto ml-auto items-center h-fit'>
                                    <img src="https://www.iconarchive.com/download/i103365/paomedia/small-n-flat/calendar.1024.png" className='w-10 float-left' alt="" />
                                    <p className='text-white font-semibold inline-block ml-5'>
                                        {data.mentorShift ? (data.mentorShift.date.name) : (
                                            (data.studentShift ? (data.studentShift.date.name) : (
                                                "No Shift"
                                            ))
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        
                    </section>
                </section>
            </main>)
    }
    else{
        return(
            <main className='bg-main bg-cover'>
                <section className=" bg-black/40 flex font-medium items-center justify-center h-screen w-full">
                    <section className=" mx-auto bg-[#20354b] rounded-2xl p-8 w-fit shadow-lg">
                        <div className='flex'>
                            <span>
                                <div className="mt-6 w-1/2 m-auto">
                                    <img src={`${data.image}`} referrerPolicy='no-referrer' className="rounded-full w-28 " alt="profile picture" />
                                </div>
                                <div className='float-left mt-8'>
                                    <div>
                                        <h2 className="text-white font-bold text-2xl tracking-wide">{data.username}</h2>
                                    </div>
                                    <p className="text-emerald-400 font-semibold mt-2.5" >{data.mentor ? ('Mentor') : ('Student')}</p>
                                    <p className='text-white font-medium text-md'>{data.email}</p>
                                </div>
                            </span>
                        </div>
                    </section>
                </section>
            </main>
    )}
    
}

export default function Profile({ foundUser }) {
    const router = useRouter()
    const {data: session} = useSession();
    const { id } = router.query
    if(!foundUser) {
        return <h1>No User Found</h1>
    }
    if(id === session?.user.id) {
        return <ProfileIfLoggedUser user={foundUser} id={id} />
    }
    else {
        return <ProfileIfDiffUser user={foundUser} id={id} />
    }
}

