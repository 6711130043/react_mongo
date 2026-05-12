import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import Navbar from "./Navbar";
export default function App() {
  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    name: "",
    age: "",
    street: "",
    city: "",
    zip: "",
    hobby: "",
    tel: "",
  });

  const [editId, setEditId] = useState(null);

  // modal
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ READ
  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api/employees");
    setData(res.data);
  };

  // ✅ handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ CREATE + UPDATE
  const handleSubmit = async () => {
    //console.log(form);
    const payload = {
      name: form.name,
      age: Number(form.age),

      address: {
        street: form.street,
        city: form.city,
        zip: form.zip,
      },

      hobby: form.hobby.split(",").map((h) => h.trim()),
      tel: form.tel.split(",").map((t) => t.trim()),
    };
    console.log(payload);
    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/employees/${editId}`,
          payload,
        );
      } else {
        await axios.post("http://localhost:5000/api/employees", payload);
      }

      // reset
      setForm({
        name: "",
        age: "",
        street: "",
        city: "",
        zip: "",
        hobby: "",
        tel: "",
      });

      setEditId(null);

      fetchData();
      setShowModal(false);
      Swal.fire("Success!", "Employee saved successfully.", "success");
    } catch (err) {
      console.log(err);
      Swal.fire("Error!", "Failed to save employee.", "error");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        fetchData();
        Swal.fire("Deleted!", "Employee has been deleted.", "success");
      } catch (err) {
        console.log(err);
        Swal.fire("Error!", "Failed to delete employee.", "error");
      }
    }
  };

  // ✅ EDIT
  const handleEdit = (item) => {
    setForm({
      name: item.name,
      age: item.age,

      street: item.address?.street || "",
      city: item.address?.city || "",
      zip: item.address?.zip || "",

      hobby: item.hobby.join(", "),
      tel: item.tel.join(", "),
    });

    setEditId(item._id);
    setShowModal(true);
  };

  // ✅ PAGINATION
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Employee CRUD</h2>

        {/* ✅ first employee */}
        {data.length > 0 && (
          <div className="alert alert-info text-center">
            First Employee:
            <strong> {data[0].name}</strong>
          </div>
        )}

        {/* ✅ ADD BUTTON */}
        <button
          className="btn btn-primary mb-4"
          onClick={() => {
            setEditId(null);
            setForm({
              name: "",
              age: "",
              street: "",
              city: "",
              zip: "",
              hobby: "",
              tel: "",
            });
            setShowModal(true);
          }}
        >
          Add Employee
        </button>

        {/* ✅ TABLE */}
        <div className="card shadow p-3">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Address</th>
                <th>Hobby</th>
                <th>Tel</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>

                  <td>{item.age}</td>

                  <td>
                    {item.address?.street},{item.address?.city},
                    {item.address?.zip}
                  </td>

                  <td>{item.hobby.join(", ")}</td>

                  <td>{item.tel.join(", ")}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ PAGINATION */}
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
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

        {/* ✅ MODAL */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editId ? "Edit Employee" : "Add Employee"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Age"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Street"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Zip"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Hobby (comma separated)"
                  name="hobby"
                  value={form.hobby}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Tel (comma separated)"
                  name="tel"
                  value={form.tel}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editId ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
