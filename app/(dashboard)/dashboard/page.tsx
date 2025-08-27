"use client";

import { useEffect, useState } from "react";
import StatCard from "../../Components/Dashboard/StatCard";
import RecentTickets from "../../Components/Dashboard/RecentTickets";
import { DashboardData } from "@/types";
import Heading from "../../Components/Heading";
import toast from "react-hot-toast";
import Container from "../../Components/Container";

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/users/[userId]/tickets");
        if (!response.ok) {
          toast.error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-800"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return <div className="p-6">No data available</div>;
  }

  return (
    <Container>
      <div className="">
        <Heading title="My Dashboard" />

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Tickets" value={data.stats.total} icon="📋" />
          <StatCard
            title="Pending"
            value={data.stats.pending}
            color="bg-yellow-100 text-yellow-800"
          />
          <StatCard
            title="Open"
            value={data.stats.open}
            color="bg-blue-100 text-blue-800"
          />
          <StatCard
            title="In Progress"
            value={data.stats.inProgress}
            color="bg-purple-100 text-purple-800"
          />
          <StatCard
            title="Resolved"
            value={data.stats.resolved}
            color="bg-green-100 text-green-800"
          />
          <StatCard
            title="Closed"
            value={data.stats.closed}
            color="bg-green-200 text-gray-800"
          />
        </div>

        {/* Charts Row */}
        {/*  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">My Tickets by Priority</h2>
          <PriorityChart data={data.stats.byPriority} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">My Tickets by Category</h2>
          <CategoryChart data={data.stats.byCategory} />
        </div>
      </div> */}

        {/* Recent Tickets */}
        <div>
          <h2 className="text-lg font-semibold mb-4">My Recent Tickets</h2>
          <RecentTickets tickets={data.recentTickets} />
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
