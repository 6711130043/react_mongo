import Navbar from "./Navbar";
import img01 from "./assets/img01.jpg";

function Home() {
  return (
    <>
      <Navbar />
      <div>
        <h2>Welcome to the Home Page!</h2>
        <p>This is the homepage of our website.</p>
        <img src={img01} style={{ height: "200px", width: "200px" }} />
      </div>
    </>
  );
}

export default Home;
