import { ContentCopyRounded } from "@mui/icons-material";
import { Box, IconButton, Paper, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useEthers } from "@usedapp/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useGetOwners, useGetSigner } from "../../../hooks";
import { ShareIcon } from "../../index";
import { styles } from "./styles";

const AddressCell = (params: GridRenderCellParams) => {
  const [tooltipTitle, setTooltipTitle] = useState<string>("Copy to clipboard");
  const { library } = useEthers();

  return (
    <Stack py={1} px={3} spacing={1} direction="row" alignItems="center">
      <Typography variant="caption" component="p" width="340px">
        <Typography variant="caption" fontWeight="bold">
          {library?.network?.name?.substring(0, 3)}:
        </Typography>{" "}
        {params?.value}
      </Typography>
      <Tooltip title={tooltipTitle} placement="top">
        <IconButton
          size="medium"
          sx={styles.iconButton}
          onClick={() => {
            params?.value && navigator.clipboard.writeText(params?.value);
            setTooltipTitle("Copied");
            setTimeout(() => {
              setTooltipTitle("Copy to clipboard");
            }, 1200);
          }}
        >
          <ContentCopyRounded sx={styles.copyIcon} />
        </IconButton>
      </Tooltip>
      <Tooltip title="View on sepolia.etherscan.io" placement="top">
        <IconButton
          size="small"
          sx={styles.iconButton}
          onClick={() => {
            window.open(`https://${library?.network?.name}.etherscan.io/address/${params?.value}`, "_blank");
          }}
        >
          <ShareIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

const WalletOwners = () => {
  const router = useRouter();
  const { walletAddress } = router?.query;
  const [rows, setRows] = useState<any[]>([]);

  const signer = useGetSigner();
  const ownersList = useGetOwners(signer, walletAddress);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "No",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "avatar",
      headerName: "Avatar",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={params.value} width="34" height="34" alt="" className="rounded-full object-cover" />
      ),
    },
    {
      field: "address",
      headerName: "Owner Address",
      maxWidth: 738,
      width: 738,
      align: "center",
      headerAlign: "center",
      renderCell: AddressCell,
    },
  ];

  useEffect(() => {
    setRows(() => {
      const modifyOwnerList =
        ownersList &&
        ownersList?.length > 0 &&
        ownersList?.map((owner: string, index: number) => {
          return {
            id: index + 1,
            avatar: "/asset/images/avatar.png",
            address: owner,
          };
        });
      return modifyOwnerList || [];
    });
  }, [ownersList]);

  return (
    <>
      <Typography variant="h6" fontWeight="700" mt="24px" gutterBottom>
        Owners
      </Typography>
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
    </>
  );
};

export default WalletOwners;
