import Footer from "../../../components/layout/Footer";
import Header from "../../../components/layout/Header";
import { AddressBook } from "../../../customer-profile/body/address-book";
import { SideBar } from "../../../customer-profile/body/side-bar";

const AddressBookPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="flex w-full h-screen m-8">
          <div className="w-[25%]">
            <SideBar />
          </div>
          <div className="w-[75%] overflow-auto">
            <AddressBook />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddressBookPage;
