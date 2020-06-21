const main = document.getElementById("main");
const addUserBtn = document.getElementById("add-user");
const doubleBtn = document.getElementById("double");
const showMillionairesBtn = document.getElementById("show-millionaires");
const sortBtn = document.getElementById("sort");
const calculateWealthBtn = document.getElementById("calculate-wealth");

let data = [];

getRandomUser();
getRandomUser();
getRandomUser();

// fetch random user and add money
async function getRandomUser() {
  const res = await fetch("https://randomuser.me/api");
  const data = await res.json();

  const user = data.results[0];

  const newUser = {
    name: `${user.name.first} ${user.name.last}`,
    money: Math.floor(Math.random() * 3000000),
  };

  addData(newUser);
}

// Add new obj to data arr
function addData(obj) {
  data.push(obj);

  updateDOM();
}

function updateDOM(providedData = data) {
  // Clear main div
  main.innerHTML = "<h2><strong>Person</strong> Wealth</h2>";

  providedData.forEach((item) => {
    const element = document.createElement("div");
    element.classList.add("person");
    element.innerHTML = `<strong>${item.name}</strong> ${formatMoney(
      item.money
    )}`;
    main.appendChild(element);
  });
}

// Format number as money - https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-string
function formatMoney(number) {
  return "$" + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

// Double everyones money
function doubleMoney() {
  data.map((item) => (item.money *= 2));
  updateDOM();
  // map from Author:
  // data = data.map(user => { return ...user, money: user.money * 2 }; });
  // updateDOM();
}

// Shows Millionaires only
function showMillionaires() {
  data = data.filter((item) => item.money > 1000000);
  updateDOM();
}
// Sort users by richest
function sortByRichest() {
  data.sort((a, b) => b.money - a.money);
  updateDOM();
}

// Calculate the entire wealth
function calculateEntireWealth() {
  // Author's function:
  // const wealth = data.reduce((acc, user) => (acc += user.money), 0);

  // My first try
  // const entireWealth = data
  //   .map((item) => item.money)
  //   .reduce((accumulator, currentValue) => accumulator + currentValue);
  // console.log(formatMoney(entireWealth));

  const wealth = data.reduce(
    (accumulator, currentValue) => (accumulator += currentValue.money),
    0
  );

  const wealthEl = document.createElement("div");
  wealthEl.innerHTML = `<h3>Total Wealth: <strong>${formatMoney(
    wealth
  )}</strong></h3>`;

  main.appendChild(wealthEl);
}

addUserBtn.addEventListener("click", getRandomUser);
doubleBtn.addEventListener("click", doubleMoney);
showMillionairesBtn.addEventListener("click", showMillionaires);
sortBtn.addEventListener("click", sortByRichest);
calculateWealthBtn.addEventListener("click", calculateEntireWealth);
