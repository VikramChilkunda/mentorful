import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from "next";
import toast, { Toaster } from 'react-hot-toast';


export function dateToText(date) {
	if (date === 1 || date === 21 || date == 31) return `${date}st`
	if (date === 2 || date === 22) return `${date}nd`
	if (date === 3 || date === 23) return `${date}rd`
	if (date >= 4 && date <= 20 || date >= 24 && date <= 30) return `${date}th`
}
export default function generate(displacement, date) {
	const month = date.getMonth();
    console.log("date: ", date.getMonth(), "/", date.getDate())
	let dates = []
	let counter = 0
	const daysInMonth = (year, month) => new Date(year, month+1, 0).getDate();
	const year = date.getFullYear()
	const numDaysPrevMonth = daysInMonth(year, month - 1)
	// console.log("number of days in the previous month: ", numDaysPrevMonth)
	const numDaysCurrMonth = daysInMonth(year, month)
	// console.log("number of days in the current month: ", numDaysCurrMonth)

	if(date.getDate() - displacement <= 0){
		//if beginning of week is previous month
		for (let i = displacement; date.getDate() - i <= 0 && counter < 7; i--, counter++) {
			// console.log(`Loop iteration ${i}`, date.getDate() - i + numDaysPrevMonth)
			const prevMonthDateObj = date
			prevMonthDateObj.setMonth(month - 1)
			dates.push({
				month: month - 1,
				date: date.getDate() - i + numDaysPrevMonth,
				name: prevMonthDateObj.toLocaleString('en-US', { month: "long" }) + " " + dateToText(date.getDate() - i + numDaysPrevMonth)
			})
			console.log("a: pushing here:", dates)
		}
		const currMonthDateObj = date
		currMonthDateObj.setMonth(month)
		console.log("counter before: ", counter)
		//rest of the week, which is in the current month
		for(let i = counter; i < 7; i++) {
			dates.push({
				month: month,
				date: date.getDate() - displacement + i,
				name: currMonthDateObj.toLocaleString('en-US', { month: "long" }) + " " + dateToText(date.getDate() -displacement + i)
			})
			console.log("b: pushing here:", dates)
			console.log('value of i: ', i)
		}
		return dates;
	}
	else if(date.getDate() + (6 - displacement) <= numDaysCurrMonth) {
		for (let i = displacement; counter < 7; i--, counter++) {
			const currDate = date
			dates.push({
				month: month,
				date: date.getDate() - i,
				name: currDate.toLocaleString('en-US', { month: "long" }) + " " + dateToText(date.getDate() -i) 
			})
			console.log("c: pushing here:", dates)
		}
		return dates;
	}
	else {
		for(let i = 0; date.getDate() - displacement + i <= numDaysCurrMonth; i++, counter++){
			const currMonthDateObj = date
			currMonthDateObj.setMonth(month)
			dates.push({
				month: month,
				date: date.getDate() - displacement + i,
				name: currMonthDateObj.toLocaleString('en-US', { month: "long" }) + " " + dateToText(date.getDate() - displacement + i)
			})
			console.log("d: pushing here:", dates)
		}	
		for(let i = 0; i < 7 - counter; i++, counter++){
			// console.log('dsjaflsd')
			const nextMonthDateObj = date
			nextMonthDateObj.setMonth(month + 1)
			dates.push({
				month: month + 1,
				date: i+1,
				name: nextMonthDateObj.toLocaleString('en-US', { month: "long" }) + " " + dateToText(i+1)
			})
			console.log("e: pushing here:", dates)
		}
		return dates;
	}
}


export  function generateV2() {
	const today = new Date();
	const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
	const startOfWeek = new Date(today); // Clone today's date
	startOfWeek.setDate(today.getDate() - currentDay - 1); // Get the first day of the week
	
	const dates = [];
	for (let i = 0; i < 7; i++) {
		const date = new Date(startOfWeek);
		date.setDate(startOfWeek.getDate() + i);
		dates.push(date);
	}
	
	console.log("generated dates")
	const returnDates = []
	for(let i = 0; i < dates.length; i++) {
		returnDates.push({
			month: dates[i].getMonth(),
			date: dates[i].getDate(),
			name: dates[i].toLocaleString('en-US', {month: "long"}) + " " + dateToText(dates[i].getDate())
		})
	}
	console.log("adding the following dates: ", returnDates)
	return returnDates
}