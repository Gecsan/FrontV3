import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QuoteCard } from "./utils/QuoteCard";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/admin/utils/CustomTabs";

import ServiceCards from "./utils/ServiceCards";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const NavigationBar = ({ toggleDarkMode, isDarkMode }: { toggleDarkMode: () => void; isDarkMode: boolean }) => {
  return (
    <nav className="max-w-[90%] mx-auto w-full flex items-center justify-between p-4 my-2">
      <Link to="/" className="font-black text-lg flex items-center">
        <i className="fa-solid fa-people-carry-box mr-2"></i>
        MoveMate.
      </Link>

      <div className="flex items-center justify-start gap-2">
        <Button variant="outline" onClick={toggleDarkMode}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </Button>
        <Button variant="link" asChild>
          <Link to="/register">Register</Link>
        </Button>
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </nav>
  );
};

const Header = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <div className="w-[90%] mx-auto my-4 flex items-center justify-between gap-4">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          <CarouselItem>
            <div className="w-full h-full flex items-end justify-center flex-col px-6">
              <div className="flex flex-col gap-2 mb-4 items-center">
                <span className="flex items-center justify-start gap-2 text-3xl font-bold">
                  <p>MoveMate</p>
                  <i className="fa-solid fa-people-carry-box"></i>
                </span>
                <small>Moving Made Simple</small>
              </div>

              <p className="font-light text-sm w-[70%] text-justify">
               MoveMate is a web application designed to simplify and
               streamline the moving process for both individuals and
               businesses. It provides accurate quotes, personalized moving
               plans, and real-time updates, allowing users to track their
               moves and connect with verified service providers. The platform
               facilitates seamless communication, enabling users to compare
               rates, review services, and securely book moves. Key features
               include schedule management, cost tracking, service ratings, and
               personalized recommendations. With an intuitive dashboard and
               data-driven insights, MoveMate offers a reliable, transparent,
               and efficient moving experience from start to finish.
             </p>
           </div>
         </CarouselItem>


         <CarouselItem>
           <div className="p-1">
             <div className="w-full ">
               <img
                 src="https://i.pinimg.com/736x/58/70/62/5870627b83045febecdef91a2c5ddcc9.jpg"
                 alt="test image"
                 className="w-full h-full object-fit rounded"
               />
             </div>
           </div>
         </CarouselItem>
         <CarouselItem>
           <div className="p-1">
             <div className="w-full ">
               <img
                 src="https://i.pinimg.com/originals/c4/9a/20/c49a207e0f89c9290d98fd43a87a8cb0.gif"
                 alt="test image"
                 className="w-full h-full object-fit rounded"
               />
             </div>
           </div>
         </CarouselItem>
         <CarouselItem>
           <div className="p-1">
             <div className="w-full ">
               <img
                 src="https://i.pinimg.com/originals/0b/6a/36/0b6a3646a6e8afbb366903bfa10301b8.gif"
                 alt="test image"
                 className="w-full h-full object-fit rounded"
               />
             </div>
           </div>
         </CarouselItem>
       </CarouselContent>
       <CarouselPrevious />
       <CarouselNext />
     </Carousel>




     <div className="w-full">
       <QuoteCard />
     </div>
   </div>
 );
};


const InfoSection = () => {
  return (
    <div className="max-w-[90%] w-full mx-auto">
      <p className="text-3xl font-bold">Services</p>
      <ServiceCards />
    </div>
  );
};

const MapSection = () => {
  return (
    <div className="mx-auto w-[90%] rounded overflow-hidden py-6">
      <iframe
        src="https://www.google.com/maps/embed?pb=san_diego"
        width="1000"
        height="450"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ height: "500px", width: "100%" }}
        className="rounded"
      ></iframe>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="w-[90%] mx-auto">
      <p className="underline font-semibold underline-offset-2 text-end py-4 text-sm">
        Terms and conditions
      </p>
    </div>
  );
};

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div>
      <NavigationBar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <Header />
      <InfoSection />
      <MapSection />
      <Footer />
    </div>
  );
};

export default HomePage;