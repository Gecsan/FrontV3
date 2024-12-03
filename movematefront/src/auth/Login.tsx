import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

import { Checkbox } from "@/components/ui/checkbox";
import useAuthStore from "@/store/AuthStore";

const LoginSchema = z.object({
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .min(2, {
      message: "Email must be at least 2 characters.",
    }),
  password: z.string(),
  //   password: z
  //     .string()
  //     .min(6, {
  //       message: "Password must be at least 6 characters.",
  //     })
  //     .regex(/[A-Z]/, {
  //       message: "Password must contain at least one uppercase letter.",
  //     })
  //     .regex(/[a-z]/, {
  //       message: "Password must contain at least one lowercase letter.",
  //     })
  //     .regex(/\d/, {
  //       message: "Password must contain at least one number.",
  //     }),
});

const Login = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  }); 

  const store = useAuthStore();

  const onSubmit: SubmitHandler<z.infer<typeof LoginSchema>> = (data) => {
    console.log("FORM SUBMITTED ----", data);
    store.login(data);
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-start justify-start gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Login</h2>
          <span className="flex items-center justify-start gap-2 text-sm">
            <p>Do not have an account?</p>
            <Link
              to="/register"
              className="underline underline-offset-2 font-semibold"
            >
              Create account
            </Link>
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <Checkbox id="remember_me" />
              <label
                htmlFor="remember_me"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
