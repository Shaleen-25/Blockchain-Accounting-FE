import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";
import useStore from "../../global-state";
import { toast } from "react-toastify";
import { toastSettings } from "../../constants";

export default function Approvals({ users }) {
  const [approvalData, setApprovalData] = useState(null);
  const user = useStore((state) => state.loggedInUser);
  const userId = users?.find(({ firstName }) => firstName === user).id;

  const getApprovalsData = async () => {
    const data = await fetch(
      `https://mlsubba.herokuapp.com/api/consensus/findByApprover?approver=${userId}`
    ).catch((err) => {
      console.log("err", err);
    });
    const res = await data.json();
    const approvals = res.map(
      ({ id, message, transactionNum, approverStatus }) => ({
        id,
        transactionNum,
        msg: message,
        status: approverStatus,
      })
    );
    setApprovalData(approvals);
  };

  useEffect(() => {
    getApprovalsData();
  }, []);

  const acceptHandler = async (params) => {
    await fetch(
      `https://mlsubba.herokuapp.com/api/consensus/setApproval?transactionNum=${
        params.row.transactionNum
      }&approver=${userId}&approve=${true}`
    );
    await getApprovalsData();
    toast.info("Transaction Approval Sent", toastSettings);
  };

  const rejecttHandler = async (params) => {
    await fetch(
      `https://mlsubba.herokuapp.com/api/consensus/setApproval?transactionNum=${
        params.row.transactionNum
      }&approver=${userId}&approve=${false}`
    );
    await getApprovalsData();
    toast.info("Transaction Rejection Sent", toastSettings);
  };

  const columns = [
    {
      field: "transactionNum",
      headerName: "Transaction ID",
      flex: 1,
      sortable: false,
    },
    {
      field: "message",
      headerName: "Transaction message",
      flex: 4,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <>
          <Tooltip title={params.row.msg}>
            <p>{params.row.msg}</p>
          </Tooltip>
        </>
      ),
    },
    {
      field: "approval",
      headerName: "Approve/Reject",
      flex: 1,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <>
          {params.row.status !== "Awaited" ? (
            params.row.status
          ) : (
            <>
              <CheckCircleIcon
                color="success"
                onClick={() => acceptHandler(params)}
                sx={{ marginLeft: 2, marginRight: 10 }}
              />
              <CancelIcon
                color="error"
                onClick={() => rejecttHandler(params)}
              />
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div
      style={{
        border: "1px solid black",
        margin: "auto",
        height: "90%",
        width: "95%",
        textAlign: "center",
      }}
    >
      <DataGrid
        rows={approvalData}
        columns={columns}
        pageSize={6}
        disableColumnMenu={true}
        disableColumnFilter={true}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
        disableSelectionOnClick
      />
    </div>
  );
}
