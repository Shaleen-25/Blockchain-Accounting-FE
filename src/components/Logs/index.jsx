import { Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useEffect } from "react";
import useStore from "../../global-state";

const Logs = ({ users }) => {
  const [logData, setLogData] = useState([]);
  const loggedInUser = useStore((state) => state.loggedInUser);
  const userID = users.find(({ firstName }) => firstName === loggedInUser)?.id;
  const columns = [
    { field: "dateTime", headerName: "Date Time", flex: 1, sortable: false },
    { field: "category", headerName: "Category", flex: 1, sortable: false },
    {
      field: "message",
      headerName: "Message",
      flex: 3,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <>
          <Tooltip title={params.row.msg}>
            <p>{params.row.msg}</p>
          </Tooltip>
        </>
      ),
    },
    { field: "user", headerName: "User", flex: 1, sortable: false },
  ];

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `https://bbanode2.ap-northeast-1.elasticbeanstalk.com/api/logs/findUser?user=${userID}`
      );
      const data = await res.json();

      const finalData = data.map(({ id, date, category, message, user }) => ({
        id,
        dateTime: date.replace("T", " ").replace(/\..*/, ""),
        category,
        msg: message,
        user: !user ? "System" : loggedInUser,
      }));

      setLogData(finalData);
    })();
  }, []);

  return (
    <>
      <div style={{ margin: 30, height: "84%" }}>
        <DataGrid
          rows={logData}
          columns={columns}
          pageSize={8}
          disableColumnMenu={true}
          disableColumnFilter={true}
          rowsPerPageOptions={[8]}
          checkboxSelection={false}
          disableSelectionOnClick
        />
      </div>
    </>
  );
};

export default Logs;
