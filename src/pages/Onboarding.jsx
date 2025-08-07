import React, { useEffect, useState } from "react";
import axios from "axios";

const backend = "https://zealthy-backend-5cxb.onrender.com";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    aboutMe: "",
    birthdate: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [stepFields, setStepFields] = useState({});
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios
      .get(`${backend}/api/admin/config`)
      .then((res) => {
        const stepMap = {};
        res.data.forEach((item) => {
          stepMap[item.page] = stepMap[item.page] || [];
          stepMap[item.page].push(item.component);
        });
        setStepFields(stepMap);
      })
      .catch(() => setError("Failed to load form config."));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.email || !formData.password)) {
      setError("Email and password are required");
      return;
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const handleSubmit = () => {
    axios
      .post(`${backend}/api/users`, formData)
      .then(() => {
        setSubmitted(true);
        setFormData({
          email: "",
          password: "",
          aboutMe: "",
          birthdate: "",
          address: "",
          city: "",
          state: "",
          zip: "",
        });
        setStep(1);
      })
      .catch((err) => {
        if (err.response?.status === 409) setError("User already exists");
        else setError("Something went wrong");
      });
  };

  const renderField = (name) => {
    const props = {
      name,
      value: formData[name],
      onChange: handleChange,
      className: "form-control input-style",
      placeholder: " ",
    };

    const labelText = {
      email: "Email",
      password: "Password",
      aboutMe: "About Me",
      birthdate: "Birthdate",
      address: "Address",
      city: "City",
      state: "State",
      zip: "ZIP",
    };

    if (name === "aboutMe") {
      return (
        <div className="form-group" key={name}>
          <textarea {...props} rows={4} />
          <label>{labelText[name]}</label>
        </div>
      );
    } else if (name === "birthdate") {
      return (
        <div className="form-group" key={name}>
          <input type="date" {...props} />
          <label>{labelText[name]}</label>
        </div>
      );
    } else {
      return (
        <div className="form-group" key={name}>
          <input type={name === "password" ? "password" : "text"} {...props} />
          <label>{labelText[name]}</label>
        </div>
      );
    }
  };

  return (
    <div style={styles.wrapper}>
      <style>{cssStyles}</style>
      <div className="card-container">
        <div className="step-bar">
          <div className={`step ${step >= 1 ? "active" : ""}`} />
          <div className={`step ${step >= 2 ? "active" : ""}`} />
          <div className={`step ${step === 3 ? "active" : ""}`} />
        </div>

        <h2 className="title">🚀 Welcome to Zealthy</h2>
        <p className="subtitle">Step {step} of 3</p>

        {submitted && <div className="success-msg">🎉 User submitted successfully!</div>}
        {error && <div className="alert">❌ {error}</div>}

        {step === 1 && (
          <>
            {["email", "password"].map(renderField)}
            <button className="btn btn-next" onClick={handleNext}>
              ➡️ Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {(stepFields[2] || []).map(renderField)}
            <div className="btn-group">
              <button className="btn btn-back" onClick={() => setStep(1)}>
                ⬅️ Back
              </button>
              <button className="btn btn-next" onClick={handleNext}>
                ➡️ Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {(stepFields[3] || []).map(renderField)}
            <div className="btn-group">
              <button className="btn btn-back" onClick={() => setStep(2)}>
                ⬅️ Back
              </button>
              <button className="btn btn-submit" onClick={handleSubmit}>
                ✅ Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "linear-gradient(135deg, #fceae6, #ffffff)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
};

const cssStyles = `
  .card-container {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    animation: fadeIn 0.4s ease-in-out;
  }

  .title {
    color: #EA552B;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    text-align: center;
    color: #555;
    margin-bottom: 1.5rem;
  }

  .step-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .step {
    height: 6px;
    background: #ddd;
    width: 32%;
    border-radius: 4px;
    transition: background 0.3s ease;
  }

  .step.active {
    background: #EA552B;
  }

  .form-group {
    position: relative;
    margin-bottom: 1.5rem;
  }

  .input-style {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    outline: none;
    transition: border 0.3s, box-shadow 0.3s;
  }

  .input-style:focus {
    border-color: #EA552B;
    box-shadow: 0 0 0 3px rgba(234, 85, 43, 0.2);
  }

  .form-group label {
    position: absolute;
    top: 50%;
    left: 0.75rem;
    transform: translateY(-50%);
    color: #aaa;
    background: white;
    padding: 0 0.25rem;
    transition: 0.2s ease;
    pointer-events: none;
  }

  .input-style:focus + label,
  .input-style:not(:placeholder-shown) + label {
    top: -0.6rem;
    font-size: 0.8rem;
    color: #EA552B;
  }

  .btn {
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
    margin-top: 0.5rem;
  }

  .btn-next, .btn-submit {
    background: #EA552B;
    color: white;
  }

  .btn-back {
    background: #ddd;
  }

  .btn-next:hover, .btn-submit:hover {
    background: #d14930;
  }

  .btn-back:hover {
    background: #bbb;
  }

  .btn-group {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .alert {
    background: #ffe5e5;
    color: #d10000;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .success-msg {
    background: #e0ffe5;
    color: #28a745;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
