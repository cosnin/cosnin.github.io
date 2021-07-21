import express from "express";
import passport from "passport";
import { ResponseObj } from "../models/models";
import { io } from "../index";
import { sendSensorData, sendRecording } from "../socket/socket";
import * as Patient from "../models/patients";
let router = express.Router();

let btnsActive = {};

router.get(
  "/all",
  passport.authenticate("bearer", { session: false }),
  (req, res, next) => {
    Patient.getAllPatients((err, patientList: Patient.IPatientModel[]) => {
      if (err) {
        let responseObj = new ResponseObj(
          400,
          "db error: getting all patients list",
          err
        );
        return res.status(responseObj.status).json(responseObj);
      }

      let responseObj = new ResponseObj(200, "success", patientList);
      return res.status(responseObj.status).json(responseObj);
    });
  }
);

router.get(
  "/search",
  passport.authenticate("bearer", { session: false }),
  (req, res, next) => {
    let query: any = {};
    if (req.query.id) {
      query.patientId = req.query.id;
      query.recordTime = { $ne: null };
    }
    Patient.queryPatients(
      query,
      {},
      { sort: { recordTime: -1 } },
      (err, patientList: Patient.IPatientModel[]) => {
        if (err) {
          let responseObj = new ResponseObj(
            400,
            "db error: getting all patients list",
            err
          );
          return res.status(responseObj.status).json(responseObj);
        }

        var patients = patientList ? patientList.slice() : [];

        patients = patients.map((p) => {
          var n: any = JSON.parse(JSON.stringify(p));

          n.top = n.top ? n.top.d1 + ", " + n.top.d2 + ", " + n.top.d3 : "";

          n.bottom = n.bottom
            ? n.bottom.d1 + ", " + n.bottom.d2 + ", " + n.bottom.d3
            : "";

          n.left = n.left
            ? n.left.d1 + ", " + n.left.d2 + ", " + n.left.d3
            : "";

          n.right = n.right
            ? n.right.d1 + ", " + n.right.d2 + ", " + n.right.d3
            : "";

          n.front = n.front
            ? n.front.d1 + ", " + n.front.d2 + ", " + n.front.d3
            : "";

          n.back = n.back
            ? n.back.d1 + ", " + n.back.d2 + ", " + n.back.d3
            : "";
          if (n.recordTime) {
            n.recordTime = new Date(n.recordTime).toLocaleString();
          }

          return n;
        });
        //console.log(patients);

        let responseObj = new ResponseObj(200, "success", patients);
        return res.status(responseObj.status).json(responseObj);
      }
    );
  }
);

// Post Sensor data
router.post("/sensor", (req, res, next) => {
  let responseObj = new ResponseObj(200, "success", req.body);
  btnsActive = {};
  sendSensorData(io, req.body);

  return res.status(responseObj.status).json(responseObj);
});

// Post recording data
router.post("/recording", (req, res, next) => {
  let responseObj = new ResponseObj(200, "success", req.body);
  sendRecording(io, req.body);
  return res.status(responseObj.status).json(responseObj);
});

// Post Sensor data
router.get("/patient/:id", (req, res, next) => {
  if (!req.params.id) {
    let responseObj = new ResponseObj(400, "missing patient id", null);
    return res.status(responseObj.status).json(responseObj);
  }

  let newPatient: Patient.IPatientModel = new Patient.PatientModel({
    patientId: req.params.id
  });

  Patient.createPatient(
    newPatient,
    (err: any, newObject: Patient.IPatientModel) => {
      if (err || !newObject) {
        let responseObj = new ResponseObj(
          400,
          "db error: getting patient data",
          err
        );
        return res.status(responseObj.status).json(responseObj);
      }

      let responseObj = new ResponseObj(200, "success", newPatient);

      return res.status(responseObj.status).json(responseObj);
    }
  );
});

// query button status
router.get("/query", (req, res, next) => {
  let newPatient: Patient.IPatientModel = new Patient.PatientModel({
    patientId: req.params.id
  });

  let responseObj = new ResponseObj(200, "success", btnsActive);

  return res.status(responseObj.status).json(responseObj);
});

// active button
router.post("/activate", (req, res, next) => {
  btnsActive = { recording: true };
  let responseObj = new ResponseObj(200, "success", btnsActive);

  return res.status(responseObj.status).json(responseObj);
});

// Save Patient's Sensor data
router.post("/patient", (req, res, next) => {
  if (!req.body.id && !req.body.patientId) {
    let responseObj = new ResponseObj(400, "missing patient id", null);
    return res.status(responseObj.status).json(responseObj);
  }

  var updateObj: Patient.IPatientModel = new Patient.PatientModel(req.body);
  let updateJson = JSON.parse(JSON.stringify(updateObj));
  updateJson.recordTime = Date.now();
  delete updateJson.createdAt;
  delete updateJson._id;
  delete updateJson.id;

  //console.log(updateJson);
  Patient.updatePatientById(
    req.body.id,
    updateJson,
    (err: any, response: Patient.IPatientModel) => {
      if (err || !response) {
        let responseObj = new ResponseObj(
          400,
          "db error: getting patient data",
          err
        );
        return res.status(responseObj.status).json(responseObj);
      }

      let responseObj = new ResponseObj(200, "success", response);

      return res.status(responseObj.status).json(responseObj);
    }
  );
});

// =========================  end of routes   ========================
module.exports = router;
