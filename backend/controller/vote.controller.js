import { Candidate } from "../models/candidate.models.js";
import { User } from "../models/user.models.js";
import { Vote } from "../models/votes.models.js";
import moment from "moment";

export const vote = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const userId = req.user._id; // Get from authenticated user

    // Check if user has already voted (any candidate)
    const existingVote = await Vote.findOne({ user: userId });
    if (existingVote) {
      return res.status(400).json({ message: "You have already voted" });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "candidate not found" });
    }

    const newVote = new Vote({ user: userId, candidate: candidateId });
    await newVote.save();

    candidate.votes += 1;
    await candidate.save();

    // Fix field name: hasVote (from model) not hasVoted
    await User.findByIdAndUpdate(userId, { hasVote: true, vote: newVote._id });

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listUsersWithVotingInfo = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const votes = await Vote.find()
      .populate("user", "username email")
      .populate("candidate", "fullname");

    const usersWithVotingInfo = users.map((user) => {
      const userVote = votes.find(
        (vote) => vote.user && vote.user._id.toString() === user._id.toString(),
      );

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        hasVoted: !!userVote,
        votedTo:
          userVote && userVote.candidate ? userVote.candidate.fullname : null,
        voteDate:
          userVote && userVote.timestamp
            ? moment(userVote.timestamp).format("MMMM Do YYYY, h:mm:ss a")
            : null,
      };
    });

    res.status(200).json(usersWithVotingInfo);
  } catch (error) {
    console.error("Error fetching users with voting info:", error);
    res.status(500).json({ message: error.message });
  }
};

export const clearUserVote = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const vote = await Vote.findOne({ user: user._id });

    if (!vote) {
      return res.status(404).json({ message: "user has not voted" });
    }

    const candidate = await Candidate.findById(vote.candidate);
    if (candidate) {
      candidate.votes = Math.max(0, candidate.votes - 1); // Prevent negative votes
      await candidate.save();
    }

    await User.findByIdAndUpdate(id, { hasVote: false, vote: null });
    await Vote.findByIdAndDelete(vote._id);

    res.status(200).json({ message: "user vote cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
