import LaptopIcon from "@mui/icons-material/Laptop";
import React, { useRef } from "react";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { toastSettings } from "../../constants";
import "./index.scss";
import useStore from "../../global-state";

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
  const [lName, setLname] = useState("");
  const [pwd, setPwd] = useState("");
  const [signUpPage, setSignUpPage] = useState(false);
  const [searchParams] = useSearchParams();
  const setLoggedInUser = useStore((state) => state.setLoggedInUser);

  const handleLogin = async () => {
    if (signUpPage) {
      //post req to add user
      try {
        await fetch("https://mlsubba.herokuapp.com/api/user/add", {
          method: "POST",
          body: JSON.stringify({
            firstName: user,
            lastName: lName,
            password: pwd,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
      } catch (err) {
        console.log("error", err);
      }
      setSignUpPage(false);
      toast.success(`Successfully Registered ${user}`, toastSettings);
    } else {
      // post req to check user
      const data = await fetch(
        `https://mlsubba.herokuapp.com/api/user/login?name=${user}&password=${pwd}`
      );
      const res = await data.text();
      if (res === "success") {
        setLoggedInUser(user);
        localStorage.setItem("loggedInUser", user);
        toast.success(`Successfully Logged in as ${user}`, toastSettings);
        setTimeout(() => {
          window.location.pathname = "/dashboard";
        }, 1000);
      } else if (res === "wrong password") {
        toast.error(`Incorrect credentials`, toastSettings);
      } else if (res === "register") {
        toast.error(`User does not exist`, toastSettings);
        setSignUpPage(true);
      }
    }
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
              label="Last Name"
              required
              value={lName}
              onChange={(e) => setLname(e.target.value)}
            />
          )}
          <TextField
            label="Password"
            type="password"
            required
            value={pwd}
            o
            onChange={(e) => setPwd(e.target.value)}
          />
          <Button
            fullWidth
            variant="outlined"
            className="submit"
            onClick={handleLogin}
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
