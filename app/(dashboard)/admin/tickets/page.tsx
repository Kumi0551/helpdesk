import { getAllTickets } from "@/actions/getAllTickets";
import { getCurrentUser } from "@/actions/getCurrentUser";
import EmptyState from "@/app/Components/EmptyState";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";
import TicketTable from "./TicketsTable";
import Container from "@/app/Components/Container";

const AllTickets = async () => {
  try {
    const tickets = await getAllTickets();
    const currentUser = await getCurrentUser();

    if (
      !currentUser ||
      (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN")
    ) {
      return (
        <EmptyState
          title="Unauthorized"
          subtitle="You don't have permission to view this page"
        />
      );
    }

    if (!tickets || tickets.length === 0) {
      return (
        <EmptyState title="No ticket found" subtitle="There are no tickets" />
      );
    }

    return (
      <Container>
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              Ticket Management
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              View and manage all system tickets
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
        <div className="w-full overflow-x-auto">
          <TicketTable tickets={tickets} />
        </div>
      </Container>
    );
  } catch (error) {
    console.error("Error fetching tickets or user data:", error);
    return (
      <EmptyState
        title="Error"
        subtitle="An error occurred while loading the tickets. Please try again later."
      />
    );
  }
};

export default AllTickets;
