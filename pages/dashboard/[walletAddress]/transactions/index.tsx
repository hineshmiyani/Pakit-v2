import { CallMade, CallReceived, ExpandMore, HighlightOff, PeopleAltOutlined } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  EthereumTxWithTransfersResponse,
  SafeBalanceResponse,
  SafeModuleTransactionWithTransfersResponse,
  SafeMultisigTransactionWithTransfersResponse,
} from "@safe-global/safe-service-client";
import { useEthers } from "@usedapp/core";
import { formatEther, formatUnits } from "ethers/lib/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AccountAvatar, TransactionProgressStepper, TxNotFound } from "../../../../components";
import {
  useGetAllTxs,
  useGetBalances,
  useGetPendingTxs,
  useGetSigner,
  useNumConfirmationsRequired,
} from "../../../../hooks";
import { styles } from "./styles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2.5 }}>{children}</Box>}
    </Box>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const queueText = "Queued transactions will appear here";
const completedText = "Completed transactions will appear here";

enum TxType {
  ETHEREUM_TRANSACTION = "ETHEREUM_TRANSACTION",
  MULTISIG_TRANSACTION = "MULTISIG_TRANSACTION",
}

const Transactions = () => {
  const router = useRouter();
  const { walletAddress, id: walletId } = router?.query;
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { account } = useEthers();
  const signer = useGetSigner();

  const confirmationsRequired = useNumConfirmationsRequired(signer, walletAddress);
  const { results: transactionsList, refetch: getAllTxs } = useGetAllTxs(signer, walletAddress);
  const { results: pendingTxList, refetch: getPendingTxs } = useGetPendingTxs(signer, walletAddress);
  const { tokensBalances: tokensList } = useGetBalances(signer, walletAddress);

  const findTokenInfo = (tokenAddress: string) => {
    const token = tokensList?.find((token: SafeBalanceResponse) => token?.tokenAddress === tokenAddress);
    return token;
  };

  return (
    <>
      <Container>
        <Typography variant="h5" fontWeight="bold" my="24px">
          Transactions
        </Typography>

        <Box width="100%">
          <Box borderBottom={1} borderColor="divider">
            <Tabs value={value} onChange={handleChange} aria-label="tabs" sx={styles.tabsContainer}>
              <Tab sx={styles.tab} label="Queue" {...a11yProps(0)} onClick={getPendingTxs} />
              <Tab sx={styles.tab} label="Completed" {...a11yProps(1)} onClick={getAllTxs} />
            </Tabs>
          </Box>

          {/* Pending Txs */}
          <TabPanel value={value} index={0}>
            <Box>
              {pendingTxList?.map((transaction: any, index: number) => {
                if ("isExecuted" in transaction && transaction?.isExecuted === false) {
                  return (
                    <Accordion key={transaction?.to + index} sx={styles.accordionContainer}>
                      <AccordionSummary expandIcon={<ExpandMore />} sx={styles.accordionSummary}>
                        <Stack direction="row" spacing={2} alignItems="center" width="100%">
                          <Box flexBasis="10%" maxWidth="10%">
                            <Typography>
                              <Typography component="span" fontWeight="600">
                                Tx:{" "}
                              </Typography>
                              {transaction?.nonce}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={1.2} flexBasis="20%" maxWidth="20%">
                            <CallMade sx={{ color: "primary.buttonColor" }} />
                            <Typography>Send</Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={1.2} flexBasis="25%" maxWidth="25%">
                            <Image
                              src={
                                transaction?.dataDecoded
                                  ? findTokenInfo(transaction?.to)?.token?.logoUri ||
                                    "/asset/images/token-placeholder.svg"
                                  : "/asset/images/ethLogo.png"
                              }
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/asset/images/token-placeholder.svg";
                                (e.target as HTMLImageElement).srcset = "/asset/images/token-placeholder.svg";
                              }}
                              height={26}
                              width={26}
                              className="rounded-full object-cover"
                              alt=""
                            />
                            {transaction?.dataDecoded ? (
                              <Typography>
                                {formatUnits(
                                  transaction?.dataDecoded?.parameters?.[1]?.value || "0",
                                  findTokenInfo(transaction?.to)?.token?.decimals,
                                )}{" "}
                                {findTokenInfo(transaction?.to)?.token?.symbol}
                              </Typography>
                            ) : (
                              <Typography>{transaction?.value && formatEther(transaction?.value)} ETH</Typography>
                            )}
                          </Box>

                          <Box display="flex" alignItems="center" gap={1.2} flexBasis="25%" maxWidth="25%">
                            <PeopleAltOutlined />
                            <Typography>
                              {parseInt(transaction?.confirmations?.length)} out of {confirmationsRequired}
                            </Typography>
                          </Box>

                          <Typography variant="body2" sx={styles.confirmationText}>
                            Needs Confirmation
                          </Typography>
                        </Stack>
                      </AccordionSummary>

                      <Divider />

                      <AccordionDetails sx={{ pt: 2 }}>
                        <Box display="flex" alignItems="top" gap={3}>
                          <Box>
                            <Typography variant="body1">
                              Send{" "}
                              <Typography variant="body1" component="span" fontWeight="700">
                                {transaction?.dataDecoded
                                  ? formatUnits(
                                      transaction?.dataDecoded?.parameters?.[1]?.value || "0",
                                      findTokenInfo(transaction?.to)?.token?.decimals,
                                    )
                                  : formatEther(transaction?.value)}{" "}
                              </Typography>
                              {transaction?.dataDecoded ? findTokenInfo(transaction?.to)?.token?.symbol : "ETH"} to:
                            </Typography>
                            <Box my={1}>
                              {transaction?.dataDecoded ? (
                                <AccountAvatar toAddress={transaction?.dataDecoded?.parameters?.[0]?.value} />
                              ) : (
                                <AccountAvatar toAddress={transaction?.to} />
                              )}
                            </Box>
                          </Box>

                          <Divider orientation="vertical" flexItem />
                          {confirmationsRequired && (
                            <Box>
                              <TransactionProgressStepper
                                transaction={transaction}
                                confirmationsRequired={confirmationsRequired}
                                getTxs={getPendingTxs}
                              />
                            </Box>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  );
                }
                return null;
              })}
              {pendingTxList?.filter((transaction: any) => transaction?.isExecuted === false)?.length === 0 && (
                <TxNotFound text={queueText} />
              )}
            </Box>
          </TabPanel>

          {/* Completed Txs */}
          <TabPanel value={value} index={1}>
            <Box>
              {transactionsList?.map((transaction: any, index: number) => {
                if (!("isExecuted" in transaction) || transaction?.isExecuted === true) {
                  return (
                    <Accordion
                      key={transaction?.to + index}
                      sx={{
                        my: 1.5,
                        borderRadius: "4px !important",
                        "&::before": { height: 0 },
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />} sx={styles.accordionSummary}>
                        <Stack direction="row" spacing={2} alignItems="center" width="100%">
                          <Box flexBasis="10%" maxWidth="10%">
                            {transaction?.txType === TxType.MULTISIG_TRANSACTION && (
                              <Typography>
                                <Typography component="span" fontWeight="600">
                                  Tx:{" "}
                                </Typography>
                                {transaction?.nonce}
                              </Typography>
                            )}
                          </Box>

                          <Box display="flex" alignItems="center" gap={1.2} flexBasis="20%" maxWidth="20%">
                            {transaction?.txType === TxType.MULTISIG_TRANSACTION ? (
                              <>
                                <CallMade sx={{ color: "primary.buttonColor" }} />
                                <Typography>Sent</Typography>
                              </>
                            ) : (
                              <>
                                <CallReceived sx={{ color: "success.main" }} />
                                <Typography>Received</Typography>
                              </>
                            )}
                          </Box>
                          <Box display="flex" alignItems="center" gap={1.2} flexBasis="25%" maxWidth="25%">
                            <Image
                              src={
                                transaction?.transfers?.[0]?.type === "ETHER_TRANSFER"
                                  ? "/asset/images/ethLogo.png"
                                  : transaction?.transfers?.[0]?.tokenInfo?.logoUri ||
                                    "/asset/images/token-placeholder.svg"
                              }
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/asset/images/token-placeholder.svg";
                                (e.target as HTMLImageElement).srcset = "/asset/images/token-placeholder.svg";
                              }}
                              height={26}
                              width={26}
                              className="rounded-full object-cover"
                              alt=""
                            />
                            <Typography>
                              {transaction?.txType === TxType.MULTISIG_TRANSACTION && "-"}
                              {transaction?.transfers?.[0]?.type === "ETHER_TRANSFER"
                                ? formatEther(transaction?.transfers?.[0]?.value || "0") + " ETH"
                                : `${formatUnits(
                                    transaction?.transfers?.[0]?.value || "0",
                                    transaction?.transfers?.[0]?.tokenInfo?.decimals,
                                  )} ${transaction?.transfers?.[0]?.tokenInfo?.symbol}`}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={1.2} flexBasis="25%" maxWidth="25%">
                            {transaction?.txType === TxType.MULTISIG_TRANSACTION && (
                              <>
                                <PeopleAltOutlined />
                                <Typography>
                                  {transaction?.confirmations?.length && transaction?.confirmations?.length} out of{" "}
                                  {confirmationsRequired}
                                </Typography>
                              </>
                            )}
                          </Box>

                          <Typography
                            variant="body2"
                            textAlign="center"
                            sx={{
                              ...styles.confirmationText,
                              color: "success.main",
                            }}
                          >
                            Success
                          </Typography>
                        </Stack>
                      </AccordionSummary>

                      <Divider />

                      <AccordionDetails sx={{ pt: 2 }}>
                        <Box display="flex" alignItems="top" gap={3}>
                          {transaction?.txType === TxType.MULTISIG_TRANSACTION && (
                            <Box>
                              <Typography variant="body1">
                                Sent{" "}
                                <Typography variant="body1" component="span" fontWeight="700">
                                  {formatUnits(
                                    transaction?.transfers?.[0]?.value || "0",
                                    transaction?.transfers?.[0]?.tokenInfo?.decimals ?? "18",
                                  )}{" "}
                                </Typography>
                                {transaction?.transfers?.[0]?.type === "ETHER_TRANSFER"
                                  ? "ETH"
                                  : transaction?.transfers?.[0]?.tokenInfo?.symbol}{" "}
                                to:
                              </Typography>
                              <Box my={1}>
                                <AccountAvatar
                                  toAddress={transaction?.transfers ? transaction?.transfers?.[0]?.to : transaction?.to}
                                />
                              </Box>
                            </Box>
                          )}

                          {!(transaction?.txType === TxType.MULTISIG_TRANSACTION) && (
                            <Box>
                              <Typography variant="body1">
                                Received{" "}
                                <Typography variant="body1" component="span" fontWeight="700">
                                  {formatUnits(
                                    transaction?.transfers?.[0]?.value || "0",
                                    transaction?.transfers?.[0]?.tokenInfo?.decimals ?? "18",
                                  )}{" "}
                                </Typography>
                                {transaction?.transfers?.[0]?.type === "ETHER_TRANSFER"
                                  ? "ETH"
                                  : transaction?.transfers?.[0]?.tokenInfo?.symbol}{" "}
                                from:
                              </Typography>
                              <Box my={1}>{transaction?.from && <AccountAvatar toAddress={transaction?.from} />}</Box>
                            </Box>
                          )}

                          <Divider orientation="vertical" flexItem />

                          {transaction?.txType === TxType.MULTISIG_TRANSACTION && confirmationsRequired && (
                            <Box>
                              <TransactionProgressStepper
                                transaction={transaction}
                                confirmationsRequired={confirmationsRequired}
                              />
                            </Box>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  );
                }
                return null;
              })}
              {transactionsList?.filter((transaction: any) => transaction?.isExecuted === true)?.length === 0 && (
                <TxNotFound text={completedText} />
              )}
            </Box>
          </TabPanel>
        </Box>
      </Container>
    </>
  );
};

export default Transactions;
