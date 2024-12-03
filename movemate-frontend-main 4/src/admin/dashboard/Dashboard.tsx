import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Users from "./components/Users";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Quotes from "./components/Quotes";
import Moves from "./components/Moves";
import useAuthStore from "@/store/AuthStore";
import MoveServices from "./components/Services";
import Schedules from "./components/Schedules";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../utils/CustomTabs";

const NavigationBar = () => {
  const store = useAuthStore();

  return (
    <nav className="max-w-[90%] mx-auto w-full flex items-center justify-between p-4  my-2">
      <Link to="/" className="font-black text-lg w-[20rem] ">
        MoveMate.
      </Link>

      <div className="flex items-center justify-between gap-2 ">
        <Badge className="bg-green-500 ">Admin</Badge>

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
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="w-[50%] flex justify-between">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="moves">Move Size</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            {/* <TabsTrigger value="schedules">Schedules</TabsTrigger> */}
          </TabsList>

          <TabsContent value="users">
            <Users />
          </TabsContent>

          <TabsContent value="quotes">
            <Quotes />
          </TabsContent>

          <TabsContent value="moves">
            <Moves />
          </TabsContent>
          <TabsContent value="services">
            <MoveServices />
          </TabsContent>
          {/* <TabsContent value="schedules">
            <Schedules />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
