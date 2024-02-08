function Transfer() {
    const [show, setShow] = React.useState(true);
    const [status, setStatus] = React.useState("");
    const [recipientEmail, setRecipientEmail] = React.useState("");
    const [amount, setAmount] = React.useState("");
    const [amountError, setAmountError] = React.useState("");
  
    // Retrieve user data from local storage
    const userData = JSON.parse(localStorage.getItem("user"));
    const senderEmail = userData ? userData.email : "";
  
    function handleTransfer() {
      // Round the amount to two decimal places
      const roundedAmount = parseFloat(amount).toFixed(2);
  
      // Make the transfer
      const url = `/account/transfer?senderEmail=${encodeURIComponent(senderEmail)}&recipientEmail=${encodeURIComponent(recipientEmail)}&amount=${encodeURIComponent(roundedAmount)}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setStatus(data.message || "Transfer failed");
          setShow(false);
          // Check if transfer was successful and redirect
          if (data.message === "Transfer successful") {
            handleRedirect();
          }
        })
        .catch((error) => {
          console.error("Error transferring money:", error);
          setStatus("Transfer failed");
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
  
    function handleRedirect() {
      window.location.href = "/#/balance"; // Redirect to balance page
      window.location.reload(); // Refresh the page
    }
  
    return (
      <Card
        bgcolor="dark"
        header="Transfer"
        body={
          show ? (
            <>
              <label>Recipient Email</label>
              <br />
              <input
                type="text"
                className="form-control"
                placeholder="Enter recipient email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.currentTarget.value)}
              />
              <br />
              <label>Amount</label>
              <br />
              <input
                type="text"
                className="form-control"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => handleAmountChange(e.currentTarget.value)}
              />
              {amountError && <div style={{ color: "red" }}>{amountError}</div>}
              <br />
              <button
                type="submit"
                className="btn btn-light"
                onClick={handleTransfer}
              >
                Transfer
              </button>
            </>
          ) : (
            <TransferMsg
              status={status}
              setShow={setShow}
              setStatus={setStatus}
            />
          )
        }
      />
    );
  }
  
  function TransferMsg(props) {
    return (
      <>
        <h5>{props.status}</h5>
      </>
    );
  }
