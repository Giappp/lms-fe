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
import {ChevronRight} from "lucide-react"

type Role = 'teacher' | 'student'

interface BreadcrumbItemType {
    title: string
    href: string
}

const SPECIAL_TITLES: Record<string, string> = {
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
    'profile': 'Profile',
    'settings': 'Settings',
    'edit': 'Edit',
}

const DashboardBreadcrumb = () => {
    const pathname = usePathname()
    const paths = pathname.split("/").filter(Boolean)

    // Detect role from pathname
    const role: Role = paths.includes('teacher') ? 'teacher' : 'student'

    const generateTitle = (path: string): string => {
        // Check special titles first
        if (SPECIAL_TITLES[path]) {
            return SPECIAL_TITLES[path]
        }

        // Check if it's a UUID or ID pattern (e.g., course IDs)
        if (/^[a-f0-9-]{36}$/i.test(path) || /^\d+$/.test(path)) {
            return 'Details'
        }

        // Convert kebab-case to Title Case
        return path
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    }

    const generateBreadcrumbItems = (): BreadcrumbItemType[] => {
        const items: BreadcrumbItemType[] = []

        // Always start with dashboard
        items.push({
            title: "Dashboard",
            href: `/${role}`,
        })

        // Skip role name in the paths array
        const roleIndex = paths.indexOf(role)
        if (roleIndex === -1) return items

        const relevantPaths = paths.slice(roleIndex + 1)
        let currentPath = ""

        for (const path of relevantPaths) {
            currentPath += `/${path}`
            const fullPath = `/${role}${currentPath}`

            items.push({
                title: generateTitle(path),
                href: fullPath,
            })
        }

        return items
    }

    const items = generateBreadcrumbItems()

    // Hide breadcrumb if we're at the root dashboard
    if (pathname === `/${role}` || items.length <= 1) {
        return null
    }

    return (
        <div
            className="hidden md:flex items-center px-6 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Breadcrumb>
                <BreadcrumbList>
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1

                        return (
                            <React.Fragment key={item.href}>
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <BreadcrumbPage className="font-medium">
                                            {item.title}
                                        </BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link
                                                href={item.href}
                                                className="transition-colors hover:text-foreground"
                                            >
                                                {item.title}
                                            </Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && (
                                    <BreadcrumbSeparator>
                                        <ChevronRight className="h-4 w-4"/>
                                    </BreadcrumbSeparator>
                                )}
                            </React.Fragment>
                        )
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}

export default DashboardBreadcrumb