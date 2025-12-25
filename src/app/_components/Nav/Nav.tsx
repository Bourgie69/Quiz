"use client";
import { useRouter } from "next/navigation";

const Nav = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/")}
      className="text-2xl font-semibold cursor-pointer"
    >
      Quiz app
    </button>
  );
};
export default Nav;
