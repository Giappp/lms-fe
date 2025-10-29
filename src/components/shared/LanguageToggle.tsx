import React from 'react'
import {Button} from "@/components/ui/button";
import {faLanguage} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const LanguageToggle = () => {
    return (
        <Button variant="ghost"
                className="rounded-full transition-colors text-icon hover:bg-white/10 border-1 border-ring hover:shadow-md">
            <FontAwesomeIcon icon={faLanguage}/>
        </Button>
    );
}
export default LanguageToggle
