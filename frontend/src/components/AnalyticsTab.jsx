import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { useVoteStore } from "../stores/useVoteStore";
import { useState } from "react";
const UsersList = () => {
  const { clearVote, votes } = useVoteStore();
  const [clearingId, setClearingId] = useState(null);

  const handleClearVote = async (userId) => {
    if (window.confirm("Are you sure you want to clear this vote?")) {
      setClearingId(userId);
      await clearVote(userId);
      setClearingId(null);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {votes?.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No votes found</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-3 sm:px-3 py-1 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-3 sm:px-3 py-1 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Group
              </th>
              <th
                scope="col"
                className="px-3 sm:px-3 py-1 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                hasVoted
              </th>
              <th
                scope="col"
                className="px-3 sm:px-3 py-1 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                VoteTo
              </th>
              <th
                scope="col"
                className="px-3 sm:px-3 py-1 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                VoteDate
              </th>
              <th
                scope="col"
                className="px-3 sm:px-3 py-1 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {votes?.map((vote) => (
              <tr key={vote.id || vote._id} className="hover:bg-gray-700">
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{vote.username}</div>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {vote.group || "N/A"}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {vote.hasVoted ? "Yes" : "No"}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {vote.votedTo || "null"}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {vote.voteDate || "null"}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleClearVote(vote.id)}
                    disabled={clearingId === vote.id}
                    className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
                  >
                    <RotateCw
                      className={`size-2 sm:size-5 ${clearingId === vote.id ? "animate-spin" : ""}`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default UsersList;
