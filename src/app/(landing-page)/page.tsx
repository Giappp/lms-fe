import {NavBar} from "@/app/ui/NavBar";
import HeroSection from "@/app/(landing-page)/components/HeroSection";
import FeaturesSection from "@/app/(landing-page)/components/FeaturesSection";
import StatsSection from "@/app/(landing-page)/components/StatsSection";
import TestimonialSection from "@/app/(landing-page)/components/TestimonialSection";
import PricingSection from "@/app/(landing-page)/components/PricingSection";
import DemoRoleSection from "@/app/(landing-page)/components/DemoRoleSection";
import Footer from "@/app/(landing-page)/components/Footer";

export default function Home() {
    return (
        <>
            <NavBar/>
            <HeroSection/>
            <FeaturesSection/>
            <StatsSection/>
            <TestimonialSection/>
            <PricingSection/>
            <DemoRoleSection/>
            <Footer/>
        </>
    )
}
