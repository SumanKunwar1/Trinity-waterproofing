import Footer from "../../../components/layout/Footer";
import Header from "../../../components/layout/Header";
import { Dashboard } from "../../../customer-profile/body/dashboard";
import { SideBar } from "../../../customer-profile/body/side-bar";

const DashboardPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="flex w-full h-screen">
          <div className="w-[25%] overflow-auto h-full">
            <SideBar />
          </div>
          <div className="w-[75%] overflow-auto">
            <Dashboard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default DashboardPage;
