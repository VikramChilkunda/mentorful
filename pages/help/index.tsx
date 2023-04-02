import Link from 'next/link'

import prisma from '@/prisma/client'
import { BaseSyntheticEvent, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import toast from 'react-hot-toast';

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)
       
    const shifts = await prisma.shift.findMany({
        where: {
            OR: [
                {
                    student: null,
                    filled: false
                },
                {
                    filled: true,
                    studentId: session.user.id
                }
            ]

        },
        include: {
            mentor: true,
            student: true
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
            console.log("Added here:")
            console.log(<Shift key={groupShifts[i].id} shift={groupShifts[i]} />);
            

        }
    }
    return(
        <div className="mt-5 flex justify-center items-start h-screen">
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
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100">
            <img referrerPolicy="no-referrer" className=" w-1/2 rounded-t-lg h-50 md:h-auto md:w-1/3 md:rounded-none md:rounded-l-lg" src={shift.student.image} alt=""></img>
            <img referrerPolicy="no-referrer" className=" w-2/12 rounded-t-lg h-50 md:h-auto md:w-1/9 md:rounded-none" src={shift.mentor.image} alt=""></img>
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{shift.student.username}</h5>
                <hr className='mb-2'></hr>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{shift.mentor.username}</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{shift.from}:00 - {shift.to}:00 on March {shift.date}</p>
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
        <div className="flex flex-col items-center border border-gray-200 rounded-lg shadow md:flex-row bg-gray-100">
            <img referrerPolicy="no-referrer" className="object-cover w-full rounded-t-lg h-100 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src={shift.mentor.image} alt=""></img>
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{shift.mentor.username}</h5>
                <p className="mb-3 font-normal text-gray-700 ">{shift.from}:00 - {shift.to}:00 on March {shift.date}</p>
                <button type="button" onClick={handleSubmit} className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 ">Select</button>
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
                toast.success("Succesfully signed up for this 1-on-1 session!")
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
        <>
       
        { all.map((date, idx) => (
            <div key={idx}>
                {date}
            </div>
        )) }
        </>
    )
    
}

