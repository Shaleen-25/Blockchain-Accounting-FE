import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useEffect } from "react";
import ViewTransactions from "../Transactions/ViewTransactions";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@material-ui/core";

const Blockchain = () => {
  const [selectedTrancNum, setTrancNum] = useState(undefined);
  const [blockChainData, setBlockChainData] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1, sortable: false },
    { field: "date", headerName: "Date", flex: 1, sortable: false },
    {
      field: "transactionNum",
      headerName: "Transaction ID",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div
          style={{ width: "100%" }}
          onClick={() => {
            setTrancNum(params.row.transactionNum);
            handleClickOpen(true);
          }}
        >
          <p>{params.row.transactionNum}</p>
        </div>
      ),
    },
    { field: "block_hash", headerName: "Block Hash", flex: 1, sortable: false },
    { field: "blockchain", headerName: "Blockchain", flex: 1, sortable: false },
  ];

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `https://mlsubba.herokuapp.com/api/blockchain/all`
      );
      const data = await res.json();

      const finalData = data.map(
        ({ id, transactionNum, block_hash, date, blockchain }) => ({
          id,
          transactionNum,
          block_hash,
          date: date.replace(/T.*/, ""),
          blockchain,
        })
      );

      setBlockChainData(finalData);
    })();
  }, []);

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          <div style={{ height: "100%" }}>
            <ViewTransactions transactionNum={selectedTrancNum} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <div style={{ margin: 30, height: "84%" }}>
        <DataGrid
          rows={blockChainData}
          columns={columns}
          pageSize={8}
          disableColumnMenu={true}
          disableColumnFilter={true}
          rowsPerPageOptions={[8]}
          checkboxSelection={false}
          disableSelectionOnClick
        />
      </div>
    </>
  );
};

export default Blockchain;
