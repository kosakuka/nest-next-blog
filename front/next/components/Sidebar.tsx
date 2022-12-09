import { useRouter } from "next/router";
import React, { useState } from "react";

const Sidebar = () => {
  const router = useRouter();
  const [searchFormValue, setSearchFormValue] = useState("");
  return (
    <div className="h-max right-0 flex flex-col">
      <h1 className="font-semibold text-xl mb-3">検索</h1>
      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          const searchFormValueArray = searchFormValue.split(" ");
          let searchURL = "/search?q=";
          searchFormValueArray.map((ele) => {
            searchURL += `${ele}+`;
          });
          searchURL = searchURL.slice(0, -1);
          router.push(searchURL);
        }}
      >
        <input
          className="bg-slate-200 outline-none px-5 py-3 rounded-md italic w-full"
          placeholder="input something..."
          type="text"
          value={searchFormValue}
          onChange={(e) => {
            setSearchFormValue(e.target.value);
          }}
        />
      </form>
    </div>
  );
};

export default Sidebar;
