import Nav from "./_components/Nav/Nav";
import QuizGen from "./_components/QuizGen/QuizGen";
import SideBar from "./_components/Sidebar/SideBar";

export default function Home() {
  return (
    <div>
      <Nav />
      <div className="flex">
        <SideBar />
        <QuizGen />
      </div>
    </div>
  );
}
