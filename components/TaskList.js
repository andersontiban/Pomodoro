
'use client';
import {useState} from 'react'

export default function TaskList() {
    const [tasks, setTasks] = useState([])
    const [newTask, setNewTask] = useState('')

    const addTask = () => {
        if (newTask.trim() !== '') {
            setTasks([...tasks, {text: newTask, done: false}])
            setNewTask('')
        }
    }

    const toggleTask = (index) => {
        const updated = [...tasks]
        updated[index].done = !updated[index].done
        setTasks(updated)
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
            <div className="flex mb-4">
                <input
                    value = {newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-1 p-2 border rounded-l"
                    placeholder="New task..."
                />
                <button onClick={addTask} className="bg-blue-500 p-2 rounded-r text-white">
                    Add
                </button>
            </div>
            <ul>
                {tasks.map((task, idx) => (
                    <li
                        key = {idx}
                        onClick={() => toggleTask(idx)}
                        className={`p-2 cursor-pointer ${task.done ? 'line-through text-gray-400' : ''}`}
                    >
                        {task.text}
                    </li>
                ))}
            </ul>

        </div>
    )
}