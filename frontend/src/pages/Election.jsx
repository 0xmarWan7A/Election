import PositionItem from "../components/PositionItem";
import { motion } from "framer-motion";

const positions = [
  {
    href: "/president",
    name: "الرئيس",
    imageUrl: "/president.jpg",
  },
  { href: "/academic", name: "المقرر", imageUrl: "/academic.jpg" },
  { href: "/organizer", name: "التنظيم", imageUrl: "/organizer.jpg" },
  { href: "/media", name: "الاعلام", imageUrl: "/media.jpg" },
  { href: "/logistics", name: "الدعم اللوجيستي", imageUrl: "/logistics.jpg" },
];

const Positions = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-center text-xl sm:text-4xl font-bold text-yellow-400 mb-2 sm:mb-4">
          Explore Our Candidates
        </h1>
        <p className="text-center text-md sm:text-xl text-gray-300 mb-12">
          Discover the latest Candidates & Elections
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {positions.map((position) => (
            <PositionItem position={position} key={position.name} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
export default Positions;
