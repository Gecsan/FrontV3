import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MovingDate } from "./MovingDate";
import { quotePayloadType } from "@/utils/types";
import useService from "@/api/Services";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function QuoteCard() {
  const [services, setServices] = useState([]);
  const [sizes, setSizes] = useState([]);
  const fetchServices = async () => {
    await service
      .fetchMoveServices()
      .then((response) => {
        console.log(response);
        setServices(response);
      })
      .catch((error) => {
        console.error("Error fetching services ___ ", error);
      });
  };

  const fetchSizes = async () => {
    await service
      .fetchMoveSizes()
      .then((response) => {
        console.log(response);
        setSizes(response);
      })
      .catch((error) => {
        console.error("Error fetching sizes ___ ", error);
      });
  };

  const defaultQuotePayload = {
    origin: {
      name: "",
      has_stairs: false,
    },
    destination: {
      name: "",
      has_stairs: false,
    },
    move_type_id: "",
    move_size_id: "",
    move_date: "",
    email: "",
  };

  const [currentPayload, setCurrentPayload] =
    useState<quotePayloadType>(defaultQuotePayload);

  const [open, setOpen] = useState(false);
  const closeDialog = () => setOpen(false);

  const service = new useService();

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    const formatPayload = {
      ...currentPayload,
      // origin: currentPayload.origin.name,
      // destination: currentPayload.destination.name,
      move_date: new Date(currentPayload.move_date),
    };

    console.log("Form submitted with the following data:", formatPayload);

    await service
      .createQuote(formatPayload)
      .then((response) => {
        console.log("Quote created ___ ", response);

        toast({
          title: "Success",

          description: (
            <span className="flex items-center justify-start gap-2">
              <i className="fa-solid fa-circle-check text-green-600 !text-xl"></i>
              <p>Details submitted</p>
            </span>
          ),
        });

        closeDialog();
      })
      .catch((error) => {
        console.error("Error creating quote ____ ", error);
        toast({
          title: "Error",
          variant: "destructive",
          description: (
            <span className="flex items-center justify-start gap-2">
              <p>Error getting quote, please try again..</p>
            </span>
          ),
        });
      })
      .finally(() => {
        setCurrentPayload(defaultQuotePayload);
      });
  };

  useEffect(() => {
    fetchServices();
    fetchSizes();
  }, []);

  return (
    <Card className="w-[70%] mx-auto">
      <CardHeader>
        <CardTitle>Get a quote</CardTitle>
        <CardDescription>Get a quote in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="quote-form">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                name="origin"
                placeholder="From Zip"
                value={currentPayload.origin.name}
                onChange={(e) =>
                  setCurrentPayload((prev) => ({
                    ...prev,
                    origin: { ...prev.origin, name: e.target.value },
                  }))
                }
              />
              <div className="flex items-center space-x-2 my-2">
                <input
                  type="checkbox"
                  id="origin_stairs"
                  name="origin_stairs"
                  checked={currentPayload.origin.has_stairs}
                  onChange={(e: any) =>
                    setCurrentPayload((prev) => ({
                      ...prev,
                      origin: {
                        ...prev.origin,
                        has_stairs: e.target.checked,
                      },
                    }))
                  }
                />
                <label
                  htmlFor="origin_stairs"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Has stairs
                </label>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                name="destination"
                placeholder="To Zip"
                value={currentPayload.destination.name}
                onChange={(e) =>
                  setCurrentPayload((prev) => ({
                    ...prev,
                    destination: { ...prev.destination, name: e.target.value },
                  }))
                }
              />
              <div className="flex items-center space-x-2 my-2">
                <input
                  type="checkbox"
                  id="destination_stairs"
                  name="destination_stairs"
                  checked={currentPayload.destination.has_stairs}
                  onChange={(e: any) =>
                    setCurrentPayload((prev) => ({
                      ...prev,
                      destination: {
                        ...prev.destination,
                        has_stairs: e.target.checked,
                      },
                    }))
                  }
                />
                <label
                  htmlFor="destination_stairs"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Has stairs
                </label>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="service">Service</Label>
              <Select
                value={currentPayload.move_type_id}
                onValueChange={(value) =>
                  setCurrentPayload((prev) => ({
                    ...prev,
                    move_type_id: value,
                  }))
                }
              >
                <SelectTrigger id="move_type_id">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {services?.map((service: any) => (
                    <SelectItem value={service.id} key={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                  {/* <SelectItem value="Packing">Packing only</SelectItem>
                  <SelectItem value="Unpacking">Unpacking only</SelectItem>
                  <SelectItem value="Packing_unpacking">
                    Packing and unpacking
                  </SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="move_size">Size of move</Label>
              <Select
                value={currentPayload.move_size_id}
                onValueChange={(value) =>
                  setCurrentPayload((prev) => ({
                    ...prev,
                    move_size_id: value,
                  }))
                }
              >
                <SelectTrigger id="move_size_id">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {sizes?.map((size: any) => (
                    <SelectItem value={size.id} key={size.id}>
                      {size.name}
                    </SelectItem>
                  ))}
                  {/* <SelectItem value="Storage">Storage</SelectItem>
                  <SelectItem value="1_bedroom">1 bedroom</SelectItem>
                  <SelectItem value="2_bedroom">2 bedroom</SelectItem>
                  <SelectItem value="3_bedroom">3 bedroom</SelectItem>
                  <SelectItem value="4_bedroom">4 bedroom and up</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="moving_date">Moving date</Label>
              <Input
                type="date"
                id="move_date"
                name="move_date"
                value={currentPayload.move_date}
                onChange={(e) =>
                  setCurrentPayload((prev) => ({
                    ...prev,
                    move_date: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentPayload(defaultQuotePayload)}
        >
          Clear
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              form="quote-form"
              disabled={
                !currentPayload.origin ||
                !currentPayload.destination ||
                !currentPayload.move_type_id ||
                !currentPayload.move_size_id ||
                !currentPayload.move_date
              }
            >
              Get quote
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter Email address</DialogTitle>
              <DialogDescription>
                A quote will be sent to the email address you submit
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-start justify-start gap-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="user@email.com"
                  className="col-span-3"
                  value={currentPayload.email}
                  onChange={(e) =>
                    setCurrentPayload((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
