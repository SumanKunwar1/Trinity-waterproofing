import Footer from "../../../components/layout/Footer";
import Header from "../../../components/layout/Header";
import { PurchaseHistory } from "../../../customer-profile/body/purchase-history";
import { SideBar } from "../../../customer-profile/body/side-bar";

const PurchaseHistoryPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="flex w-full h-screen">
          <div className="w-[25%] z-50">
            <SideBar />
          </div>
          <div className="w-[75%] overflow-auto">
            <PurchaseHistory />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PurchaseHistoryPage;
