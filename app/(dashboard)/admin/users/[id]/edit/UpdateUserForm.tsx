"use client";

import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import SelectField from "@/app/Components/SelectField";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Input from "@/app/Components/inputs/inputs";
import Button from "@/app/Components/Button";
import Select from "@/app/Components/Select";

interface UpdateUserProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    departmentId: string;
    department: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    };
    _count: {
      ticketsCreated: number;
      ticketsAssigned: number;
    };
  };
  departments: {
    id: string;
    name: string;
  }[];
  currentUser: {
    id: string;
    role: string;
  };
}

const UpdateUserForm: React.FC<UpdateUserProps> = ({ user, currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
    },
  });

  useEffect(() => {
    axios
      .get("/api/get-departments")
      .then((response) => setDepartments(response.data))
      .catch(() => toast.error("Failed to load departments"));

    // Initialize form with user data
    reset({
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
    });
  }, [user, reset]);
  // In your UpdateUserForm component's onSubmit handler:
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    // Only include password fields if it's a self-update
    const updateData =
      currentUser.id === user.id
        ? {
            ...data,
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }
        : data;

    axios
      .patch(`/api/users/${user.id}`, updateData)
      .then(() => {
        toast.success("User updated successfully");
        router.push("/admin/users");
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Update failed");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Input
        id="name"
        label="Full Name"
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

      <Select
        id="role"
        label="Role"
        register={register}
        errors={errors}
        options={[
          "SUPER_ADMIN",
          "ADMIN",
          "IT_OFFICER",
          "MANAGER",
          "EMPLOYEE",
          "USER",
        ]}
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

      <div className="flex gap-4 w-full">
        <Button
          outline
          label="Cancel"
          onClick={() => router.push("/admin/users")}
          disabled={isLoading}
        />
        <Button
          label={isLoading ? "Updating..." : "Update"}
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </div>
    </>
  );
};

export default UpdateUserForm;
