const express = require('express');
const { verifyAuthentication, verifySuperAdmin, verifyCompanyAdmin } = require('../middlewares/auth');
const { addCompany, getCompanies, getMyCompany, updateMyCompany, updateMyCompanyCover, updateMyCompanyLogo } = require('../controllers/companyControllers');
const upload = require('../middlewares/upload');
const router = express.Router();

router.post("/addcompany", verifyAuthentication, verifySuperAdmin, addCompany);
router.get("/allcompanies", verifyAuthentication, verifySuperAdmin, getCompanies);
router.get("/mycompany", verifyAuthentication, verifyCompanyAdmin, getMyCompany);
router.put("/updatemycompany", verifyAuthentication, verifyCompanyAdmin, updateMyCompany);
router.post("/updatemycompanycover", verifyAuthentication, verifyCompanyAdmin, upload.single("imgfile"), updateMyCompanyCover);
router.post("/updatemycompanylogo", verifyAuthentication, verifyCompanyAdmin, upload.single("imgfile"), updateMyCompanyLogo);

module.exports = router;
