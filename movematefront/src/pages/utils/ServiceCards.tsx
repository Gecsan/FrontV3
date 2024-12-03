import useService from "@/api/Services";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"


import { toast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
export type ServiceCard = {
  id: number;
  description: string;
  name: string;
};

const ListServiceCards = (serviceCards: ServiceCard[]) => {
  return serviceCards?.map((serviceCard) => (
    <div
      className="col-span-12 lg:col-span-4 xl:col-span-3 md:col-span-3"
      key={serviceCard.id}
    >
      {/* <div className="card mb-0 h-40 flex items-center justify-center">
            <i className="fa-solid fa-location-dot"></i>
            <p>{serviceCard.city_name}</p>
          </div> */}

      <Card>
        <CardHeader>
          <CardTitle>
            <p className="text-sm font-bold underline underline-offset-2">
              {serviceCard.name}
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="flex items-center justify-start gap-2">
            <p>{serviceCard.description}</p>
          </span>
        </CardContent>
        <CardFooter className="px-2 " >
         <div className="w-full flex flex-wrap  items-center justify-between gap-2">
         <Button variant="link">
            <i className="fa-solid fa-star-half-stroke"></i>
            Add Review
          </Button>


          <Drawer>
  <DrawerTrigger asChild>
  <Button
                className="text-sm"
                onClick={() => console.log(serviceCard.id)}
                variant="ghost"
              >
                View Reviews
              </Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Reviews</DrawerTitle>
      <DrawerDescription> These are the reviews for : <b>mover new</b></DrawerDescription>
    </DrawerHeader>

    <div className="grid gap-4 p-4">
                <div className="flex items-start gap-2 justify-start">
                  <Avatar>
               
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="flex items-center justify-start gap-2">
                      <p className="font-semibold">Rating:</p>
                      <p>4</p>
                    </span>
                    <span className="font-light text-sm">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    </span>
                  </div>
                </div>
              </div>


    <DrawerFooter>
      
      <DrawerClose className=" text-start">
        <Button variant="outline" className="bg-orange-600 text-white">Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>



   
         </div>
          {/* <Button variant="ghost">View Reviews</Button> */}
        </CardFooter>
      </Card>
    </div>
  ));
};

const ServiceCards = () => {
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const service = new useService();

  const fetchServiceCards = async () => {
    setIsLoading(true);
    try {
      const response = await service.fetchMoveServices();
      console.log(response);
      setServiceCards(response);
    } catch (error) {
      console.error("Error fetching services", error);
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceCards();
  }, []);

  return (
    <div className="w-full h-full">
      {/* <p className="tex-lg font-bold">My ServiceCards</p> */}
      <div className="w-full">
        {serviceCards?.length ? (
          <div className="grid grid-cols-12 gap-8 my-4">
            {ListServiceCards(serviceCards)}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center h-[50vh] ">
            <Card>
              <CardHeader>
                <CardTitle>
                  <p className=" font-bold underline underline-offset-2">
                    Empty
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="flex items-center justify-start gap-2">
                  <p>Services not available</p>
                </span>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCards;
