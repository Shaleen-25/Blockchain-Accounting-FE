import AddCircle from "@mui/icons-material/AddCircle";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Button, Grid } from "@mui/material";
import cloneDeep from "lodash.clonedeep";
import React from "react";
import { useState } from "react";
import Select from "react-dropdown-select";
import { toast } from "react-toastify";
import { toastSettings } from "../../constants";
import "./index.scss";

const Info = ({
  index,
  addorDelete,
  accs,
  handleUpdate,
  side,
  allAccountsDB,
}) => {
  const last = index === accs.length - 1;
  const qtyDisplay = ["Purchase", "Purchase Return", "Sale", "Sale Return"];

  return (
    <div
      style={{
        display: "flex",
        marginTop: "-15px",
        marginBottom: "20px",
      }}
    >
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>Choose Account</h4>
        <Select
          key={index}
          values={[{ label: accs[index].id, value: accs[index].id }]}
          options={allAccountsDB}
          onChange={(values) => {
            handleUpdate("account", index, values[0]?.label, side);
          }}
        />
      </div>
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>Enter Amount</h4>
        <input
          type="number"
          className="defaultInput"
          value={accs[index].amt}
          onChange={(e) => handleUpdate("amount", index, e.target.value, side)}
        />
      </div>
      {qtyDisplay.includes(accs[index]?.id) ? (
        <div className="dropdown">
          <h4 style={{ textAlign: "left", lineHeight: 0 }}>Enter Quantity</h4>
          <input
            type="number"
            className="defaultInput"
            value={accs[index].qty}
            onChange={(e) =>
              handleUpdate("quantity", index, e.target.value, side)
            }
          />
        </div>
      ) : null}
      {last ? (
        <div className="add">
          <AddCircle
            onClick={() => addorDelete(index, true, side)}
            fontSize="medium"
          />
        </div>
      ) : (
        <div className="add">
          <CloseOutlinedIcon
            onClick={() => addorDelete(index, false, side)}
            fontSize="medium"
          />
        </div>
      )}
    </div>
  );
};

const NewTransaction = ({ userID, allAccountsDB }) => {
  const [accs, setAccs] = useState([{}]);
  const [accsr, setAccsr] = useState([{}]);
  const [msg, setMsg] = useState("");

  const leftAccountIDs = allAccountsDB
    .filter(({ label }) => accs.map(({ id }) => id).includes(label))
    .map(({ id }) => id);
  const rightAccountIDs = allAccountsDB
    .filter(({ label }) => accsr.map(({ id }) => id).includes(label))
    .map(({ id }) => id);

  const leftAccountAmts = accs.map(({ amt }) => amt);
  const rightAccountAmts = accsr.map(({ amt }) => amt);

  const leftAccountQtys = accs.map(({ qty }) => qty || 0);
  const rightAccountQtys = accsr.map(({ qty }) => qty || 0);

  const handleAddorDelete = (i, add, side) => {
    const setter = side === "left" ? setAccs : setAccsr;
    if (add) {
      setter((prev) => {
        const tempArr = cloneDeep(prev);
        tempArr.push({});
        return tempArr;
      });
    } else {
      setter((prev) => {
        const tempArr = cloneDeep(prev);
        tempArr.splice(i, 1);
        return tempArr;
      });
    }
  };

  const handleUpdate = (type, i, val, side) => {
    const setter = side === "left" ? setAccs : setAccsr;
    if (type === "account") {
      setter((prev) => {
        const tempArr = cloneDeep(prev);
        tempArr[i].id = val;

        return tempArr;
      });
    } else if (type === "amount") {
      setter((prev) => {
        const tempArr = cloneDeep(prev);
        tempArr[i].amt = Number(val || 0);
        return tempArr;
      });
    } else {
      setter((prev) => {
        const tempArr = cloneDeep(prev);
        tempArr[i].qty = Number(val || 0);
        return tempArr;
      });
    }
  };

  const displayAccounts = (side) => {
    const accounts = side === "left" ? accs : accsr;
    return accounts.map((_, i) => {
      return (
        <Info
          allAccountsDB={allAccountsDB}
          last={i === accounts.length - 1}
          key={i}
          index={i}
          side={side}
          accs={accounts}
          addorDelete={handleAddorDelete}
          handleUpdate={handleUpdate}
        />
      );
    });
  };

  const handleSave = async () => {
    const leftAmt = accs.reduce((acc, curr) => {
      return acc + (curr.amt || 0);
    }, 0);
    const rightAmt = accsr.reduce((acc, curr) => {
      return acc + (curr.amt || 0);
    }, 0);
    if (!rightAmt || !leftAmt) {
      toast.error("From and To total amount should not be 0", toastSettings);
    } else if (rightAmt !== leftAmt) {
      toast.error("From and To total amount should be equal", toastSettings);
    } else if (!msg) {
      toast.error("Transaction message should not be empty", toastSettings);
    } else {
      try {
        await fetch("https://mlsubba.herokuapp.com/api/transaction/add", {
          method: "POST",
          body: JSON.stringify({
            quantityFrom: leftAccountQtys,
            quantityTo: rightAccountQtys,
            accountFrom: leftAccountIDs,
            amountFrom: leftAccountAmts,
            accountFromIsCredit: false,
            accountTo: rightAccountIDs,
            amountTo: rightAccountAmts,
            message: msg,
            user: userID,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        toast.success("Transaction successfully submitted", toastSettings);
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        console.log("error", err);
        toast.error(err.message, toastSettings);
      }
    }
  };

  return (
    <>
      <Grid className="transactions" container spacing={2}>
        <Grid className="left" item xs={6}>
          <h3>Dr.</h3>
          {displayAccounts("left")}
        </Grid>
        <Grid className="right" item xs={6}>
          <h3>Cr.</h3>
          {displayAccounts("right")}
        </Grid>
        {/* <Grid item xs={2} id="checkbox">
          <Checkbox onChange={() => setIsCredit((prev) => !prev)} />{" "}
          <span>Credit</span>
        </Grid> */}
        <Grid item xs={4}>
          <input
            className="defaultInput"
            value={msg}
            placeholder="Enter Transaction Narration"
            onChange={(e) => setMsg(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="outlined"
            className="submit"
            onClick={handleSave}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default NewTransaction;
