import React, { useEffect } from "react";
import { utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useCall, useContractFunction, useEthers } from "@usedapp/core";
import { Container } from "@mui/material";
import { useRouter } from "next/router";

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
