import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import useStore from "../../global-state";

const columns = [
  { field: "id", headerName: "Transaction ID", flex: 1, sortable: false },
  {
    field: "message",
    headerName: "Transaction message",
    flex: 2,
    sortable: false,
  },
  {
    field: "approval",
    headerName: "Approve/Reject",
    flex: 1,
    sortable: false,
    disableClickEventBubbling: true,
    renderCell: (params) => (
      <>
        <CheckCircleIcon
          //disable={true}
          color="success"
          onClick={() => console.log(params.id, "A")}
          sx={{ marginLeft: 2, marginRight: 10 }}
        />
        <CancelIcon color="error" onClick={() => console.log(params.id, "R")} />
      </>
    ),
  },
];

const rows = [
  {
    id: 11,
    message: "Sample Transaction Message",
  },
  { id: 22, message: "Approve for Cash DR to Sales CR of Rs.40.0" },
  { id: 33, message: "Approve for ICICI Bank DR to Sales CR of Rs.600.0" },
  { id: 44, message: "Approve for Cash DR to Capital CR of Rs.100.0" },
];

export default function Approvals({ users }) {
  // const [selectedAcc, setSelectedAcc] = useState(null);
  // const user = useStore((state) => state.loggedInUser);

  // useEffect(() => {
  //   const getApprovalsData = async () => {
  //     const userId = 0; // users.find(({ firstName }) => firstName === user).id
  //     const data = await fetch(
  //       `https://mlsubba.herokuapp.com/api/consensus/findByApprover?approver=${userId}`
  //     ).catch((err) => {
  //       console.log("err", err);
  //     });
  //     const res = await data.json();
  //     const accOptions = res.map((acc) => ({
  //       label: acc.name,
  //       value: acc.id,
  //     }));
  //     setSelectedAcc(accOptions);
  //   };
  //   getApprovalsData();
  // }, []);

  return (
    <div
      style={{
        border: "1px solid black",
        margin: "auto",
        height: "90%",
        width: "95%",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={8}
        disableColumnMenu={true}
        disableColumnFilter={true}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
        disableSelectionOnClick
      />
    </div>
  );
}
