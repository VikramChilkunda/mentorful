import Link from 'next/link'

import prisma from '@/prisma/client'
import { BaseSyntheticEvent, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import toast from 'react-hot-toast';
import { timeToText } from '@/utils/timeToString';

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
    return {
        props: {
            shifts,
        },
    }
}
function Group(props) {
    console.log(props)
    let {groupShifts} = props
    console.log("group shifts");
    console.log(groupShifts);
    
    
    const rows = []
    for(let i = 0; i < groupShifts.length; i++) {
        if(groupShifts[i]?.student){
            rows.push(<StudentShift key={groupShifts[i].id} shift={groupShifts[i]} />)
        }
        else if(groupShifts[i]?.mentor){
            rows.push(<Shift key={groupShifts[i].id} shift={groupShifts[i]} />)
            

        }
    }
    return(
        <div className="pt-5 flex justify-center items-start h-screen bg-main bg-cover">
            <div className="w-4/5">
                <div className="flex flex-row justify-between">
                    { rows.map((row, idx) => (
                        <div key={idx} className={`w-1/${groupShifts.length}`}>
                            {row}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
    )
}
function StudentShift(props) {
    const shift = props.shift
    console.log(shift);
    
    return (
        <div className="flex bg-white/20 border border-purple-700 rounded-lg shadow md:flex-row space-between">
            <div className='flex-col border-r-2 grow'>
                <div className='flex items-center '>
                    <img referrerPolicy="no-referrer" className="rounded-tl-lg h-1/2 md:h-auto mr-3" src={shift.student.image} alt=""></img>
                    <h5 className="h-[49%] text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{shift.student.username}</h5>
                </div>
                <hr></hr>
                <div className='flex items-center'>
                    <img referrerPolicy="no-referrer" className=" rounded-bl-lg h-1/2 md:h-auto mr-3" src={shift.mentor.image} alt=""></img>
                    <h5 className="h-[49%] text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{shift.mentor.username}</h5>
                </div>
            </div>
            <div className="flex flex-col justify-between p-4 leading-normal w-1/5 justify-self-end grow">
                <p className="font-semibold text-2xl text-white m-auto">{timeToText(shift.from)} - {timeToText(shift.to)} on {shift.date.month+1}/{shift.date.date}</p>
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
        <div className="flex flex-col items-center border border-purple-700 rounded-lg shadow md:flex-row bg-white/20">
            <img referrerPolicy="no-referrer" className="object-cover w-full rounded-t-lg h-100 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src={shift.mentor.image} alt=""></img>
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{shift.mentor.username}</h5>
                <p className="mb-3 font-normal text-black">{timeToText(shift.from)} - {timeToText(shift.to)} on {shift.date.month+1}/{shift.date.date}</p>
                <button type="button" onClick={handleSubmit} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 ">Select</button>
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

    
    const numPerRow = 3;
    const pass = []
    for(let i = 0; i < shifts.length; i+=numPerRow) {
        for(let j = 0; j < numPerRow; j++){
            pass.push(shifts[j+i])
        }
        all.push(<Group groupShifts={pass} />)
        
    }

    
    return (
        <div className='bg-main bg-cover h-screen'>
            <div className='bg-black/40 h-screen'>
                <>
                {
                    (all.length === 0 && 
                    <div className='w-1/2 m-auto'>
                        <div className="m-auto w-1/2 flex flex-col bg-white/50 justify-center border border-purple-700 rounded-lg shadow md:flex-row hover:bg-gray-100">
                            <div className="flex flex-col p-4 leading-normal">
                                <h5 className="text-2xl font-bold tracking-tight text-gray-900">No Mentors Available</h5>
                            </div>
                        </div>
                    </div>)
                }
                { all.map((date, idx) => (
                    <div key={idx}>
                        {date}
                    </div>
                )) }
                </>
            </div>
        </div>
    )
    
}

