"use client";

import React, { useState } from "react";
import { Ticket, Role } from "@prisma/client";
import TicketCard from "../../Components/tickets/TicketCard";
import Pagination from "../../Components/ui/Pagination";

interface TicketsPageProps {
  tickets: (Ticket & {
    createdBy: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
    assignedTo: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    } | null;
    acceptedBy: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    } | null;
    department: {
      name: string;
      id: string;
    };
    comments: {
      createdAt: Date;
    }[];
  })[];
  currentUser: {
    id: string;
    role: Role;
    departmentId: string | null;
  };
}

const UserTickets: React.FC<TicketsPageProps> = ({ tickets, currentUser }) => {
  const [activeTab, setActiveTab] = useState<
    "created" | "assigned" | "accepted"
  >("created");
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  const paginateTickets = (tickets: TicketsPageProps["tickets"]) => {
    const startIndex = (currentPage - 1) * ticketsPerPage;
    const endIndex = startIndex + ticketsPerPage;
    return tickets.slice(startIndex, endIndex);
  };

  const createdTickets = tickets.filter(
    (ticket) => ticket.createdBy.id === currentUser.id
  );
  const assignedTickets = tickets.filter(
    (ticket) => ticket.assignedTo?.id === currentUser.id
  );
  const acceptedTickets = tickets.filter(
    (ticket) => ticket.acceptedBy?.id === currentUser.id
  );

  const activeTickets =
    activeTab === "created"
      ? createdTickets
      : activeTab === "assigned"
      ? assignedTickets
      : acceptedTickets;

  const paginatedTickets = paginateTickets(activeTickets);

  const totalPages = Math.ceil(activeTickets.length / ticketsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="py-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">My Tickets</h1>
          <p className="mt-2 text-sm text-gray-700">
            {activeTab === "created"
              ? "Tickets you've created"
              : activeTab === "assigned"
              ? "Tickets assigned to you"
              : "Tickets accepted by you"}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab("created");
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "created"
                ? "border-purple-800 text-purple-800"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Created ({createdTickets.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("assigned");
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "assigned"
                ? "border-purple-800 text-purple-800"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Assigned ({assignedTickets.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("accepted");
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "accepted"
                ? "border-purple-800 text-purple-800"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Accepted ({acceptedTickets.length})
          </button>
        </nav>
      </div>

      {/* Tickets List */}
      <div className="mt-8">
        <div className="space-y-4">
          {paginatedTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              currentUserId={currentUser.id}
            />
          ))}
        </div>

        {/* Empty State */}
        {activeTickets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {activeTab === "created"
                ? "You haven't created any tickets yet"
                : activeTab === "assigned"
                ? "No tickets assigned to you"
                : "No tickets accepted by you"}
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {activeTickets.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={handleNextPage}
            onPrevious={handlePreviousPage}
          />
        )}
      </div>
    </div>
  );
};

export default UserTickets;
