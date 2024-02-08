function CreateAccount() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState("");

  function handleRedirect() {
    window.location.href = "/#/login"; // Redirect to home page
    window.location.reload(); // Refresh the page
  }

  return (
    <Card
      bgcolor="primary"
      header="Create Account"
      body={
        show ? (
          <>
            {status.length > 0 && (
              <div className="alert alert-danger" role="alert">
                {status}
              </div>
            )}
            <CreateForm
              setShow={setShow}
              setStatus={setStatus}
              handleRedirect={handleRedirect}
            />
          </>
        ) : (
          <CreateMsg
            status={status}
            setShow={setShow}
            setStatus={setStatus}
            handleRedirect={handleRedirect}
          />
        )
      }
    />
  );
}

function CreateMsg(props) {
  React.useEffect(() => {
    console.log("Status:", props.status); // Log the status for debugging
    if (props.status === "Success") {
      console.log("Redirecting..."); // Log the redirect attempt for debugging
      props.handleRedirect(); // Redirect after successful account creation
    }
  }, [props.status, props.handleRedirect]);

  return (
    <>
      <h5>{props.status}</h5>
    </>
  );
}

function CreateForm(props) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [emailInUseError, setEmailInUseError] = React.useState("");

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function handle() {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      setEmailError("");
      return;
    }
    setEmailError("");
    setPasswordError("");

    const url = `/account/create/${name}/${email}/${password}`;
    (async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.email) {
          props.setStatus("Success");
          setTimeout(() => {
            props.handleRedirect();
          }, 2000);
        } else {
          if (data.error === "EMAIL_ALREADY_IN_USE") {
            setEmailInUseError("Email is already in use");
          } else {
            setEmailInUseError("");
            props.setStatus(data.message || "Account creation failed");
          }
        }
      } catch (error) {
        console.error("Error creating account:", error);
        if (error instanceof SyntaxError && error.message.includes("Firebase Error")) {
          setEmailInUseError("Email is already in use");
        } else {
          props.setStatus("Account creation failed");
        }
      }
    })();
  }

  return (
    <>
      Name
      <br />
      <input
        type="text"
        className="form-control"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <br />
      Email address
      <br />
      <input
        type="email"
        className="form-control"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <br />
      {emailInUseError && <div style={{ color: "red" }}>{emailInUseError}</div>}
      {emailError && <div style={{ color: "red" }}>{emailError}</div>}
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
      {passwordError && <div style={{ color: "red" }}>{passwordError}</div>}
      <button type="submit" className="btn btn-light" onClick={handle}>
        Create Account
      </button>
    </>
  );
}
