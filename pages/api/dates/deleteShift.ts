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
            toast.success("Succesfully cancelled your shift!")
            res.status(200).json(resource)
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
            toast.success("Succesfully cancelled your meeting!")
            res.status(200).json(resource2);
            break;
        default:
            res.status(400)
    }

    
    // res.send(resource)
}