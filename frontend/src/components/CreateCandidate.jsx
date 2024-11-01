import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const positions = ["president", "academic", "media", "organizer", "logistics"];
const CreateCandidateForm = () => {
  const [newCandidate, setNewCandidate] = useState({
    fullname: "",
    description: "",
    Position: "",
    number: "",
    logo: "",
    image: "",
  });

  const { createCandidate, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCandidate(newCandidate);
      setNewCandidate({
        fullname: "",
        description: "",
        Position: "",
        number: "",
        logo: "",
        image: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewCandidate({ ...newCandidate, logo: reader.result });
      };

      reader.readAsDataURL(file); // base64
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewCandidate({ ...newCandidate, image: reader.result });
      };

      reader.readAsDataURL(file); // base64
    }
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-yellow-300">
        Create New Candidate
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Candidate Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newCandidate.fullname}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, fullname: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-yellow-500 focus:border-yellow-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newCandidate.description}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, description: e.target.value })
            }
            rows="3"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 
						 focus:border-yellow-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="number"
            className="block text-sm font-medium text-gray-300"
          >
            Candidate ID
          </label>
          <input
            type="text"
            id="number"
            name="number"
            value={newCandidate.number}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, number: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-yellow-500 focus:border-yellow-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Position
          </label>
          <select
            id="service"
            name="service"
            value={newCandidate.position}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, position: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            required
          >
            <option value="">Select a position</option>
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="logo"
            className="sr-only"
            accept="image/*"
            onChange={handleLogoChange}
          />
          <label
            htmlFor="logo"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Logo
          </label>
          {newCandidate.logo && (
            <span className="ml-3 text-sm text-gray-400">
              Logo uploaded successfully{" "}
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
          {newCandidate.image && (
            <span className="ml-3 text-sm text-gray-400">
              Image uploaded successfully{" "}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
          disabled={loading}
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
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Candidate
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};
export default CreateCandidateForm;
