function Login() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState("");

  return (
    <Card
      bgcolor="info"
      header="Login"
      body={
        show ? (
          <>
            <LoginForm setShow={setShow} setStatus={setStatus} />
            <div style={{ marginTop: "10px" }}>
              {" "}
              {/* Adjust margin top to create space */}
              <p>Don't have an account?</p>
              <button
                className="btn btn-light"
                onClick={() => (window.location.href = "/#/CreateAccount/")}
              >
                Create one
              </button>
            </div>
          </>
        ) : (
          <LoginMsg status={status} setShow={setShow} setStatus={setStatus} />
        )
      }
    />
  );
}

function LoginMsg(props) {
  return <h5>Success</h5>;
}

function LoginForm(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  function validateEmail(email) {
    // Regular expression for email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function handleLogin() {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setPasswordError(""); // Clear password error if email is invalid
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      setEmailError(""); // Clear email error if password is invalid
      return;
    }
    setEmailError(""); // Clear email error
    setPasswordError(""); // Clear password error

    fetch(`/account/login/${email}/${password}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.email) {
          localStorage.setItem("user", JSON.stringify(data)); // Store the user data
          props.setStatus("");
          props.setShow(false);
          console.log("JSON:", data);
          window.location.href = "/#/"; // Redirect to home page after successful login
          window.location.reload(); // Refresh the page
        } else {
          props.setStatus(data.message || "Login failed");
        }
      })
      .catch((err) => {
        props.setStatus("Login failed");
        console.log("Fetch error:", err);
      });
  }

  return (
    <>
      Email
      <br />
      <input
        type="input"
        className="form-control"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <br />
      {emailError && <div style={{ color: "red" }}>{emailError}</div>}{" "}
      {/* Display email validation error */}
      Password
      <br />
      <input
        type="password"
        className="form-control"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <br />
      {passwordError && <div style={{ color: "red" }}>{passwordError}</div>}{" "}
      {/* Display password validation error */}
      <button type="submit" className="btn btn-light" onClick={handleLogin}>
        Login
      </button>
    </>
  );
}