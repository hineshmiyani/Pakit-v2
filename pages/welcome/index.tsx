import React from "react";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { APP_NAME } from "../../constants";
import { styles } from "./styles";

const Welcome = () => {
  const router = useRouter();

  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={styles.title}>
          Welcome to the {APP_NAME}.
        </Typography>
        <Typography variant="h6" sx={styles.subtitle}>
          {APP_NAME} is the most trusted platform to manage digital assets.
          <br />
          Here is how to get started:
        </Typography>

        <Paper elevation={0} sx={styles.paperContainer}>
          <Card sx={styles.cardContainer}>
            <CardContent sx={{ p: "24px 24px 0" }}>
              <Typography gutterBottom variant="h5" fontWeight="bold">
                Create Wallet
              </Typography>
              <Typography variant="body1">
                Create a new Wallet that is controlled by one or multiple
                owners. You will be required to pay a network fee for creating
                your new Wallet.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: "30px 24px" }}>
              <Button
                sx={{
                  backgroundColor: "primary.buttonColor",
                  border: "1px solid",
                  borderColor: "primary.buttonColor",
                  color: "primary.contrastText",
                  p: "8px 12px",
                  "&:hover": {
                    backgroundColor: "primary.buttonColor",
                  },
                }}
                startIcon={<Add />}
                onClick={() => router.push("/create")}
              >
                Create new Wallet
              </Button>
            </CardActions>
          </Card>
        </Paper>
      </Container>
    </>
  );
};

export default Welcome;
