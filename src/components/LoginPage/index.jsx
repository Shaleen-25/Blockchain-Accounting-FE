import LaptopIcon from "@mui/icons-material/Laptop";
import React, { useRef } from "react";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    color: "black",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),

    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "300px",
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
}));

const LoginPage = () => {
  const box1Ref = useRef(null);
  const classes = useStyles();
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [signUpPage, setSignUpPage] = useState(false);

  const [searchParams] = useSearchParams();

  const toastSettings = {
    position: toast.POSITION.TOP_RIGHT || 0,
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
  };

  return (
    <>
      <div className="box" ref={box1Ref} id="box">
        <LaptopIcon sx={{ fontSize: 100 }} />
        <p id="node">Node {searchParams.get("node")}</p>
      </div>
      <div className="formContainer">
        <form className={classes.root} onSubmit={"handleSubmit"}>
          <TextField
            label="User Name"
            required
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          {signUpPage && (
            <TextField
              label="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <TextField
            label="Password"
            required
            value={pwd}
            o
            onChange={(e) => setPwd(e.target.value)}
          />
          <Button
            fullWidth
            //type="submit"
            variant="outlined"
            className="submit"
            onClick={() => toast.error(" Wow so easy!", toastSettings)}
          >
            {signUpPage ? "Sign Up" : "Login"}
          </Button>
          {!signUpPage && (
            <p>
              Don't have an Account?{" "}
              <span
                style={{ textDecoration: "underline", color: "#005CC5" }}
                onClick={() => setSignUpPage((prev) => !prev)}
              >
                Sign Up
              </span>
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default LoginPage;
