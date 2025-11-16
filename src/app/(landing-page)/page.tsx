import {NavBar} from "@/components/shared/NavBar";
import HeroSection from "@/app/(landing-page)/ui/HeroSection";
import FeaturesSection from "@/app/(landing-page)/ui/FeaturesSection";
import StatsSection from "@/app/(landing-page)/ui/StatsSection";
import TestimonialSection from "@/app/(landing-page)/ui/TestimonialSection";
import PricingSection from "@/app/(landing-page)/ui/PricingSection";
import DemoRoleSection from "@/app/(landing-page)/ui/DemoRoleSection";
import Footer from "@/app/(landing-page)/ui/Footer";

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
