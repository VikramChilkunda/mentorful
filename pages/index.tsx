import Link from 'next/link'
import '../app/globals.css'
import { useSession, signIn, signOut } from "next-auth/react";
// import styles from './page.module.css'

import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from "next";

export default function Home() {
    const { data: session } = useSession();
    return (
        //bg-main refers to the background-iamge specfied in tailwind.config
        // <div className="relative overflow-hidden bg-cover bg-no-repeat text-center h-screen bg-main bg-center">
        //     <div className=" h-full w-full overflow-hidden bg-fixed bg-black/40">
        //         <div className="flex h-full items-center justify-center w-[80%] m-auto">
        //             <div className="text-white">
        //                 <h2 className="mb-4 text-7xl md:text-8xl font-semibold">
        //                     Mentorful
        //                 </h2>
        //                 <Link href='/help' className='no-underline text-white'>
        //                     <button
        //                         type="button"
        //                         className="rounded border-2 border-neutral-50 px-7 pt-[10px] pb-[8px] text-sm font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-neutral-100 hover:bg-green-700 hover:bg-opacity-40 hover:text-neutral-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 ">

        //                             Get Help
        //                     </button>
        //                 </Link>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="relative overflow-hidden bg-cover bg-no-repeat text-center h-screen bg-[#ebe3b6] bg-center">
            <div className=" h-full w-full overflow-hidden bg-fixed bg-black/40">
                <div className="flex flex-col h-full px-5 max-w-5xl m-auto justify-center md:justify-items-start">
                    <h2 className="mb-4 text-5xl md:text-8xl font-semibold w-[80%] mx-auto ">
                        Mentorful will be available soon
                    </h2>
                    <p className='text-2xl md:text-4xl font-semibold mt-20'>
                        Join our waitlist as we prepare to launch
                    </p>
                    <a href="https://www.surveymonkey.com/r/CP7DK2C" target="_blank">
                        <button type="button" className="mt-5 py-4 px-6  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white mx-auto transition ease-in   duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                            I'm in!
                        </button>
                    </a>
                </div>
            </div>
        </div>

    )
}

