import { Icon } from "@mui/material";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./css/styles.css";
import Home from "./Home.png";
import logo from "./icon.png";
import { auth } from "../firebase";
//import {signOut } from "firebase/auth";

export default function Navigation() {
  return (
    <React.Fragment>
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav class="sb-sidenav accordion bg" id="sidenavAccordion">
            <div
              //   style={{
              //     height: "calc(100vh - 56px)",
              //     overflow: "auto",
              //   }}
              class="sb-sidenav-menu"
              style={{
                backgroundImage: `url(${Home})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div
                class="nav"
                style={{
                  backgroundColor: "#000",
                  height: "100vh",
                  opacity: "0.65",
                }}
              >
                <div
                  class="sb-sidenav-menu-heading"
                  style={{
                    color: "#fff",
                    fontSize: 28,
                    paddingLeft: 30,
                    marginBottom: 25,
                  }}
                >
                  Admin
                </div>

                <Link
                  class="nav-link sidenavtext "
                  to="/Dashboard/StagesOfLife"
                >
                  <div class="sb-nav-link-icon"></div>
                  <img
                    src={logo}
                    style={{ width: 25, height: 25, marginRight: 15 }}
                  ></img>
                  Categories
                </Link>

                <Link class="nav-link sidenavtext " to="/Dashboard/AddQuotes">
                  <div class="sb-nav-link-icon"></div>
                  <img
                    src={logo}
                    style={{ width: 25, height: 25, marginRight: 15 }}
                  ></img>
                  Quotes Managment
                </Link>

                <Link class="nav-link sidenavtext " to="/Dashboard/AllUsers">
                  <div class="sb-nav-link-icon"></div>
                  <img
                    src={logo}
                    style={{ width: 25, height: 25, marginRight: 15 }}
                  ></img>
                  All Users
                </Link>

                {/* <Link class="nav-link sidenavtext " to="/Dashboard/Favourite">
                  <div class="sb-nav-link-icon"></div>
                  <img
                    src={logo}
                    style={{ width: 25, height: 25, marginRight: 15 }}
                  ></img>
                  Favourties
                </Link> */}
                <Link class="nav-link sidenavtext " to="/Dashboard/Donations">
                  <div class="sb-nav-link-icon"></div>
                  <img
                    src={logo}
                    style={{ width: 25, height: 25, marginRight: 15 }}
                  ></img>
                  Donations
                </Link>

                <Link class="nav-link sidenavtext " to="/Dashboard/Forums">
                  <div class="sb-nav-link-icon"></div>
                  <img
                    src={logo}
                    style={{ width: 25, height: 25, marginRight: 15 }}
                  ></img>
                  Forums
                </Link>

                <Link class="nav-link sidenavtext " to="/">
                  <div class="sb-nav-link-icon"></div>
                  <img
                    src={logo}
                    style={{ width: 25, height: 25, marginRight: 15 }}
                  ></img>{" "}
                  Logout
                </Link>
              </div>
            </div>
          </nav>
        </div>
        <div
          style={{
            width: "100%",
          }}
        >
          <Outlet />
        </div>
      </div>
    </React.Fragment>
  );
}
