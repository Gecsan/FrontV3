import useAuthStore from "@/store/AuthStore";
import { Link, Navigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: ("admin" | "user")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { is_autenticated, user_role } = useAuthStore((state) => state);

  if (!is_autenticated) {
    return <Navigate to="/" />;
  } else if (!allowedRoles.includes(user_role!)) {
    return (
      <>
        <div className="flex justify-center items-center  h-screen w-full">

<div>

          <Card >
            <CardHeader>
              <CardTitle>
            
                Unauthorized</CardTitle>
              <CardDescription>
                You seem to be trying to access a protected page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full flex  items-center justify-center gap-2">
             
              <i className="fa-solid fa-circle-exclamation text-red-500 mr-2 text-3xl"></i>
                <p className="text-semibold text-lg">
                  You do not have access to this page
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild>
                <Link to="/login">
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Login</Link>
              </Button>
            </CardFooter>
          </Card>
</div>


          {/* <img
            width="500"
            height="500"
            alt="Empty page -- Error 404"
            src="https://cdn.dribbble.com/users/381530/screenshots/3949858/media/aff8c4541abddf91b8f69206b2175381.gif"
          /> */}
        </div>
      </>
    );
  }
  return children;
};
export default ProtectedRoute;
