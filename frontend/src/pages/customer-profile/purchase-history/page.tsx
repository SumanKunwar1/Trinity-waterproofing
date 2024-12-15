import { PurchaseHistory } from "../../../customer-profile/body/purchase-history";
import { SideBar } from "../../../customer-profile/body/side-bar";

export const PurchaseHistoryPage = () => {
  return (
    <div className="flex w-full h-screen m-8">
      <div className="w-[25%]">
        <SideBar />
      </div>
      <div className="w-[75%] overflow-auto">
        <PurchaseHistory />
      </div>
    </div>
  );
};
