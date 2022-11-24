import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { utils } from "ethers";
import { formatEther, parseEther, parseUnits } from "@ethersproject/units";
import { useContractFunction, useEtherBalance, useEthers, useTokenBalance } from "@usedapp/core";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  styled,
  Typography,
  Stack,
  Tooltip,
  Divider,
  TextField,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { TollRounded, Close, ContentCopyRounded, CallMade } from "@mui/icons-material";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import { SafeBalanceUsdResponse } from "@gnosis.pm/safe-service-client";

import { createNewTransaction, encodeERC20TokenTransferData } from "../../../services";
import { useGetSigner, useGetTotalBalance } from "../../../hooks";
import { contract } from "../../../constants";
import { ShareIcon } from "../../index";
import { styles } from "./styles";

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
  },
}));

type DialogTitleProps = {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
};

const CustomDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={styles.dialogTitle} {...other}>
      {children}
      {onClose ? (
        <IconButton aria-label="close" onClick={onClose} sx={styles.closeButton}>
          <Close />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

enum DialogStep {
  CHOOSE_TRANSACTION = "CHOOSE_TRANSACTION",
  DEPOSIT_FUNDS = "DEPOSIT_FUNDS",
  SEND_FUNDS = "SEND_FUNDS",
}

type Props = {
  children?: JSX.Element;
  walletAddress: string;
};

const MakeTransactionDialog: React.FC<Props> = ({ children, walletAddress }) => {
  const router = useRouter();
  const { id: walletId } = router?.query;

  const [open, setOpen] = useState<boolean>(false);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);
  const [tooltipTitle, setTooltipTitle] = useState<string>("Copy to clipboard");
  const [showDialogStep, setShowDialogStep] = useState<string>(DialogStep.CHOOSE_TRANSACTION);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [sendAmount, setSendAmount] = useState<number>(0);
  const [selectToken, setSelectToken] = useState<string>("Ether");

  const [recipientAddress, setRecipientAddress] = useState<string>("");

  const { account, library } = useEthers();
  const signer = useGetSigner();

  const { tokensBalance: tokensList } = useGetTotalBalance(signer, walletAddress);
  const accountBalance = useEtherBalance(account?.toString());
  const walletBalance: any = useEtherBalance(walletAddress);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectToken(event.target.value.toString());
  };

  // const depositEther = () => {
  //   setDisabledBtn(true);
  //   depositAmount !== 0 &&
  //     walletId &&
  //     deposit(account, +walletId, {
  //       value: utils.parseEther(depositAmount.toString()),
  //     });
  // };

  let loadingToast, successToast: any;
  const sendFund = async () => {
    setDisabledBtn(true);
    if (!walletAddress || Array.isArray(walletAddress) || !signer || !recipientAddress || !selectToken) return;
    loadingToast = toast.loading("Please confirm the transaction and wait for its execution...");

    let safeTransactionData: SafeTransactionDataPartial;
    if (selectToken === "Ether") {
      //* Transfer Ether
      safeTransactionData = {
        to: recipientAddress,
        value: parseEther(sendAmount?.toString()).toString(),
        data: "0x00",
      };
    } else {
      //* Find ERC20 Token from Token List
      const ERC20Token =
        tokensList && tokensList?.find((token: SafeBalanceUsdResponse) => token?.token?.name === selectToken);
      const value = parseUnits(sendAmount?.toString(), ERC20Token?.token?.decimals);

      //* Transfer ERC20
      if (!ERC20Token) return;
      safeTransactionData = {
        to: ERC20Token?.tokenAddress,
        value: "0",
        data: encodeERC20TokenTransferData(recipientAddress, value.toString()),
      };
    }

    try {
      const createTx = await createNewTransaction(signer, walletAddress, safeTransactionData);
      toast.dismiss(loadingToast);
      successToast = toast.success("A Transaction has been successfully executed! ", {
        duration: 5000,
      });
      setTimeout(() => {
        toast.dismiss(successToast);
        router.push({
          pathname: `/dashboard/${walletAddress}/transactions`,
          query: { id: walletId },
        });
      }, 6000);
      handleClose();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error?.reason, {
        duration: 5000,
      });
    }

    setDisabledBtn(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setShowDialogStep(DialogStep.CHOOSE_TRANSACTION);
      setDepositAmount(0);
    }, 500);
  };

  return (
    <Box>
      {children && React.cloneElement(children, { onClick: handleClickOpen })}
      <CustomDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <CustomDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {showDialogStep === DialogStep.CHOOSE_TRANSACTION && "Send"}
          {showDialogStep === DialogStep.DEPOSIT_FUNDS && "Deposit funds"}
          {showDialogStep === DialogStep.SEND_FUNDS && "Send funds"}
        </CustomDialogTitle>

        <DialogContent dividers sx={styles.dialogContent}>
          {/* DialogStep -> CHOOSE_TRANSACTION */}
          {showDialogStep === DialogStep.CHOOSE_TRANSACTION && (
            <Stack alignItems="center" m="30px" spacing={4}>
              {/* <Button
                startIcon={<TollRounded sx={{ fontSize: "24px !important" }} />}
                sx={styles.button}
                onClick={() => setShowDialogStep(DialogStep.DEPOSIT_FUNDS)}
              >
                Deposit Funds
              </Button> */}
              <Button
                startIcon={<CallMade sx={{ fontSize: "24px !important" }} />}
                sx={styles.button}
                onClick={() => setShowDialogStep(DialogStep.SEND_FUNDS)}
              >
                Send Funds
              </Button>
            </Stack>
          )}

          {/* DialogStep -> DEPOSIT_FUNDS */}
          {showDialogStep === DialogStep.DEPOSIT_FUNDS && (
            <Box textAlign="left">
              <Typography variant="subtitle1" gutterBottom fontWeight="500">
                Sending from
              </Typography>

              <Stack direction="row" alignItems="center" spacing={1.2}>
                <Image
                  src="/asset/images/avatar.png"
                  alt=""
                  width={34}
                  height={34}
                  className="rounded-full object-cover"
                />
                <Typography variant="body2">
                  <Typography variant="caption" fontWeight="bold">
                    {library?.network?.name?.substring(0, 2)}
                    {library?.network?.name?.substring(3, 4)}:
                  </Typography>{" "}
                  {account}
                </Typography>

                <Stack spacing={0.5} direction="row" alignItems="center">
                  <Tooltip title={tooltipTitle} placement="top">
                    <IconButton
                      size="medium"
                      sx={styles.iconButton}
                      onClick={() => {
                        account && navigator.clipboard.writeText(account);
                        setTooltipTitle("Copied");
                        setTimeout(() => {
                          setTooltipTitle("Copy to clipboard");
                        }, 1200);
                      }}
                    >
                      <ContentCopyRounded sx={styles.copyIcon} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View on goerli.etherscan.io" placement="top">
                    <IconButton
                      size="small"
                      sx={styles.iconButton}
                      onClick={() => {
                        window.open(`https://${library?.network?.name}.etherscan.io/address/${account}`, "_blank");
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              <Box sx={styles.balanceContainer}>
                <Typography variant="body2">
                  Balance :{" "}
                  <Typography variant="body2" component="span" fontWeight="600">
                    {" "}
                    {accountBalance ? parseFloat(formatEther(accountBalance)).toFixed(4) : 0.0} ETH
                  </Typography>{" "}
                </Typography>
              </Box>

              <Divider sx={styles.divider} />

              <Box>
                <Typography variant="body2" component="p" my={1}>
                  Amount
                </Typography>
                <TextField
                  fullWidth
                  color="error"
                  variant="outlined"
                  type="number"
                  value={depositAmount}
                  onChange={(e) => {
                    setDepositAmount(+e.target.value);
                  }}
                  placeholder="Enter an amount*"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                  required
                />
              </Box>
            </Box>
          )}

          {/* DialogStep -> SEND_FUNDS  */}
          {showDialogStep === DialogStep.SEND_FUNDS && (
            <Box textAlign="left">
              <Typography variant="subtitle1" gutterBottom fontWeight="500">
                Sending from
              </Typography>

              <Stack direction="row" alignItems="center" spacing={1.2}>
                <Image
                  src="/asset/images/walletAvatar.png"
                  alt=""
                  width={34}
                  height={34}
                  className="rounded-full object-cover"
                />
                <Typography variant="body2">
                  <Typography variant="caption" fontWeight="bold">
                    {library?.network?.name?.substring(0, 2)}
                    {library?.network?.name?.substring(3, 4)}:
                  </Typography>{" "}
                  {walletAddress ? walletAddress : ""}
                </Typography>

                <Stack spacing={0.5} direction="row" alignItems="center">
                  <Tooltip title={tooltipTitle} placement="top">
                    <IconButton
                      size="medium"
                      sx={styles.iconButton}
                      onClick={() => {
                        account && navigator.clipboard.writeText(account);
                        setTooltipTitle("Copied");
                        setTimeout(() => {
                          setTooltipTitle("Copy to clipboard");
                        }, 1200);
                      }}
                    >
                      <ContentCopyRounded sx={styles.copyIcon} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View on goerli.etherscan.io" placement="top">
                    <IconButton
                      size="small"
                      sx={styles.iconButton}
                      onClick={() => {
                        window.open(`https://${library?.network?.name}.etherscan.io/address/${account}`, "_blank");
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              <Box sx={styles.balanceContainer}>
                <Typography variant="body2">
                  Balance :{" "}
                  <Typography variant="body2" component="span" fontWeight="600">
                    {" "}
                    {walletBalance ? parseFloat(formatEther(walletBalance)).toFixed(4) : 0.0} ETH
                  </Typography>{" "}
                </Typography>
              </Box>

              <Divider sx={styles.divider} />

              <Box>
                <Typography variant="body2" component="p" my={1}>
                  Recipient *
                </Typography>
                <TextField
                  fullWidth
                  color="error"
                  variant="outlined"
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => {
                    setRecipientAddress(e.target.value);
                  }}
                  placeholder="Enter an recipient address*"
                  InputLabelProps={{ shrink: true }}
                  required
                />

                <Typography variant="body2" component="p" my={1}>
                  Select an asset *
                </Typography>
                <Select value={selectToken} onChange={handleChange} color="error" sx={{ width: "100%" }}>
                  {tokensList &&
                    tokensList?.map((token: SafeBalanceUsdResponse, index) => (
                      <MenuItem key={index} value={token?.token?.name ?? "Ether"}>
                        <Stack direction="row" spacing={1}>
                          <img
                            src={token?.token?.logoUri ?? "/asset/images/ethLogo.png"}
                            width="24"
                            height="24"
                            alt=""
                            className="rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/asset/images/token-placeholder.svg";
                              (e.target as HTMLImageElement).srcset = "/asset/images/token-placeholder.svg";
                            }}
                          />
                          <Typography>{token?.token?.name ?? "Ether"}</Typography>
                          <Typography>
                            ({formatEther(token?.balance)} {token?.token?.symbol ?? "Ether"})
                          </Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                </Select>

                <Typography variant="body2" component="p" my={1}>
                  Amount *
                </Typography>
                <TextField
                  fullWidth
                  color="error"
                  variant="outlined"
                  type="number"
                  value={sendAmount}
                  onChange={(e) => {
                    setSendAmount(+e.target.value);
                  }}
                  placeholder="Enter an amount*"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                  required
                />
              </Box>
            </Box>
          )}
        </DialogContent>

        {/* DialogStep -> DEPOSIT_FUNDS */}
        {/* {showDialogStep === DialogStep.DEPOSIT_FUNDS && (
          <DialogActions sx={styles.dialogActions}>
            <>
              <Button sx={styles.cancelButton} onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={() => depositEther()}
                sx={styles.submitButton}
                disabled={depositAmount === 0 || disabledBtn}
              >
                Submit
              </Button>
            </>
          </DialogActions>
        )} */}

        {/* DialogStep -> SEND_FUNDS  */}
        {showDialogStep === DialogStep.SEND_FUNDS && (
          <DialogActions sx={styles.dialogActions}>
            <>
              <Button sx={styles.cancelButton} onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={() => sendFund()}
                sx={styles.submitButton}
                disabled={!recipientAddress || sendAmount === 0 || disabledBtn}
              >
                Submit
              </Button>
            </>
          </DialogActions>
        )}
      </CustomDialog>
    </Box>
  );
};

export default MakeTransactionDialog;
