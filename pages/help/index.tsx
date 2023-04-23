import Link from 'next/link'

import prisma from '@/prisma/client'
import { BaseSyntheticEvent, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import toast from 'react-hot-toast';
import { timeToText } from '@/utils/timeToString';
import { Inter, Poppins, Rubik } from 'next/font/google'

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
        <div className={`flex bg-[#eee]/80 border border-purple-700 rounded-lg shadow md:flex-row space-between m-auto text-black overflow-hidden ${inter.className}`}>
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
        <div className={`flex items-center bg-[#eee]/80 rounded-md px-5 py-4 m-auto mb-5  ${rubik.className}`}>
            <img referrerPolicy="no-referrer" className="object-cover w-[60%] rounded-lg mr-5" src={shift.mentor.image} alt=""></img>
            <div className={`flex flex-col justify-between`}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">{shift.mentor.username}</h5>
                <p className="text-black">{timeToText(shift.from)} - {timeToText(shift.to)} on {shift.date.month+1}/{shift.date.date}</p>
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


    
    return (
        <div className='bg-main bg-cover h-screen'>
            <div className='bg-black/40 min-h-full'>
                <div className='w-full md:w-2/3 lg:w-[80%] xl:w-[80%] justify-around flex flex-wrap m-auto pt-10'>
                    {
                        (shifts.map((shift) => (
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
                        <div className="m-auto w-1/2 flex flex-col bg-white justify-center border border-purple-700 rounded-lg shadow md:flex-row">
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

