function NavBar() {
  function handleLogout() {
    localStorage.removeItem("user"); // Remove user data from localStorage
    console.log("Logged out successfully");
    window.location.href = "/#/login"; // Redirect to login page
    window.location.reload(); // Refresh the page
  }

  // Retrieve user data from local storage
  const userData = JSON.parse(localStorage.getItem("user"));
  console.log("User data:", userData); // Log user data for debugging
  const userName = userData ? userData.name : "";
  const isEmployee = userData && userData.role === "Employee"; // Check if user is an employee
  console.log("Is employee:", isEmployee); // Log isEmployee for debugging

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{ backgroundColor: "#C8A2C8" }}
    >
      <a className="navbar-brand" href="#">
        GoodBank
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav nav-tabs mr-auto">
          {/* Added 'mr-auto' class for left alignment */}
          {userData && ( // Conditionally render these items after logging in
            <>
              <li className="nav-item">
                <a className="nav-link" href="#/deposit/">
                  Deposit
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#/withdraw/">
                  Withdraw
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#/transfer/">
                  Transfer
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#/balance/">
                  Balance
                </a>
              </li>
              {isEmployee && ( // Conditionally render the "AllData" tab only for employees
                <li className="nav-item">
                  <a className="nav-link" href="#/alldata/">
                    AllData
                  </a>
                </li>
              )}
            </>
          )}
        </ul>
        {userData ? ( // Render user information if user is logged in
          <div className="ml-auto">
            {/* Added 'ml-auto' class for right alignment */}
            <span className="navbar-text mr-3" style={{ color: "black" }}>
              Welcome, {userName}!
            </span>
            {/* Changed text color to black */}
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
            {/* Logout button */}
          </div>
        ) : (
          <button
            className="btn btn-light"
            onClick={() => (window.location.href = "/#/login/")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
