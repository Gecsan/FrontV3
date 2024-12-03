import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QuoteCard } from "./utils/QuoteCard";

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
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

const NavigationBar = () => {
  return (
    <nav className="max-w-[90%] mx-auto w-full flex items-center justify-between p-4  my-2">
      <Link to="/" className="font-black text-lg">
        MoveMate.
      </Link>
      <div className="flex items-center justify-start gap-2">
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
    <div className="w-[90%] mx-auto my-4  flex items-center justify-between gap-4">
      <Carousel
        plugins={[plugin.current]}
        className="w-full "
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          <CarouselItem>
            <div className="w-full  h-full flex items-end justify-center flex-col px-6">
              <div className="flex flex-col gap-2 mb-4 items-center">
                <span className="flex items-center justify-start gap-2 text-3xl font-bold ">
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
        src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d387191.33750346623!2d-73.979681!3d40.6974881!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ske!4v1732507701139!5m2!1sen!2ske"
        width="1000"
        height="450"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ height: "500px", width: "100%" }}
        className="rounded "
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
  return (
    <div>
      <NavigationBar />
      <Header />
      <InfoSection />
      <MapSection />
      <Footer />
    </div>
  );
};

export default HomePage;
