"use client";

import Navbar from "@/components/Navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signup, userExists } from "./fx";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const formSchema = z.object({
    username: z.string().min(5, "Minimum 5 characters"),
    password: z.string().min(8, "Minimum 8 characters"),
    confPass: z.string().min(8, "Minimum 8 characters"),
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
      confPass: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (await userExists(data.username)) {
      setError("username", { message: "User already exists" });
      return;
    }

    if (data.password !== data.confPass) {
      setError("password", { message: "Passwords don't match" });
      setError("confPass", { message: "Passwords don't match" });
      return;
    }

    await signup(data.username, data.confPass);
    router.push("/");
  }

  return (
    <div className="window">
      <Navbar />
      <div className="card card-border bg-base-100 w-96">
        <div className="card-body">
          <h2 className="card-title">Create an account</h2>
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
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Confirm Password</legend>
              <input
                type="password"
                className={`input ${errors.confPass && "border-error"}`}
                {...register("confPass")}
              />
              {errors.confPass && (
                <p className="fieldset-label text-error">
                  {errors.confPass.message}
                </p>
              )}
            </fieldset>
            <div className="card-actions justify-center mt-2">
              <button className="btn btn-primary">Signup</button>
              <span className="w-full text-center text-neutral-content">
                Already have an account?{" "}
                <Link className="text-secondary" href="/">
                  Login
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
