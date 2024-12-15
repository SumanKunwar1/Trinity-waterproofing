import { ManageProfile } from "../../../customer-profile/body/manage-profile";
import { SideBar } from "../../../customer-profile/body/side-bar";

export const ManageProfilePage = () => {
  return (
    <div className="flex w-full h-screen m-8">
      <div className="w-[25%]">
        <SideBar />
      </div>
      <div className="w-[75%] overflow-auto">
        <ManageProfile />
      </div>
    </div>
  );
};
