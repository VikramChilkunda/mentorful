import Link from 'next/link'
// import styles from './page.module.css'
import { useRouter } from 'next/router'
import prisma from '@/prisma/client'
import React, { BaseSyntheticEvent, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from 'react-hot-toast';
import { log } from 'console';

export async function getStaticProps({ params }) {
    const data = await prisma.user.findFirst({
        where: {
            id: params.id
        },
        include: {
            mentorShift: true,
            studentShift: true
        }
    });
    // console.log(data)

    return {
        props: {
            data
        }
    }
}
export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking'
    }
}
function User(props) {
    const exists = props.user
    if (exists) {
        return <>
            <img src={`${exists.image}`} referrerPolicy='no-referrer' alt="" />
            <h1 className='max-w-lg text-3xl font-semibold leading-relaxed text-gray-900 dark:text-black' id='usernamefjdlaskjfl'>{ props.user.username }
                {exists.mentor && ( 
                    <span className="bg-blue-100 text-blue-800 text-2xl font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-2">MENTOR</span>
                )}
                {!exists.mentor && ( 
                    <span className="bg-blue-100 text-blue-800 text-2xl font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-2">STUDENT</span>
                )}
            </h1>
            
        </>
    }
    else {
        return <h1>No User Found</h1>
    }
}

function Email(props) {
    const exists = props.user
    if (exists) {
        return <h2 className='max-w-lg text-xl font-semibold leading-relaxed text-blue-900 dark:text-black'>{ props.user.email }</h2>
    }
    else {
        return <h1>No User Found</h1>
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
                        <h2>Shift from: {exists.mentorShift.from}-{exists.mentorShift.to} on 3/{exists.mentorShift.date}  </h2>
                        <form onSubmit={handleSubmit}><button>Cancel Appointment</button></form>
                    </>
        }
        else if(exists.studentShift) {
            return <>
                <h2>Meeting from: {exists.studentShift.from}-{exists.studentShift.to} on 3/{exists.studentShift.date}  </h2>
                <form onSubmit={handleSubmit}><button>Cancel Appointment</button></form>
            </>
        }
        
    }   
    else{
        return <h2>Not currently signed up for a shift</h2>
    }
}
function Delete(props) {
    const router = useRouter()
    const exists = props.user
    if (exists) {
        return <form className='inline' onSubmit={ handleSubmit }><button type="button" className="mt-5 focus:outline-none text-black bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2.5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button></form>
    }
    else {
        return <h1>No User Found</h1>
    }
    async function handleSubmit(e) {
        e.preventDefault();
        const userData = async () => {
            const { id } = router.query;
            const response = await fetch("/api/users/deleteUser", {
                method: "POST",
                body: JSON.stringify(id),
            });
            return response.json();
        }
        userData().then((data) => {
            alert('getting here')
            router.push('/')
        })
    }
}

function MyDateComp() {
    const [startDate, setStartDate] = useState(new Date());
    return (
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
    );
}

function SignUpMentor(props) {
    const exists = props.user
    return(exists && !exists.mentor && (
        <a href={`/users/${exists.id}/becomeAMentor`} className="border-2 border-green-500 no-underline inline-flex items-center justify-center p-5 text-base font-medium text-black-500 rounded-lg  hover:text-gray-900 hover:bg-gray-100 dark:text-blue-400 ">
            <span className="w-full">Would you like to become a mentor?</span>
            <svg aria-hidden="true" className="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </a> )
    )
}


export default function Profile({ data }) {
    const router = useRouter()
    const { id } = router.query
    // console.log(data)
    return (
        <main className='px-48'>
            <div className='grid h-screen place-items-center'>
                <div>
                    <User user={ data } />
                    <Email user={ data } />
                    <Delete user={ data } />
                    
                    <Link href={ `/users/${id}/edit`} className='inline no-underline text-black bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Edit</Link>
                    <Shift user={data}></Shift>
                    <br />
                    <SignUpMentor user={data} />
                    {/* <MyDateComp/> */}
                </div>
            </div>
        </main>
    )
}

