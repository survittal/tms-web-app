"use client";
import { Image } from "next/image";

const n = "registered";

const contactus = () => {
  return (
    <section className="bg-gray-100 min-h-screen flex box-border justify-center items-center ">
      <div className="rounded-2xl flex max-w-3xl p-5 items-center">
        <div className="md:w-1/2 px-5">
          <h2 className="font-bold text-3xl text-[#330e0e]">Login</h2>
          <p className="text-sm mt-4 text-[#000000]">
            If you are already <span className="font-bold">{n}</span> with us
          </p>
          <form className="flex flex-col gap-4">
            <input
              className="mt-4 rounded-xl p-2 border"
              type="tel"
              id="userid"
              placeholder="User Mobile No."
            ></input>

            <div className="relative">Password</div>
            <div className="relative">I Agree</div>
            <button className="bg-[#2f24bd] text-white py-2 font-bold rounded-xl hover:scale-105 duration-300">
              Submit Button
            </button>
          </form>
        </div>
        <div className="md:block hidden w-1/2">
          <img
            className="rounded-2xl max-h-[1600px]"
            src="https://images.unsplash.com/photo-1552010099-5dc86fcfaa38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxmcmVzaHxlbnwwfDF8fHwxNzEyMTU4MDk0fDA&ixlib=rb-4.0.3&q=80&w=1080"
            alt="login form image"
          ></img>
        </div>
      </div>
    </section>
  );
};

export default contactus;
