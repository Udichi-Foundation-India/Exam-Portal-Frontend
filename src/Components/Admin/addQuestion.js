import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Navbar from "./../../Common/Navbar_Admin";
import Footer from "../../Common/Footer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axiosInstance from "../../axiosInstance";
import getCookie from "../../getCookie";
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

var arrayOption = [];

const Input = ({
  setOptionIsCorrect,
  setOptionName,
  optionVal,
  option_name,
  inputList,
  setOptionId,
  option_list,
  setOptionList,
}) => {
  const [iscorrect, setIscorrect] = useState(false);
  const [option_val, setOptionVal] = useState(optionVal);
  return (
    <Grid container spacing={1} style={{ marginTop: "0.5%" }}>
      <Grid item xs={6}>
        <TextField
          id="outlined-basic"
          label="Type Option"
          variant="outlined"
          size="small"
          style={{ width: "98.5%" }}
          onClick={(e) => {
            setOptionId(inputList.length);
            setOptionName(e.target.value);
          }}
          onChange={(e) => {
            option_list[option_list.length - 1].title = e.target.value;
            setOptionVal(e.target.value);
            setOptionName(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={<Checkbox />}
          label="Is Correct"
          onClick={(e) => {
            option_list[option_list.length - 1].is_correct = e.target.checked;
            setOptionIsCorrect(e.target.checked);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default function AddCandidate({ error, setError }) {
  let token = getCookie("access_token");
  let user = JSON.parse(localStorage.getItem("user"));

  const config = {
    headers: { Authorization: `Bearer ${token}`, "user-type": user.usertype },
  };

  const [group, setGroup] = useState("");
  const [type, setType] = useState("");
  const [section, setSection] = useState("");
  const [inputList, setInputList] = useState([]);
  const [title, setTitle] = useState("");
  const [positive, setPositive] = useState("");
  const [negetive, setNegetive] = useState("");
  const [qstype, setQstype] = useState("");
  const [option, setOption] = useState([]);
  const [assign, setAssign] = useState(false);
  const [create, setCreate] = useState(false);
  const [grptitle, setGrptitle] = useState("");
  const [questionid, setQuestionid] = useState("");
  const [quesgroup, setQuesgroup] = useState([]);
  const [open, setOpen] = useState(false);
  const [option_list, setOptionList] = useState([]);
  const [option_id, setOptionId] = useState(null);
  const [option_name, setOptionName] = useState(null);
  const [option_ischecked, setOptionIsCorrect] = useState(false);
  let [boltype, setBoltype] = useState(false);
  let [strtype, setStrtype] = useState("Fill in the Blank");

  useEffect(() => {
    getQuestionsGroup();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onAddBtnClick = (event) => {
    let op_lis = [];
    let option_data = {
      title: null,
      is_correct: false,
    };
    op_lis.push(option_data);
    setOptionList(option_list.concat(option_data));
    setInputList(
      inputList.concat(
        <Input
          inputList={inputList}
          setOptionId={setOptionId}
          option_list={op_lis}
          optionVal={option_list.title}
          setOptionList={setOptionList}
          option_name={option_name}
          setOptionName={setOptionName}
          setOptionIsCorrect={setOptionIsCorrect}
          key={inputList.length}
        />
      )
    );
  };

  console.log(option_list);

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const handleChange2 = (event) => {
    setGroup(event.target.value);
  };

  async function create_questiongroup(e) {
    e.preventDefault();
    let data = {
      title: grptitle,
      questions: [],
    };
    axiosInstance
      .post("/question-group/", data, config)
      .then((res) => {
        console.log(res);
        let ques = quesgroup;
        if (res.status === 201) ques.push(res.data);
        console.log(ques);
        setQuesgroup(ques);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        setError("Error occurred. Please try again!");
        setTimeout(() => {
          setError(null);
        }, 1000);
      });
  }

  console.log(quesgroup);

  function assign_group() {
    handleOpen();
    setAssign(true);
    setCreate(false);
    getQuestionsGroup();
  }

  function create_group() {
    handleOpen();
    setCreate(true);
    setAssign(false);
  }

  function getQuestionsGroup() {
    axiosInstance
      .get("/question-group/", config)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setQuesgroup(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Error occurred. Please try again!");
        setTimeout(() => {
          setError(null);
        }, 1000);
      });
  }

  async function assign_questiongroup(e) {
    e.preventDefault();
    console.log(type);
    if (type === "Obj") {
      console.log("MCQ");
      boltype = true;
      strtype = "Multiple Correct";
    }
    console.log(boltype);
    let q_data = {
      title: title,
      is_objective: boltype,
      positive_marks: positive,
      negative_marks: negetive,
      options: option_list,
      type_question: strtype,
    };
    let data = {
      question: q_data,
    };

    console.log(data);
    axiosInstance
      .post(`/question-group/create/${group}`, data, config)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          setTitle("");
          setPositive("");
          setNegetive("");
          setType("");
          setGroup("");
          boltype = false;
          strtype = "Fill in the Blank";
          setOptionList([]);
          setInputList([]);
          handleClose();
        }
      })
      .catch((err) => {
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

  return (
    <div>
      <Sidebar content={items1} background="#193441">
        <Navbar />
        <div style={{ padding: "2%" }}>
          <center>
            <Card
              sx={{ maxWidth: 500 }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: "5rem",
                padding: "2%",
              }}
            >
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  style={{ marginBottom: "0", fontWeight: "bold" }}
                >
                  Add Question
                </Typography>
                <br />
                <Typography variant="body2" color="text.secondary">
                  <form>
                    <Grid container spacing={1} style={{ marginTop: "0.5%" }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          required
                          value={title}
                          id="outlined-basic"
                          label="Type Your Question"
                          variant="outlined"
                          size="small"
                          onChange={(e) => {
                            e.preventDefault();
                            setTitle(e.target.value);
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={1} style={{ marginTop: "0.5%" }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          required
                          value={positive}
                          id="outlined-basic"
                          label="Positive Marks"
                          variant="outlined"
                          size="small"
                          onChange={(e) => {
                            e.preventDefault();
                            setPositive(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          required
                          value={negetive}
                          id="outlined-basic"
                          label="Negetive Marks"
                          variant="outlined"
                          size="small"
                          onChange={(e) => {
                            e.preventDefault();
                            setNegetive(e.target.value);
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={1} style={{ marginTop: "0.5%" }}>
                      <Grid item xs={12}>
                        <FormControl required fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Question Type
                          </InputLabel>
                          <Select
                            fullWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={type}
                            label="Question Type"
                            onChange={handleChange}
                          >
                            <MenuItem value={"Obj"}>
                              Single/Miltiple Correct
                            </MenuItem>
                            <MenuItem value={"Des"}>
                              Fill in The Blanks
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container spacing={1} style={{ marginTop: "0.5%" }}>
                      <Grid item xs={12}>
                        <FormControl required fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Question Section
                          </InputLabel>
                          <Select
                            fullWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={group}
                            label="Question Section"
                            onChange={handleChange2}
                          >
                            {quesgroup.map((key) => {
                              return (
                                <MenuItem value={key._id}>{key.title}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    {type === "Obj" ? (
                      <Grid container spacing={1} style={{ marginLeft: "0%" }}>
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: "#193441",
                            margin: "2% 0%",
                          }}
                          onClick={onAddBtnClick}
                        >
                          Add Option
                        </Button>
                      </Grid>
                    ) : (
                      <center></center>
                    )}
                    <br />
                    <div>{inputList}</div>
                    <br />
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#193441", width: "50%" }}
                      onClick={assign_questiongroup}
                    >
                      Continue
                    </Button>
                    <br />
                    <p>
                      Click
                      <a
                        onClick={create_group}
                        style={{
                          textDecoration: "none",
                          cursor: "pointer",
                          color: "#193441",
                        }}
                      >
                        &nbsp;here&nbsp;
                      </a>
                      to create a Section
                    </p>
                  </form>
                </Typography>
              </CardContent>
            </Card>
          </center>
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <center>
              {true ? (
                <div>
                  <Grid container spacing={1} style={{ marginTop: "0.5%" }}>
                    <Grid item xs={12}>
                      <TextField
                        id="outlined-basic"
                        label="Enter Section Name"
                        variant="outlined"
                        size="small"
                        fullWidth
                        onChange={(e) => {
                          e.preventDefault();
                          setGrptitle(e.target.value);
                        }}
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#193441", width: "50%" }}
                    onClick={create_questiongroup}
                  >
                    Continue
                  </Button>
                </div>
              ) : (
                <center></center>
              )}
            </center>
          </Box>
        </Modal>
      </Sidebar>
    </div>
  );
}
