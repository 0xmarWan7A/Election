import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const CandidatesList = () => {
  const { deleteCandidate, candidates } = useProductStore();

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-3 sm:px-6 py-1 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Candidate
            </th>
            <th
              scope="col"
              className="px-3 sm:px-6 py-1 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Candidate ID
            </th>
            <th
              scope="col"
              className="px-3 sm:px-6 py-1 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Position
            </th>
            <th
              scope="col"
              className="px-3 sm:px-6 py-1 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Votes
            </th>
            <th
              scope="col"
              className="px-3 sm:px-6 py-1 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Created-At
            </th>

            <th
              scope="col"
              className="px-3 sm:px-6 py-1 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {candidates?.map((candidate) => (
            <tr key={candidate._id} className="hover:bg-gray-700">
              <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 size-5 sm:size-10">
                    <img
                      className="size-5 sm:size-10 rounded-full object-cover"
                      src={candidate.image}
                      alt={candidate.fullname}
                    />
                  </div>
                  <div className="ml-2 sm:ml-4">
                    <div className="text-sm font-medium text-white">
                      {candidate.fullname}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{candidate.number}</div>
              </td>
              <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">
                  {candidate.position}
                </div>
              </td>
              <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{candidate.votes}</div>
              </td>
              <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">
                  {candidate.createdAt.slice(0, 10)}
                </div>
              </td>
              <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => deleteCandidate(candidate._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash className="size-2 sm:size-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};
export default CandidatesList;
