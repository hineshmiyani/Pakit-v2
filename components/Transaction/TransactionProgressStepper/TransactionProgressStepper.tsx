import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import toast from "react-hot-toast";
import { useEthers } from "@usedapp/core";
import { styled } from "@mui/material/styles";
import {
  Stack,
  Stepper,
  Step,
  StepLabel,
  Box,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  Typography,
  Button,
} from "@mui/material";
import { Check, CircleOutlined } from "@mui/icons-material";

import { useGetOwnersApprovedTx, useGetPendingTxs, useGetSigner } from "../../../hooks";
import { confirmTx, executeTx, rejectTx } from "../../../services";
import { AccountAvatar } from "../../index";
import { styles } from "./styles";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#f02525",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#f02525",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#bdbdbd",
    borderTopWidth: 3,
    borderRadius: 1,
    minHeight: "14px",
  },
}));

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#bdbdbd",
  display: "flex",
  height: 24,
  width: 24,
  alignItems: "center",
  justifyContent: "center",
  ...(ownerState.active && {
    color: "#f02525",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#f02525",
    zIndex: 1,
    fontSize: 22,
  },
  "& .QontoStepIcon-circle": {
    fontSize: "16px",
  },
}));

const QontoStepIcon = (props: StepIconProps) => {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <CircleOutlined className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
};

type Props = {
  transaction: any;
  confirmationsRequired: number;
};

