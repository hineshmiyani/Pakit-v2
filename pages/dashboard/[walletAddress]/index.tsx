import React from "react";
import { Container } from "@mui/material";
import { WalletDetails, WalletOwners } from "../../../components";

const Dashboard = () => (
  <Container>
    <WalletDetails />
    <WalletOwners />
  </Container>
);

export default Dashboard;
