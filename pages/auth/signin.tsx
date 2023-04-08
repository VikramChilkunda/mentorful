import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    console.log("providers: ", providers)
    return (
        <div className="h-full bg-cover bg-main">
            <div className="bg-black/40 h-full flex">
                <div className='mt-auto mb-auto w-full flex justify-center'>
                    <div className="flex flex-col items-end border-r-2 pr-5 hover:mr-12 transition-all hover:border-r-8 hover:border-blue-500">
                        <h1 className="mt-0 mb-2 leading-tight text-primary text-white text-7xl font-semibold bg-gradient-to-r from-[#f12711]   to-[#f5af19] inline-block text-transparent bg-clip-text">Mentors</h1>
                        <a onClick={ () => signIn('zoom') } className="relative inline-flex items-center px-12 py-6 bg-white overflow-hidden text-2xl font-semibold border-2 border-indigo-600 rounded-xl hover:text-white group hover:bg-gray-50">
                            <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                            <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </span>
                            <span className="relative">Sign in with Zoom</span>
                        </a>
                    </div>

                    <div className="flex flex-col items-start border-l-2 pl-5 hover:ml-12 transition-all hover:border-l-8 hover:border-red-500">
                        <h1 className="mt-0 mb-2 leading-tight text-primary text-white text-7xl font-semibold bg-gradient-to-r from-[#3a6073] to-[#3a7bd5] inline-block text-transparent bg-clip-text">Students</h1>
                        <a onClick={ () => signIn('google') } className="relative inline-flex items-center px-12 py-6 bg-white overflow-hidden text-2xl font-semibold border-2 border-indigo-600 rounded-xl hover:text-white group hover:bg-gray-50">
                            <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                            <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </span>
                            <span className="relative">Sign in with Google</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>


    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!
    if (session) {
        return { redirect: { destination: "/" } };
    }

    const providers = await getProviders();

    return {
        props: { providers: providers ?? [] },
    }
}