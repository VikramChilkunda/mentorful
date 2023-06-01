import Link from 'next/link'
// import styles from './page.module.css'
import { useRouter } from 'next/router'
import prisma from '@/prisma/client'
import React, { BaseSyntheticEvent, Component, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSession, signOut } from 'next-auth/react';

export async function getServerSideProps({ params }) {
	const user = await prisma.user.findFirst({
		where: {
			id: params.id
		}
	});
	let title = 'Become a Mentor'
	return {
		props: {
			user, title
		}
	}
}

export default function Profile({ user }) {
	const router = useRouter()
	const { id } = router.query
	const [secret, setSecret] = useState();
	const { data: session, status } = useSession()

	function secretChange(e: BaseSyntheticEvent) {
		setSecret(e.target.value);
	}
	async function handleSubmit(e: BaseSyntheticEvent) {
		e.preventDefault();
		const postData = async () => {
			const data = {
				secret, id
			};
			const response = await fetch("/api/users/becomeAdmin", {
				method: "POST",
				body: JSON.stringify(data),
			});			
			if (response.status === 200) {
				toast.success("You are now an admin!")

			}
			else if (response.status === 400) {
				toast.error("You already are an admin!")
			}
			else if (response.status === 403) {
				toast.error("That is not the right key!")
			}
			return response.json();
		}
		postData().then((data) => {
			location.assign(`/users/${id}`)
		})
	}
	if(session?.user.id === id) {
		// if(session?.user.personal_meeting_url) {
			return (
				<main className='bg-main bg-cover h-screen'>
					<div className='bg-black/40 content-center h-full flex flex-col md:px-48'>
						<div className=' m-auto w-full xl:w-2/3 justify-center p-10'>
							<h1 className="font-semibold text-3xl mb-5 text-white">Please enter the secret key to become an administrator: </h1>
							<form onSubmit={ handleSubmit } className=''>
								<div className="relative z-0 w-full mb-6 group ">
									<input onChange={ secretChange } value={ secret } type="password" name="floating_secret" id="floating_secret" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-nonefocus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
									<label htmlFor="floating_email" className="peer-focus:font-medium absolute text-lg text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Secret <span className='text-red-500'>*</span></label>
								</div>
								<button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
							</form>
						</div>
					</div>
				</main>
			)
	}	
	else {
		return(
			<main className='bg-main bg-cover h-screen'>
				<div className='bg-black/40 content-center h-full flex flex-col px-48 '>
					<div className=' m-auto w-2/3 justify-center p-10'>
						<h1 className="font-semibold text-3xl mb-5 text-white">Please do not try to edit another user's account! </h1>
					</div>
				</div>
			</main>
		)
		}
}

