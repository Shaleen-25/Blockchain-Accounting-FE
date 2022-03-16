import { Button } from "@mui/material";
import React from "react";
import { useState } from "react";
import Select from "react-dropdown-select";
import { toast } from "react-toastify";
import { toastSettings } from "../../constants";
import "./index.scss";

const typeOptions = [
  { label: "Asset", id: "Asset" },
  { label: "Liability", id: "Liability" },
  { label: "Income", id: "Income" },
  { label: "Expense", id: "Expense" },
];

const ManageAccounts = ({ users }) => {
  const [accName, setAccName] = useState("");
  const [type, setType] = useState("");
  const [appr1, setAppr1] = useState("");
  const [appr2, setAppr2] = useState("");

  const userOptions = users.map((user) => ({
    label: user.firstName,
    id: user.id,
  }));

  const handleSubmit = async () => {
    try {
      await fetch("https://mlsubba.herokuapp.com/api/account/add", {
        method: "POST",
        body: JSON.stringify({
          name: accName,
          type,
          approver1: appr1,
          approver2: appr2,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      toast.success("Successfully Added New Account");
    } catch (err) {
      console.log("error", err);
      toast.error(err.message, toastSettings);
    }
  };

  return (
    <div className="addAccount">
      <h3>Add new Account</h3>
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>Account Name</h4>
        <input
          type="text"
          className="defaultInput"
          palceholder={"Enter account name"}
          value={accName}
          onChange={(e) => setAccName(e.target.value)}
        />
        <br />
      </div>
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>
          Choose Account Type
        </h4>
        <Select
          values={[
            { label: "Select Account Type", value: "Select Account Type" },
          ]}
          options={typeOptions}
          onChange={(values) => {
            setType(values[0].id);
          }}
        />
        <br />
      </div>
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>
          Choose Approver One
        </h4>
        <Select
          values={[{ label: "Select Approver", value: "test" }]}
          options={userOptions}
          onChange={(values) => {
            setAppr1(values[0].id);
          }}
        />
        <br />
      </div>
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>
          Choose Approver Two
        </h4>
        <Select
          values={[{ label: "Select Approver", value: "test" }]}
          options={userOptions}
          onChange={(values) => {
            setAppr2(values[0].id);
          }}
        />
        <br />
        <br />
      </div>
      <Button variant="outlined" className="submit" onClick={handleSubmit}>
        Create New Account
      </Button>
    </div>
  );
};

export default ManageAccounts;
