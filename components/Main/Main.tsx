import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useEthers } from "@usedapp/core";
import { Container } from "@mui/material";

const Main = () => {
  const router = useRouter();
  const { account } = useEthers();
  useEffect(() => {
    if (!account) {
      router.push({
        pathname: "/login",
        query: { redirect_url: router?.route },
      });
    } else {
      router.route !== "/welcome" && router.push("/welcome");
    }
  }, [account]);

  return <Container maxWidth="xl"></Container>;
};

export default Main;
