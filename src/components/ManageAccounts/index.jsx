import { Button } from "@mui/material";
import React from "react";
import { useState } from "react";
import Select from "react-dropdown-select";
import { toast } from "react-toastify";
import { toastSettings } from "../../constants";
import "./index.scss";

const typeOptions = [
  { label: "Fixed Asset", id: "Fixed Asset" },
  { label: "Current Asset", id: "Current Asset" },
  { label: "Fixed Liability", id: "Fixed Liability" },
  { label: "Current Liability", id: "Current Liability" },
  { label: "Direct Income", id: "Direct Income" },
  { label: "Indirect Income", id: "Indirect Income" },
  { label: "Direct Expense", id: "Direct Expense" },
  { label: "Indirect Expense", id: "Indirect Expense" },
  { label: "Capital", id: "Capital" },
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
      const res = await fetch("https://mlsubba.herokuapp.com/api/account/add", {
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
      const data = await res.json();
      if (data?.status === 500)
        toast.error("Failed to add New Account. Try again");
      else toast.success("Successfully Added New Account", toastSettings);
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
          Choose Account Group
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
