"use client";
import React, { useReducer } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/user";
import { mutationKeys } from "@/utils/mutation-keys";
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
import { Card } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { LoginFormData, loginSchema } from "@/validations/login";

import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/slices/auth-slice";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;
  const dispatch = useDispatch();
  const router = useRouter();

  const { mutate: loginUserMutation, isPending } = useMutation({
    mutationKey: [mutationKeys.login],
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Logged in successfully");
      Cookies.set("accessToken", data.accessToken, { expires: 1 });
      Cookies.set("refreshToken", data.refreshToken, { expires: 7 });
      dispatch(setUser(data.userWithoutPassword));
      router.push("/dashboard");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginUserMutation(data);
  };

  return (
    <Card className="w-full max-w-lg mx-auto p-8 shadow-lg flex flex-col gap-2">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h1 className="text-sky-600 text-center text-2xl font-bold">Login</h1>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Email" type="email" />
                </FormControl>
                <FormMessage>{errors.email?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Password" type="password" />
                </FormControl>
                <FormMessage>{errors.password?.message}</FormMessage>
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-4 w-full" disabled={isPending}>
            {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
      <Link href={"/register"} className="p-2  text-primary mt-2 text-sm">
        {`Don't have an account ? Register`}
      </Link>
    </Card>
  );
};

export default LoginPage;
