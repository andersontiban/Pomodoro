import { login, signup } from './actions'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <form className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
                    Welcome
                </h2>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex justify-between space-x-4">
                    <button
                        formAction={login}
                        className="w-full rounded-lg bg-indigo-600 text-white py-2 font-semibold hover:bg-indigo-700 transition"
                    >
                        Log in
                    </button>
                    <button
                        formAction={signup}
                        className="w-full rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 py-2 font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                    >
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    )
}
