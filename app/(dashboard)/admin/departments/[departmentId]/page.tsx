import { getCurrentUser } from "@/actions/getCurrentUser";
import { getDepartmentById } from "@/actions/getDepartmentById";
import EmptyState from "@/app/Components/EmptyState";
import DepartmentTabs from "@/app/Components/department/DepartmentTabs";
import { notFound, redirect } from "next/navigation";
import React from "react";

const DepartmentPage = async ({
  params,
}: {
  params: Promise<{ departmentId: string }>;
}) => {
  const resolvedParams = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    redirect("/unauthorized");
  }

  if (!resolvedParams?.departmentId) {
    return (
      <EmptyState
        title="Invalid Department"
        subtitle="Department ID is missing from URL"
      />
    );
  }

  const department = await getDepartmentById(resolvedParams.departmentId);

  if (!department) {
    notFound();
  }
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{department.name}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Created on {new Date(department.createdAt).toLocaleDateString()}
        </p>
      </div>

      <DepartmentTabs department={department} />
    </div>
  );
};

export default DepartmentPage;
