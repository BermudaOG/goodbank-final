function Balance() {
  const [balance, setBalance] = React.useState(null);

  // Retrieve user data from local storage
  const userData = JSON.parse(localStorage.getItem("user"));
  const userEmail = userData ? userData.email : "";

  // Fetch balance when component mounts
  React.useEffect(() => {
    fetch(`/account/balance/${userEmail}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.balance !== undefined) {
          // Round the balance to the nearest hundredth decimal
          const roundedBalance = parseFloat(data.balance).toFixed(2);
          setBalance(roundedBalance);
        } else {
          throw new Error("Data format incorrect");
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setBalance("Error fetching balance. Please try again.");
      });
  }, [userEmail]);

  return (
    <Card
      bgcolor="dark"
      header="Balance"
      body={
        <div>
          <p>Balance: {balance !== null ? balance : "Fetching balance..."}</p>
        </div>
      }
    />
  );
}
