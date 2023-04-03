import Link from 'next/link'
// import styles from './page.module.css'
import { useRouter } from 'next/router'
import prisma from '@/prisma/client'
import React, { BaseSyntheticEvent, Component, useState, useEffect } from 'react';

export async function getServerSideProps({params}) {
	const data = await prisma.user.findFirst({
		where: {
			id: params.id
		}
	});	
	return {
		props: {
			data
		}
	}
}

export default function Profile({data}) {
	const router = useRouter()
  	const { id } = router.query
    const [secret, setSecret] = useState(data.username);
	function secretChange(e: BaseSyntheticEvent) {
		setSecret(e.target.value);
	}
    async function handleSubmit(e: BaseSyntheticEvent) {
		e.preventDefault();
		const postData = async () => {
			const data = {
				secret, id
			};
			const response = await fetch("/api/users/becomeMentor", {
				method: "POST",
				body: JSON.stringify(data),
			});
			return response.json();
		}
		postData().then((data) => {
            router.push(`/users/${id}`)
		})
	}
	return (
        
	<main className='py-4 px-48 content-center'>      
        <form onSubmit={handleSubmit}>
            <div className="relative z-0 w-3/5 mb-6 group ">
                <input onChange={secretChange} type="password" name="floating_secret" id="floating_secret" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Secret</label>
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>

	</main>
	)
}
