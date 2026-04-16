import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { Calculator } from "../components/Calculator";
import { Advantages } from "../components/Advantages";
import { Gallery } from "../components/Gallery";
import { Footer } from "../components/Footer";

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Services />
      <Calculator />
      <Advantages />
      <Gallery />
      <Footer />
    </div>
  );
}
