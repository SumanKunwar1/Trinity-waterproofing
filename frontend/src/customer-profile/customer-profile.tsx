import { Outlet } from "react-router-dom";
import { SideBar } from "../customer-profile/body/side-bar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
export const CustomerProfile = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="flex w-full h-screen m-8">
          <div className="w-[25%]">
            <SideBar />
          </div>
          <div className="w-[75%] overflow-auto">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
