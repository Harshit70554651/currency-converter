
import axios from "axios";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const api_url = "https://open.er-api.com/v6/latest";

async function currencyConverter(from, to, amount) {
  try {
    // Validate amount
    if (!Number.isFinite(amount) || amount <= 0) {
      console.log("Please enter a valid amount greater than 0.");
      return;
    }

    // Clean currency codes
    from = from.trim().toUpperCase();
    to = to.trim().toUpperCase();

    // Fetch exchange rates
    const res = await axios.get(`${api_url}/${from}`);

    // Check API response
    if (res.data.result !== "success") {
      console.log(`Source currency ${from} is invalid.`);
      return;
    }

    const rates = res.data.rates;

    // Check target currency
    if (rates[to] === undefined) {
      console.log(`Currency code ${to} not found.`);
      return;
    }

    // Convert currency
    const converted = amount * rates[to];

    // Display result
    console.log("\n------ Currency Converter ------");
    console.log(
      `${amount} ${from} = ${converted.toFixed(2)} ${to}`
    );
    console.log("--------------------------------");

  } catch (error) {
    console.log(
      "Error fetching exchange rates:",
      error.message
    );
  }
}

// Take input from user
rl.question("Enter Source Currency (e.g. USD): ", (from) => {
  rl.question("Enter Target Currency (e.g. INR): ", (to) => {
    rl.question("Enter Amount to Convert: ", async (amount) => {
      await currencyConverter(from, to, Number(amount));
      rl.close();
    });
  });
});
