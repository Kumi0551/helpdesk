"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../Components/Button";
import Input from "../Components/inputs/inputs";
import React, { useEffect, useState } from "react";
import Heading from "../Components/Heading";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SafeUser } from "@/types";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

interface LogInFormProps {
  currentUser: SafeUser | null;
}

const LogInForm: React.FC<LogInFormProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      department: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [currentUser, router]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        router.push("/dashboard");
        router.refresh();
        toast.success("Logged In");
      }
      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };

  if (currentUser) {
    return <p className="text-center">Logged In. Redirecting...</p>;
  }
  return (
    <>
      <Heading title="Log In to your account" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        icon={
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer"
          >
            {showPassword ? (
              <VscEyeClosed className="h-6 w-6" />
            ) : (
              <VscEye className="h-6 w-6" />
            )}
          </span>
        }
      />
      <Button
        label={isLoading ? "Loading" : "Sign In"}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default LogInForm;
