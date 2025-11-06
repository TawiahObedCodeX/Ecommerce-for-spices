import Categories from "../Components/Categories";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection"

export default function Home() {

  return <div>
    <Navbar />
      <HeroSection />
    <Categories />
    <Footer />
  </div>;
}
