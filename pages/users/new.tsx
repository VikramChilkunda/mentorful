import React, { BaseSyntheticEvent, Component, useState, useEffect } from 'react';

import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import prisma from '@/prisma/client'

export default function Form() {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	function usernameChange(e: BaseSyntheticEvent) {
		console.log(e)
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
			console.log('here')
			const data = {
				username, email, password
			};
		  const response = await fetch("/api/get", {
			method: "POST",
			body: JSON.stringify(data),
		  });
		  return response.json();
		}
		postData().then((data) => {
			navigate('/')
		})
		// const data = await newUser();
	}
	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="username">Username</label>
				<input type="text" onChange={usernameChange} name="username" id="username" />
			</div>
			<div>
				<label htmlFor="email">Email</label>
				<input type="text" onChange={emailChange} name="email" id="email" />
			</div>
			<div>
				<label htmlFor="password">Password</label>
				<input type="text" onChange={passwordChange} name="password" id="password" />
			</div>
			<button>Submit</button>
		</form>
	);
}




