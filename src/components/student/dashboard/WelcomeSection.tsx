import React from 'react'

interface WelcomeSectionProps {
    fullName: string | undefined;
}

const WelcomeSection = ({fullName}: WelcomeSectionProps) => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {fullName}</h1>
        </div>
    )
}
export default WelcomeSection
