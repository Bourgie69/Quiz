"use client"

import { useEffect } from "react";
import Nav from "./_components/Nav/Nav";
import QuizGen from "./_components/QuizGen/QuizGen";
import SideBar from "./_components/Sidebar/SideBar";

export default function Home() {

  useEffect(() => {
    const createUser = async () => {
      await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      })
    }
    
    createUser()
  }, [])

  return (
    <div>
      {/* <Nav/> */}
      <div className="flex bg-gray-50">
        <SideBar />
        <QuizGen />
      </div>
    </div>
  );
}
