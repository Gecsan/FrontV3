import useService from "@/api/Services";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
export type Favorite = {
  id: number;

  city_name: string;
};

const ListFavorites = (favorites: Favorite[]) => {
  return favorites?.map((favorite) => (
    <div
      className="col-span-12 lg:col-span-4 xl:col-span-2 md:col-span-3"
      key={favorite.id}
    >
      {/* <div className="card mb-0 h-40 flex items-center justify-center">
            <i className="fa-solid fa-location-dot"></i>
            <p>{favorite.city_name}</p>
          </div> */}

      <Card>
        <CardHeader>
          <CardTitle>
            <p className="text-sm font-bold underline underline-offset-2">
              City
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="flex items-center justify-start gap-2">
            <i className="fa-solid fa-location-dot"></i>
            <p>{favorite.city_name}</p>
          </span>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="text-red-600">
            Remove
          </Button>
        </CardFooter>
      </Card>
    </div>
  ));
};

const Favorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const service = new useService();

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await service.fetchFavorites();
      setFavorites(response);
    } catch (error) {
      console.error("Error fetching favorites", error);
      toast({
        title: "Error",
        description: "Failed to fetch favorites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="w-full h-full">
      <p className="tex-lg font-bold">My Favorites</p>
      <div className="w-full">
        {favorites?.length ? (
          <div className="grid grid-cols-12 gap-8 my-4">
           { ListFavorites(favorites)}
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
                <i className="fa-solid fa-map-location"></i>
                  <p>You do not have any favorite places</p>
                </span>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
