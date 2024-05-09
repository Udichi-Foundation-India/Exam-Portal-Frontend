import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Navbar from "./../../Common/Navbar_Admin";
import Footer from "../../Common/Footer";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Collapsible from "react-collapsible";
import "./style.css";
import axiosInstance from "../../axiosInstance";
import getCookie from "../../getCookie";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import moment from "moment";
import { Modal as Modal1 } from "react-responsive-modal";
import { Sidebar, SidebarItem } from "react-responsive-sidebar";
import {
  AccessTimeOutlined,
  AddOutlined,
  CampaignOutlined,
  HdrPlusOutlined,
  HelpOutlineOutlined,
  HomeOutlined,
  InsertChartOutlined,
  ListAltOutlined,
  PersonOutlineOutlined,
  PlusOneOutlined,
  SummarizeRounded,
  TuneOutlined,
} from "@mui/icons-material";
import Clock from "react-live-clock";

function createData(name, candidates, duration, questions, action) {
  return { name, candidates, duration, questions, action };
}

let token = getCookie("access_token");

const config = {
  headers: { Authorization: `Bearer ${token}` },
};

export default function BasicTable({ error, setError }) {
  const [examgroup, setExamgroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [allexamcandidates, setAllexamcandidates] = useState([]);
  const [demodata, setDemodata] = useState([]);
  var questionnum = 0;

  useEffect(() => {
    getExams();
  }, []);

  const handleOpen1 = () => {
    setOpen1(true);
  };
  const handleClose1 = () => {
    setDemodata([]);
    setOpen1(false);
  };
  const handleOpen2 = () => {
    setOpen2(true);
  };
  const handleClose2 = () => {
    setAllexamcandidates([]);
    setOpen2(false);
  };

  function getExams() {
    setLoading(true);
    axiosInstance
      .get("/test/all", config)
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          console.log(res.data);
          setExamgroup(res.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setError("Error occurred. Please try again!");
        setTimeout(() => {
          setError(null);
        }, 1000);
      });
  }

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
    <SidebarItem href="/dashboardAdmin">
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
    <SidebarItem href="/examAdmin">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "15px",
          fontWeight: "normal",
        }}
      >
        <AccessTimeOutlined />
        &nbsp; Exams
      </div>
    </SidebarItem>,
    <SidebarItem href="/candidateAdmin">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "15px",
          fontWeight: "normal",
        }}
      >
        <PersonOutlineOutlined />
        &nbsp; Candidates
      </div>
    </SidebarItem>,
    <SidebarItem href="/questionAdmin">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "15px",
          fontWeight: "normal",
        }}
      >
        <SummarizeRounded />
        &nbsp; Questions
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
        <InsertChartOutlined />
        &nbsp; Statistics
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

  console.log(allexamcandidates);
  return (
    <div>
      <Sidebar content={items1} background="#193441">
        <Navbar />
        <div style={{ margin: "5%" }}>
          <br />
          <br />
          <br />
          <Grid container spacing={1} style={{ alignItems: "center" }}>
            <Grid item xs={6}>
              <h4
                style={{
                  textAlign: "left",
                  fontSize: "28px",
                }}
              >
                Exams
              </h4>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "right" }}>
              <Button variant="contained" color="success" href="/addexamAdmin">
                <AddOutlined />
                Create
              </Button>
            </Grid>
          </Grid>
          <br />
          <br />
          {!examgroup && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </div>
          )}
          {examgroup && (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Exam Name</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Start Date/Time</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Duration</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Questions</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Action</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {examgroup.map((key) => {
                    questionnum = 0;
                    let momentDate = moment
                      .utc(key.starting_date)
                      .format("MM/DD/YY, h:mm:ss a");
                    return (
                      <TableRow
                        key={key._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {key.title}
                        </TableCell>
                        <TableCell align="right">{momentDate}</TableCell>
                        <TableCell align="right">
                          {key.available_window} mins.
                        </TableCell>
                        <TableCell align="right">
                          {key.question_groups.map((x) => {
                            questionnum = questionnum + x.questions.length;
                            return questionnum;
                          })}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ cursor: "pointer", color: "grey" }}
                          // onClick={() => {
                          //   handleOpen1();
                          //   axiosInstance
                          //     .get(
                          //       `/attempts/attempts_group/${key._id}`,
                          //       config
                          //     )
                          //     .then((res) => {
                          //       if (res.status === 200) {
                          //         console.log(res);
                          //         setDemodata(res.data);
                          //       }
                          //     })
                          //     .catch((err) => {
                          //       console.log(err);
                          //     });
                          // }}
                        >
                          <ListAltOutlined />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
        <Modal1 open={open1} onClose={handleClose1} center>
          <Box style={{ padding: "3%" }}>
            <center>
              <h3>View Results</h3>
              <p style={{ padding: "0 5%" }}>
                Click on the link below to get the attempts of the students who
                have submitted the Exam
              </p>
              <br />
              <Grid
                container
                spacing={1}
                style={{
                  marginTop: "0.5%",
                  alignItems: "center",
                  overFlowY: "scroll",
                }}
              >
                <Grid item xs={6}>
                  <p style={{ textAlign: "left", fontWeight: "bold" }}>Name</p>
                </Grid>
                <Grid item xs={6}>
                  <p style={{ textAlign: "right", fontWeight: "bold" }}>
                    View Attempts
                  </p>
                </Grid>
              </Grid>
              {demodata.map((altst) => {
                return (
                  <Grid
                    container
                    spacing={0}
                    style={{
                      marginTop: "0.1%",
                      alignItems: "center",
                      overFlowY: "scroll",
                    }}
                  >
                    <Grid item xs={6}>
                      <p style={{ textAlign: "left" }}>
                        {altst.candidate.firstname} {altst.candidate.lastname}
                      </p>
                    </Grid>
                    <Grid item xs={6}>
                      <p
                        style={{
                          textAlign: "right",
                          color: "red",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          handleOpen2();
                          axiosInstance
                            .get(
                              `/attempts/attempts_groups/${altst._id}`,
                              config
                            )
                            .then((res) => {
                              if (res.status === 200) {
                                console.log(res);
                                setAllexamcandidates(
                                  res.data.attempts_submitted
                                );
                              }
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        }}
                      >
                        View
                      </p>
                    </Grid>
                  </Grid>
                );
              })}
              <br />
              <br />
              <br />
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#193441",
                  width: "50%",
                }}
                onClick={handleClose1}
              >
                Close
              </Button>
            </center>
          </Box>
        </Modal1>
        <Modal1 open={open2} onClose={handleClose2} center>
          <center>
            <h3>View Attempts</h3>
            <p style={{ padding: "0 8%" }}>
              Click on the link below to check the Answer Scripts and to update
              the Marks
            </p>
            <br />
            <Grid
              container
              spacing={1}
              style={{
                marginTop: "0.5%",
                alignItems: "center",
                overFlowY: "scroll",
              }}
            >
              <Grid item xs={6}>
                <p style={{ textAlign: "left", fontWeight: "bold" }}>
                  Attempt Id
                </p>
              </Grid>
              <Grid item xs={6}>
                <p style={{ textAlign: "right", fontWeight: "bold" }}>Marks</p>
              </Grid>
            </Grid>
            {allexamcandidates.map((altst) => {
              return (
                <Grid
                  container
                  spacing={0}
                  style={{
                    marginTop: "0.1%",
                    alignItems: "center",
                    overFlowY: "scroll",
                  }}
                >
                  <Grid item xs={6}>
                    <p style={{ textAlign: "left" }}>{altst._id}</p>
                  </Grid>
                  <Grid item xs={6}>
                    <p style={{ textAlign: "right" }}>{altst.marks_obtained}</p>
                  </Grid>
                </Grid>
              );
            })}
            <br />
            <br />
            <br />
            <Button
              variant="contained"
              style={{
                backgroundColor: "#193441",
                width: "50%",
              }}
              onClick={handleClose2}
            >
              Close
            </Button>
          </center>
        </Modal1>
        <marquee
          width="100%"
          direction="right"
          height="30%"
          style={{ fontSize: "10px" }}
        >
          Live monitoring is enabled. Please upgrade your server to view the
          real time check!
        </marquee>
      </Sidebar>
    </div>
  );
}
