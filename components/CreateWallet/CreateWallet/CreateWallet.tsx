import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import type Safe from "@gnosis.pm/safe-core-sdk";
import { Box, Button, Step, StepConnector, StepLabel, Stepper, Typography } from "@mui/material";

import { useGetSigner, useGetWallets } from "../../../hooks";
import { createNewWallet } from "../../../services";
import { AddOwners, ConnectWallet, NameOfWallet, Review } from "../index";
import { styles } from "./styles";

interface IStepDescription {
  [key: number]: JSX.Element;
}
const steps = ["Connect Wallet" /* , "Name" */, "Owners and Confirmations", "Review"];
const getStepDescription = (step: number) => {
  const stepDescription: IStepDescription = {
    0: <ConnectWallet />,
    // 1: <NameOfWallet />,
    1: <AddOwners />,
    2: <Review />,
  };
  return stepDescription?.[step];
};

const CreateWallet = () => {
  const router = useRouter();
  const signer = useGetSigner();
  const walletList = useGetWallets(signer);

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<any>({});
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const totalSteps = steps.length;
  const completedSteps = Object.values(completed).filter((step) => step).length;
  const allStepsCompleted = completedSteps === totalSteps;

  const createWallet = async () => {
    setDisabledBtn(true);

    const ownersData = sessionStorage.getItem("ownersData");
    const { ownersList, requiredConfirmations } = ownersData && JSON.parse(ownersData || "");

    let confirmTxToast: string | undefined, loadingToast, successToast: string | undefined;
    const props = {
      safeAccountConfig: {
        threshold: parseInt(requiredConfirmations),
        owners: ownersList,
      },
      callback: (txHash: string) => {
        console.log({ txHash });
        //* Processing Tx
        confirmTxToast && toast.dismiss(confirmTxToast);
        loadingToast = toast.loading("Creating Wallet...");
      },
    };

    if (signer) {
      try {
        //* Confirm Tx
        confirmTxToast = toast.loading("Please Confirm Transaction...");

        //* Creat Tx
        const safeSdk: Safe = await createNewWallet(signer, props);
        const newSafeAddress = safeSdk?.getAddress();

        console.log({ newSafeAddress });

        //* Success Tx
        if (newSafeAddress) {
          setIsCreated(true);
          toast.dismiss(loadingToast);
          successToast = toast.success("Wallet successfully created!", {
            duration: 5000,
          });
          setTimeout(() => {
            toast.dismiss(successToast);
            toast.loading("Redirecting to the wallet...", {
              duration: 5000,
            });
          }, 5000);
          setDisabledBtn(false);
        }
      } catch (err: any) {
        // Error
        toast.dismiss(confirmTxToast);
        toast.error(err?.reason);
        setDisabledBtn(false);
      }
    }
  };

  useEffect(() => {
    if (signer && isCreated) {
      setTimeout(async () => {
        console.log({ walletList });
        router.push({
          pathname: `/dashboard/${walletList.at(-1)}`,
          query: { id: walletList.length - 1 },
        });
        sessionStorage.removeItem("ownersData");
        sessionStorage.removeItem("walletName");
      }, 7000);
    }
  }, [signer, isCreated]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCompleted((prevCompleted: any) => {
      return { ...prevCompleted, [activeStep]: false };
    });
  };

  const handleNext = () => {
    setCompleted((prevCompleted: any) => {
      return { ...prevCompleted, [activeStep]: true };
    });
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Box sx={styles.container}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<StepConnector sx={styles.customStepperConnector} />}
      >
        {steps.map((step, index) => (
          <Step key={step} completed={completed[index]} sx={styles.customStepper}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box>
        {allStepsCompleted ? (
          <>
            <Typography mt={2} mb={1}>
              All Steps Completed
            </Typography>
            <Box display="flex" flexDirection="row" pt={2}>
              <Box flex="1 1 auto" />
              <Button variant="contained" onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </>
        ) : (
          <Box width="90%" m="auto">
            {getStepDescription(activeStep)}
            <Box sx={styles.buttonContainer}>
              <Button onClick={handleBack} variant="text" disabled={activeStep === 0} sx={styles.backButton}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={styles.continueButton}
                disabled={disabledBtn}
                onClick={() => {
                  activeStep === totalSteps - 1 ? createWallet() : handleNext();
                }}
              >
                {activeStep === totalSteps - 1 ? "Create" : "Continue"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CreateWallet;
