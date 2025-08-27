"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../../Components/Button";
import Input from "../../Components/inputs/inputs";
import React, { useEffect, useState } from "react";
import Heading from "../../Components/Heading";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Select from "../../Components/Select";
import TextArea from "../../Components/TextArea";
import SelectField from "../../Components/SelectField";

const TicketRequestForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      subject: "",
      description: "",
      type: "",
      category: "",
      priority: "LOW",
      departmentId: "",
    },
  });

  useEffect(() => {
    axios
      .get("/api/get-departments")
      .then((response) => setDepartments(response.data))
      .catch(() => toast.error("Failed to load departments"));
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      await axios.post("/api/submitTicket", data);
      toast.success("Ticket Submitted Successfully");
      router.push("/tickets");
      router.refresh();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to Submit Ticket");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading title="Submit a Ticket" />
      <Input
        id="subject"
        label="Subject"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      {/*     <Select
        id="type"
        label="Type "
        register={register}
        errors={errors}
        options={["LOW", "MEDIUM", "HIGH", "CRITICAL"]}
        required
      /> */}
      <Select
        id="priority"
        label="Priority "
        register={register}
        errors={errors}
        options={["LOW", "MEDIUM", "HIGH", "CRITICAL"]}
        required
      />
      {/*       <Select
        id="category"
        label="Category "
        register={register}
        errors={errors}
        options={["LOW", "MEDIUM", "HIGH"]}
        required
      /> */}

      {/* 
      <div className="w-full">
        <label
          htmlFor="departmentId"
          className="block text-sm font-medium text-gray-700"
        >
          Department
        </label>
        <select
          id="departmentId"
          {...register("departmentId", { required: true })}
          disabled={isLoading || departments.length === 0}
          className={`mt-1 block w-full p-2 border rounded-md bg-white text-gray-900 ${
            errors.departmentId ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="" disabled hidden>
            {departments.length === 0
              ? "Loading departments..."
              : "Select Department"}
          </option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        {errors.departmentId && (
          <p className="text-red-500 text-sm mt-1">Department is required</p>
        )}
      </div> */}
      <SelectField
        id="departmentId"
        label="Department"
        register={register}
        errors={errors}
        options={departments}
        isLoading={isLoading}
      />

      <Button
        label={isLoading ? "Submitting..." : "Submit Ticket"}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default TicketRequestForm;
