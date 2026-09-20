import React from 'react'
import { MdSunny } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdSettings } from "react-icons/md";

const Navbar = () => {
  return (
    <>
    <div className="nav flex items-center justify-between gap-3 px-4 sm:px-8 lg:px-[100px] h-[70px] sm:h-[90px] border-b-[1px] border-gray-800">
      <div className="logo min-w-0">
        <h3 className='text-[20px] sm:text-[25px] font-[700] sp-text truncate'>Prompt2UI</h3>
      </div>
      <div className="icons flex shrink-0 items-center gap-[10px] sm:gap-[15px]">
        <div className="icon"><MdSunny /></div>
        <div className="icon"><FaUser /></div>
        <div className="icon"><MdSettings /></div>
      </div>
    </div>
    </>
  )
}

export default Navbar