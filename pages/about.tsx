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
        <div className="relative bg-cover bg-no-repeat text-center h-screen bg-[#eee]">
            <div className="w-full">
                <div className="flex items-center justify-center max-w-[900px] mx-auto px-10 py-10">
                    <div>
                        <h2 className="mb-4 text-6xl font-semibold lg:mt-20">
                            Our Mission
                        </h2>
                        <h4 className="mb-10 text-xl leading-9">
                        Underrepresented minority enrollment in America’s top universities could drop dramatically during the next 
                        college admissions cycle due to the impending decisions of two supreme court cases, SFFA v. Harvard and SFFA v. 
                        UNC, which may outlaw race-conscious admissions. Our mission is to prevent a decrease in minority enrollment by 
                        providing highly-qualified college applicants in underserved communities with free college assistance, tutoring, 
                        4-year high school course planning, and mentorship to ensure that every student has the same opportunity to attend 
                        selective universities and maintain diversity in America’s college campuses.
                        </h4>
                        <h2 className="mb-4 text-4xl mt-5 ">
                            Our Selection Process
                        </h2>
                        <h4 className="mb-6 text-xl leading-9">
                        All students who believe they qualify for Mentorful benefits can request mentorship by signing up through our calendar. A select group of students recommended by our mentors and identified as highly-qualified applicants will be able to apply for our specialized mentorship program. Students in this program will receive full access to our college assistance, tutoring, course planning, and personalized career guidance services up until graduation.
                        </h4>
                        
                    </div>
                </div>
            </div>
        </div>
        
    )
}

