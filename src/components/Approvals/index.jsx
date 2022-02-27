import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

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
          color="success"
          onClick={() => console.log(params.id, "A")}
          sx={{ marginLeft: 2, marginRight: 10 }}
        />
        <CancelIcon
          color="error"
          onClick={() => console.log(params.id, "R")}
          //   sx={{ marginLeft: 15 }}
        />
      </>
    ),
  },
];

const rows = [
  {
    id: 11,
    message: "some transaction message",
  },
  { id: 22, message: "Lannister" },
  { id: 33, message: "Lannister" },
  { id: 44, message: "Stark" },
  { id: 55, message: "Targaryen" },
  { id: 66, message: "Melisandre" },
];

export default function DataGridDemo() {
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
