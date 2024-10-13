const Feedback = require('../models/Feedback');
const auth = require("../auth");

// Controller to accept feedback (without rating)
module.exports.submitFeedback = async (req, res) => {
  try {

    const { comment } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and user data is available via token

    // Validation: Ensure comment is provided
    if (!comment) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    // Create a new feedback entry
    const feedback = new Feedback({
      userId,
      comment
    });

    // Save the feedback to the database
    await feedback.save();

    return res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error.message);
    return res.status(500).json({ message: 'An error occurred while submitting feedback', error: error.message });
  }
};

module.exports.getAllFeedbacks = async (req, res) => {
    try {
        // Fetch all feedback records
        // const feedbacks = await Feedback.find().populate('userId', 'firstname lastname email');
        const feedbacks = await Feedback.find();

        if (!feedbacks || feedbacks.length === 0) {
            return res.status(404).json({ message: 'No feedbacks found.' });
        }

        // Send the feedback data
        return res.status(200).json(feedbacks);

    } catch (error) {
        console.error('Error fetching feedbacks:', error.message);
        return res.status(500).json({ message: 'An error occurred while fetching feedbacks', error: error.message });
    }
};


module.exports.deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;

        // Find feedback by ID and remove it
        const feedback = await Feedback.findByIdAndDelete(feedbackId);

        // If no feedback is found
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found.' });
        }

        // Feedback deleted successfully
        return res.status(200).json({ message: 'Feedback deleted successfully.', feedback });

    } catch (error) {
        console.error('Error deleting feedback:', error.message);
        return res.status(500).json({ message: 'An error occurred while deleting the feedback', error: error.message });
    }
};