import React from "react";

const Register = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Create an Account</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;