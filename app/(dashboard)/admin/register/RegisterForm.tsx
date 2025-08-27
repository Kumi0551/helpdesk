"use client";

import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Input from "../../../Components/inputs/inputs";
import Button from "../../../Components/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import SelectField from "@/app/Components/SelectField";
import Select from "@/app/Components/Select";
import Heading from "@/app/Components/Heading";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);

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
      departmentId: "",
    },
  });

  const passwordValidationRules = {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters long",
    },
    pattern: {
      value:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  };

  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/get-departments")
      .then((response) => setDepartments(response.data))
      .catch(() => toast.error("Failed to load departments"));
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("Account created");

        signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        }).then((callback) => {
          if (callback?.ok) {
            router.push("/");
            router.refresh();
            toast.success("Logged In");
          }
          if (callback?.error) {
            toast.error(callback.error);
          }
        });
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Heading title="Register a new user" />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
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
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        validationRules={passwordValidationRules}
        required
      />

      <Select
        id="role"
        label="Role"
        register={register}
        errors={errors}
        options={["SUPER_ADMIN", "ADMIN", "USER"]}
        required
      />

      <SelectField
        id="departmentId"
        label="Department"
        register={register}
        errors={errors}
        options={departments}
        isLoading={isLoading}
      />

      <Button
        label={isLoading ? "Loading" : "Register"}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default RegisterForm;
