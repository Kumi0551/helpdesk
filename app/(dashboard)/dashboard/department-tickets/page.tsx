// app/dashboard/department-tickets/page.tsx
import { getDepartmentTickets } from "@/actions/getDepartmentTickets";
import { getCurrentUser } from "@/actions/getCurrentUser";
import EmptyState from "@/app/Components/EmptyState";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";
import DepartmentTicketTable from "./DepartmentTicketTable";

const DepartmentTicketsPage = async () => {
  const currentUser = await getCurrentUser();
  const tickets = await getDepartmentTickets();

  if (!currentUser /* || currentUser.role !== "ADMIN" */) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="You don't have permission to view this page"
      />
    );
  }

  if (!currentUser.departmentId) {
    return (
      <EmptyState
        title="No Department Assigned"
        subtitle="Your account is not assigned to any department"
      />
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <EmptyState
        title="No Tickets Found"
        subtitle="There are no tickets in your department"
      />
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Department Tickets
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage tickets in your department
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/submit-ticket"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-800 hover:bg-purple-900"
          >
            <FaUserPlus className="mr-2" size={16} />
            Create New Ticket
          </Link>
        </div>
      </div>
      <div className="mt-8">
        <DepartmentTicketTable tickets={tickets} />
      </div>
    </div>
  );
};

export default DepartmentTicketsPage;
