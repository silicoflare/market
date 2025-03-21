"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { userExists } from "./fx";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const formSchema = z.object({
    username: z.string().min(5, "Minimum 5 characters"),
    password: z.string().min(8, "Minimum 8 characters"),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!(await userExists(data.username))) {
      setError("username", { message: "User does not exist" });
      return;
    }

    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (!res?.ok) {
      setError("password", { message: "Wrong password" });
      return;
    }

    router.push("/market");
  }

  return (
    <div className="window">
      <Navbar />
      <div className="w-full flex flex-col items-center">
        <h1 className="text-5xl font-bold">Market</h1>
        <p className="py-3">Share files and links with each other!</p>
      </div>
      <br />

      <div className="card card-border bg-base-100 w-96">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Username</legend>
              <input
                type="text"
                className={`input ${errors.username && "border-error"}`}
                {...register("username")}
              />
              {errors.username && (
                <p className="fieldset-label text-error">
                  {errors.username.message}
                </p>
              )}
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="password"
                className={`input ${errors.password && "border-error"}`}
                {...register("password")}
              />
              {errors.password && (
                <p className="fieldset-label text-error">
                  {errors.password.message}
                </p>
              )}
            </fieldset>
            <div className="card-actions justify-center mt-2">
              <button className="btn btn-primary">Login</button>
              <span className="w-full text-center text-neutral-content">
                Don't have an account?{" "}
                <Link className="text-secondary" href="/signup">
                  Sign Up
                </Link>
                .
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
