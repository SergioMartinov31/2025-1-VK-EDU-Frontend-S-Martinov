import HeaderSection from '@/components/HeaderSection/HeaderSection'
import HeroSection from '@/components/HeroSection/HeroSection'
import FeaturesSection from '@/components/FeaturesSection/FeaturesSection'
import FooterSection from '@/components/FooterSection/FooterSection'
import FeedbackForm from '@/components/FeedbackForm/FeedbackForm'
import ScreenshotsSection from '@/components/ScreenshotsSection/ScreenshotsSection'

export default function Home() {
  return (
    <>
      <HeaderSection />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ScreenshotsSection />
        <FeedbackForm />
      </main>
      <FooterSection />
    </>
  )
}