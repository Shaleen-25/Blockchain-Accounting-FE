import Button from "@material-ui/core/Button";

const Reports = () => {
  return (
    <>
      <div
        style={{
          margin: 30,
          display: "flex",
          flexDirection: "column",
          height: "60%",
          width: "30%",
          margin: "auto",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h4 style={{ textAlign: "left", lineHeight: 0 }}>
          Download Report in xlsx format
        </h4>
        <Button fullWidth variant="outlined" className="submit">
          <a
            href="https://mlsubba.herokuapp.com/api/report/download/tb.xlsx"
            style={{
              width: "100%",
              color: "white",
              textDecoration: "none",
            }}
          >
            Trial Balance
          </a>
        </Button>
        <br />
        <Button fullWidth variant="outlined" className="submit">
          <a
            href="https://mlsubba.herokuapp.com/api/report/download/income.xlsx"
            style={{
              width: "100%",
              color: "white",
              textDecoration: "none",
            }}
          >
            Income Statement
          </a>
        </Button>
        <br />
        <Button fullWidth variant="outlined" className="submit">
          <a
            href="https://mlsubba.herokuapp.com/api/report/download/bs.xlsx"
            style={{
              width: "100%",
              color: "white",
              textDecoration: "none",
            }}
          >
            Balance Sheet
          </a>
        </Button>
        <br />
        <Button fullWidth variant="outlined" className="submit">
          <a
            href="https://mlsubba.herokuapp.com/api/report/download/inventory.xlsx"
            style={{
              width: "100%",
              color: "white",
              textDecoration: "none",
            }}
          >
            Inventory Report
          </a>
        </Button>
        <br />
      </div>
    </>
  );
};

export default Reports;
