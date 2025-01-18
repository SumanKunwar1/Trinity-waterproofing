import Footer from "../../../components/layout/Footer";
import Header from "../../../components/layout/Header";
import ReturnAndCancel from "../../../customer-profile/body/return-and-cancel";
import { SideBar } from "../../../customer-profile/body/side-bar";

const ReturnAndCancelPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="flex w-full h-screen">
          <div className="">
            <SideBar />
          </div>
          <div className="w-[75%] overflow-auto">
            <ReturnAndCancel />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnAndCancelPage;
