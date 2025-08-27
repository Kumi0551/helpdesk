import { getUserById } from "@/actions/getUserById";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { getAllDepartments } from "@/actions/getAllDepartments";
import UpdateUserForm from "./UpdateUserForm";
import Container from "@/app/Components/Container";
import FormWrap from "@/app/Components/FormWrap";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const resolvedParams = await params;
  const currentUser = await getCurrentUser();
  const user = await getUserById(resolvedParams.id);
  const departments = await getAllDepartments();

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Unauthorized</h1>
          <p>You don&#39;t have permission to view this page</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">User Not Found</h1>
          <p>The requested user could not be found</p>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <FormWrap>
        <UpdateUserForm
          user={user}
          departments={departments}
          currentUser={currentUser}
        />
      </FormWrap>
    </Container>
  );
}
