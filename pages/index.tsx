import type { NextPage } from "next";
import { useEthers } from "@usedapp/core";
import { Loader, Main } from "../components";

const Home: NextPage = () => {
  const { isLoading } = useEthers();

  if (isLoading) return <Loader />;
  return (
    <>
      <Main />
    </>
  );
};

export default Home;
