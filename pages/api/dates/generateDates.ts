import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from "next";
import toast, { Toaster } from 'react-hot-toast';

export default  async function deleteAllUsers(req: NextApiRequest, res: NextApiResponse) {
    const operator = new Date();
    const month = operator.getMonth();
    const day = operator.getDay(); //0 = sunday
    let dates = []
    if(day === 0) {
        dates = [
            {
              month: month,
              date: operator.getDate()  
            },
            {
              month: month,
              date: operator.getDate()+1  
            },
            {
              month: month,
              date: operator.getDate()+2  
            },
            {
              month: month,
              date: operator.getDate()+3
            },
            {
              month: month,
              date: operator.getDate()+4
            },
            {
              month: month,
              date: operator.getDate()+5  
            },
            {
              month: month,
              date: operator.getDate()+6
            },
        ]
    }
       
}

function generate(displacement) {
    return [
        {
            month: month,
            date: operator.getDate()  
          },
          {
            month: month,
            date: operator.getDate()+1  
          },
          {
            month: month,
            date: operator.getDate()+2  
          },
          {
            month: month,
            date: operator.getDate()+3
          },
          {
            month: month,
            date: operator.getDate()+4
          },
          {
            month: month,
            date: operator.getDate()+5  
          },
          {
            month: month,
            date: operator.getDate()+6
          }
    ]
}