const TransactionProgressStepper: React.FC<Props> = ({ transaction, confirmationsRequired }) => {
  const router = useRouter();
  const { walletAddress, id: walletId } = router.query;
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const { account } = useEthers();
  const signer = useGetSigner();
  const { refetch: getPendingTxs } = useGetPendingTxs(signer, walletAddress);
  const { results: approvedTxOwnerList, refetch: getOwnersWhoApprovedTxHash } = useGetOwnersApprovedTx(
    signer,
    walletAddress,
    transaction?.safeTxHash,
  );

  useEffect(() => {
    if (transaction?.isExecuted === true) {
      setActiveStep(4);
    } else if (parseInt(transaction?.confirmations?.length) >= confirmationsRequired) {
      setActiveStep(3);
    } else {
      setActiveStep(1);
    }
  }, [transaction?.confirmations?.length]);

  let loadingToast, successToast: any;

  const executeTransaction = async () => {
    setDisabledBtn(true);
    if (!walletAddress || Array.isArray(walletAddress) || !signer || !transaction) return;
    loadingToast = toast.loading("Please confirm the transaction and wait for its execution...");

    try {
      const execute = await executeTx(signer, walletAddress, transaction);
      setTimeout(async () => {
        await getPendingTxs();
        await getOwnersWhoApprovedTxHash();
      }, 2000);
      toast.dismiss(loadingToast);
      successToast = toast.success("A Transaction has been successfully executed! ", {
        duration: 5000,
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error?.reason);
    }
    setDisabledBtn(false);
  };

  const confirmTransaction = async () => {
    setDisabledBtn(true);
    if (!walletAddress || Array.isArray(walletAddress) || !signer || !transaction?.safeTxHash) return;
    loadingToast = toast.loading("Please confirm the transaction and wait for its execution...");

    try {
      const confirm = await confirmTx(signer, walletAddress, transaction?.safeTxHash);
      setTimeout(async () => {
        await getPendingTxs();
        await getOwnersWhoApprovedTxHash();
      }, 2000);
      toast.dismiss(loadingToast);
      successToast = toast.success("A Transaction has been successfully executed! ", {
        duration: 5000,
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error?.reason);
    }
    setDisabledBtn(false);
  };

  const rejectConfirmation = async () => {
    setDisabledBtn(true);
    if (!walletAddress || Array.isArray(walletAddress) || !signer || !transaction?.nonce) return;
    loadingToast = toast.loading("Please confirm the transaction and wait for its execution...");

    try {
      const reject = await rejectTx(signer, walletAddress, transaction?.nonce);
      setTimeout(async () => {
        await getPendingTxs();
        await getOwnersWhoApprovedTxHash();
      }, 2000);
      toast.dismiss(loadingToast);
      successToast = toast.success("A Transaction has been successfully executed! ", {
        duration: 5000,
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error?.reason);
    }
    setDisabledBtn(false);
  };

  // useEffect(() => {
  //   console.log({ executeTxState });
  //   let loadingToast, confirmTxWallet, successToast: any;
  //   switch (executeTxState?.status) {
  //     case "PendingSignature":
  //       confirmTxWallet = toast.loading("Please Confirm Transaction...");
  //       break;
  //     case "Mining":
  //       toast.dismiss(confirmTxWallet);
  //       loadingToast = toast.loading("Executing Transaction...");
  //       break;
  //     case "Success":
  //       toast.dismiss(loadingToast);
  //       successToast = toast.success("A Transaction has been successfully Executed! ", {
  //         duration: 5000,
  //       });
  //       setDisabledBtn(false);
  //       setTimeout(() => {
  //         toast.dismiss(successToast);
  //       }, 6000);
  //       break;
  //     case "Exception":
  //       toast.dismiss(loadingToast);
  //       toast.error(executeTxState?.errorMessage || "", {
  //         duration: 5000,
  //       });
  //       setDisabledBtn(false);
  //       break;
  //     case "Fail":
  //       toast.dismiss(loadingToast);
  //       toast.error(executeTxState?.errorMessage || "", {
  //         duration: 5000,
  //       });
  //       setDisabledBtn(false);
  //       break;
  //     default:
  //       break;
  //   }
  // }, [executeTxState]);

  // useEffect(() => {
  //   console.log({ confirmTxState });
  //   let loadingToast, confirmTxWallet, successToast: any;
  //   switch (confirmTxState?.status) {
  //     case "PendingSignature":
  //       confirmTxWallet = toast.loading("Please Confirm Transaction...");
  //       break;
  //     case "Mining":
  //       toast.dismiss(confirmTxWallet);
  //       loadingToast = toast.loading("Confirming Transaction...");
  //       break;
  //     case "Success":
  //       toast.dismiss(loadingToast);
  //       successToast = toast.success("A Transaction has been successfully Confirmed! ", {
  //         duration: 5000,
  //       });
  //       setDisabledBtn(false);
  //       setTimeout(() => {
  //         toast.dismiss(successToast);
  //       }, 6000);
  //       break;
  //     case "Exception":
  //       toast.dismiss(loadingToast);
  //       toast.error(confirmTxState?.errorMessage || "", {
  //         duration: 5000,
  //       });
  //       setDisabledBtn(false);
  //       break;
  //     case "Fail":
  //       toast.dismiss(loadingToast);
  //       toast.error(confirmTxState?.errorMessage || "", {
  //         duration: 5000,
  //       });
  //       setDisabledBtn(false);
  //       break;
  //     default:
  //       break;
  //   }
  // }, [confirmTxState]);

  // useEffect(() => {
  //   console.log({ rejectConfirmationState });
  //   let loadingToast, confirmTxWallet, successToast: any;
  //   switch (rejectConfirmationState?.status) {
  //     case "PendingSignature":
  //       confirmTxWallet = toast.loading("Please Confirm Transaction...");
  //       break;
  //     case "Mining":
  //       toast.dismiss(confirmTxWallet);
  //       loadingToast = toast.loading("Rejecting Confirmation...");
  //       break;
  //     case "Success":
  //       toast.dismiss(loadingToast);
  //       successToast = toast.success("A confirmation has been successfully rejected! ", {
  //         duration: 5000,
  //       });
  //       setDisabledBtn(false);
  //       setTimeout(() => {
  //         toast.dismiss(successToast);
  //       }, 6000);
  //       break;
  //     case "Exception":
  //       toast.dismiss(loadingToast);
  //       toast.error(rejectConfirmationState?.errorMessage || "", {
  //         duration: 5000,
  //       });
  //       setDisabledBtn(false);
  //       break;
  //     case "Fail":
  //       toast.dismiss(loadingToast);
  //       toast.error(rejectConfirmationState?.errorMessage || "", {
  //         duration: 5000,
  //       });
  //       setDisabledBtn(false);
  //       break;
  //     default:
  //       break;
  //   }
  // }, [rejectConfirmationState]);

  const steps = [
    !transaction?.isExecuted || transaction?.transfers?.length > 0 ? "Created" : "On-chain rejection created",
    <Typography key="second" variant="body2">
      Confimations ({parseInt(transaction?.confirmations?.length)} of {confirmationsRequired})
    </Typography>,
    <AccountAvatar key="third" toAddress={transaction?.to} truncate={true} />,
    "Executed",
  ];

  return (
    <Stack width="100%">
      <Stepper orientation="vertical" activeStep={activeStep} connector={<QontoConnector />}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel sx={styles.stepLabel} StepIconComponent={QontoStepIcon}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {transaction?.isExecuted === false && (
        <Box sx={styles.buttonContainer}>
          {transaction?.confirmations?.length >= confirmationsRequired ? (
            <Button
              variant="contained"
              color="primary"
              sx={styles.actionsButton}
              disabled={disabledBtn}
              onClick={() => executeTransaction()}
            >
              Execute
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={styles.actionsButton}
              disabled={(account && approvedTxOwnerList?.includes(account)) || disabledBtn}
              onClick={() => confirmTransaction()}
            >
              Confirm
            </Button>
          )}

          <Button
            variant="outlined"
            disabled={disabledBtn}
            sx={styles.rejectButton}
            onClick={() => rejectConfirmation()}
          >
            Reject
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default TransactionProgressStepper;
