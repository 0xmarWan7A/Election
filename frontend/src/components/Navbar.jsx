import { Home, Send, Lock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const Navbar = () => {
  const { user } = useUserStore();
  const isAdmin = user?.role === "admin";

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-center items-center sm:justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-yellow-400 items-center space-x-2 flex"
          >
            منتدى سنوسرت الاول لكشافة الاسماعيلية
          </Link>

          <nav className="flex flex-nowrap sm:flex-wrap items-center gap-12 sm:gap-6 mt-2 sm:mt-0">
            <Link
              to={"/"}
              className="text-gray-300 hover:text-yellow-400 transition duration-300
					 ease-in-out"
            >
              <Home
                className="inline-block mr-1 group-hover:text-yellow-400"
                size={20}
              />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              to={"/contact-us"}
              className="text-gray-300 hover:text-yellow-400 transition duration-300
					 ease-in-out"
            >
              <Send
                className="inline-block mr-1 group-hover:text-yellow-400"
                size={20}
              />
              <span className="hidden sm:inline">Contact</span>
            </Link>
            <Link
              to={"/election"}
              className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center"
            >
              <Users
                className="inline-block mr-1 group-hover:text-yellow-700"
                size={20}
              />
              <span className="hidden sm:inline">Election</span>
            </Link>
            {isAdmin && (
              <Link
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center"
                to={"/secret-dashboard"}
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
