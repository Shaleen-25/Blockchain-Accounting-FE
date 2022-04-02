import React from "react";
import { useState } from "react";
import Select from "react-dropdown-select";
import Transactions from "./NewTransaction";
import Ledger from "../Ledger";
import ManageAccounts from "../ManageAccounts";
import ViewTransactions from "./ViewTransactions";

import "./index.scss";

const Accounting = ({ users, userID }) => {
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
      label: "Create New Account",
      value: "Create New Account",
      component: ManageAccounts,
    },
    {
      label: "View Ledger ",
      value: "View Ledger",
      component: Ledger,
    },
  ];
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
      <ComponentToRender users={users} userID={userID} />
    </div>
  );
};

export default Accounting;
