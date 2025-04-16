const express = require('express');
const { verifyAuthentication, verifySuperAdmin, verifyCompanyAdmin } = require('../middlewares/auth');
const { addCompany, getCompanies, getMyCompany, updateMyCompany } = require('../controllers/companyControllers');
const router = express.Router();

router.post("/addcompany", verifyAuthentication, verifySuperAdmin, addCompany);
router.get("/allcompanies", verifyAuthentication, verifySuperAdmin, getCompanies);
router.get("/mycompany", verifyAuthentication, verifyCompanyAdmin, getMyCompany);
router.put("/updatemycompany", verifyAuthentication, verifyCompanyAdmin, updateMyCompany);

module.exports = router;