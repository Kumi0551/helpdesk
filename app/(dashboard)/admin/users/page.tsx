import Link from "next/link";
import EmptyState from "@/app/Components/EmptyState";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { getUsers } from "@/actions/getUsers";
import { FaUserPlus, FaUserSlash, FaUserCheck } from "react-icons/fa";
import UserCard from "@/app/Components/ui/UserCard";

const AllUsers = async () => {
  const currentUser = await getCurrentUser();
  const users = await getUsers();

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="You don't have permission to view this page"
      />
    );
  }

  if (!users || users.length === 0) {
    return (
      <EmptyState
        title="No users found"
        subtitle="There are no users in the system"
      />
    );
  }

  // Separate active and deactivated users
  const activeUsers = users.filter((user) => user.isActive);
  const deactivatedUsers = users.filter((user) => !user.isActive);

  return (
    <div className="py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-slate-900">
            User Management
          </h1>
          <p className="mt-2 text-sm text-slate-700">
            View and manage all system users
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/register"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-800 hover:bg-purple-900"
          >
            <FaUserPlus className="mr-2" size={16} />
            Add New User
          </Link>
        </div>
      </div>

      {/* Active Users Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-slate-900 flex items-center gap-2 mb-4">
          <FaUserCheck className="text-green-500" />
          Active Users ({activeUsers.length})
        </h2>

        <div className="space-y-4">
          {activeUsers.length > 0 ? (
            activeUsers.map((user) => <UserCard key={user.id} user={user} />)
          ) : (
            <EmptyState
              title="No active users"
              subtitle="There are currently no active users in the system"
            />
          )}
        </div>
      </div>

      {/* Deactivated Users Section */}
      {deactivatedUsers.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-medium text-slate-900 flex items-center gap-2 mb-4">
            <FaUserSlash className="text-red-500" />
            Deactivated Users ({deactivatedUsers.length})
          </h2>

          <div className="space-y-4">
            {deactivatedUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
