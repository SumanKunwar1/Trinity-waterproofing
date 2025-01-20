import Footer from "../../../components/layout/Footer";
import Header from "../../../components/layout/Header";
import Notifications from "../../../customer-profile/body/notification";
import { SideBar } from "../../../customer-profile/body/side-bar";

const Notification = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="flex w-full h-screen">
          <div className="">
            <SideBar />
          </div>
          <div className="w-[75%] overflow-auto">
            <Notifications />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Notification;
