import { Candidate } from "../models/candidate.models.js";
import { User } from "../models/user.models.js";
import { Vote } from "../models/votes.models.js";
import moment from "moment";

export const vote = async (req, res) => {
  try {
    const { candidateId, userId } = req.body;
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "candidate not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const vote = await Vote.findOne({
      user: user._id,
      candidate: candidate._id,
    });
    if (vote) {
      return res.status(400).json({ message: "You have already voted" });
    }
    const newVote = new Vote({ user: user._id, candidate: candidate._id });
    await newVote.save();
    candidate.votes += 1;
    await candidate.save();
    await User.findByIdAndUpdate(userId, { hasVoted: true });
    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listUsersWithVotingInfo = async (req, res) => {
  try {
    const users = await User.find();
    const votes = await Vote.find()
      .populate("user", "username email")
      .populate("candidate", "fullname");

    const usersWithVotingInfo = users.map((user) => {
      const userVote = votes.find(
        (vote) => vote.user._id.toString() === user._id.toString()
      );

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        hasVoted: !!userVote,
        votedTo: userVote ? userVote.candidate.fullname : null,
        voteDate: userVote
          ? moment(userVote.timestamp).format("MMMM Do YYYY, h:mm:ss a").tz("Africa/Cairo")
          : null,
      };
    });

    res.status(200).json(usersWithVotingInfo);
  } catch (error) {
    console.error("Error fetching users with voting info:", error);
  }
};

export const clearUserVote = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const data = await Vote.findOne({ user: user._id });

    if (!data) {
      return res.status(404).json({ message: "user has not voted" });
    }

    const candidate = await Candidate.findById(data.candidate);
    if (!candidate) {
      return res.status(404).json({ message: "candidate not found" });
    }
    candidate.votes -= 1;
    await candidate.save();
    await User.findByIdAndUpdate(id, { hasVoted: false });
    await Vote.findByIdAndDelete(data._id);
    res.status(200).json({ message: "user vote cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
