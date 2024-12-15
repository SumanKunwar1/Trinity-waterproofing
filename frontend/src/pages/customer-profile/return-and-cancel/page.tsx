import { ReturnAndCancel } from "../../../customer-profile/body/return-and-cancel";
import { SideBar } from "../../../customer-profile/body/side-bar";

export const ReturnAndCancelPage = () => {
  return (
    <div className="flex w-full h-screen m-8">
      <div className="w-[25%]">
        <SideBar />
      </div>
      <div className="w-[75%] overflow-auto">
        <ReturnAndCancel />
      </div>
    </div>
  );
};
