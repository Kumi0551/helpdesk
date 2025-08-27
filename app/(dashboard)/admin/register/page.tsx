import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "../../../Components/Container";
import FormWrap from "../../../Components/FormWrap";
import RegisterForm from "./RegisterForm";
import NullData from "@/app/Components/NullData";

const Register = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return <NullData title="Oops... Access Denied" />;
  }
  return (
    <div className="">
      <Container>
        <FormWrap>
          <RegisterForm />
        </FormWrap>
      </Container>
    </div>
  );
};
export default Register;
