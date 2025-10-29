import React from 'react'

const QuizzesStat = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border border-border">
            <div className="border border-border p-6 text-center rounded-lg shadow-md">
                <h1 className="text-blue-500">5</h1>
                <p>Available</p>
            </div>
            <div className="border border-border p-6 text-center rounded-lg shadow-md">
                <h1 className="text-success">1</h1>
                <p>Completed</p>
            </div>
            <div className="border border-border p-6 text-center rounded-lg shadow-md">
                <h1 className="text-yellow-500">3</h1>
                <p>Pending</p>
            </div>
            <div className="border border-border p-6 text-center rounded-lg shadow-md">
                <h1 className="text-blue-700">66%</h1>
                <p>Average Score</p>
            </div>
        </div>
    )
}
export default QuizzesStat
