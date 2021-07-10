import React from 'react'
import Head from 'next/head'

const Home: React.FC = () => {
    return (
        <div className="bg-gray-400">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div
                className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 text-6xl"
                role="alert"
            >
                <p className="font-bold">Be Warned</p>
                <p>You are using Tailwind CSS!</p>
            </div>
        </div>
    )
}

export default Home
