import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";
import useStore from "../../global-state";
import { toast } from "react-toastify";
import { toastSettings } from "../../constants";
import Select from "react-dropdown-select";
import ViewTransactions from "../Transactions/ViewTransactions";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@material-ui/core";
import { DialogContentText } from "@mui/material";
import TextField from "@material-ui/core/TextField";

const filterOptions = [
  {
    label: "All",
    value: "All",
  },
  {
    label: "Awaited",
    value: "Awaited",
  },
  {
    label: "Approved",
    value: "Approved",
  },
  {
    label: "Rejected",
    value: "Rejected",
  },
];

export default function Approvals({ users }) {
  const [selectedTrancNum, setTrancNum] = useState(undefined);
  const [approvalData, setApprovalData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [openTranc, setOpenTranc] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const user = useStore((state) => state.loggedInUser);
  const userId = users?.find(({ firstName }) => firstName === user)?.id;

  const getApprovalsData = async () => {
    const data = await fetch(
      `https://bbanode2.ap-northeast-1.elasticbeanstalk.com/api/consensus/findByApprover?approver=${userId}`
    ).catch((err) => {
      console.log("err", err);
    });
    const res = await data.json();
    const approvals = res.map(
      ({ id, message, transactionNum, approverStatus, status }) => ({
        id,
        transactionNum,
        msg: message,
        status: approverStatus,
        statusMsg: status,
      })
    );
    setApprovalData(approvals);
    setFilteredData(approvals);
  };

  useEffect(() => {
    getApprovalsData();
  }, [userId]);

  const acceptHandler = async (params) => {
    try {
      await fetch("https://bbanode2.ap-northeast-1.elasticbeanstalk.com/api/consensus/setApproval", {
        method: "POST",
        body: JSON.stringify({
          transactionNum: params.row.transactionNum,
          approver: userId,
          approverStatus: "Approved",
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } catch (err) {
      console.log("error", err);
    }
    await getApprovalsData();
    toast.info("Transaction Approval Sent", toastSettings);
  };

  const rejectHandler = async () => {
    try {
      await fetch("https://bbanode2.ap-northeast-1.elasticbeanstalk.com/api/consensus/setApproval", {
        method: "POST",
        body: JSON.stringify({
          transactionNum: selectedTrancNum,
          approver: userId,
          approverStatus: "Rejected",
          status: rejectionReason,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } catch (err) {
      console.log("error", err);
    }
    await getApprovalsData();
    toast.info("Transaction Rejection Sent", toastSettings);
  };

  const columns = [
    {
      field: "transactionNum",
      headerName: "Transaction ID",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <div
          style={{ width: "100%" }}
          onClick={() => {
            setTrancNum(params.row.transactionNum);
            setOpenTranc(true);
          }}
        >
          <p>{params.row.transactionNum}</p>
        </div>
      ),
    },
    {
      field: "message",
      headerName: "Narration",
      flex: 2,
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
      flex: 0.75,
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
                onClick={() => {
                  setOpenReject(true);
                  setTrancNum(params.row.transactionNum);
                }}
              />
            </>
          )}
        </>
      ),
    },
    {
      field: "statusMsg",
      headerName: "Status",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title={params.row.statusMsg}>
            <p>{params.row.statusMsg}</p>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <Dialog
        open={openTranc}
        onClose={() => setOpenTranc(false)}
        fullWidth={true}
      >
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          <div style={{ height: "100%" }}>
            <ViewTransactions
              transactionNum={selectedTrancNum}
              showAll={false}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTranc(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openReject} onClose={() => setOpenReject(false)}>
        <DialogTitle>Rejection Reason</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Kindly provide a suitable reason for rejection.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Rejection Reason"
            fullWidth
            variant="standard"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              rejectHandler();
              setOpenReject(false);
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <div
        style={{
          margin: "auto",
          height: "85%",
          width: "95%",
          textAlign: "center",
        }}
      >
        <div className="dropdown">
          <h4 style={{ textAlign: "left", lineHeight: 0 }}>Filter By</h4>
          <Select
            options={filterOptions}
            onChange={(values) => {
              const filteredRows = approvalData.filter(
                ({ status }) =>
                  values[0]?.value === "All" || status === values[0]?.value
              );
              setFilteredData(filteredRows);
            }}
          />
        </div>
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={6}
          disableColumnMenu={true}
          disableColumnFilter={true}
          rowsPerPageOptions={[6]}
          checkboxSelection={false}
          disableSelectionOnClick
        />
      </div>
    </>
  );
}
