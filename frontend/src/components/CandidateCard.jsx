import { Vote, Loader } from "lucide-react";
import { useVoteStore } from "../stores/useVoteStore";

const CandidateCard = ({ candidate, user }) => {
  const { createVote, loading } = useVoteStore();

  // Handle click event for voting
  const handleVote = () => {
    createVote(candidate._id, user.id);
  };
  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-contain w-full"
          src={candidate.image}
          alt="candidate image"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">
          {candidate.fullname}
        </h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p className="text-gray-300">{candidate.description}</p>
        </div>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p className="text-gray-300">رقم: {candidate.number}</p>
          <img
            className="size-5 sm:size-10 rounded-lg object-cover"
            src={candidate.logo}
            alt={candidate.fullname}
          />
        </div>
        <button
          onClick={handleVote}
          disabled={loading}
          className="flex items-center justify-center rounded-lg bg-yellow-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-yellow-700 focus:outline-none focus:ring-4"
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <Vote size={22} className="mr-2" />
              Vote
            </>
          )}
        </button>
      </div>
    </div>
  );
};
export default CandidateCard;
