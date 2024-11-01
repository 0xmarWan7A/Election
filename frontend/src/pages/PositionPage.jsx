import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import CandidateCard from "../components/CandidateCard";
const PositionsPage = () => {
  const { fetchCandidatesByPosition, candidates } = useProductStore();
  const { user } = useUserStore();

  const { position } = useParams();

  useEffect(() => {
    fetchCandidatesByPosition(position);
  }, [fetchCandidatesByPosition, position]);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto mt-10 sm:mt-0 px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-2xl sm:text-4xl font-bold text-yellow-400 mt-10 mb-2 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {position.charAt(0).toUpperCase() + position.slice(1)}
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {candidates?.length === 0 && (
            <h2 className="text-xl sm:text-3xl font-semibold text-gray-300 text-center col-span-full">
              No candidates found
            </h2>
          )}

          {candidates?.map((candidate) => (
            <CandidateCard
              key={candidate._id}
              candidate={candidate}
              user={user}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PositionsPage;
