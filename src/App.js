import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import StagesOfLife from "./components/StagesOfLife";
import AllUsers from "./components/AllUsers";
import AddQuotes from "./components/AddQuotes";
import Forums from "./components/Forums";
import FourmsID from "./components/ForumsID";
import Login from "./components/LogIn";
import Favourite from "./components/Favourite";
import Donations from "./components/Donations";
import ApproveQoutes from "./components/ApproveQoutes"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Navigation />}>
          <Route path="/Dashboard/StagesOfLife" element={<StagesOfLife />} />
          <Route path="/Dashboard/AllUsers" element={<AllUsers />} />
          <Route path="/Dashboard/AddQuotes" element={<AddQuotes />} />
          <Route path="/Dashboard/AddQuotes/Approval" element={<ApproveQoutes />} />
          <Route path="/Dashboard/Forums" element={<Forums />} />
          <Route path="/Dashboard/Forums/:cname/:id" element={<FourmsID/>} />
          {/* <Route path="/Dashboard/Favourite" element={<Favourite />} /> */}
          <Route path="/Dashboard/Donations" element={<Donations />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
