import TaskList from "../../components/TaskList"
import Head from "next/head"
import Header from "../../components/Header"
import Timer from "../../components/Timer"

export default function Home() {
    return (
        <>
            <h1>Glory to God</h1>
            <Head>
                <title>FocusDeck</title>
            </Head>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
                <Header />
                <main className="mt-10 max-w-2xl mx-auto space-y-12">
                    <TaskList />
                    <Timer />
                </main>
            </div>
        </>
        
    ) 
}