import { getCurrentUser } from "@/actions/getCurrentUser";
import { getUserById } from "@/actions/getUserById";
import Container from "@/app/Components/Container";
import EmptyState from "@/app/Components/EmptyState";
import UserAvatar from "@/app/Components/UserAvatar";
import Link from "next/link";
import { FaPen } from "react-icons/fa";
import ToggleUserStatus from "./ToggleUserStatus";

interface UserDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailsPage({
  params,
}: UserDetailsPageProps) {
  const resolvedParams = await params;
  const currentUser = await getCurrentUser();
  const user = await getUserById(resolvedParams.id);

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="You don't have permission to view this page"
      />
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="Not Found"
        subtitle="The user you are looking for does not exist or has been deactivated"
      />
    );
  }

  return (
    <Container>
      <div className="max-w-3xl mx-auto">
        {!user.isActive && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  This user account is currently deactivated. Use the toggle
                  button below to reactivate.
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              User Details
            </h1>
            <p className="mt-1 text-sm text-gray-500">ID: {user.id}</p>
          </div>
          <div className="flex gap-3">
            <ToggleUserStatus
              userId={user.id}
              isActive={user.isActive}
              isCurrentUser={currentUser.id === user.id}
            />
            <Link
              href={`/admin/users/${user.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-800 hover:bg-purple-900"
            >
              <FaPen className="mr-2" size={16} />
              Edit User
            </Link>
          </div>
        </div>{" "}
        <div className="bg-white shadow rounded-lg">
          {/* User Profile Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-5">
              <div className="flex-shrink-0">
                <UserAvatar src={user.image} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 truncate">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="mt-1 flex items-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Department Information */}
          <div className="p-6 flex border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Department Information
            </h3>
            <div className="text-sm text-gray-600">
              {user.department ? (
                <div>
                  <p className="font-medium">{user.department.name}</p>
                </div>
              ) : (
                <p className="italic">No department assigned</p>
              )}
            </div>
          </div>

          {/* Ticket Statistics */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Ticket Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Created Tickets</p>
                <p className="text-2xl font-semibold text-purple-900">
                  {user._count.ticketsCreated}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Assigned Tickets</p>
                <p className="text-2xl font-semibold text-blue-900">
                  {user._count.ticketsAssigned}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Accepted Tickets</p>
                <p className="text-2xl font-semibold text-green-900">
                  {user._count.ticketsAccepted}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-500">Member Since</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>
              {user.emailVerified && (
                <div>
                  <p className="text-gray-500">Email Verified</p>
                  <p className="font-medium">
                    {new Date(user.emailVerified).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
