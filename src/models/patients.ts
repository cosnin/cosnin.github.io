import { Document, Schema, Model, model, Mongoose } from "mongoose";

export interface IPatient {
  name: string;
  patientId: string;
  deviceId: string;
  top: Object;
  bottom: Object;
  left: Object;
  right: Object;
  front: Object;
  back: Object;
  recordTime?: Date;
  createdAt?: Date;
}

export interface IPatientModel extends IPatient, Document {}

export const PatientSchema: Schema = new Schema(
  {
    name: String,
    patientId: {
      type: String,
      index: true,
      required: true
    },
    top: Object,
    bottom: Object,
    left: Object,
    right: Object,
    front: Object,
    back: Object,
    recordTime: {
      type: Date,
      index: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    usePushEach: true,
    bufferCommands: false,
    versionKey: false
  }
);

PatientSchema.set("toObject", { virtuals: true });
PatientSchema.set("toJSON", { virtuals: true });

export const PatientModel: Model<IPatientModel> = model<IPatientModel>(
  "patients",
  PatientSchema
);

export var findByPatientId = function (PatientId: string, cb: Function) {
  PatientModel.findOne({ PatientId }, function (err, Patient) {
    cb(err, Patient);
  });
};

export var findById = function (id: Schema.Types.ObjectId, cb: Function) {
  PatientModel.findById(id).exec(function (err, Patient) {
    cb(err, Patient);
  });
};

export var getAllPatients = function (cb: Function) {
  PatientModel.find({}, { password: 0 }, {}, function (err, PatientList) {
    cb(err, PatientList);
  });
};

export var queryPatients = function (
  query,
  projection: any,
  options: any,
  cb: Function
) {
  PatientModel.find(query, projection, options, function (err, PatientList) {
    cb(err, PatientList);
  });
};

export var createPatient = function (PatientObj: any, cb: Function) {
  PatientObj.save((err, newObj) => {
    if (err) return cb(err, null);
    cb(null, newObj);
  });
};

export var updatePatientById = function (
  id: Schema.Types.ObjectId | any,
  PatientObj: any,
  cb: Function
) {
  PatientModel.updateOne(
    { _id: id },
    { $set: PatientObj },
    { upsert: true },
    function (err, Patient) {
      cb(err, Patient);
    }
  );
};

export var deletePatients = (
  PatientId: Schema.Types.ObjectId,
  cb: Function
) => {
  PatientModel.deleteMany({ _id: { $in: PatientId } }, {}, (err: any) => {
    cb(err);
  });
};
