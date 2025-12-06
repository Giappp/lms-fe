import React from 'react'

interface WelcomeSectionProps {
    fullName: string | undefined;
    upcomingAssignments: number;
}

const WelcomeSection = ({fullName, upcomingAssignments}: WelcomeSectionProps) => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {fullName}</h1>
            <p className="text-muted-foreground mt-1">You have {upcomingAssignments} upcoming assignments due this
                week.</p>
        </div>
    )
}
export default WelcomeSection
