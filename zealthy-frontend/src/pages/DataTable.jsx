import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const backend = "http://localhost:4000";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("email");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    axios
      .get(`${backend}/api/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("Failed to load user data:", err);
        setError("Unable to fetch user data.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = users
    .filter((u) => u.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aField = a[sortField] || "";
      const bField = b[sortField] || "";
      if (sortOrder === "asc") return aField.localeCompare(bField);
      else return bField.localeCompare(aField);
    });

  const blankProfiles = users.filter(
    (u) => !u.aboutMe && !u.birthdate && !u.address
  ).length;

  const toggleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "1100px" }}>
      <div className="text-center mb-4">
        
        <h2 style={{ color: "#EA552B", fontWeight: "bold" }}>
          Zealthy User Dashboard 📊
        </h2>
        <p className="text-muted">
          View onboarding stats, search by email, and explore user entries
        </p>
      </div>

      {error && (
        <div className="alert alert-danger text-center">❌ {error}</div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" style={{ color: "#EA552B" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row mb-4 g-3">
            <div className="col-md-4">
              <div className="card shadow-sm border-0 text-center">
                <div className="card-body">
                  <h6 className="card-subtitle text-muted">👥 Total Users</h6>
                  <h4 className="card-title mt-2 fw-bold text-dark">
                    {users.length}
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 text-center">
                <div className="card-body">
                  <h6 className="card-subtitle text-muted">🚧 Incomplete Profiles</h6>
                  <h4 className="card-title mt-2 fw-bold text-dark">
                    {blankProfiles}
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control shadow-sm"
                placeholder="🔍 Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive shadow rounded">
            <table className="table table-striped align-middle text-center mb-0">
              <thead className="table-light">
                <tr>
                  <th onClick={() => toggleSort("email")} style={{ cursor: "pointer" }}>📧 Email</th>
                  <th onClick={() => toggleSort("aboutMe")} style={{ cursor: "pointer" }}>👤 About Me</th>
                  <th onClick={() => toggleSort("birthdate")} style={{ cursor: "pointer" }}>🎂 Birthdate</th>
                  <th>🏡 Address</th>
                  <th>🌆 City</th>
                  <th>🌎 State</th>
                  <th>🧾 ZIP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={i}>
                    <td>{u.email}</td>
                    <td>{u.aboutMe || "—"}</td>
                    <td>{u.birthdate || "—"}</td>
                    <td>{u.address || "—"}</td>
                    <td>{u.city || "—"}</td>
                    <td>{u.state || "—"}</td>
                    <td>{u.zip || "—"}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-muted py-4">
                      No matching users found 😔
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
