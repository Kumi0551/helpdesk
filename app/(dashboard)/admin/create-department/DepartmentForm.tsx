"use client";

import Button from "@/app/Components/Button";
import Heading from "@/app/Components/Heading";
import Input from "@/app/Components/inputs/inputs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const DepartmentForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/departments", { name: data.name })
      .then(() => {
        toast.success("Department created");
        router.push("/admin/departments");
        router.refresh();
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsLoading(false));
  };
  return (
    <>
      <Heading title="Create a new department" />
      <Input
        id="name"
        label="Department Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Button
        label={isLoading ? "Loading" : "Submit"}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default DepartmentForm;
