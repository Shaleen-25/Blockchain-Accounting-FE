import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { useState } from "react";

import "./index.scss";

const columns = [
  { field: "id", headerName: "Transaction ID", flex: 1, sortable: false },
  { field: "date", headerName: "Transaction Date", flex: 1, sortable: false },
  { field: "accountFrom", headerName: "From", flex: 1, sortable: false },
  { field: "accountTo", headerName: "To", flex: 1, sortable: false },
  { field: "amount", headerName: "Amount", flex: 1, sortable: false },
  {
    field: "approved",
    headerName: "Approval Status",
    flex: 1,
    sortable: false,
  },
];

const ViewTransactions = ({ userID, transactionNum, showAll = true }) => {
  const [allTrans, setAllTrans] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        showAll
          ? `https://mlsubba.herokuapp.com/api/transaction/all`
          : `https://mlsubba.herokuapp.com/api/transaction/find?transactionNum=${transactionNum}`
      );

      let data = await res.json();
      if (showAll) {
        data = data.filter(({ user }) => user === userID);
      }
      const trans = data.map(
        ({ id, date, accountFrom, accountTo, amount, approved }) => {
          return {
            id,
            date: date.replace(/T.*/, ""),
            accountFrom: accountFrom,
            accountTo: accountTo,
            amount,
            approved,
          };
        }
      );
      setAllTrans(trans);
    })();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={allTrans}
        columns={columns}
        pageSize={7}
        disableColumnMenu={true}
        disableColumnFilter={true}
        rowsPerPageOptions={[7]}
        checkboxSelection={false}
        disableSelectionOnClick
      />
    </div>
  );
};

export default ViewTransactions;
