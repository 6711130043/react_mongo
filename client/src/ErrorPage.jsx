import Navbar from "./Navbar";
import img01 from "./assets/img01.jpg";

function ErrorPage() {
  return (
    <>
      <Navbar />
      <div>
        <h2>กำลังสร้างจร้าาาาาาาาาา</h2>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <img src={img01} />
      </div>
    </>
  );
}

export default ErrorPage;
