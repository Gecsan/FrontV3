import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { createJSONStorage, persist } from "zustand/middleware";

import { User_details_type } from "@/utils/types";
import useService from "@/api/Services";
import { base_URL } from "@/api/Api";
import { toast } from "@/hooks/use-toast";

interface AuthState {
  is_autenticated: boolean;
  user_role: "admin" | "user" | null;
  login: (payload: object) => void;
  logout: () => void;
  user_details: User_details_type;
  fetch_user_details: () => void;
  register_user: (payload: any) => void;
  sizes: any;
  services: any;
  fetch_sizes_services:()=> void
}
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      is_autenticated: false,
      user_role: null,
      sizes: [],
      services: [],
      user_details: {
        id: 0,
        full_name: "",
        email: "",
        phone_number: "",
        role: "user",
      },
      register_user: async (payload) => {
        const url = `${base_URL}api/users/register`;
        await axios
          .post(url, payload)
          .then((response) => {
            if (response.status === 200) {
              toast({
                title: "Succesfull",
                description: (
                  <span className="flex items-center justify-start gap-2">
                    <i className="fa-solid fa-user-check text-green-600 !text-xl"></i>
                    <p>Account creation succefull</p>
                  </span>
                ),
              });
              window.location.href = "/login";
            } else {
              toast({
                title: "Error",
                variant: "destructive",
                description: (
                  <span className="flex items-center justify-start gap-2">
                    <p>Error on account creation, please try again..</p>
                  </span>
                ),
              });
            }
          })
          .catch((error) => {
            console.error("ACCOUNT CREATION ERROR ____ ", error);
            toast({
              title: "Error",
              variant: "destructive",
              description: (
                <span className="flex items-center justify-start gap-2">
                  <p>Error on account creation, please try again..</p>
                </span>
              ),
            });
          });
      },
      login: async (payload: any) => {
        const login_url = `${base_URL}api/login/login`;

        try {
          const response: any = await axios.post(login_url, payload);

          // decode access token to get user role
          const update_user_role = () => {
            const token: any = jwtDecode(response.data.access_token) || "";
            const role = token.role;
            console.log(role);

            if (role === "admin") {
              set({ user_role: "admin" });
            } else {
              set({ user_role: "user" });
            }
          };

          console.log(response.status);

          // update authenticate status if the request is succesfull
          if (response.status === 200) {
            set({ is_autenticated: true });
            // store access and refresh token on succesfull response
            localStorage.setItem("access", response.data.access_token);
            localStorage.setItem("refresh", response.data.refresh_token);

            // update user roles
            update_user_role();
            toast({
              title: "Success",
              description: (
                <span className="flex items-center justify-start gap-2">
                  <i className="fa-solid fa-circle-check text-green-600 !text-3xl"></i>
                  <p>Login successful</p>
                </span>
              ),
            });

            useAuthStore.getState().fetch_user_details;

            console.log(
              "CURRENT_STATE : __ ",
              useAuthStore.getState().user_details
            );
          } else {
            set({ is_autenticated: false });
          }

          // re-direct based on user role
          const role = useAuthStore.getState().user_role;
          if (role === "admin") {
            window.location.href = "/admin";
          } else if (role === "user") {
            window.location.href = "/dashboard";
          }
        } catch (error: any) {
          console.error("Error experienced :: ", error);
          toast({
            title: "Error",
            variant: "destructive",
            description: (
              <span className="flex flex-col items-start justify-start gap-2">
                <p>Error on login, please try again..</p>
                <small className="text-gray-800 font-semibold">
                  {error.response.data.detail}
                </small>
              </span>
            ),
          });

          return error;
        }
      },
      logout: () => {
        set({ is_autenticated: false });
        localStorage.clear();
        toast({
          title: "Logout",
          variant: "default",
          description: (
            <span className="flex items-center justify-start gap-2">
              <p>Logged out succesfull</p>
            </span>
          ),
        });
        window.location.href = "/";
      },
      fetch_user_details: async () => {
        const service = new useService();
        const getUserId = () => {
          if (localStorage.length) {
            const token = localStorage.getItem("access") || "";
            const formattedToken = jwtDecode(token);
            return formattedToken.sub;
          }
        };

        try {
          const user_id = getUserId() || undefined;

          const response = await service.fetchUSerDetails(user_id);
          // console.log(response)
          set({ user_details: response });
          return response;
        } catch (error) {
          console.error("Error encountered :: ", error);
        }
      },
      fetch_sizes_services: async () => {
        const service = new useService();

        await service.fetchMoveSizes().then((response: any) => {
          console.log(response);

          set({ sizes: response });
        });

        await service.fetchMoveServices().then((response: any) => {
          set({ services: response });
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useAuthStore;
