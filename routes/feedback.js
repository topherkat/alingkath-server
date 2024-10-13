const express = require("express");
const feedbackController = require("../controllers/feedback");
const { verify, verifyAdmin } = require("../auth");
const router = express.Router();

router.get('/', verify, verifyAdmin, feedbackController.getAllFeedbacks);
router.post('/submit', verify, feedbackController.submitFeedback);
router.delete('/:feedbackId', verify, verifyAdmin, feedbackController.deleteFeedback);

module.exports = router;