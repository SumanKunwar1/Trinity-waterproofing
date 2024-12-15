import { Dashboard } from "../../../customer-profile/body/dashboard";
import { SideBar } from "../../../customer-profile/body/side-bar";

export const DashboardPage = () => {
  return (
    <div className="flex w-full h-screen m-8">
      <div className="w-[25%]">
        <SideBar />
      </div>
      <div className="w-[75%] overflow-auto">
        <Dashboard />
      </div>
    </div>
  );
};
