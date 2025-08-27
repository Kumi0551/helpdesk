"use client";

import React, { useState, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/Components/inputs/inputs";
import Button from "@/app/Components/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Heading from "@/app/Components/Heading";
import { Role } from "@prisma/client";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

interface ProfileFormProps {
  currentUser: {
    id: string;
    name: string | null;
    email: string | null;
    role: Role;
    departmentId: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    emailVerified: Date | null;
    image: string | null;
    department: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  };
}

const ProfileForm: React.FC<ProfileFormProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const formValues = watch();

  useEffect(() => {
    const hasNameChanged =
      dirtyFields.name && formValues.name?.trim() !== currentUser?.name?.trim();

    const hasCurrentPasswordChanged =
      dirtyFields.currentPassword && formValues.currentPassword.trim() !== "";
    const hasNewPasswordChanged =
      dirtyFields.newPassword && formValues.newPassword.trim() !== "";

    setIsFormDirty(
      hasNameChanged || hasCurrentPasswordChanged || hasNewPasswordChanged
    );
  }, [dirtyFields, formValues, currentUser]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      if (!currentUser) {
        throw new Error("User is not logged in");
      }

      // Validate password change - both fields must be filled if either is changed
      if (
        (data.currentPassword || data.newPassword) &&
        (!data.currentPassword || !data.newPassword)
      ) {
        throw new Error(
          "Both current and new password are required for password change"
        );
      }

      const updateData = {
        name: data.name.trim(),
        departmentId: currentUser.departmentId,
        ...(data.currentPassword && {
          currentPassword: data.currentPassword.trim(),
          newPassword: data.newPassword.trim(),
        }),
      };

      await axios.patch(`/api/users/${currentUser.id}`, updateData);
      toast.success("Profile updated");
      reset({
        name: data.name.trim(),
        email: currentUser.email,
        currentPassword: "",
        newPassword: "",
      });
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      currentPassword: "",
      newPassword: "",
    });
  };

  return (
    <>
      <Heading title="Profile Information" />
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
          label="Company Email"
          disabled
          register={register}
          errors={errors}
        />

        <div className="space-y-4 pt-2 w-full">
          <h3 className="text-sm font-medium text-gray-700">Change Password</h3>
          <Input
            id="currentPassword"
            label="Current Password"
            type={showCurrentPassword ? "text" : "password"}
            disabled={isLoading}
            register={register}
            errors={errors}
            icon={
              <span
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="cursor-pointer"
              >
                {showCurrentPassword ? (
                  <VscEyeClosed className="h-5 w-5" />
                ) : (
                  <VscEye className="h-5 w-5" />
                )}
              </span>
            }
          />
          <Input
            id="newPassword"
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            disabled={isLoading}
            register={register}
            errors={errors}
            icon={
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="cursor-pointer"
              >
                {showNewPassword ? (
                  <VscEyeClosed className="h-5 w-5" />
                ) : (
                  <VscEye className="h-5 w-5" />
                )}
              </span>
            }
          />
        </div>

        <div className="flex gap-4 pt-4 w-full">
          <Button
            outline
            label="Cancel"
            onClick={handleCancel}
            disabled={!isFormDirty || isLoading}
          />
          <Button
            label={isLoading ? "Updating..." : "Update"}
            onClick={handleSubmit(onSubmit)}
            disabled={!isFormDirty || isLoading}
          />
        </div>
      </>
    </>
  );
};

export default ProfileForm;
