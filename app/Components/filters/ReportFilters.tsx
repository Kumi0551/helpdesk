"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Department, Priority, Status, Role } from "@prisma/client";
import { ReportType } from "@/types";
import axios from "axios";
import SelectField from "../SelectField";
import { FieldValues, useForm } from "react-hook-form";
import Button from "../Button";
import StatusFilter from "./StatusFilter";
import PriorityFilter from "./PriorityFilter";
import SelectDate from "./SelectDate";

interface ReportFiltersProps {
  currentUser: {
    id: string;
    role: Role;
    departmentId?: string;
  };
  departments: Department[];
  initialParams: {
    type?: ReportType;
    department?: string;
    user?: string;
    status?: string;
    priority?: string;
    start?: string;
    end?: string;
  };
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  currentUser,
  departments,
  initialParams,
}) => {
  const router = useRouter();
  const [users, setUsers] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      reportType: initialParams.type || "overview",
      department: initialParams.department || "",
      user: initialParams.user || "",
      status: initialParams.status || "all",
      priority: initialParams.priority || "all",
      startDate: initialParams.start || "",
      endDate: initialParams.end || "",
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (formValues.department) {
      setIsLoading(true);
      axios
        .get(
          `/api/users/department-users?departmentId=${formValues.department}`
        )
        .then((response) => setUsers(response.data))
        .catch(() => console.error("Failed to fetch users"))
        .finally(() => setIsLoading(false));
    } else {
      setUsers([]);
    }
  }, [formValues.department]);

  useEffect(() => {
    if (currentUser.role === "ADMIN" && currentUser.departmentId) {
      setValue("department", currentUser.departmentId);
      setValue("reportType", "department");
    }
  }, [currentUser, setValue]);

  const applyFilters = async () => {
    setIsApplyingFilter(true);

    const params = new URLSearchParams();

    if (formValues.reportType !== "overview") {
      params.set("type", formValues.reportType);
    }
    if (formValues.department) params.set("department", formValues.department);
    if (formValues.user) params.set("user", formValues.user);
    params.set("status", formValues.status);
    if (formValues.priority !== "all")
      params.set("priority", formValues.priority);
    if (formValues.startDate) params.set("start", formValues.startDate);
    if (formValues.endDate) params.set("end", formValues.endDate);

    axios
      .get(`/admin/reports?${params.toString()}`)
      .then(() => {
        router.replace(`/admin/reports?${params.toString()}`);
        router.push(`/admin/reports?${params.toString()}`);
      })
      .catch((error) => {
        console.error("Failed to apply filters:", error);
      })
      .finally(() => {
        setIsApplyingFilter(false);
      });
  };

  const reportTypeOptions = [
    { id: "overview", name: "System Overview" },
    { id: "department", name: "Department Tickets" },
    { id: "user", name: "User Tickets" },
  ];

  const userOptions = users.map((user) => ({
    id: user.id,
    name: `${user.name} (${user.email})`,
  }));

  const departmentOptions = departments.map((dept) => ({
    id: dept.id,
    name: dept.name,
  }));

  return (
    <div className="shadow rounded-lg mb-8 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SelectField
          id="reportType"
          label="Report Type"
          register={register}
          errors={errors}
          options={reportTypeOptions}
          required
        />

        {(formValues.reportType === "department" ||
          formValues.reportType === "user") && (
          <SelectField
            id="department"
            label="Department"
            register={register}
            errors={errors}
            options={departmentOptions}
            required={formValues.reportType !== "overview"}
          />
        )}

        {formValues.reportType === "user" && (
          <SelectField
            id="user"
            label="User"
            disabled={!formValues.department || isLoading}
            register={register}
            errors={errors}
            options={userOptions}
            isLoading={isLoading}
            required
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <StatusFilter
            value={formValues.status as Status | "all"}
            onChange={(value) => setValue("status", value)}
          />
        </div>

        <div>
          <PriorityFilter
            value={formValues.priority as Priority | "all"}
            onChange={(value) => setValue("priority", value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectDate
          value={formValues.startDate}
          onChange={(value) => setValue("startDate", value)}
          label="Start Date"
          disabled={isLoading}
        />
        <SelectDate
          value={formValues.endDate}
          onChange={(value) => setValue("endDate", value)}
          label="End Date"
          disabled={isLoading}
          min={formValues.startDate}
        />
      </div>
      <div className="mt-4">
        <div className="flex gap-4">
          <Button
            label={isApplyingFilter ? "Applying..." : "Apply Filters"}
            onClick={handleSubmit(applyFilters)}
            disabled={isApplyingFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
