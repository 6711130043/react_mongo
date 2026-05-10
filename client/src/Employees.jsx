import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
export default function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api/employees");
    setData(res.data);
  };
  //  Search
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.address.city.toLowerCase().includes(search.toLowerCase()),
  );
  //  Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(start, start + itemsPerPage);
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Employee Data</h2>
      {/*  Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search name or city..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      {/*  Table */}
      <div className="card shadow p-3">
        <table className="table table-bordered table-striped">
          {" "}
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Hobby</th>
              <th>Tel</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.address.city}</td>
                <td>{item.hobby.join(", ")}</td>
                <td>{item.tel.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*  Pagination */}
      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 && "disabled"}`}>
            {" "}
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
          </li>
          {[...Array(totalPages)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${currentPage === totalPages && "disabled"}`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
