import { AddressBook } from "../../../customer-profile/body/address-book";
import { SideBar } from "../../../customer-profile/body/side-bar";

const AddressBookPage = () => {
  return (
    <div className="flex w-full h-screen m-8">
      <div className="w-[25%]">
        <SideBar />
      </div>
      <div className="w-[75%] overflow-auto">
        <AddressBook />
      </div>
    </div>
  );
};

export default AddressBookPage;
