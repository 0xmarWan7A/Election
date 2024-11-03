import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-center text-xl sm:text-4xl font-bold text-yellow-400 mt-20 mb-2 sm:mb-4">
    منتدى سنوسرت الاول لكشافة الاسماعيلية
        </h1>
        <p className="text-center text-md sm:text-xl text-gray-300 mb-12">
          Discover the latest Candidates & Elections
        </p>
      </motion.div>
    </div>
  );
};

export default Home;
