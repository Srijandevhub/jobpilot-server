const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    name: { type: String, required: true, index: true },
    industrytypeid: { type: mongoose.Schema.Types.ObjectId, ref: 'industrytypes', default: null },
    description: { type: String, default: "" },
    foundedin: { type: String, default: "" },
    organisationtype: { type: String, default: "" },
    teamsize: { type: String, default: "" },
    website: { type: String, default: "" },
    phonecode: { type: String, default: "" },
    phonenumber: { type: String, default: "" },
    email: { type: String, default: "" },
    coverimage: { type: String, default: "" },
    logoimage: { type: String, default: "" },
    isarchieved: { type: Boolean, default: true }
}, { timestamps: true });

const Company = mongoose.model('companies', companySchema)

module.exports = Company;