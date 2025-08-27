import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "../Components/Container";
import FormWrap from "../Components/FormWrap";
import LogInForm from "./LogInForm";

const signIn = async () => {
  const currentUser = await getCurrentUser();
  return (
    <div>
      <Container>
        <FormWrap>
          <LogInForm currentUser={currentUser} />
        </FormWrap>
      </Container>
    </div>
  );
};

export default signIn;
