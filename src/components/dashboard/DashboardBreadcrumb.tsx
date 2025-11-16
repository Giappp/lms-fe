"use client"
import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {usePathname} from "next/navigation"
import Link from "next/link"

const DashboardBreadcrumb = () => {
    const pathname = usePathname()
    const paths = pathname.split("/").filter(Boolean)

    // Detect role from pathname
    const role = paths.includes('teacher') ? 'teacher' : 'student'

    const generateTitle = (path: string) => {
        // Special cases for specific paths
        const specialTitles: Record<string, string> = {
            'quizzes': 'Quizzes',
            'courses': 'Courses',
            'enrollments': 'Enrollments',
            'analytics': 'Analytics',
            'new': 'Create New',
            'templates': 'Templates',
            'import': 'Import',
            'my-courses': 'My Courses',
            'my-progress': 'My Progress',
            'results': 'Results',
            'profile': 'Profile'
        }

        if (specialTitles[path]) {
            return specialTitles[path]
        }

        // Convert kebab-case to Title Case
        return path
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    }

    const generateBreadcrumbItems = () => {
        const items = []
        let currentPath = ""

        // Always start with dashboard with the correct role path
        items.push({
            title: "Dashboard",
            href: `/${role}`,
        })

        // Skip role name in the paths array since we already added it as dashboard
        const relevantPaths = paths.slice(paths.indexOf(role) + 1)

        for (const path of relevantPaths) {
            currentPath += `/${path}`
            // Construct the full path with the role prefix
            const fullPath = `/${role}${currentPath}`
            items.push({
                title: generateTitle(path),
                href: fullPath,
            })
        }

        return items
    }

    const items = generateBreadcrumbItems()

    // Hide breadcrumb if we're at the root path for either role
    if (pathname === `/${role}`) {
        return null
    }

    return (
        <div className="hidden md:flex p-4 border-b bg-background">
            <Breadcrumb>
                <BreadcrumbList>
                    {items.map((item, index) => (
                        <React.Fragment key={item.href}>
                            <BreadcrumbItem>
                                {index === items.length - 1 ? (
                                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={item.href}>{item.title}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {index < items.length - 1 && <BreadcrumbSeparator/>}
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}

export default DashboardBreadcrumb
