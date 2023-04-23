import Link from 'next/link'

import prisma from '@/prisma/client'
import { getServerSession } from "next-auth/next"
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from './api/auth/[...nextauth]';


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);
    if(!session?.user.admin) return;
    const response = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            mentor: true,
            mentorShift: true,
            studentShift: true
        }
    })
    const data = response;
    return {
        props: {
            data, session
        },
    }
}

export default function Home({ data }) {
    console.log("all users: ", data)
    async function handleSubmit() {
        const res = await fetch('/api/users/deleteAllUsers');
        console.log(res);
    }
    async function handleClick(id) {
        const result = await fetch('/api/users/deleteUser', {
            method: "POST",
            body: JSON.stringify(id)
        })
    }
    return (
        <main className='py-4 px-48 bg-[#eee] h-full'>
            <table className="table-fixed border-collapse border border-slate-500 w-full">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Shift</th>
                        <th>Mentor</th>
                    </tr>
                </thead>
                <tbody>
                    { data.map((user) => (
                        <tr key={ user.id }>
                            <td className='border border-slate-400 px-5 font-semibold'>{ user.username }</td >
                            <td className='border border-slate-400 px-5'>{ user.email }</td >
                            <td className='border border-slate-400 px-5'>
                                { user.studentShift ? (user.studentShift) : 
                                    (user.mentorShift ? (user.mentorShift) : ('') )
                                }
                            </td >
                            <td className='border border-slate-400 px-5'>{ user.mentor ? ("Yes") : ("No") }</td >
                            <td className='border border-slate-400 px-5 text-blue-600 underline'><button onClick={() => handleClick(user.id)}>Delete</button></td>
                        </tr>
                    )) }
                </tbody>
            </table>
            <form onSubmit={ handleSubmit }><button>Delete All users</button></form>
        </main>
    )
}

