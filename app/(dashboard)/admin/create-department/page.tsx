import Container from "@/app/Components/Container";
import FormWrap from "@/app/Components/FormWrap";
import DepartmentForm from "./DepartmentForm";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/Components/NullData";

const CreateDepartment = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return <NullData title="Oops... Access Denied" />;
  }
  return (
    <div>
      <Container>
        <FormWrap>
          <DepartmentForm />
        </FormWrap>
      </Container>
    </div>
  );
};

export default CreateDepartment;
