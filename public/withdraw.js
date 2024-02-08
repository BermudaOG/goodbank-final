function Withdraw() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState("");

  // Retrieve user data from local storage
  const userData = JSON.parse(localStorage.getItem("user"));
  const userEmail = userData ? userData.email : "";

  return (
    <Card
      bgcolor="dark"
      header="Withdraw"
      body={
        show ? (
          <WithdrawForm
            setShow={setShow}
            setStatus={setStatus}
            userEmail={userEmail}
          />
        ) : (
          <WithdrawMsg
            status={status}
            setShow={setShow}
            setStatus={setStatus}
          />
        )
      }
    />
  );
}

function WithdrawMsg(props) {
  return (
    <>
      <h5>Success</h5>
      <p style={{ marginBottom: "20px" }}>Amount: {props.status}</p>
      <button
        type="submit"
        className="btn btn-light"
        onClick={() => {
          props.setShow(true);
          props.setStatus("");
        }}
      >
        Withdraw again
      </button>
    </>
  );
}

function WithdrawForm(props) {
  const [amount, setAmount] = React.useState("");
  const [amountError, setAmountError] = React.useState("");

  function handle() {
    // Round the amount to two decimal places
    const roundedAmount = parseFloat(amount).toFixed(2);

    fetch(`/account/update/${props.userEmail}/-${roundedAmount}`)
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => {
        if (data.ok === 1 && data.lastErrorObject.n === 1) {
          props.setStatus(data.value.balance.toString()); // Update with the new balance
          props.setShow(false);
        } else {
          props.setStatus("Withdrawal failed");
        }
      })
      .catch((err) => {
        props.setStatus("Withdrawal failed");
        console.log("Fetch error:", err);
      });
  }

  function handleAmountChange(value) {
    // Check if the entered value has more than two decimal places
    if (value.includes(".") && value.split(".")[1].length > 2) {
      setAmountError("Please enter up to two decimal places only.");
    } else {
      setAmountError("");
      setAmount(value);
    }
  }

  return (
    <>
      Amount
      <br />
      <input
        type="text"
        className="form-control"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => handleAmountChange(e.currentTarget.value)}
      />
      {amountError && <div style={{ color: "red" }}>{amountError}</div>}{" "}
      {/* Display error message */}
      <br />
      <button type="submit" className="btn btn-light" onClick={handle}>
        Withdraw
      </button>
    </>
  );
}
