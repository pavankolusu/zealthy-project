import { useEffect, useState } from "react";
import axios from "axios";

const backend = "http://localhost:4000";

export default function Admin() {
  const [config, setConfig] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const components = ["aboutMe", "birthdate", "address", "city", "state", "zip"];

  useEffect(() => {
    axios
      .get(`${backend}/api/admin/config`)
      .then((res) => {
        const initial = {};
        res.data.forEach((c) => {
          initial[c.component] = c.page;
        });
        setConfig(initial);
      })
      .catch((err) => {
        console.error("Failed to load config:", err);
        setError("Unable to load config. Try again later.");
      });
  }, []);

  const updateComponent = (component, page) => {
    setConfig((prev) => ({ ...prev, [component]: page }));
  };

  const handleSave = () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    const configArray = Object.entries(config).map(([component, page]) => ({
      component,
      page,
    }));

    axios
      .post(`${backend}/api/admin/config`, configArray)
      .then(() => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to save config:", err);
        setError("Failed to save config. Please try again.");
      })
      .finally(() => setSaving(false));
  };

  return (
    <div style={styles.wrapper}>
      <style>{css}</style>
      <div className="admin-card">
        <h2 className="admin-title">⚙️ Admin Configuration</h2>
        <p className="admin-subtitle">
          Customize which fields show on which page of the onboarding flow 🧩
        </p>

        {error && <div className="alert alert-danger">❌ {error}</div>}
        {success && <div className="alert alert-success">✅ Config saved successfully!</div>}

        <div className="grid">
          {components.map((c) => (
            <div key={c} className="component-card">
              <h5 className="field-title">🧷 {c}</h5>
              {[2, 3].map((page) => (
                <label key={page} className="radio-label">
                  <input
                    type="radio"
                    name={c}
                    value={page}
                    checked={config[c] === page}
                    onChange={() => updateComponent(c, page)}
                  />
                  <span>📄 Page {page}</span>
                </label>
              ))}
            </div>
          ))}
        </div>

        <div className="btn-container">
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? "⏳ Saving..." : "💾 Save Config"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "linear-gradient(135deg, #fceae6, #ffffff)",
    minHeight: "100vh",
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
  },
};

const css = `
  .admin-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    max-width: 1000px;
    width: 100%;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }

  .admin-title {
    color: #EA552B;
    font-size: 1.75rem;
    text-align: center;
    margin-bottom: 0.25rem;
  }

  .admin-subtitle {
    color: #666;
    text-align: center;
    margin-bottom: 2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .component-card {
    background: #f8f9fa;
    border-radius: 0.75rem;
    padding: 1.25rem;
    transition: box-shadow 0.3s;
    border: 1px solid #e0e0e0;
  }

  .component-card:hover {
    box-shadow: 0 6px 16px rgba(0,0,0,0.05);
  }

  .field-title {
    font-size: 1.1rem;
    color: #333;
    margin-bottom: 1rem;
    text-transform: capitalize;
  }

  .radio-label {
    display: block;
    margin-bottom: 0.75rem;
    font-weight: 500;
    color: #444;
    cursor: pointer;
  }

  .radio-label input[type="radio"] {
    margin-right: 0.5rem;
    accent-color: #EA552B;
  }

  .btn-container {
    text-align: center;
    margin-top: 2rem;
  }

  .save-btn {
    background: #EA552B;
    color: white;
    font-weight: bold;
    font-size: 1rem;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .save-btn:hover {
    background: #d1482c;
  }

  .alert {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    text-align: center;
    margin-bottom: 1rem;
  }

  .alert-danger {
    background: #ffe5e5;
    color: #b00020;
  }

  .alert-success {
    background: #e6f5ea;
    color: #1e7e34;
  }
`;
