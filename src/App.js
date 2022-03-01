import React from "react";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dasboard from "./components/Dasboard";
import PageContainer from "./components/PageContainer";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

const Redirect = () => {
  window.location.pathname = "/";
  return;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <PageContainer>
          <Routes>
            <Route exact path="/dashboard" element={<Dasboard />}></Route>
            <Route exact path="/login" element={<LoginPage />}></Route>
            <Route exact path="/" element={<LandingPage />}></Route>
            <Route exact path="/*" element={<Redirect />}></Route>
          </Routes>
        </PageContainer>
      </BrowserRouter>
    </div>
  );
}

export default App;
