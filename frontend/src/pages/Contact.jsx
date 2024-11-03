import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, MapPin, Mail, Phone, User, Loader } from "lucide-react";
import { useContactStore } from "../stores/useContactStore";
// import { toast } from "react-hot-toast";

const ContactUS = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const { sendMail, loading } = useContactStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMail({
        name,
        email,
        subject,
        message,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-12 py-12 sm:flex-row sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mt-1 text-xl text-center sm:text-left sm:text-3xl font-extrabold text-yellow-400">
            CONTACT US
          </h2>
          <p className="mt-1 text-md sm:text-xl text-center sm:text-left text-gray-400">
            We are responsive for all messages.
          </p>
          <div
            className="flex gap-5 sm:gap-20 items-center ml-10 sm:ml-0 mt-10 text-gray-300 hover:text-yellow-400 transition duration-300
					 ease-in-out"
          >
            <MapPin
              className="inline-block mr-1 group-hover:text-yellow-400"
              size={40}
              aria-hidden="true"
            />
            <span className="sm:inline">Ismailia, Egypt</span>
          </div>
          <div
            className="flex gap-5 sm:gap-20 ml-10 sm:ml-0 items-center mt-10 text-gray-300 hover:text-yellow-400 transition duration-300
					 ease-in-out"
          >
            <Phone
              className="inline-block mr-1 group-hover:text-yellow-400"
              aria-hidden="true"
              size={30}
            />
            <span className="sm:inline"></span>
          </div>
          <div
            className="flex gap-5 sm:gap-20 ml-10 sm:ml-0 items-center mt-10 text-gray-300 hover:text-yellow-400 transition duration-300
					 ease-in-out"
          >
            <Mail
              className="inline-block mr-1 group-hover:text-yellow-400"
              aria-hidden="true"
              size={30}
            />
            <span className="sm:inline"></span>
          </div>
        </motion.div>
        <motion.div
          className="mt-8  sm:mx-auto sm:w-full max-w-xl sm:max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className=" block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
									rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none focus:ring-yellow-500 
									 focus:border-yellow-500 sm:text-sm"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className=" block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
									rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none focus:ring-yellow-500 
									 focus:border-yellow-500 sm:text-sm"
                    placeholder="Your Email Address"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="user"
                  className="block text-sm font-medium text-gray-300"
                >
                  Subject
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MessageCircle
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className=" block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
									rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none focus:ring-yellow-500 
									 focus:border-yellow-500 sm:text-sm"
                    placeholder="Subject"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300"
                >
                  Message
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <textarea
                    id="message"
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="3"
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 
						 focus:border-yellow-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600
							 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-yellow-500 transition duration-150 ease-in-out disabled:opacity-50"
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
                    <Mail className="mr-2 h-5 w-5" aria-hidden="true" />
                    Contact US
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};
export default ContactUS;
