import Link from 'next/link'
// import styles from './page.module.css'
import { useRouter } from 'next/router'
import prisma from '@/prisma/client'
import React, { BaseSyntheticEvent, Component, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export async function getServerSideProps({ params }) {
	const data = await prisma.user.findFirst({
		where: {
			id: params.id
		}
	});
	console.log("Found user: ",data)

	return {
		props: {
			data
		}
	}
}



export default function Profile({ data }) {
	const router = useRouter()
	if(!data) return
	if(!data.mentor){
		return (
			<div className='bg-main bg-cover h-screen'>
				<div className='h-full bg-black/40'>
					<div className="w-1/2 mx-auto bg-white/20 p-20 flex flex-col content-center justif">
						<p className="text-3xl font-bold text-white mb-4 text-center">This page is meant for mentors.</p>
					</div>
				</div>
			</div>
		)
	}
	
	async function handleSubmit() {
		const id = data.id
		const params = [id, [...data.subjects], meeting, password]
		if(!data.mentor)
			return;
		
		const response = await fetch('/api/users/updateUser', {
			method: "POST",
			body: JSON.stringify(params)
		})
		if(response.status === 200) {
			toast.success("Succesfully updated your profile!")
			location.assign(`/users/${data.id}`)
		} else {
			toast.error("Unable to update your profile!")
		}
	}
	const [meeting, setMeeting] = useState(data.personal_meeting_url)
	const [password, setPassword] = useState(data.meeting_password)
	function meetingChange(e: BaseSyntheticEvent) {
		setMeeting(e.target.value);
        console.log(meeting)
	}
	function passwordChange(e: BaseSyntheticEvent) {
		setPassword(e.target.value);
        console.log(password)
	}
	return (
		<div className='bg-main bg-cover h-screen'>
			<div className='h-full bg-black/40'>
				<div className='max-w-lg md:mx-auto mx-10 pt-10'>
                    <p className="text-3xl font-bold text-white mb-10 text-center">Zoom Information</p>
					<div className="relative z-0 w-full mb-6 group ">
						<label htmlFor="floating_email" className="peer-focus:font-medium text-sm text-white
						peer-focus:-translate-y-6">Zoom Meeting URL (personal meeting URL preferred but not necessary)</label>
						<input onChange={meetingChange} type="text" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none 
						focus:outline-none focus:ring-0 focus:border-blue-600 peer" value={meeting} />
					</div>
					<div className="relative z-0 w-full mb-6 group ">
						<label htmlFor="floating_email" className="peer-focus:font-medium text-sm text-white
						peer-focus:-translate-y-6">Zoom Meeting password (if required)</label>
						<input onChange={passwordChange}  type="text" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none 
						focus:outline-none focus:ring-0 focus:border-blue-600 peer" value={password}/>
					</div>
					<button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto max-w-sm">
					Submit
					</button>
				</div>
			</div>
		</div>

	)
}

