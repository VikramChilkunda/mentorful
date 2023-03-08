import { SessionProvider } from "next-auth/react"

import Layout from '../components/Layout'
export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    return (
        <Layout>
            <SessionProvider session={ session }>
                <Component { ...pageProps } />
            </SessionProvider>
        </Layout>
    )
}