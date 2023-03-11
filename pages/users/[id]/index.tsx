import Link from 'next/link'
// import styles from './page.module.css'
import { useRouter } from 'next/router'
import prisma from '@/prisma/client'
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export async function getServerSideProps({ params }) {
    const data = await prisma.user.findFirst({
        where: {
            id: params.id
        },
        include: {
            shift: true
        }
    });
    // console.log(data)

    return {
        props: {
            data
        }
    }
}

function User(props) {
    const exists = props.user
    if (exists) {
        return <h1 id='usernamefjdlaskjfl'>Username: { props.user.username }</h1>
    }
    else {
        return <h1>No User Found</h1>
    }
}

function Email(props) {
    const exists = props.user
    if (exists) {
        return <h2>Email: { props.user.email }</h2>
    }
    else {
        return <h1>No User Found</h1>
    }
}

function Shift(props) {
    const exists = props.user
    console.log(exists);
    
    if(exists) {
        return <>
            <h2>Shift from: {exists.shift.from}-{exists.shift.to} on 3/{exists.shift.date}  </h2>
        </>
    }   
    else{
        return <h2>No User Found</h2>
    }
}
function Delete(props) {
    const router = useRouter()
    const exists = props.user
    if (exists) {
        return <form onSubmit={ handleSubmit }><button>Delete</button></form>
    }
    else {
        return <h1>No User Found</h1>
    }
    async function handleSubmit(e) {
        e.preventDefault();
        const userData = async () => {
            const { id } = router.query;
            const response = await fetch("/api/users/deleteUser", {
                method: "POST",
                body: JSON.stringify(id),
            });
            return response.json();
        }
        userData().then((data) => {
            alert('getting here')
            router.push('/')
        })
    }
}

function MyDateComp() {
    const [startDate, setStartDate] = useState(new Date());
    return (
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
    );
}



export default function Profile({ data }) {
    const router = useRouter()
    const { id } = router.query
    // console.log(data)
    return (
        <main className='py-4 px-48'>
            <div className='p-30'>
                <User user={ data } />
                <Email user={ data } />
                <Delete user={ data } /> <br />
                <Shift user={data}></Shift>
                <Link href={ `/users/${id}/edit` }>Edit</Link>
                <MyDateComp/>
            </div>
        </main>
    )
}

