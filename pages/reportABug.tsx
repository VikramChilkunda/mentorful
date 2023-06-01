import Link from 'next/link'
// import styles from './page.module.css'
import { useRouter } from 'next/router'
import prisma from '@/prisma/client'
import React, { BaseSyntheticEvent, Component, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export async function getServerSideProps({ params }) {
    let title = 'Report a Bug'
	return {
		props: {
			title
		}
	}
}



export default function Profile() {

	
	async function handleSubmit() {
		const params = [text]
		
		const response = await fetch('/api/reportabug', {
			method: "POST",
			body: JSON.stringify(text)
		})
		if(response.status === 200) {
			toast.success("Succesfully sent the report!")
            location.assign('/')
		} else {
			toast.error("Unable to send the report!")
		}
	}
	const [text, setText] = useState()
	function textChange(e: BaseSyntheticEvent) {
		setText(e.target.value);
	}
	return (
		<div className='bg-main bg-cover h-screen'>
			<div className='h-full bg-black/40'>
				<div className='max-w-xl md:mx-auto mx-10 pt-10'>
                    <p className="text-3xl font-bold text-white mb-10 text-left">Please enter your feedback of the website or any bugs you may have experienced: </p>
					<div className="relative z-0 w-full mb-6 group ">
						<label htmlFor="floating_email" className="peer-focus:font-medium text-sm text-white
						peer-focus:-translate-y-6">Description</label>
						<textarea onChange={textChange} className="border-2 resize-y p-5 block w-full text-sm text-white bg-transparent border-b-2 border-gray-300 appearance-none 
						focus:outline-none focus:ring-0 peer max-h-[300px] min-h-[100px]" value={text} />
					</div>
					<button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto max-w-sm">
					Submit
					</button>
				</div>
			</div>
		</div>

	)
}

