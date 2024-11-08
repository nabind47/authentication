import { redirect } from "next/navigation";

import { getSession } from "@/lib/sessions";

const Dashboard = async () => {
  const session = await getSession();

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  return <div>Dashboard</div>;
};

export default Dashboard;
