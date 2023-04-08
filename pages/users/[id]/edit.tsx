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
	const subjects = [
		'Biology', 'Chemistry', 'Physics', 'Calculus', 'History', 'Statistics'
	]
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
	const userSubjects = data.subjects
	console.log("user: ", data)
	let selectedSubjects:Array<String> = []
	function handleSelect(e: BaseSyntheticEvent) {
		console.log("event: ", e)
		console.log("selectedSubjects", selectedSubjects)
		if(selectedSubjects.includes(e.target.name)){
			const index = selectedSubjects.indexOf(e.target.name)
			selectedSubjects.splice(index, 1)
		}
		else if(selectedSubjects.length < 3 && !selectedSubjects.includes(e.target.name)){
			selectedSubjects.push(e.target.name)
		}
		else if(selectedSubjects.length == 3 && !selectedSubjects.includes(e.target.name)){
			
			e.preventDefault();
		}
		console.log("array: ", selectedSubjects)

	}
	async function handleSubmit() {
		const params = [data.id, selectedSubjects]
		if(!data.mentor)
			return;
		if(selectedSubjects.length == 0){
			toast.error("Must select at least one subject!")
			return;
		}
		if(selectedSubjects.length > 3){
			toast.error("Too many subjects selected!")
			return;
		}
		const response = await fetch('/api/users/updateUser', {
			method: "POST",
			body: JSON.stringify(params)
		})
		if(response.status === 200) {
			toast.success("Succesfully updated your profile!")
			router.push(`/users/${data.id}`)
		} else {
			toast.error("Unable to update your profile!")
		}
	}
	return (
		<div className='bg-main bg-cover h-screen'>
			<div className='h-full bg-black/40'>
				<div className="w-1/2 mx-auto bg-white/20 p-20 flex flex-col content-center justif">
					<p className="text-3xl font-bold text-white mb-4 text-center">Subjects</p>
					<ul className="space-y-2 flex flex-col items-center">
						<span>
						{	
							subjects.map((subject) => (
								<li className='flex items-center mb-2' key={subject}>
									<input onClick={handleSelect} type="checkbox" id={subject} name={subject} className="mr-2"/>
									<label htmlFor={subject} className={`font-medium text-lg text-white ${(userSubjects.includes(subject) ? 'text-yellow-300' : 'text-black')}`}>{subject}</label>
								</li>
							))
						}
						</span>
					</ul>
					<button onClick={handleSubmit} className="bg-blue-500 w-1/3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto mt-7">
					Submit
					</button>
				</div>
			</div>
		</div>

	)
}

