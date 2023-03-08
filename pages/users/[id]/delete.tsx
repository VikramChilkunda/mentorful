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
	console.log(data)
	
	return {
		props: {
			data
		}
	}
}

export async function handleSubmit() {

}	

export default function Profile({data}) {
	const router = useRouter()
  	const { id } = router.query
	console.log(data)
    const [username, setUsername] = useState(data.username);
	const [email, setEmail] = useState(data.email);
	const [password, setPassword] = useState(data.password);
	function usernameChange(e: BaseSyntheticEvent) {
		setUsername(e.target.value);
	}
	function emailChange(e: BaseSyntheticEvent) {
		setEmail(e.target.value);
	}
	function passwordChange(e: BaseSyntheticEvent) {
		setPassword(e.target.value);
	}
    async function handleSubmit(e: BaseSyntheticEvent) {
		e.preventDefault();
		const postData = async () => {
			const data = {
				username, email, password, id
			};
			const response = await fetch("/api/users/updateUser", {
				method: "POST",
				body: JSON.stringify(data),
			});
			return response.json();
		}
		postData().then((data) => {
			// alert('getting here')
			router.push(`/users/${id}`)
		})
		// const data = await newUser();
	}
	return (
	<main className='py-4 px-48'>
		<form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">username</label>
                <input type="text" onChange={usernameChange} defaultValue={data.username}></input>
            </div>
            <div>
                <label htmlFor="email">email</label>
                <input type="text" onChange={emailChange} defaultValue={data.email}></input>
            </div>
            <div>
                <label htmlFor="password">password</label>
                <input type="text" onChange={passwordChange} defaultValue={data.password}></input>
            </div>
            <button>Submit</button>
        </form>
	</main>
	)
}

