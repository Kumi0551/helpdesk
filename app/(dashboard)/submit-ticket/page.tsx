import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "../../Components/Container";
import FormWrap from "../../Components/FormWrap";
import TicketRequestForm from "./TicketRequestForm";
import NullData from "../../Components/NullData";

const TicketRequest = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <NullData title="Oops! You're not logged in." />;
  }
  return (
    <div>
      <div>
        <Container>
          <FormWrap>
            <TicketRequestForm />
          </FormWrap>
        </Container>
      </div>
    </div>
  );
};

export default TicketRequest;
