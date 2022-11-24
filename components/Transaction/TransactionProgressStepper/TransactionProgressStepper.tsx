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
  getTxs?: () => Promise<void>;
};

const TransactionProgressStepper: React.FC<Props> = ({ transaction, confirmationsRequired, getTxs }) => {
  const router = useRouter();
  const { walletAddress, id: walletId } = router.query;
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isTxExecuted, setIsTxExecuted] = useState(false);

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

  useEffect(() => {
    setTimeout(async () => {
      await getOwnersWhoApprovedTxHash();
      await getPendingTxs();
      getTxs && (await getTxs());
    }, 5000);
  }, [isTxExecuted]);

  let loadingToast, successToast: any;

  const executeTransaction = async () => {
    setDisabledBtn(true);
    setIsTxExecuted(false);
    if (!walletAddress || Array.isArray(walletAddress) || !signer || !transaction) return;
    loadingToast = toast.loading("Please confirm the transaction and wait for its execution...");

    try {
      const execute = await executeTx(signer, walletAddress, transaction);
      toast.dismiss(loadingToast);
      successToast = toast.success("A Transaction has been successfully executed! ", {
        duration: 5000,
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error?.reason);
    }
    await setIsTxExecuted(true);
    await setDisabledBtn(false);
  };

  const confirmTransaction = async () => {
    setDisabledBtn(true);
    setIsTxExecuted(false);
    if (!walletAddress || Array.isArray(walletAddress) || !signer || !transaction?.safeTxHash) return;
    loadingToast = toast.loading("Please confirm the transaction and wait for its execution...");

    try {
      const confirm = await confirmTx(signer, walletAddress, transaction?.safeTxHash);
      toast.dismiss(loadingToast);
      successToast = toast.success("A Transaction has been successfully executed! ", {
        duration: 5000,
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error?.reason);
    }
    await setIsTxExecuted(true);
    await setDisabledBtn(false);
  };

  // const rejectConfirmation = async () => {
  //   setDisabledBtn(true);
  //   if (!walletAddress || Array.isArray(walletAddress) || !signer || !transaction?.nonce) return;
  //   loadingToast = toast.loading("Please confirm the transaction and wait for its execution...");

  //   try {
  //     const reject = await rejectTx(signer, walletAddress, transaction?.nonce);
  //     toast.dismiss(loadingToast);
  //     successToast = toast.success("A Transaction has been successfully executed! ", {
  //       duration: 5000,
  //     });
  //     setTimeout(async () => {
  //       await getPendingTxs();
  //       await getOwnersWhoApprovedTxHash();
  //     }, 7000);
  //   } catch (error: any) {
  //     toast.dismiss(loadingToast);
  //     toast.error(error?.reason);
  //   }
  //   await setDisabledBtn(false);
  // };

  const steps = [
    !transaction?.isExecuted || transaction?.transfers?.length > 0 ? "Created" : "On-chain rejection created",
    <Typography key="second" variant="body2">
      Confimations ({approvedTxOwnerList && approvedTxOwnerList?.length} of {confirmationsRequired})
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
          {approvedTxOwnerList && approvedTxOwnerList.length >= confirmationsRequired ? (
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

          {/* <Button
            variant="outlined"
            disabled={disabledBtn}
            sx={styles.rejectButton}
            onClick={() => rejectConfirmation()}
          >
            Reject
          </Button> */}
        </Box>
      )}
    </Stack>
  );
};

export default TransactionProgressStepper;
