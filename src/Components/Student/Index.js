import React, { useEffect } from "react";
import Navbar from "./../../Common/Navbar_Student";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Footer from "../../Common/Footer";
import { useState } from "react";
import axiosInstance from "../../axiosInstance";
import getCookie from "../../getCookie";
import moment from "moment";
import Modal from "@mui/material/Modal";
import { Sidebar, SidebarItem } from "react-responsive-sidebar";
import {
  AccessTimeOutlined,
  CampaignOutlined,
  HelpOutlineOutlined,
  HomeOutlined,
  InsertChartOutlined,
  PersonOutlineOutlined,
  SummarizeRounded,
  TuneOutlined,
} from "@mui/icons-material";
import Clock from "react-live-clock";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Index({ error, setError }) {
  const [open, setOpen] = useState(false);
  let token = getCookie("access_token");
  let user = JSON.parse(localStorage.getItem("user"));
  let user_id = JSON.parse(localStorage.getItem("user"))._id;

  const config = {
    headers: { Authorization: `Bearer ${token} ${user_id}` },
  };
  const [alloted_tests, setAllotedTest] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/candidate/alloted_test/", config)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          localStorage.setItem("user_id", JSON.stringify(res.data._id));
          setAllotedTest(res.data.alloted_test);
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Error occurred. Please try again!");
        setTimeout(() => {
          setError(null);
        }, 1000);
      });
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const items1 = [
    <SidebarItem></SidebarItem>,
    <SidebarItem></SidebarItem>,
    <SidebarItem></SidebarItem>,
    <SidebarItem>
      <div
        style={{
          alignItems: "center",
          fontWeight: "normal",
        }}
      >
        <b style={{ fontSize: "12px", fontWeight: "normal" }}>March, 2024</b>
        <br />
        <Clock
          format={"h:mm:ss A"}
          ticking={true}
          timezone={"ASIA"}
          style={{ fontSize: "semibold" }}
        />
      </div>
    </SidebarItem>,
    <SidebarItem href="/dashboardStudent">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "15px",
          fontWeight: "normal",
        }}
      >
        <HomeOutlined />
        &nbsp; Dashboard
      </div>
    </SidebarItem>,
    <SidebarItem href="#">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "15px",
          fontWeight: "normal",
        }}
      >
        <CampaignOutlined />
        &nbsp; Notifications
      </div>
    </SidebarItem>,
    <SidebarItem href="#">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "15px",
          fontWeight: "normal",
        }}
      >
        <TuneOutlined />
        &nbsp; Settings
      </div>
    </SidebarItem>,
    <SidebarItem href="#">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "15px",
          fontWeight: "normal",
        }}
      >
        <HelpOutlineOutlined />
        &nbsp; Help & Support
      </div>
    </SidebarItem>,
  ];

  return (
    <div>
      <Sidebar content={items1} background="#193441">
        <Navbar />
        <div style={{ padding: "5%" }}>
          <br />
          <br />
          <br />
          <h4
            style={{ textAlign: "left", fontSize: "22px", lineHeight: "1px" }}
          >
            Dashboard
          </h4>
          <p style={{ lineHeight: "1px" }}>Welcome to Udichi </p>
          <br />
          <br />
          <br />
          {alloted_tests.map((altst) => {
            let momentDate = moment
              .utc(altst.starting_date)
              .format("MM/DD/YY, h:mm:ss a");
            return (
              <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gap={2}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "10px 0",
                }}
              >
                <Box gridColumn="span 12">
                  <Item
                    style={{
                      padding: "1.5%",
                      borderLeft: "2rem solid #193441",
                    }}
                  >
                    <h3 style={{ textAlign: "left" }}>{altst.title}</h3>
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(12, 1fr)"
                      gap={1}
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Box gridColumn="span 3" style={{ textAlign: "left" }}>
                        Duration: {altst.available_window} mins.
                      </Box>
                      <Box gridColumn="span 3">{momentDate}</Box>
                      <Box
                        gridColumn="span 3"
                        style={{ color: "grey", cursor: "pointer" }}
                        onClick={() => {
                          alert("Please Contact Admin!");
                        }}
                      >
                        View Results
                      </Box>
                      <Box
                        gridColumn="span 3"
                        style={{
                          textAlign: "right",
                          color: "#193441",
                          cursor: "pointer",
                          display:
                            altst.type_of_test === "written" ? "" : "none",
                        }}
                      >
                        <a
                          href={`/starttestStudent/${altst._id}`}
                          style={{ textDecoration: "none" }}
                        >
                          Attempt Now
                        </a>
                      </Box>
                    </Box>
                  </Item>
                </Box>
              </Box>
            );
          })}
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <center>
              <img
                src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?b=1&s=170667a&w=0&k=20&c=Z5bM_O61NdvOVMAV91l_K_xVAsgPxayDrlVxvi19jqE="
                style={{ width: "60%" }}
              />
            </center>
            <p>
              <b>First Name:</b> {user.firstname}
            </p>
            <p>
              <b>Last Name:</b> {user.lastname}
            </p>
            <p>
              <b>Email ID:</b> {user.email}
            </p>
            <p>
              <b>Mobile No:</b> {user.mobile}
            </p>
            <p>
              <b>Username:</b> {user.username}
            </p>
          </Box>
        </Modal>
      </Sidebar>
    </div>
  );
}
