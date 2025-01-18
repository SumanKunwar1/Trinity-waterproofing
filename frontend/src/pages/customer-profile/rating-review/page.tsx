import Footer from "../../../components/layout/Footer";
import Header from "../../../components/layout/Header";
import { Reviews } from "../../../customer-profile/body/rating-reviews";
import { SideBar } from "../../../customer-profile/body/side-bar";
const RatingsAndReviews = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="flex w-full h-screen">
          <div className="">
            <SideBar />
          </div>
          <div className="w-[75%] overflow-auto">
            <Reviews />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RatingsAndReviews;
