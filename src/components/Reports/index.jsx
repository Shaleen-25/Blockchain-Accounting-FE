import { useState } from "react";
import { useJsonToCsv } from "react-json-csv";
import Select from "react-dropdown-select";
import Button from "@material-ui/core/Button";

const fields = {
    accountName: "Particulars",
    amountdr: "Debit",
    amountcr: "Credit",
  },
  style = {
    padding: "25px",
  };

const Reports = () => {
  const { saveAsCsv } = useJsonToCsv();
  const [reportData, setReportData] = useState([]);
  const date = new Date();
  const filename = `Trial Balance ${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;

  const reportTypes = [
    { label: "Trial Balance", value: "Trial Balance", id: "tb" },
  ];

  const getReportData = async (id) => {
    let totalCr = 0,
      totalDr = 0;
    const res = await fetch(`https://mlsubba.herokuapp.com/api/report/${id}`);
    const data = await res.json();
    const reportData = data.map(({ particulars, amountDR, amountCR }) => {
      let amountcr = 0,
        amountdr = 0;
      if (amountCR > amountDR) {
        amountcr = Math.abs(amountCR - amountDR);
      } else {
        amountdr = Math.abs(amountDR - amountCR);
      }
      totalCr += amountcr;
      totalDr += amountdr;
      return {
        accountName: particulars,
        amountdr,
        amountcr,
      };
    });

    reportData.push({
      accountName: "Total",
      amountdr: totalDr,
      amountcr: totalCr,
    });

    setReportData(reportData);
  };

  return (
    <>
      <div
        style={{
          margin: 30,
          display: "flex",
          height: "60%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="dropdown">
          <h4 style={{ textAlign: "left", lineHeight: 0 }}>
            Choose Report Format
          </h4>
          <Select
            options={reportTypes}
            onChange={(values) => {
              getReportData(values[0].id);
            }}
          />
          <br />
          <br />
          <Button
            fullWidth
            variant="outlined"
            className="submit"
            onClick={() =>
              saveAsCsv({ data: reportData || [], style, fields, filename })
            }
          >
            Download Report
          </Button>
        </div>
      </div>
    </>
  );
};

export default Reports;
