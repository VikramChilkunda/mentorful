import { SessionProvider } from "next-auth/react"
import Link from 'next/link'
import React, { useEffect, useState } from "react";
import '../app/globals.css'
import { useSession, signIn, signOut } from "next-auth/react";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router'
import Head from "next/head";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {

    return (
        <>
            <Head>
                <link rel="shortcut icon" href='/Logo Icon (1).png' />
                { pageProps.title ? (
                    <title>{ pageProps.title }</title>
                ) : (
                    <title>Mentorful</title>
                ) }
            </Head>
            <SessionProvider session={ session }>
                <div className="flex flex-col h-screen">
                    {/* <Header /> */}
                        <Navbar />
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
function Navbar() {
    const { data: session, status } = useSession();
    const [isNavOpen, setIsNavOpen] = useState(false); // initiate isNavOpen state with false
    function SpecialLink(props) {
        const href = props.href
        const router = useRouter()
        let linkStyle = ''
        if (router.asPath === href) {
            linkStyle = 'block py-2 pl-3 pr-4 text-black rounded md:bg-transparent md:text-blue-500 md:p-0 mt-3 md:mt-0 underline md:no-underline font-bold uppercase'
        }
        else {
            linkStyle = 'block py-2 pl-3 pr-4 text-black rounded md:bg-transparent md:text-black md:p-0 mt-3 md:mt-0 underline md:no-underline font-bold uppercase'
        }
    
        return (
            <Link href={ href } onClick={ () => setIsNavOpen(false) } className={ linkStyle } >{ props.text }</Link>
        )
    }
    if(status != "loading"){
        return (
            <div className="flex items-center justify-between px-2 sm:px-4 py-2.5 w-full max-h-[70px]">
                <a href="/">
                    <img src="/Full logo.svg" className="lg:w-50 h-1/2 mr-3 sm:h-9 max-w-[200px] md:max-w-none" alt="logo" />
                </a>
                <nav>
                    <section className="MOBILE-MENU flex lg:hidden">
                        <div
                            className="HAMBURGER-ICON space-y-2"
                            onClick={ () => setIsNavOpen((prev) => !prev) } // toggle isNavOpen state on click
                        >
                            <span className="block h-0.5 w-7 animate-pulse bg-gray-600"></span>
                            <span className="block h-0.5 w-7 animate-pulse bg-gray-600"></span>
                            <span className="block h-0.5 w-7 animate-pulse bg-gray-600"></span>
                        </div>
    
                        <div className={ isNavOpen ? "showMenuNav h-screen" : "hideMenuNav" }> 
                            <div
                                className="CROSS-ICON absolute top-0 right-0 px-8 py-8"
                                onClick={ () => setIsNavOpen(false) } // change isNavOpen state to false to close the menu
                            >
                                <svg
                                    className="h-8 w-8 text-gray-600"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </div>
                            <ul className="MENU-LINK-MOBILE-OPEN flex flex-col items-center justify-between min-h-[100px] p-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row 
                                md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
                                <a href="/">
                                    <img src="/Full logo.svg" className="w-full m-auto" alt="logo" />
                                </a>
                                { session && session.user && session.user.mentor ? (
                                    <li className="mt-3">
                                        <SpecialLink href='/dates' text='Calendar' />
                                        {/* <Link href="/dates" className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" >Dates</Link> */ }
                                    </li>
                                ) : (
                                    <></>
                                ) }
                                { session && session.user && !session.user.mentor ? (
                                    session.user.studentShift && session.user.studentShift.mentorId ? (
                                        <>
                                            <li className="mt-3">
                                                <SpecialLink href={ `/users/${ session.user.studentShift.mentorId }` } text='About Your Mentor' />
                                            </li>
                                            <li className="mt-3">
                                                <SpecialLink href={ `/users/${ session.user.id }/becomeAMentor` } text='Become a Mentor' />
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li className="mt-3">
                                                <SpecialLink href='/help' text='Find a Mentor' />
                                            </li>
                                            <li className="mt-3">
                                                <SpecialLink href={ `/users/${ session.user.id }/becomeAMentor` } text='Become a Mentor' />
                                            </li>
                                        </>
                                    )
                                ) : (<></>) }
                                { session && session.user && session.user.admin ? (
                                    <li className="mt-3">
                                        <SpecialLink href='/users' text='Users' />
                                        {/* <Link href="/users" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white">Users</Link> */ }
                                    </li>
                                ) : (<></>) }
                                { session ? (
                                    <>
                                        <li className="mt-3">
                                            <SpecialLink href={ `/users/${ session.user.id }` } text='Profile' />
                                            {/* <Link href={ `/users/${ session.user.id }` } className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Profile</Link> */ }
                                        </li>
                                        <li className="mt-3">
                                            <SpecialLink href='/api/auth/signout' text='Sign Out' />
                                            {/* <Link href='/api/auth/signout' className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Sign Out</Link> */ }
                                        </li>
                                    </>
                                ) : (
                                    <li className="mt-3">
                                        <button onClick={ () => { signIn() } } className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Sign In</button>
                                    </li>
                                ) }
                            </ul>
                        </div>
                    </section>
    
                    <ul className="DESKTOP-MENU hidden space-x-8 lg:flex p-4 mt-4 border rounded-lg bg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white border-gray-700 ">
                                { session && session.user && session.user.mentor ? (
                                    <li>
                                        <SpecialLink href='/dates' text='Calendar' />
                                        {/* <Link href="/dates" className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" >Dates</Link> */ }
                                    </li>
                                ) : (
                                    <></>
                                ) }
                                { session && session.user && !session.user.mentor ? (
                                    session.user.studentShift && session.user.studentShift.mentorId ? (
                                        <>
                                            <li>
                                                <SpecialLink href={ `/users/${ session.user.studentShift.mentorId }` } text='About Your Mentor' />
                                            </li>
                                            <li>
                                                <SpecialLink href={ `/users/${ session.user.id }/becomeAMentor` } text='Become a Mentor' />
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li>
                                                <SpecialLink href='/help' text='Find a Mentor' />
                                            </li>
                                            <li>
                                                <SpecialLink href={ `/users/${ session.user.id }/becomeAMentor` } text='Become a Mentor' />
                                            </li>
                                        </>
                                    )
                                ) : (<></>) }
                                { session && session.user && session.user.admin ? (
                                    <li>
                                        <SpecialLink href='/users' text='Users' />
                                        {/* <Link href="/users" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white">Users</Link> */ }
                                    </li>
                                ) : (<></>) }
                                { session ? (
                                    <>
                                        <li>
                                            <SpecialLink href={ `/users/${ session.user.id }` } text='Profile' />
                                            {/* <Link href={ `/users/${ session.user.id }` } className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Profile</Link> */ }
                                        </li>
                                        <li>
                                            <SpecialLink href='/api/auth/signout' text='Sign Out' />
                                            {/* <Link href='/api/auth/signout' className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Sign Out</Link> */ }
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        <button onClick={ () => { signIn() } } className="block py-2 pl-3 pr-4 text-black font-semibold uppercase">Sign In</button>
                                    </li>
                                ) }
                    </ul>
                </nav>
                <style>{ `
            .hideMenuNav {
                display: none;
            }
            .showMenuNav {
                display: block;
                position: absolute;
                width: 100%;
                height: 100vh;
                top: 0;
                left: 0;
                background: white;
                z-index: 10;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
            }
            `}</style>
            </div>
        );
    }
   
}


const Header = ({ serverSession }) => {
    const { data: session, status } = useSession();
    // console.log("the status of authentication is: ", status)
    if (status != "loading") {
        // console.log(session.user)
        return (
            <header className="sticky top-0 z-50">
                <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 dark:bg-gray-900 w-full transform">
                    <div className="container flex flex-wrap items-center justify-between mx-auto">
                        <a href="/" className="flex items-center">
                            <img src="/Full logo.svg" className="w-20 md:w-6 mr-3 sm:h-9" alt="Flowbite Logo" />
                        </a>
                        <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                        </button>
                        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                            
                        </div>
                    </div>
                </nav>
            </header>
        )
    }
};
