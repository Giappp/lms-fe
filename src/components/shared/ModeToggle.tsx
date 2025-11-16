"use client"

import * as React from "react"
import {useEffect, useState} from "react"
import {useTheme} from "next-themes"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoon, faSun} from "@fortawesome/free-solid-svg-icons";
import {Button} from "@/components/ui/button";

export function ModeToggle() {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    // Ensure theme is mounted to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Button variant={"ghost"}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full transition-colors text-icon hover:bg-white/10 border-1 border-ring hover:shadow-md"
                aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <FontAwesomeIcon icon={faSun}/>
            ) : (
                <FontAwesomeIcon icon={faMoon}/>
            )}
        </Button>
    );
}

