import { getAllDepartments } from "@/actions/getAllDepartments";
import { getCurrentUser } from "@/actions/getCurrentUser";
import DepartmentCard from "@/app/Components/department/DepartmentCard";
import EmptyState from "@/app/Components/EmptyState";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";

const Departments = async () => {
  const departments = await getAllDepartments();
  const currentUser = await getCurrentUser();

  // Authorization check
  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="You don't have permission to view this page"
      />
    );
  }

  if (!departments || departments.length === 0) {
    return (
      <EmptyState
        title="No departments found"
        subtitle="There are no departments in the system"
      />
    );
  }

  return (
    <div className="py-6 mt-8 flow-root ">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            Department Management
          </h1>
          <p className="my-2 text-sm text-gray-700">
            View and manage all system departments
          </p>
        </div>
        <div className="my-4 sm:mt-0">
          <Link
            href="/admin/create-department"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-800 hover:bg-purple-900"
          >
            <FaUserPlus className="mr-2" size={16} />
            Add New Department
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="space-y-4 ">
            {departments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                currentUserRole="SUPER_ADMIN"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departments;
