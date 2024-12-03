import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useAuthStore from "@/store/AuthStore";
import Quotes from "./components/MyQuotes";
import Moves from "./components/MyMoves";
import Favorites from "./components/Favorites";

const NavigationBar = () => {
  const store = useAuthStore();

  return (
    <nav className="max-w-[90%] mx-auto w-full flex items-center justify-between p-4  my-2">
      <Link to="/" className="font-black text-lg w-[20rem] ">
        MoveMate.
      </Link>

      <div className="flex items-center justify-between gap-2 ">
        <Badge className="bg-blue-500 ">Client</Badge>

        <Button variant="outline" onClick={() => store.logout()}>
          Logout
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </Button>
      </div>
    </nav>
  );
};
const Dashboard = () => {
  const store = useAuthStore();

  useEffect(() => {
    store.fetch_sizes_services();
  }, []);

  return (
    <div>
      <NavigationBar />
      <div className="max-w-[90%] w-full mx-auto">
        <Tabs defaultValue="quotes" className="w-full">
          <TabsList className="w-[50%] flex justify-between">
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            {/* <TabsTrigger value="moves">Moves</TabsTrigger> */}
            {/* <TabsTrigger value="favorites">Favorites</TabsTrigger> */}
          </TabsList>

          <TabsContent value="quotes">
            <Quotes />
          </TabsContent>

          {/* <TabsContent value="moves">
            <Moves />
          </TabsContent>
          <TabsContent value="favorites">
            <Favorites />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
