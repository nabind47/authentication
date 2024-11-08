import { getProfile } from "@/actions/profile";

const Profile = async () => {
  const data = await getProfile();

  return <div>{JSON.stringify(data)}</div>;
};

export default Profile;
