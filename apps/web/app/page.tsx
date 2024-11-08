import React from "react";

import { getSession } from "@/lib/sessions";

const Home = async () => {
  const session = await getSession();
  console.log(session);

  return <div>Home</div>;
};

export default Home;
