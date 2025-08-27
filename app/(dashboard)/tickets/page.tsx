import { getCurrentUser } from "@/actions/getCurrentUser";
import { getUserTickets } from "@/actions/getUserTickets";
import EmptyState from "@/app/Components/EmptyState";
import UserTickets from "./UserTickets";
import Container from "../../Components/Container";

export default async function TicketsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login to view tickets"
      />
    );
  }

  const tickets = await getUserTickets();

  if (!tickets || tickets.length === 0) {
    return (
      <EmptyState
        title="No tickets found"
        subtitle="You haven't created or been assigned any tickets"
      />
    );
  }

  return (
    <Container>
      <UserTickets tickets={tickets} currentUser={currentUser} />
    </Container>
  );
}
