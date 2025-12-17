import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Monika Sri N S");
  const [email, setEmail] = useState("cse-analyst@example.com");

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedEmail = localStorage.getItem("userEmail");
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          CSE Analyst Profile
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-200">
          <div className="flex items-center">
            <span className="w-40 font-semibold">👤 Name:</span>
            <span>{name}</span>
          </div>
          <div className="flex items-center">
            <span className="w-40 font-semibold">📧 Email:</span>
            <span>{email}</span>
          </div>
          <div className="flex items-center">
            <span className="w-40 font-semibold">🛡️ Role:</span>
            <span>Cybersecurity Analyst (CSE)</span>
          </div>
          <div className="flex items-center">
            <span className="w-40 font-semibold">🏢 Organization:</span>
            <span>CERT Division</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;



