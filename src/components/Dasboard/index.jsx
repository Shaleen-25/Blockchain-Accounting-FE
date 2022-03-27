import React, { useEffect, useState } from "react";
import "./index.scss";
import { styled } from "@mui/system";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import { buttonUnstyledClasses } from "@mui/base/ButtonUnstyled";
import TabUnstyled, { tabUnstyledClasses } from "@mui/base/TabUnstyled";
import Transactions from "../Transactions";
import Approvals from "../Approvals";
import useStore from "../../global-state";
import { Button } from "@material-ui/core";
import ManageAccounts from "../ManageAccounts";
import Ledger from "../Ledger";
import Reports from "../Reports";
import Blockchain from "../Blockchain";

const blue = {
  50: "#F0F7FF",
  200: "#80BFFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
};

const Tab = styled(TabUnstyled)`
  font-family: IBM Plex Sans, sans-serif;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  padding: 12px 16px;
  margin: 6px 6px;
  border: none;
  border-radius: 5px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${blue[400]};
  }

  &:focus {
    color: #fff;
    border-radius: 3px;
    outline: 2px solid ${blue[200]};
    outline-offset: 2px;
  }

  &.${tabUnstyledClasses.selected} {
    background-color: ${blue[50]};
    color: ${blue[600]};
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(TabPanelUnstyled)`
  width: 100%;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
`;

const TabsList = styled(TabsListUnstyled)`
  min-width: 320px;
  background-color: ${blue[500]};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`;

const Logut = () => {
  const setUser = useStore((state) => state.setLoggedInUser);
  return (
    <Button
      variant="contained"
      id="logout"
      onClick={() => {
        setUser("");
        localStorage.removeItem("loggedInUser");
        window.location.pathname = "/";
      }}
    >
      LOG OUT
    </Button>
  );
};

const Dasboard = () => {
  const user = useStore((state) => state.loggedInUser);
  if (!user) window.location.pathname = "/login";
  const [users, setUsers] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetch("https://mlsubba.herokuapp.com/api/user/all");
      const users = await res.json();
      setUsers(users);
    })();
  }, []);

  return (
    <>
      <Logut />
      <div className="dashboard">
        <TabsUnstyled defaultValue={0}>
          <TabsList>
            <Tab>Transactions</Tab>
            <Tab>Manage Accounts</Tab>
            <Tab>Approvals</Tab>
            <Tab>Reports</Tab>
            <Tab>Ledgers</Tab>
            <Tab>Blockchain</Tab>
          </TabsList>
          <TabPanel value={0}>
            <div className="sectionBody">
              <Transactions users={users} />
            </div>
          </TabPanel>
          <TabPanel value={1}>
            <div className="sectionBody">
              <ManageAccounts users={users} />
            </div>
          </TabPanel>
          <TabPanel value={2}>
            <div className="sectionBody">
              <Approvals />
            </div>
          </TabPanel>
          <TabPanel value={3}>
            <div className="sectionBody">
              <Reports />
            </div>
          </TabPanel>
          <TabPanel value={4}>
            <div className="sectionBody">
              <Ledger />
            </div>
          </TabPanel>
          <TabPanel value={5}>
            <div className="sectionBody">
              <Blockchain />
            </div>
          </TabPanel>
        </TabsUnstyled>
      </div>
    </>
  );
};

export default Dasboard;
