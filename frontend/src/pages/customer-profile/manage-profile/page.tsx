import Footer from "../../../components/layout/Footer";
import Header from "../../../components/layout/Header";
import { ManageProfile } from "../../../customer-profile/body/manage-profile";
import { SideBar } from "../../../customer-profile/body/side-bar";

const ManageProfilePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="flex w-full h-screen">
          <div className="w-[25%]">
            <SideBar />
          </div>
          <div className="w-[75%] overflow-auto">
            <ManageProfile />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default ManageProfilePage;
