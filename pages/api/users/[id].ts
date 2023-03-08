import { useRouter } from 'next/router'
const router = useRouter()
import type { NextApiRequest, NextApiResponse } from "next";

export default async function(req: NextApiRequest, res: NextApiResponse) {
    res.send(req.query)
}   