/** @format */

import { cn } from "../lib/utils";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchBar({ onChange, className, value }) {
  return (
    <div
      className={cn(
        "md:min-w-[300px] md:w-[500px] w-full ring-2 ring-slate-700 rounded-md flex items-center gap-2 px-2 hover:ring-white focus-within:ring-white  transition-all group ",
        className
      )}
    >
      <AiOutlineSearch
        className="text-2xl text-slate-700 group-hover:text-white
    group-focus-within:text-white"
      />
      <input
        onChange={onChange}
        type="text"
        value={value}
        placeholder="Seach for Devotees "
        className="w-full h-[38px] rounded-md bg-inherit outline-none p-2   "
      />
    </div>
  );
}

