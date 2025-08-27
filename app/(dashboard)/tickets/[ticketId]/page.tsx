import { getCurrentUser } from "@/actions/getCurrentUser";

import NullData from "@/app/Components/NullData";
import TicketDetails from "./TicketDetails";
import getTicketById from "@/actions/getTicketById";

interface IParams {
  ticketId: string;
}
interface TicketPageProps {
  params: Promise<IParams>;
}

const TicketPage: React.FC<TicketPageProps> = async ({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) => {
  const resolvedParams = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <NullData title="Oops! You're not logged in." />;
  }

  const ticket = await getTicketById(resolvedParams.ticketId);
  if (!ticket) {
    return <NullData title="Ticket not found" />;
  }

  return (
    <TicketDetails
      ticket={ticket}
      currentUser={{
        ...currentUser,
        createdAt: new Date(currentUser.createdAt),
        updatedAt: new Date(currentUser.updatedAt),
      }}
    />
  );
};

export default TicketPage;
