"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllDevotees, getAllSevas, getDetByDocID } from "../db/devotee";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import Link from "next/link";
import Modal from "../components/Modal";
import SevaTable from "../components/SevaTable";

function AdminSuspense() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [devotee, setDevotee] = useState([]);
  const [sevaList, setSevaList] = useState([]);
  const [devoteeName, setDevoteeName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dID, setDId] = useState("");

  useEffect(() => {
    getDetByDocID(id).then(function (result) {
      setData(result);
      setDevoteeName(result.firstname);
      setLoading(false);
    });
  }, []);

  const handleClick = () => {
    router.replace("/seva/booking/" + `${data.id}`);
  };

  const showData = () => {
    getAllDevotees("0").then(function (result) {
      setDevotee(result.data);
      console.log(result);
    });
  };

  function handleChange(e) {
    setInput(e.target.value);
  }

  const devoteeList = input
    ? devotee?.filter(
        (d) =>
          d.firstname.toLowerCase().includes(input.toLowerCase()) ||
          d.city.toLowerCase().includes(input.toLowerCase())
      )
    : devotee;

  const handleCardClick = (dtID) => {
    //console.log(`Card "${cardTitle}" was clicked!`);
    setDId(dtID);
    getAllSevas(dtID).then(function (result) {
      setSevaList(result.data);
      console.log(result);
      setIsModalOpen(true);
    });

    //    showSevaList(dtID);
    // You can perform any action here, like navigating to a new page,
    // updating state, or making an API call.
  };

  return (
    <div className="flex flex-col w-auto items-center">
      <div className="mb-3 text-lg font-bold p-2.5">
        Welcome <span className="text-blue-700">{devoteeName}</span>
      </div>
      <div className="items-center sm:flex space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
        <button
          className="w-full md:w-auto font-bold bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:bg-blue-300 rounded-lg text-white inline-flex items-center justify-center px-4 py-2.5"
          onClick={handleClick}
        >
          Self Booking
        </button>
        <button
          className="w-full md:w-auto font-bold bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:bg-blue-300 rounded-lg text-white inline-flex items-center justify-center px-4 py-2.5"
          onClick={showData}
        >
          List Devotees
        </button>
        <Link
          href="/"
          className="w-full md:w-auto font-bold bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:bg-blue-300 rounded-lg text-white inline-flex items-center justify-center px-4 py-2.5"
        >
          Back to Home
        </Link>
      </div>

      <div style={{ textAlign: "center" }}>
        <h2 className="text-2xl font-semibold mt-4">List of Devotees</h2>
        <section className="flex w-full sm:p-5 justify-center ">
          <SearchBar onChange={handleChange} value={input} className="" />
        </section>
        <section className="flex flex-wrap gap-3 justify-between">
          {devoteeList?.map((d, i) => (
            <Card data={d} key={i} onClick={() => handleCardClick(d.id)} />
          ))}
        </section>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Seva List</h2>
        <SevaTable id={dID} data={sevaList} />
      </Modal>
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<div>Loading search params...</div>}>
        <AdminSuspense />
      </Suspense>
    </div>
  );
}
