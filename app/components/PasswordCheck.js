"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function PasswordCheck({ id, pwd }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const inputRef = useRef(null);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitting1, setIsSubmitting1] = useState(false);

  //console.log(pwd);
  useEffect(() => {
    inputRef.current.focus();
  });

  const handleClick = () => {
    setIsSubmitting1(true);
    router.replace("/");
    setIsSubmitting1(false);
  };

  const handleSubmitA = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    document.body.style.cursor = "wait";
    const params = new URLSearchParams(searchParams.toString());

    if (password === pwd) {
      params.set("id", id);
      router.replace(`/admin?${params.toString()}`);
    } else {
      alert("Sorry.... Wrong Password ... ");
      setIsSubmitting(false);
    }
    document.body.style.cursor = "default";
  };

  return (
    <section>
      <div className="flex flex-col bg-white items-center">
        <form className="max-w-sm mx-auto">
          <label
            htmlFor="sPassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password :
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="m18.75 9h-.75v-3c0-3.309-2.691-6-6-6s-6 2.691-6 6v3h-.75c-1.24 0-2.25 1.009-2.25 2.25v10.5c0 1.241 1.01 2.25 2.25 2.25h13.5c1.24 0 2.25-1.009 2.25-2.25v-10.5c0-1.241-1.01-2.25-2.25-2.25zm-10.75-3c0-2.206 1.794-4 4-4s4 1.794 4 4v3h-8zm5 10.722v2.278c0 .552-.447 1-1 1s-1-.448-1-1v-2.278c-.595-.347-1-.985-1-1.722 0-1.103.897-2 2-2s2 .897 2 2c0 .737-.405 1.375-1 1.722z" />
              </svg>
            </div>
            <input
              id="newpassword"
              type="password"
              ref={inputRef}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <p
            id="helper-text-explanation1"
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
          ></p>
          <div className="flex flex-row">
            <button
              type="submit"
              onClick={handleSubmitA}
              className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </button>
            <button
              className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={handleClick}
              disabled={isSubmitting1}
            >
              {isSubmitting1 ? "Wait.." : "Back"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
