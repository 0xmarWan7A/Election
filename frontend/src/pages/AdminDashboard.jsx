import { Users, PlusCircle, BarChart } from "lucide-react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateCandidate from "../components/CreateCandidate";
import CandidateLsit from "../components/CandidateList";
import { useProductStore } from "../stores/useProductStore";
import { useVoteStore } from "../stores/useVoteStore";
import { useEffect, useState } from "react";

const tabs = [
  { id: "create", label: "Create Candidate", icon: PlusCircle },
  { id: "candidates", label: "Candidate List", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("create");

  const { fetchAllCandidates } = useProductStore();
  const { getVotes } = useVoteStore();

  useEffect(() => {
    fetchAllCandidates();
    getVotes();
  }, [fetchAllCandidates, getVotes]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16 mt-5">
        <motion.h1
          className="text-2xl mt-10 sm:mt-0 sm:text-4xl font-bold mb-8 text-yellow-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          admin dashboard
        </motion.h1>

        <div className="flex justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-2 py-1 sm:px-4 sm:py-2 mx-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "create" && <CreateCandidate />}
        {activeTab === "candidates" && <CandidateLsit />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
};
export default AdminDashboard;
