import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "@/app/Components/Container";
import FormWrap from "@/app/Components/FormWrap";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

const ProfileSettingsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/signin");
  }

  return (
    <Container>
      <FormWrap>
        <ProfileForm currentUser={currentUser} />
      </FormWrap>
    </Container>
  );
};

export default ProfileSettingsPage;
