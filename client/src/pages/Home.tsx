import Body from "@/components/user/Body";
import Navbar from "@/components/user/Navbar";
import Sidebar from "@/components/user/Sidebar";

const Home = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-col md:flex-row gap-8 overflow-hidden">
        <div className="w-52 shrink-0">
          <Sidebar />
        </div>
        <div className="w-full overflow-y-scroll dark:bg-zinc-900">
          <Body />
        </div>
      </div>
    </div>
  );
};

export default Home;
