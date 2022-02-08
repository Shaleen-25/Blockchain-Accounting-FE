import React from "react";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dasboard from "./components/Dasboard";
import "./App.css";
import PageContainer from "./components/PageContainer";

function App() {
  return (
    <div className="App">
      <Router>
        <PageContainer>
          <Routes>
            <Route exact path="/" element={<LandingPage />}></Route>
            <Route exact path="/dashboard" element={<Dasboard />}></Route>
            <Route exact path="/login" element={<LoginPage />}></Route>
          </Routes>
        </PageContainer>
      </Router>
    </div>
  );
}

export default App;
