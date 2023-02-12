import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-dropdown-select";
import Transactions from "./NewTransaction";
import Ledger from "../Ledger";
import ManageAccounts from "../ManageAccounts";
import ViewTransactions from "./ViewTransactions";

import "./index.scss";

const Accounting = ({ users, userID }) => {
  const [allAccountsDB, setAllAccountsDB] = useState([]);
  const viewOptions = [
    {
      label: "Enter New Transaction",
      value: "Enter New Transaction",
      component: Transactions,
    },
    {
      label: "View All Transactions",
      value: "View All Transactions",
      component: ViewTransactions,
    },
    {
      label: "Manage Accounts",
      value: "Manage Accounts",
      component: ManageAccounts,
    },
    {
      label: "View Ledger ",
      value: "View Ledger",
      component: Ledger,
    },
  ];

  useEffect(() => {
    const getAccountsData = async () => {
      const data = await fetch(
        "https://bbanode2.ap-northeast-1.elasticbeanstalk.com/api/account/all"
      ).catch((err) => {
        console.log("err", err);
      });
      const res = await data.json();
      const accOptions = res.map((acc) => ({
        ...acc,
        label: acc.name,
        value: acc.name,
        id: acc.id,
      }));
      setAllAccountsDB(accOptions);
    };
    getAccountsData();
  }, []);

  const [selectedView, setSelectedView] = useState(viewOptions[0]);
  const ComponentToRender = selectedView.component;

  return (
    <div className="accounting">
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>Select View</h4>
        <Select
          values={[selectedView]}
          options={viewOptions}
          onChange={(values) => {
            setSelectedView(values[0]);
          }}
        />
      </div>
      <ComponentToRender
        users={users}
        userID={userID}
        allAccountsDB={allAccountsDB}
      />
    </div>
  );
};

export default Accounting;
