import Link from 'next/link'

import prisma from '@/prisma/client'
import { BaseSyntheticEvent, SyntheticEvent, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import toast from 'react-hot-toast';
import { timeToText } from '@/utils/timeToString';
import { Inter, Poppins, Rubik } from 'next/font/google'
import { log } from 'console';
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';

const inter = Inter({ subsets: ['latin'] })
const rubik = Rubik({ subsets: ['latin'] })
const poppins = Poppins({subsets: ['latin'], weight: "500"})

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)
       
    const shifts = await prisma.shift.findMany({
        where: {
            OR: [
                {
                    student: null,
                    filled: false,
                    mentorId: {
                        not: session?.user.id
                    }
                },
                {
                    filled: true,
                    studentId: session?.user.id
                }
            ]

        },
        include: {
            mentor: true,
            student: true,
            date: true
        }
    })
    let title = 'Available Mentors'
    return {
        props: {
            shifts, title
        },
    }
}
function StudentShift(props) {
    const shift = props.shift
    return (
        <div className={`flex bg-[#eee]/80 border rounded-lg shadow md:flex-row h-[200px] space-between m-auto text-black overflow-hidden ${inter.className}`}>
            <div className='flex-col border-r-2 grow'>
                <div className='flex items-center '>
                    <img referrerPolicy="no-referrer" className="rounded-tl-lg h-1/2 md:h-auto mr-3" src={shift.student.image} alt=""></img>
                    <h5 className="h-[49%] text-2xl font-bold tracking-tight text-black">{shift.student.username}</h5>
                </div>
                <hr></hr>
                <div className='flex items-center'>
                    <img referrerPolicy="no-referrer" className=" rounded-bl-lg h-1/2 md:h-auto mr-3" src={shift.mentor.image} alt=""></img>
                    <h5 className="h-[49%] text-2xl font-bold tracking-tight text-black">{shift.mentor.username}</h5>
                </div>
            </div>
            <div className="flex flex-col justify-between p-4 leading-normal w-1/3 justify-self-end grow">
                <p className="font-semibold text-2xl text-black m-auto">{shift.date.month+1}/{shift.date.date}: 
                </p>
                <p className='font-semibold  w-[90%] text-black m-auto text-lg text-center'>
                    {timeToText(shift.from)} <br></br>- {timeToText(shift.to)}
                </p>
            </div>
        </div>)
}
function Shift(props) {
    const shift = props.shift
    const { data: session } = useSession();
      
    
    const [mentor, setMentor] = useState();
    if(!mentor && shift.mentor) {
        setMentor(shift.mentor)
    }
    //redundant, mentor shifts are only retrieved if not filled
    return (
        <div className={`flex items-center bg-[#eee]/80 rounded-md px-5 py-4 h-[200px] mb-5 ${rubik.className}`}>
            <img referrerPolicy="no-referrer" className="object-cover w-[60%] rounded-lg mr-5" src={shift.mentor.image} alt=""></img>
            <div className={`flex flex-col justify-between`}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">{shift.mentor.username}</h5>
                <p className="text-black">{timeToText(shift.from)} - {timeToText(shift.to)} on {shift.date.month+1}/{shift.date.date}</p>
                <p>{shift.mentor.subjects.join(", ")}</p>
                <button type="button" onClick={handleSubmit} className="justify-self-end focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5">Select</button>
            </div>
        </div>   
    )

    async function handleSubmit(e: BaseSyntheticEvent) {
        const data = [mentor, session, shift]
        if (!session) {
            alert('not signed in')
        }
        const result = await fetch('/api/help/matchStudentWithShift', {
            method: 'POST',
            body: JSON.stringify(data),
        })
                
        switch (result.status) {
            case 200:
                location.reload()
                setTimeout(() => {
                    toast.success("Succesfully signed up for this 1-on-1 session!")
                }, 3000);
                break;
        
            case 403:
                toast.error("Something went wrong.")
                break;
        }
             

        
    }
}


export default function Home({ shifts }) {
    const all = []
    const [query, setQuery] = useState()
    const [myShifts, setShifts] = useState(shifts)
    console.log("my shifts: ", myShifts)
    console.log("original array: ", shifts)
    async function search(e: SyntheticEvent) {
        e.preventDefault();
        shifts = await fetch('/api/shifts/getShiftByQuery', {
            method: "POST",
            body: query
        })
        setShifts(shifts)
        console.log("new shifts: ", shifts)
    }
    async function updateQuery(e: SyntheticEvent) {
        e.preventDefault();
        setQuery(e.target.value);
        let tempQuery = e.target.value
        let res = await fetch('/api/shifts/getShiftByQuery', {
            method: "POST",
            body: tempQuery
        })
        const result = await res.json()
        setShifts(result)
        console.log("new shifts: ", result)
    }
    
    return (
        <div className='bg-main bg-cover h-screen'>
            <div className='bg-black/40 min-h-full pt-5'>
                    <form className='w-1/3 mb-5 mx-auto'>   
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input onChange={updateQuery} type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mentors, Subjects" required />
                            <button onClick={search} className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                        </div>
                    </form>
                <div className='w-full md:w-2/3 lg:w-[80%] xl:w-[80%] justify-center gap-10 flex flex-wrap m-auto pt-10 items-start'>
                    {   
                        (myShifts.map((shift) => (
                            (shift.student ? (
                                <StudentShift key={shift.id} shift={shift} />
                            ) : (
                                <Shift key={shift.id} shift={shift} />
                            ))
                        )))
                    }
                </div>
                <>
                {
                    (shifts.length === 0 && 
                    <div className='w-1/2 m-auto'>
                        <div className="m-auto flex flex-col bg-white justify-center border rounded-lg shadow md:flex-row max-w-lg">
                            <div className="flex flex-col p-4 leading-normal">
                                <h5 className="text-2xl font-bold tracking-tight text-gray-900">No Mentors Available</h5>
                            </div>
                        </div>
                    </div>)
                }
                </>
            </div>
        </div>
    )
    
}

