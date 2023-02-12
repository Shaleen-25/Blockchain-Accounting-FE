import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-dropdown-select";

import "./index.scss";

const columns = [
  { field: "id", headerName: "Serial No.", flex: 1, sortable: false },
  { field: "date", headerName: "Date", flex: 1, sortable: false },
  {
    field: "particulars",
    headerName: "Particulars",
    flex: 2,
    sortable: false,
  },
  {
    field: "amountDR",
    headerName: "Amount DR",
    flex: 1,
    sortable: false,
  },
  {
    field: "amountCR",
    headerName: "Amount CR",
    flex: 1,
    sortable: false,
  },
  {
    field: "balance",
    headerName: "Balance",
    flex: 1,
    sortable: false,
  },
];

export default function Ledger() {
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [ledgerData, setLedgerData] = useState(null);
  const [allAccountsDB, setAllAccountsDB] = useState([]);
  let total = 0;

  useEffect(() => {
    const getAccountsData = async () => {
      const data = await fetch(
        "https://bbanode2.ap-northeast-1.elasticbeanstalk.com/api/account/all"
      ).catch((err) => {
        console.log("err", err);
      });
      const res = await data.json();
      const accOptions = res.map((acc) => ({
        label: acc.name,
        value: acc.id,
      }));
      setAllAccountsDB(accOptions);
    };
    getAccountsData();
  }, []);

  const getLedgerData = async (id) => {
    if (id) {
      const data = await fetch(
        `https://bbanode2.ap-northeast-1.elasticbeanstalk.com/api/ledger/find?accountName=${id}`
      ).catch((err) => {
        console.log("err", err);
      });
      const res = await data.json();
      const ledgerRows = res.map(
        ({ date, particulars, amountCR, amountDR }, index) => {
          total = total + amountDR - amountCR;
          let suffix = "Dr";
          if (total < 0) {
            suffix = "Cr";
          }
          return {
            id: index + 1,
            date: date.replace(/T.*/, ""),
            particulars,
            amountCR,
            amountDR,
            balance: `${Math.abs(total)} ${suffix}`,
          };
        }
      );
      setLedgerData(ledgerRows);
    }
  };

  return (
    <div style={{ height: "90%" }}>
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>Choose Account</h4>
        <Select
          options={allAccountsDB}
          onChange={(values) => {
            setSelectedAcc(values[0]);
            getLedgerData(values[0]?.value);
          }}
        />
      </div>
      {selectedAcc ? (
        <div style={{ height: "100%" }}>
          <DataGrid
            rows={ledgerData}
            columns={columns}
            pageSize={7}
            disableColumnMenu={true}
            disableColumnFilter={true}
            rowsPerPageOptions={[7]}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </div>
      ) : null}
    </div>
  );
}
