"use strict";

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const port = 4000;
const { validateToken } = require("./middleware/verifyToken.js");

const {
  getUsers,
  getUserId,
  createNewCompany,
  loginJWT,
  getUserProfile,
  createUser,
} = require("./handlers");

const createJob = require("./handlers/createJob");

const jobDetails = require("./handlers/jobDetails");
const approveJob = require("./handlers/approveJob");
const addDrawing = require("./handlers/addDrawing");
const addNote = require("./handlers/addNote");
const getTemplates = require("./handlers/getTemplates");
const answerForm = require("./handlers/answerForm");
const addTemplates = require("./handlers/addTemplates");
const completeJob = require("./handlers/completeJob");
const handleLogout = require("./handlers/handleLogout");
const createManager = require("./handlers/createManager");
const deleteManager = require("./handlers/deleteManager");

express()
  .use(morgan("tiny"))
  .use(express.json({ limit: "50mb" }))
  .use(express.static("public"))
  .use(cookieParser())

  //stretch, create a middleware for checking user roles for permissions

  .get("/api/users", getUsers)
  //batchImport not working, used this to import templates.json
  .post("/api/addTemplates", addTemplates)
  .get("/api/templates", validateToken, getTemplates)
  .get("/api/user", validateToken, getUserId)
  .get("/api/user/:userName", validateToken, getUserProfile)
  .post("/api/create-user/:userId", validateToken, createUser)
  .post("/api/create-manager", validateToken, createManager)
  .post("/api/signup", createNewCompany)
  .post("/api/login", loginJWT)
  .get("/api/logout", validateToken, handleLogout)
  .post("/api/create-job/:userId", validateToken, createJob)
  .get("/api/jobDetails/:userName/:jobId", validateToken, jobDetails)
  .patch("/api/jobs/approval/:userName/:jobId", validateToken, approveJob)
  .patch("/api/jobs/addDrawing/:userName/:jobId", validateToken, addDrawing)
  .patch("/api/jobs/addNote/:userName/:jobId", validateToken, addNote)
  .patch("/api/jobs/answerForm/:userName/:jobId", validateToken, answerForm)
  .patch("/api/jobs/completed/:userName/:jobId", validateToken, completeJob)
  .delete("/api/remove-manager/:managerId", validateToken, deleteManager)

  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })
  .listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
