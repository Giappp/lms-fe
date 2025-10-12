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

    const generateTitle = (path: string) => {
        // Convert kebab-case to Title Case
        return path
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    }

    const generateBreadcrumbItems = () => {
        const items = []
        let currentPath = ""

        // Always start with dashboard
        items.push({
            title: "Student",
            href: "/student",
        })

        // Skip 'dashboard' in the paths array since we already added it
        const relevantPaths = paths.slice(paths.indexOf("student") + 1)

        for (const path of relevantPaths) {
            currentPath += `/${path}`
            items.push({
                title: generateTitle(path),
                href: currentPath,
            })
        }

        return items
    }

    const items = generateBreadcrumbItems()

    // Hide breadcrumb if we're at the root student path
    if (pathname === "/student") {
        return null;
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
