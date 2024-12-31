import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { formatEther } from "@ethersproject/units";
import { Box, Container, Paper, Skeleton, Stack, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { SafeBalanceUsdResponse } from "@safe-global/safe-service-client";
import { useGetSigner, useGetTotalBalance } from "../../../../hooks";
import { styles } from "./style";

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

const Assets = () => {
  const router = useRouter();
  const { walletAddress } = router?.query;
  const [value, setValue] = useState(0);
  const [rows, setRows] = useState<any[]>([]);

  const signer = useGetSigner();
  const { tokensBalance: tokensList } = useGetTotalBalance(signer, walletAddress);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "No",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "asset",
      headerName: "Asset",
      width: 300,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={2}>
          <img
            src={params?.value?.token ? params?.value?.token?.logoUri : "/asset/images/ethLogo.png"}
            width="24"
            height="24"
            alt=""
            className="rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/asset/images/token-placeholder.svg";
              (e.target as HTMLImageElement).srcset = "/asset/images/token-placeholder.svg";
            }}
          />
          <Typography>{params?.value?.token?.name ?? "Ether"}</Typography>
        </Stack>
      ),
    },
    {
      field: "balance",
      headerName: "Balance",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "value",
      headerName: "Value",
      maxWidth: 400,
      width: 400,
      align: "center",
      headerAlign: "center",
    },
  ];

  useEffect(() => {
    setRows(() => {
      const modifyTokenList =
        tokensList &&
        tokensList?.length > 0 &&
        tokensList?.map((token: SafeBalanceUsdResponse, index: number) => {
          return {
            id: index + 1,
            asset: token,
            balance: `${formatEther(token?.balance)} ${token?.token?.symbol ?? "Ether"}`,
            value: `${token?.fiatBalance} ${token?.fiatCode}`,
          };
        });
      return modifyTokenList || [];
    });
  }, [tokensList]);

  return (
    <>
      <Container>
        <Typography variant="h5" fontWeight="bold" my="24px">
          Assets
        </Typography>

        <Box width="100%">
          <Box borderBottom={1} borderColor="divider">
            <Tabs value={value} onChange={handleChange} aria-label="tabs" sx={styles.tabsContainer}>
              <Tab sx={styles.tab} label="Token" {...a11yProps(0)} />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <Paper elevation={0} sx={styles.container}>
              <Box sx={styles.datagridContainer}>
                {rows?.length > 0 ? (
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={3}
                    rowsPerPageOptions={[3]}
                    disableSelectionOnClick
                    disableColumnSelector
                  />
                ) : (
                  <Stack spacing={0.8} p={0.5}>
                    {Array(5)
                      .fill(null)
                      .map((_, index) => (
                        <Skeleton key={index} variant="rounded" width="100%" height={46} />
                      ))}
                  </Stack>
                )}
              </Box>
            </Paper>
          </TabPanel>
        </Box>
      </Container>
    </>
  );
};

export default Assets;
