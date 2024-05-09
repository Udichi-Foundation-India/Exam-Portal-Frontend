import React, { useState, useEffect } from "react";
import Camera from "./Camera";
import Screen from "./Screen";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import getCookie from "../../getCookie";
import Navbar from "./../../Common/Navbar_Student";
import Footer from "./../../Common/Footer";
import * as faceapi from "face-api.js";
import { useRef } from "react";
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

export default function Index({
  startScreenRecording,
  startCameraRecording,
  mediaScreenBlob,
  mediaCameraBlob,
  stopScreenSharing,
  stopCamera,
  setScreenShare,
  setCameraShare,
  cameraStatus,
  screeStatus,
  isClicked,
  error,
  setError,
  camera,
  loadModels,
}) {
  let token = getCookie("access_token");
  let user = JSON.parse(localStorage.getItem("user"));
  const videoRef = useRef();

  const config = {
    headers: { Authorization: `Bearer ${token}`, "user-type": user.usertype },
  };

  const navigate = useNavigate();
  const [alloted_test, setAllotedTest] = useState(null);
  const [is_attempted, setIsAttempted] = useState(false);
  const [previous_submission, setPreviousSubmission] = useState(null);
  const [number_of_attempts, setNumberOfAttempts] = useState(0);
  const [is_proctoring, setIsProctoring] = useState(true);
  const [multipleFace, setMultipleFace] = useState(false);

  console.log("Asdnkajndkjsnk");
  const { id } = useParams();

  const [initialise, setInitialise] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/test/${id}`, config)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          let data = res.data;
          console.log(data.proctoring);
          setIsProctoring(data.proctoring);
          let question_groups = data.question_groups;
          let questions = [];
          for (let ques of question_groups) {
            console.log(ques.questions);
            questions = questions.concat(ques.questions);
          }
          localStorage.setItem("questions", JSON.stringify(questions));
          localStorage.setItem("test_id", JSON.stringify(id));
          setAllotedTest(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status !== 404)
          setError("Error occurred. Please try again!");
        setTimeout(() => {
          setError(null);
        }, 1000);
      });
  }, []);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user_id"));
    console.log(user);
    axiosInstance
      .get(`/attempts/group/${user}/${id}`, config)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setIsAttempted(true);
          setPreviousSubmission(res.data);
          setNumberOfAttempts(res.data.attempts_submitted.length);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status !== 404)
          setError("Error occurred. Please try again!");
        setTimeout(() => {
          setError(null);
        }, 1000);
      });
  }, []);

  const startExam = async () => {
    let data = {
      test: id,
      candidate: JSON.parse(localStorage.getItem("user_id")),
      number_of_attempts_left: alloted_test.number_of_attempts,
    };
    if (is_attempted) {
      await axiosInstance
        .patch(`/attempts/groups/${previous_submission._id}`, data, config)
        .then((res) => {
          console.log(res);
          if (res.status === 201) {
            localStorage.setItem(
              "attempted_group_id",
              JSON.stringify(res.data._id)
            );
            setTimeout(() => {
              navigate("/testStudent/1");
            }, 10);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status !== 404)
            setError("Error occurred. Please try again!");
          setTimeout(() => {
            setError(null);
          }, 1000);
        });
    } else {
      await axiosInstance
        .post("/attempts/create-group", data, config)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            localStorage.setItem(
              "attempted_group_id",
              JSON.stringify(res.data._id)
            );
            setTimeout(() => {
              navigate("/testStudent/1");
            }, 10);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status !== 404)
            setError("Error occurred. Please try again!");
          setTimeout(() => {
            setError(null);
          }, 1000);
        });
    }
    let submitted_question = JSON.parse(
      localStorage.getItem("submitted_questions_id")
    );
    let test = JSON.parse(localStorage.getItem("test_id"));
    let user = JSON.parse(localStorage.getItem("user_id"));
    let attempt_id = JSON.parse(localStorage.getItem("attempt_id"));

    let d = {
      test: test,
      candidate: user,
      questions_submitted: submitted_question,
    };

    if (attempt_id === null) {
      await axiosInstance
        .post("/attempts", d, config)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);

            localStorage.setItem("attempt_id", JSON.stringify(res.data._id));
            navigate("/testStudent/1");
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status !== 404)
            setError("Error occurred. Please try again!");
          setTimeout(() => {
            setError(null);
          }, 1000);
        });
    } else {
      console.log("sdfkjsk");
      navigate("/testStudent/1");
    }
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      console.log("kdfmskdfm");
      if (initialise) {
        setInitialise(false);
      }

      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );
      console.log(detections);
      setMultipleFace(detections.length() > 1);
    }, 500);
  };

  console.log(camera);

  if (alloted_test === null) {
    return <h1>Loading...</h1>;
  }

  const left_attempts = alloted_test.number_of_attempts - number_of_attempts;
  if (left_attempts <= 0) {
    window.location = "/dashboardStudent";
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
    <>
      {/* {camera.previewStream && (
        <video
          ref={videoRef}
          autoPlay
          muted
          width={200}
          height={200}
          onPlay={handleVideoOnPlay}
        />
      )} */}
      <Sidebar content={items1} background="#193441">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {" "}
          <Navbar />
          <Card
            sx={{ maxWidth: 500 }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: "15rem",
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
                <center>Share Access</center>
              </Typography>
              <br />
              <ul style={{ textAlign: "justify" }}>
                <li style={{ textAlign: "justify" }}>
                  {" "}
                  If requested, students should share their Screen and Camera,
                  before starting the exam.
                </li>
                <br />
                <li style={{ textAlign: "justify" }}>
                  {" "}
                  If any student faces any network issue during this time, he or
                  she can call the pre-announced phone number, to get the
                  assistance.
                </li>
              </ul>
              <br />
              <br />
              <br />
              <div
                style={{
                  display: "flex",
                }}
              >
                {is_proctoring && (
                  <Screen
                    startRecording={startScreenRecording}
                    setMediaBlob={setScreenShare}
                    mediaBlobUrl={mediaScreenBlob}
                    stopRecording={stopScreenSharing}
                    isClicked={isClicked}
                    enable={screeStatus === "acquiring_media"}
                  />
                )}
                {is_proctoring && (
                  <Camera
                    startRecording={startCameraRecording}
                    setCameraBlob={setCameraShare}
                    mediaBlobUrl={mediaCameraBlob}
                    stopRecording={stopCamera}
                    isClicked={isClicked}
                    enable={cameraStatus === "acquiring_media"}
                    loadModels={loadModels}
                    camera={camera}
                  />
                )}
                {is_proctoring && (
                  <Button
                    disabled={
                      !(
                        screeStatus === "recording" &&
                        cameraStatus === "recording"
                      )
                    }
                    variant="contained"
                    onClick={() => {
                      if (
                        screeStatus === "recording" &&
                        cameraStatus === "recording"
                      ) {
                        console.log("Recording....");
                        startExam();
                      }
                    }}
                    style={{
                      backgroundColor: !(
                        screeStatus === "recording" &&
                        cameraStatus === "recording"
                      )
                        ? "#aaaaaa"
                        : "#193441",
                      margin: "2px",
                    }}
                    // enabled={
                    //   screeStatus !== "recording" &&
                    //   cameraStatus !== "recording"
                    // }
                  >
                    Continue Exam
                  </Button>
                )}
                {!is_proctoring && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      startExam();
                    }}
                    style={{
                      backgroundColor: !(
                        screeStatus === "recording" &&
                        cameraStatus === "recording"
                      )
                        ? "#aaaaaa"
                        : "#193441",
                      margin: "2px",
                    }}
                    // enabled={
                    //   screeStatus !== "recording" &&
                    //   cameraStatus !== "recording"
                    // }
                  >
                    Continue Exam
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Sidebar>
    </>
  );
}
