import AddCircle from "@mui/icons-material/AddCircle";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Button, Checkbox, Grid } from "@mui/material";
import cloneDeep from "lodash.clonedeep";
import React from "react";
import { useState } from "react";
import Select from "react-dropdown-select";
import { toast } from "react-toastify";
import { toastSettings } from "../../constants";
import "./index.scss";

const options = [
  { label: "Cash", value: "Cash" },
  { label: "CGST Source", value: "CGST Source" },
  { label: "ICICI Bank", value: "ICICI Bank" },
  { label: "Sales", value: "Sales" },
];

const Info = ({ index, addorDelete, accs, handleUpdate, side }) => {
  console.log("Accs[i]", accs, side);
  const last = index === accs.length - 1;
  return (
    <div
      style={{
        display: "flex",
        marginBottom: "20px",
      }}
    >
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>Choose Account</h4>
        <Select
          key={index}
          values={[{ label: accs[index].id, value: accs[index].id }]}
          options={options}
          onChange={(values) => {
            handleUpdate("account", index, values[0].label, side);
          }}
        />
      </div>
      <div className="dropdown">
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>Enter Amount</h4>
        <input
          type="number"
          className="defaultInput"
          value={accs[index].amt || 0}
          //defaultValue={0}
          onChange={(e) => handleUpdate("amount", index, e.target.value, side)}
        />
      </div>
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

const Transactions = () => {
  const [accs, setAccs] = useState([{}]);
  const [accsr, setAccsr] = useState([{}]);
  const [msg, setMsg] = useState("");
  const [isCredit, setIsCredit] = useState(false);

  console.log("Latest Accs Left", accs);
  console.log("Latest Accs Right", accsr);
  // console.log("isCredit", isCredit);
  // console.log("msg", msg);

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
    } else {
      setter((prev) => {
        const tempArr = cloneDeep(prev);
        tempArr[i].amt = Number(val);
        return tempArr;
      });
    }
  };

  // const handleUpdater = (type, i, val) => {
  //   if (type == "account") {
  //     setAccsr((prev) => {
  //       const tempArr = cloneDeep(prev);
  //       tempArr[i].id = val;

  //       return tempArr;
  //     });
  //   } else {
  //     setAccsr((prev) => {
  //       const tempArr = cloneDeep(prev);
  //       tempArr[i].amt = val;
  //       return tempArr;
  //     });
  //   }
  // };

  // const handleAddorDeleter = (i, add) => {
  //   if (add) {
  //     setAccsr((prev) => {
  //       const tempArr = [...prev];
  //       tempArr.push({});
  //       return tempArr;
  //     });
  //   } else {
  //     setAccsr((prev) => {
  //       const tempArr = [...prev];
  //       tempArr.splice(i, 1);
  //       return tempArr;
  //     });
  //   }
  // };

  const displayAccounts = (side) => {
    const accounts = side === "left" ? accs : accsr;
    console.log(
      "🚀 ~ file: index.jsx ~ line 151 ~ displayAccounts ~ accounts",
      accounts
    );
    return accounts.map((_, i) => {
      return (
        <Info
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

  // const displayaccsr = accsr.map((_, i) => {
  //   return (
  //     <Info
  //       last={i === accsr.length - 1}
  //       key={i}
  //       index={i}
  //       accs={accsr}
  //       addorDelete={handleAddorDeleter}
  //       handleUpdate={handleUpdater}
  //     />
  //   );
  // });

  const handleSave = () => {
    const leftAmt = accs.reduce((acc, curr) => {
      return acc + curr.amt;
    }, 0);
    const rightAmt = accsr.reduce((acc, curr) => {
      return acc + curr.amt;
    }, 0);
    if (!rightAmt || !leftAmt) {
      toast.error("From and To total amount should not be 0", toastSettings);
    } else if (rightAmt !== leftAmt) {
      toast.error("From and To total amount should be equal", toastSettings);
    } else if (!msg) {
      toast.error("Transaction message should not be empty", toastSettings);
    } else {
      toast.success("Transaction successfully submitted", toastSettings);
      window.location.reload();
      // setAccs([{}]);
      // setAccsr([{}]);
      // setMsg("");
      // setIsCredit(false);
    }
  };

  return (
    <>
      <Grid className="transactions" container spacing={2}>
        <Grid className="left" item xs={6}>
          {displayAccounts("left")}
        </Grid>
        <Grid className="right" item xs={6}>
          {displayAccounts("right")}
        </Grid>
        <Grid item xs={4}>
          <input
            className="defaultInput"
            value={msg}
            placeholder="Enter Transaction Message"
            onChange={(e) => setMsg(e.target.value)}
          />
        </Grid>
        <Grid item xs={2} id="checkbox">
          <Checkbox onChange={() => setIsCredit((prev) => !prev)} />{" "}
          <span>Credit</span>
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
      {/* <div className="transactions row">
        <div className="left col">{displayaccs}</div>
        <div className="right col">{displayaccsr}</div>
        <div className="bottom row">
          <Checkbox>IsCreddit</Checkbox>
          <h4 style={{ textAlign: "left", lineHeight: 0 }}>Enter Amount</h4>
          <input className="defaultInput" />
        </div>
      </div> */}
    </>
  );
};

export default Transactions;
