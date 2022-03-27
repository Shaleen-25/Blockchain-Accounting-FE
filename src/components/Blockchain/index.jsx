import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useEffect } from "react";

const Blockchain = () => {
  const [blockChainData, setBlockChainData] = useState([]);
  const columns = [
    { field: "id", headerName: "ID", flex: 1, sortable: false },
    { field: "date", headerName: "Date", flex: 1, sortable: false },
    {
      field: "transactionNum",
      headerName: "Transaction ID",
      flex: 1,
      sortable: false,
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
  });

  return (
    <>
      <div style={{ margin: 30, height: "420px" }}>
        <DataGrid
          rows={blockChainData}
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
};

export default Blockchain;
