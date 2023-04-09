import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from "next";
import toast, { Toaster } from 'react-hot-toast';

export default async function deleteAllUsers(req: NextApiRequest, res: NextApiResponse) {
	const date = new Date()
	const results = generate(date.getDay(), date)
	
	let dates = []
	const deletedShifts = await prisma.shift.deleteMany({})
	const deletedDates = await prisma.date.deleteMany({})
	// console.log("deleted dates: ", deletedDates)
	// console.log("deleted shifts: ", deletedShifts)
	for(const result of results) {
		const addDate = await prisma.date.create({
			data: {
				date: result.date,
				name: result.name,
				lastUpdated: date.getDate(),
				times: [
					8,9,10,11,12,13,14,15,16,17,18,19,20
				],
				month: result.month
			}
		})
		dates.push(addDate)
	}
	res.status(200).send(dates)
	
	

}
function dateToText(date) {
	if (date === 1 || date === 21 || date == 31) return `${date}st`
	if (date === 2 || date === 22) return `${date}nd`
	if (date === 3 || date === 23) return `${date}rd`
	if (date >= 4 && date <= 20 || date >= 24 && date <= 30) return `${date}th`
}
function generate(displacement, date) {
	// console.log("date input: ", date)
	// console.log("displacement: ", displacement)
	//displacement = days since sunday
	const month = date.getMonth();
	// console.log("month", month)

	let dates = []
	let counter = 0
	const daysInMonth = (year, month) => new Date(year, month+1, 0).getDate();
	const year = date.getFullYear()
	const numDaysPrevMonth = daysInMonth(year, month - 1)
	// console.log("number of days in the previous month: ", numDaysPrevMonth)
	const numDaysCurrMonth = daysInMonth(year, month)
	// console.log("number of days in the current month: ", numDaysCurrMonth)

	if(date.getDate() - displacement <= 0){
		for (let i = displacement; date.getDate() - i <= 0 && counter < 7; i--, counter++) {
			// console.log(`Loop iteration ${i}`, date.getDate() - i + numDaysPrevMonth)
			const prevMonthDateObj = date
			prevMonthDateObj.setMonth(month - 1)
			dates.push({
				month: month - 1,
				date: date.getDate() - i + numDaysPrevMonth,
				name: prevMonthDateObj.toLocaleString('en-US', { month: "long" }) + " " + dateToText(date.getDate() - i + numDaysPrevMonth)
			})
		}
		const currMonthDateObj = date
		currMonthDateObj.setMonth(month)
		for(let i = counter; i < 7; i++) {
			dates.push({
				month: month,
				date: date.getDate() - displacement + counter,
				name: currMonthDateObj.toLocaleString('en-US', { month: "long" }) + " " + dateToText(date.getDate())
			})
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
		}
		return dates;
	}
}
