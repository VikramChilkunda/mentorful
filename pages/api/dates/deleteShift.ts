import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from "next";
import toast, { Toaster } from 'react-hot-toast';

export default  async function deleteAllUsers(req: NextApiRequest, res: NextApiResponse) {
    const id = JSON.parse(req.body)[0], option = JSON.parse(req.body)[1]

    switch(option) {
        case 'mentor': 
            const resource = await prisma.shift.delete({
                where: {
                    id: parseInt(id)
                }
            })
            res.status(200).send(resource)
            break;
        case 'student':           
            const resource2 = await prisma.shift.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    studentId: null,
                    filled: false
                }
            })
            // console.log('getting here, student case');

            res.status(200).send(resource2)
            break;
        default:
            // console.log('getting here, default case');
            res.status(400)
    }

    
    // res.send(resource)
}