import { SessionProvider } from "next-auth/react"
import Link from 'next/link'
import React, { useEffect, useState } from "react";
import '../app/globals.css'
import { useSession, signIn, signOut } from "next-auth/react";
// import AdminCheck from '../components/AdminCheck'
// export { default } from "next-auth/middleware"
import prisma from '@/prisma/client'
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router'
import Head from "next/head";
import Image from "next/image";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    return (
        <>
            <Head>
                <link rel="shortcut icon" href='/Logo Icon (1).png' />
            </Head>
            <SessionProvider session={ session }>
                <div className="flex flex-col h-screen">
                    <Header />
                    <Component { ...pageProps } />
                    <Toaster
                        toastOptions={ {
                            duration: 5000,
                            success: {
                                duration: 3000,
                                theme: {
                                    primary: 'green',
                                    secondary: 'black'
                                }
                            },
                            error: {
                                duration: 3000,
                                theme: {
                                    primary: 'red',
                                    secondary: 'black'
                                }
                            }
                        } }
                    />
                </div>
            </SessionProvider>
        </>
    )
}

function SpecialLink(props) {
    const href = props.href
    const router = useRouter()
    let linkStyle = ''
    if(router.pathname === href) {
        linkStyle = 'block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
    }
    else {
        linkStyle = 'block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-white-700 md:p-0 dark:text-white'
    }

    return (
        <Link href={href} className={linkStyle} >{props.text}</Link>
    )
}
const Header = () => {
    const { data: session } = useSession();
    console.log(session)
    return (
        <header className="sticky top-0 z-50">
            <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 dark:bg-gray-900 w-full">
                <div className="container flex flex-wrap items-center justify-between mx-auto">
                    <a href="/" className="flex items-center">
                        <img src="/Full logo.svg" className="h-6 mr-3 sm:h-9" alt="Flowbite Logo" />
                    </a>
                    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            
                            { session && session.user && session.user.mentor ? (
                                <li>
                                    <SpecialLink href='/dates' text='Calendar' />
                                    {/* <Link href="/dates" className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" >Dates</Link> */}
                                </li>
                            ) : (
                                <></>
                            )}
                            {session && session.user && !session.user.mentor ? (
                                <li>
                                    <SpecialLink href='/help' text='Find a Mentor' />
                                    {/* <Link href='/help' className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Find a Mentor</Link> */}
                                </li>
                            ) : (<></>)}
                            {session && session.user && session.user.admin ? (
                                <li>
                                    <SpecialLink href='/users' text='Users'/>
                                    {/* <Link href="/users" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white">Users</Link> */}
                                </li>
                            ) : (<></>)}
                            { session ? (
                                <>
                                    <li>
                                        <SpecialLink href={ `/users/${ session.user.id }` } text='Profile' />
                                        {/* <Link href={ `/users/${ session.user.id }` } className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Profile</Link> */}
                                    </li>
                                    <li>
                                        <SpecialLink href='/api/auth/signout' text='Sign Out' />
                                        {/* <Link href='/api/auth/signout' className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Sign Out</Link> */}
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <button onClick={ () => { signIn() } } className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Sign In</button>
                                </li>
                            ) }
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
};
