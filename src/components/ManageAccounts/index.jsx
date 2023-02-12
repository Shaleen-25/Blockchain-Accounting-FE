import { Button } from "@mui/material";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { toastSettings } from "../../constants";
import styles from "./index.module.scss";
import Select from "react-select";

const typeOptions = [
  { label: "Fixed Asset", id: "Fixed Asset", value: "Fixed Asset" },
  {
    label: "Current Asset-Sundry Debtors",
    id: "Current Asset-Sundry Debtors",
    value: "Current Asset-Sundry Debtors",
  },
  {
    label: "Current Asset-Bills Receivable",
    id: "Current Asset-Bills Receivable",
    value: "Current Asset-Bills Receivable",
  },
  {
    label: "Current Asset-Stock in Hand",
    id: "Current Asset-Stock in Hand",
    value: "Current Asset-Stock in Hand",
  },
  {
    label: "Current Asset-Cash in Hand",
    id: "Current Asset-Cash in Hand",
    value: "Current Asset-Cash in Hand",
  },
  {
    label: "Current Asset-Cash at Bank",
    id: "Current Asset-Cash at Bank",
    value: "Current Asset-Cash at Bank",
  },
  {
    label: "Current Asset-Other Current Asset",
    id: "Current Asset-Other Current Asset",
    value: "Current Asset-Other Current Asset",
  },
  { label: "Fixed Liability", id: "Fixed Liability", value: "Fixed Liability" },
  {
    label: "Current Liability-Sundry Creditors",
    id: "Current Liability-Sundry Creditors",
    value: "Current Liability-Sundry Creditors",
  },
  {
    label: "Current Liability-Bills Payable",
    id: "Current Liability-Bills Payable",
    value: "Current Liability-Bills Payable",
  },
  {
    label: "Current Liability-Provisions",
    id: "Current Liability-Provisions",
    value: "Current Liability-Provisions",
  },
  {
    label: "Current Liability-Other Current Liability",
    id: "Current Liability-Other Current Liability",
    value: "Current Liability-Other Current Liability",
  },
  { label: "Direct Income", id: "Direct Income", value: "Direct Income" },
  { label: "Indirect Income", id: "Indirect Income", value: "Indirect Income" },
  { label: "Direct Expense", id: "Direct Expense", value: "Direct Expense" },
  {
    label: "Indirect Expense",
    id: "Indirect Expense",
    value: "Indirect Expense",
  },
  { label: "Purchase", id: "Purchase", value: "Purchase" },
  { label: "Sales", id: "Sales", value: "Sales" },
  { label: "Loan", id: "Loan", value: "Loan" },
  { label: "Investment", id: "Investment", value: "Investment" },
  { label: "Capital", id: "Capital", value: "Capital" },
];

const ManageAccounts = ({ users, allAccountsDB }) => {
  let allAccs = allAccountsDB;
  const [accName, setAccName] = useState("");
  const [type, setType] = useState("");
  const [appr1, setAppr1] = useState("");
  const [appr2, setAppr2] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  const userOptions = users.map((user) => ({
    label: user.firstName,
    id: user.id,
  }));

  const handleDelete = async () => {
    if (isUpdate) {
      setAccName("");
      setIsUpdate(false);
      try {
        // const res =
        await fetch("https://bbanode2.ap-northeast-1.elasticbeanstalk.com/api/account/delete", {
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
        // const data = await res.json();
        // if (data?.status === 500)
        //   toast.error("Failed to delete Account. Try again");
        // else
        toast.success("Successfully Deleted Account", toastSettings);
      } catch (err) {
        console.log("error", err);
        toast.error(err.message, toastSettings);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // const res =
      await fetch(
        `https://bbanode2.ap-northeast-1.elasticbeanstalk.com/api/account/${
          isUpdate ? "modify" : "add"
        }`,
        {
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
        }
      );
      // const data = await res.json();
      // if (data?.status === 500)
      //   toast.error("Failed to add/update Account. Try again");
      // else
      toast.success("Successfully Added/Updated Account", toastSettings);
    } catch (err) {
      console.log("error", err);
      toast.error(err.message, toastSettings);
    }
  };

  return (
    <div className={styles.addAccount}>
      <h3>Manage Accounts</h3>
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>
          Update Existing Account
        </h4>
        <Select
          options={[{ id: "Create New", label: "Create New" }, ...allAccs]}
          onChange={(value) => {
            if (value.id == "Create New") {
              setIsUpdate(false);
            } else {
              setIsUpdate(true);
              setAccName(value.name);
              setType(value.type);
              setAppr1(value.approver1);
              setAppr2(value.approver2);
            }
          }}
        />
      </div>
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>Account Name</h4>
        <input
          type="text"
          className="defaultInput"
          palceholder={"Enter account name"}
          value={accName}
          onChange={(e) => setAccName(e.target.value)}
        />
      </div>
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>
          Choose Account Group
        </h4>
        <Select
          value={typeOptions.find(({ id }) => id === type)}
          options={typeOptions}
          onChange={(value) => {
            console.log(
              "🚀 ~ file: index.jsx ~ line 136 ~ ManageAccounts ~ values",
              value
            );
            setType(value.id || "");
          }}
        />
      </div>
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>
          Choose Approver One
        </h4>
        <Select
          value={userOptions.find(({ id }) => id === appr1)}
          options={userOptions}
          onChange={(value) => {
            setAppr1(value.id || "");
          }}
        />
      </div>
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>
          Choose Approver Two
        </h4>
        <Select
          value={userOptions.find(({ id }) => id === appr2)}
          options={userOptions}
          onChange={(value) => {
            setAppr2(value.id || "");
          }}
        />
      </div>
      <br />
      <Button
        style={{ width: "350px", marginBottom: "10px" }}
        variant="outlined"
        className="submit"
        onClick={handleSubmit}
      >
        Create/Update Account
      </Button>
      {isUpdate ? (
        <Button
          style={{ width: "350px" }}
          variant="outlined"
          color="error"
          onClick={handleDelete}
        >
          Delete Account
        </Button>
      ) : null}
    </div>
  );
};

export default ManageAccounts;
