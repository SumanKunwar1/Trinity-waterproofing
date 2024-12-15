import { Outlet } from "react-router-dom";
import { SideBar } from "../customer-profile/body/side-bar";
export const CustomerProfile = () => {
  return (
    <div className="flex w-full h-screen m-8">
      <div className="w-[25%]">
        <SideBar />
      </div>
      <div className="w-[75%] overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};
