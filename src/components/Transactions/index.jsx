import AddCircle from "@mui/icons-material/AddCircle";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Button, Checkbox, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import cloneDeep from "lodash.clonedeep";
import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-dropdown-select";
import { toast } from "react-toastify";
import { toastSettings } from "../../constants";
import useStore from "../../global-state";
import "./index.scss";

const columns = [
  { field: "id", headerName: "Transaction ID", flex: 1, sortable: false },
  { field: "date", headerName: "Transaction Date", flex: 1, sortable: false },
  { field: "accountFrom", headerName: "From", flex: 1, sortable: false },
  { field: "accountTo", headerName: "To", flex: 1, sortable: false },
  { field: "amount", headerName: "Amount", flex: 1, sortable: false },
  {
    field: "approved",
    headerName: "Approval Status",
    flex: 1,
    sortable: false,
  },
];

const AllTrans = ({ userID, setShowTrans }) => {
  const [allTrans, setAllTrans] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        "https://mlsubba.herokuapp.com/api/transaction/all"
      );
      let trans = await res.json();
      trans = trans.filter(({ user }) => user === userID);
      setAllTrans(trans);
    })();
  }, [userID]);

  const rows = allTrans.map(
    ({ id, date, accountFrom, accountTo, amount, approved }) => {
      return {
        id: id + 1,
        date,
        accountFrom,
        accountTo,
        amount,
        approved,
      };
    }
  );

  return (
    <>
      <h3>All Transactions</h3>
      <div
        style={{
          border: "1px solid black",
          margin: "auto",
          height: "80%",
          width: "95%",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={6}
          disableColumnMenu={true}
          disableColumnFilter={true}
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          disableSelectionOnClick
        />
      </div>
      <Button
        variant="outlined"
        className="submit"
        onClick={() => setShowTrans(false)}
      >
        Enter New Transaction
      </Button>
    </>
  );
};

const Info = ({
  index,
  addorDelete,
  accs,
  handleUpdate,
  side,
  allAccountsDB,
}) => {
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
          options={allAccountsDB}
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

const Transactions = ({ users }) => {
  const [allAccountsDB, setAllAccountsDB] = useState([]);
  const [accs, setAccs] = useState([{}]);
  const [accsr, setAccsr] = useState([{}]);
  const [msg, setMsg] = useState("");
  const [isCredit, setIsCredit] = useState(false);
  const [showTrans, setShowTrans] = useState(false);

  const user = useStore((state) => state.loggedInUser);
  const userID = users.find(({ firstName }) => firstName === user)?.id;

  const leftAccountIDs = allAccountsDB
    .filter(({ label }) => accs.map(({ id }) => id).includes(label))
    .map(({ id }) => id);
  const rightAccountIDs = allAccountsDB
    .filter(({ label }) => accsr.map(({ id }) => id).includes(label))
    .map(({ id }) => id);

  const leftAccountAmts = accs.map(({ amt }) => amt);
  const rightAccountAmts = accsr.map(({ amt }) => amt);

  useEffect(() => {
    const getAccountsData = async () => {
      const data = await fetch(
        "https://mlsubba.herokuapp.com/api/account/all"
      ).catch((err) => {
        console.log("err", err);
      });
      const res = await data.json();
      const accOptions = res.map((acc) => ({
        label: acc.name,
        value: acc.name,
        id: acc.id,
      }));
      setAllAccountsDB(accOptions);
    };
    getAccountsData();
  }, []);

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
      try {
        await fetch("https://mlsubba.herokuapp.com/api/transaction/add", {
          method: "POST",
          body: JSON.stringify({
            accountFrom: leftAccountIDs,
            amountFrom: leftAccountAmts,
            accountFromIsCredit: isCredit,
            accountTo: rightAccountIDs,
            amountTo: rightAccountAmts,
            message: "msg",
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
      {!showTrans ? (
        <Grid className="transactions" container spacing={2}>
          <Grid className="left" item xs={6}>
            FROM
            {displayAccounts("left")}
          </Grid>
          <Grid className="right" item xs={6}>
            TO
            {displayAccounts("right")}
          </Grid>
          <Grid item xs={2} id="checkbox">
            <Checkbox onChange={() => setIsCredit((prev) => !prev)} />{" "}
            <span>Credit</span>
          </Grid>
          <Grid item xs={4}>
            <input
              className="defaultInput"
              value={msg}
              placeholder="Enter Transaction Message"
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
          <Grid item xs={3}>
            <Button
              // fullWidth
              variant="outlined"
              className="submit"
              onClick={() => setShowTrans(true)}
            >
              View All Transactions
            </Button>
          </Grid>
        </Grid>
      ) : (
        <AllTrans userID={userID} setShowTrans={setShowTrans} />
      )}
    </>
  );
};

export default Transactions;
