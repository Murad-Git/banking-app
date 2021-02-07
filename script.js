'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    // '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-12-30T14:11:59.604Z',
    '2021-01-27T17:01:17.194Z',
    '2021-01-28T23:36:17.929Z',
    '2021-01-29T10:51:36.790Z',
    '2021-01-30T10:51:36.790Z',
    // '2020-05-27T17:01:17.194Z',
    // '2020-07-11T23:36:17.929Z',
    // '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Murad Kos',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2020-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2020-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'en-GB',
};

const account4 = {
  owner: 'Aleksander Kos',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 4444,

  movementsDates: [
    '2020-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2020-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'PLN',
  locale: 'PL',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Calculate functions ----------

// Calculate days
const formatMovementDate = function (date, local) {
  const calcDaysPassed = (date1, date2) =>
    Math.abs(Math.round((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed < 7) return `${daysPassed} days ago`;
  if (daysPassed === 7) return `a week ago`;
  if (daysPassed > 8) {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = `${date.getFullYear()}`;
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(local).format(date);
  }

  console.log(daysPassed);
};

// Formatting currency
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Display and sort movements
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  // Sort movements
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  // Add all movements rows
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // Setting date for movements
    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMovementDate(date, account.locale);
    const formattedMov = formatCur(mov, account.locale, account.currency);
    // Add movement rows to history
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>;`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display the current balance
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  const formattedMov = formatCur(
    account.balance,
    account.locale,
    account.currency
  );
  labelBalance.textContent = `${formattedMov}`;
};

// Display all Incomes,Outcomes and interst
const calcDisplaySummary = function (account) {
  // Incomes
  if (account.movements.find(mov => mov > 0)) {
    const incomes = account.movements
      .filter(mov => mov > 0)
      .reduce((acc, cur) => acc + cur);
    labelSumIn.textContent = formatCur(
      incomes,
      account.locale,
      account.currency
    );
  } else {
    labelSumOut.textContent = `${0}€`;
  }

  // Outcomes
  if (account.movements.find(mov => mov < 0)) {
    const outcomes = account.movements
      .filter(mov => mov < 0)
      .reduce((acc, cur) => acc + cur);
    labelSumOut.textContent = formatCur(
      Math.abs(outcomes),
      account.locale,
      account.currency
    );
  } else {
    labelSumOut.textContent = `${0}€`;
  }

  // Interest
  if (account.movements.find(mov => mov > 0)) {
    const interest = account.movements
      .filter(mov => mov > 0)
      .map(deposit => (deposit * account.interestRate) / 100)
      .filter(int => int >= 1)
      .reduce((acc, int) => acc + int);
    labelSumInterest.textContent = formatCur(
      interest,
      account.locale,
      account.currency
    );
  } else {
    labelSumOut.textContent = `${0}€`;
  }
};

// Display current date
const now = new Date();

const displayCurDate = function (acc) {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // weekday: 'long',
  };
  // const locale = navigator.language;
  const locale = acc.locale;
  labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);
};

// const displayCurDate = function () {
//   const day = `${now.getDate()}`.padStart(2, 0);
//   const month = `${now.getMonth() + 1}`.padStart(2, 0);
//   const year = `${now.getFullYear()}`;
//   const hour = `${now.getHours()}`.padStart(2, 0);
//   const minutes = `${now.getMinutes()}`.padStart(2, 0);
//   labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;
// };

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// Create username methods to login
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

const updateUI = function (account) {
  // Display movements
  displayMovements(account);
  // Display balance
  calcDisplayBalance(account);
  // Display summary
  calcDisplaySummary(account);
  // Display Date
  displayCurDate(account);
  // Timer
  if (timerInter) clearInterval(timerInter);
  timerInter = startLogOutTimer();
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(timer / 60)).padStart(2, 0);
    const sec = String(timer % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 => stop timer and log out user
    if (timer === 0) {
      // stop timer
      clearInterval(timerInter);
      // exit UI
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    timer--;
  };
  let timer = 300;
  // Call the timer every second
  tick();
  const timerInter = setInterval(tick, 1000);
  return timerInter;
};

/////////////////////////////////////////
// Event handlers --------------
let currectAccount, timerInter;

// Fake logging in
// currectAccount = account1;
// updateUI(currectAccount);
// containerApp.style.opacity = 100;

// Logging In to bank
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currectAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // Check the user
  if (currectAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome Back, ${
      currectAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    // Update UI
    updateUI(currectAccount);
    console.log(`Correct Pin`);
  } else {
    console.log(`Incorrect Pin 👎`);
  }
});

// Transfer money
btnTransfer.addEventListener('click', e => {
  // Prevent form from submitting
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const transferUser = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    currectAccount.balance >= amount &&
    transferUser !== currectAccount.username &&
    amount > 0 &&
    transferUser
  ) {
    // Add amount to transfer user
    transferUser.movements.push(amount);
    // Add transfer date
    transferUser.movementsDates.push(new Date().toISOString());
    currectAccount.movementsDates.push(new Date().toISOString());
    console.log(`Succesfully sent ${amount}€ to ${transferUser.owner}`);
    // Decrease balance
    currectAccount.movements.push(amount * -1);

    // Update UI
    updateUI(currectAccount);
  } else {
    console.log(`Incorrect data 🙈`);
  }

  // Clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
});

// Loan
btnLoan.addEventListener('click', e => {
  // Prevent form from submitting
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (
    currectAccount.movements.some(mov => mov > 0) &&
    currectAccount.movements.some(mov => mov * 10 >= amount && amount > 0)
  ) {
    setTimeout(() => {
      // Add deposit to Acc
      currectAccount.movements.push(amount);
      // Add transfer date
      currectAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currectAccount);
      console.log(`Loan Approved😍`);
    }, 3000);

    // Clear fields
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  } else {
    inputLoanAmount.value = '';
    console.log(`Loan rejected😑, incorrect amount`);
  }
});

// Sort movements button
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currectAccount, !sorted);
  sorted = !sorted;
});

// Close account
btnClose.addEventListener('click', e => {
  // Prevent form from submitting
  e.preventDefault();

  if (
    inputCloseUsername.value === currectAccount.username &&
    +inputClosePin.value === currectAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currectAccount.username
    );
    console.log(`Success!`);

    // Delete acc from accounts
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;

    // Clear input fields
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
    inputCloseUsername.blur();

    labelWelcome.textContent = 'Log in to get started';
  } else {
    console.log(`Incorrect credentials`);
  }
});

// My Code

// let initialsCheck = function (person) {
//   let persArray = person.owner.split(' ');
//   let initials = persArray.map(value => value[0]);
//   initials = initials.join('');
//   return initials;
// };
// let check = initialsCheck(account1);

// // console.log(check);

// let listOfInitials = [];

// let authorizationCheck = function (accounts) {
//   for (let i = 0; i < accounts.length; i++) {
//     let initCheck = initialsCheck(accounts[i]);
//     listOfInitials.push(initCheck);
//     // console.log(initCheck);
// };
// authorizationCheck(accounts);
// console.log(listOfInitials);

// // let str1 = test1.map(value => {
// //   return value[0];
// // });
// // console.log(str1.join(''));

// /////////////////////////////////////////////////
// Slice
// let arr = [2, 54, 5, 3, 3]; // first  points the beginning, the second the end
// console.log(arr.slice(2, 5));

// // Splice - mutate the original var
// console.log(arr.splice(2, 3)); //First is from which index, second how much indexex it should impact
// arr.splice(-1);
// console.log(arr);

// // Reverse - mutate
// arr = [2, 54, 5, 3, 3];
// let arr1 = [9, 8, 7, 6, 5, 4, 3, 2, 1];
// console.log(arr1.reverse());
// console.log(arr1);

// // Concat - concatinate(+) two arrays NOT mutate
// console.log(arr, arr1);
// console.log(arr.concat(arr1));

// // Join - result is the string with separater
// console.log(arr1.join(' - '));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}$`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}$`);
//   }
// }

// movements.forEach(function (movement) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}$`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}$`);
//   }
// });

// Map;
// currencies.forEach(function (value, key, map) {
//   console.log(`${value}: ${key}`);
// });

// // Set
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${value}: ${key}`);
// });

// Code challange #1
// let dogsJulia = [3, 5, 2, 12, 7];
// let dogsKate = [4, 1, 15, 8, 3];
// let dogsJulia2 = [9, 16, 6, 8, 3];
// let dogsKate2 = [10, 5, 6, 1, 4];

// let checkDogs = function (arr1, arr2) {
//   let newDogsJulia = arr1.slice(1, 3);
//   console.log(newDogsJulia);
//   console.log(arr1);

//   let correctDogs = newDogsJulia.concat(arr2);
//   console.log(correctDogs);

//   correctDogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppu 🐶`);
//     }
//   });
// };

// let checkJulia = checkDogs(dogsJulia, dogsKate);
// console.log(checkJulia);

// console.log(`The second time ------------------------------`);

// checkJulia = checkDogs(dogsJulia2, dogsKate2);
// console.log(checkJulia);

// const eurToUsd = 1.1;
// const movementsUSD = movements.map(mov => parseInt(mov * eurToUsd));
// // console.log(movements, movementsUSD);

// const movementsUSDFor = [];

// for (const mov of movements) movementsUSDFor.push(parseInt(mov * eurToUsd));

// // console.log(movementsUSDFor);

// const dogsJuliaMap = dogsJulia.map((dog, i) => {
//   if (dog >= 3) {
//     return `Dog number ${i + 1} is an adult, and is ${dog} years old`;
//   } else {
//     return `Dog number ${i + 1} is still a puppu 🐶`;
//   }
// });

// console.log(dogsJuliaMap);

// const deposits = movements.filter(mov => mov > 0);
// const withdrawals = movements.filter(mov => mov < 0);

// console.log(deposits);
// console.log(withdrawals);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);

// console.log(`the current balance is ${balance}€`);

// Max value
// const maxValue = movements.reduce((acc, mov) => {
//   if (mov > acc) acc = mov;
//   return acc;
// }, 0);
// console.log(movements);
// console.log(maxValue);

// // CodeChallange#2 Map,Filter,Reduce

const dogsAges = [5, 2, 4, 1, 15, 8, 3];
const dogsAges2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(dog => (dog <= 2 ? dog * 2 : dog * 4 + 16));
//   console.log(humanAges);
//   const filteredAges = humanAges.filter(age => age >= 18);
//   console.log(filteredAges);
//   // const avAges = filteredAges.reduce((acc, cur, i, arr) => {
//   //   acc += cur;
//   //   if (i === arr.length - 1) {
//   //     return acc / arr.length;
//   //   } else {
//   //     return acc;
//   //   }
//   // }, 0);
//   const avAges =
//     filteredAges.reduce((acc, cur) => acc + cur) / filteredAges.length;
//   console.log(avAges);
// };
// console.log(dogsAges);
// calcAverageHumanAge(dogsAges);
// console.log(dogsAges2);
// calcAverageHumanAge(dogsAges2);

// const calcAverHumanRow = ages =>
//   ages
//     .map(age => (age <= 2 ? age * 2 : age * 4 + 16))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// const av1 = calcAverHumanRow(dogsAges);
// const av2 = calcAverHumanRow(dogsAges2);
// console.log(av1, av2);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// const findOneElement = function (accounts) {
//   for (const acc of accounts) {
//     if (acc.owner === 'Jessica Davis') {
//       return acc;
//     }
//   }
// };

// let foundElement = findOneElement(accounts);
// console.log(foundElement);

// Some
// let anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

// // Every
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));
// console.log(`Separate Callback------------------------`);
// // Separate callback
// let deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// let arr = [[1, 2, 3], [4, 5, 6], 8, 9, 10];
// console.log(arr.flat());
// let arrDeep = [[[1, 2], 3], [4, [5, 6]], 8, 9, 10];
// console.log(arrDeep.flat(2));

// Flat;
// let accountMovements = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, cur) => acc + cur, 0);

// console.log(accountMovements);

// // FlatMap
// let accountMovements2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov);
// // console.log(accountMovements2);

// // Sort
// // return <0, A,B (keep order)
// // return >0, B,A (switch order)
// let owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// let numbersArr = [1, 6, -9, 8, 4, -3, 2, 0, 10, -11, 22, 12];
// console.log(owners.sort());
// console.log(numbersArr.sort((a, b) => a - b));
// console.log(numbersArr);

// Create Arrays

// let newArr1 = new Array(1, 2, 3, 4, 5, 6, 7);

// let x = new Array(7);
// x.fill(1, 3, 5); //1 - number which fills array; 3 - the beginning of filling (included); 5 - end of filling (not included); Like slice()
// console.log(x);

// newArr1.fill(23, 2, 6);
// console.log(newArr1);

// // Array.from
// let y = Array.from({ length: 7 }, () => 1); //Better
// console.log(y);

// let z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// // Challange 100 random dices
// let r = Array.from({ length: 100 }, () => {
//   let rNumber = Math.round(Math.random() * 5 + 1);
//   return rNumber;
// });
// console.log(r);

// Extract movemements from UI
// labelBalance.addEventListener('click', function () {
//   const movemementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movemementsUI);
// });

// Challange #4 (Last in arrays)

// const dogs = [
//   {
//     weight: 22,
//     curFood: 250,
//     owners: ['Alice', 'Bob'],
//   },
//   {
//     weight: 8,
//     curFood: 200,
//     owners: ['Matilda'],
//   },
//   {
//     weight: 13,
//     curFood: 275,
//     owners: ['Sarah', 'John'],
//   },
//   {
//     weight: 32,
//     curFood: 340,
//     owners: ['Michael'],
//   },
// ];

// // 1. Find recommended food weight
// dogs.forEach(dog => {
//   dog.recFood = Math.trunc(dog.weight ** 0.75 * 28);
// });
// console.log(dogs);

// // 2. Find whether Sarah's dogs eats well
// dogs.map(dog =>
//   dog.owners.find(owner => {
//     if (owner === 'Sarah') {
//       if (dog.recFood > dog.curFood) {
//         console.log(
//           `${owner} dog's eats too little. Recommended: ${dog.recFood}, current: ${dog.curFood}`
//         );
//       } else {
//         console.log(
//           `${owner} dog's eats too much. Recommended: ${dog.recFood}, current: ${dog.curFood}`
//         );
//       }
//     }
//   })
// );
// // Answer
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(dogSarah);

// console.log(
//   `Sarah's dog is easting too ${
//     dogSarah.curFood > dogSarah.recFood ? 'Much' : 'Little'
//   }`
// );

// // 3. Create 2 arrays with owners
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recFood)
//   .flatMap(dog => dog.owners);

// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recFood)
//   .flatMap(dog => dog.owners);

// console.log(ownersEatTooLittle);

// // 4. Log to the consol owners with dogs who eats too much or too little
// console.log(`${ownersEatTooLittle.join(' and ')}\'s dogs eat too little!`);
// console.log(`${ownersEatTooMuch.join(' and ')}\'s dogs eat too much!`);

// // 5. log to the consol whether dog eating exactly curFood === recFood the amount of food that is recommemded (true or false);

// dogs.filter(dog => {
//   if (dog.curFood === dog.recFood) {
//     console.log(dog);
//   } else {
//     console.log(`There is no such dog`);
//   }
// });

// console.log(dogs.some(dog => dog.curFood === dog.recFood));

// // 6. log to the consol whether dog eating OK (current>recommended*0.9 && current<recommended*1.1) between 90% and 110% the amount of food (true or false);

// dogs.filter(dog => {
//   if (dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1) {
//     console.log(
//       `${dog.owners}\'s dog eats OK amount of food. RecFood: ${dog.recFood}, CurFood: ${dog.curFood}`
//     );
//   } else {
//     console.log(
//       `${dog.owners}\'s dog does Not eat OK amount of food. RecFood: ${dog.recFood}, CurFood: ${dog.curFood}`
//     );
//   }
// });

// console.log(
//   dogs.some(
//     dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
//   )
// );
// // 7. Create Array containing eating OK. Reuse 6
// const dogsEatsOK = dogs
//   .filter(dog => {
//     if (dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1) {
//       return dog;
//     }
//   })
//   .map(dog => dog.owners)
//   .flat();

// console.log(dogsEatsOK);

// // 8. Shallow copy dogs array and sort by recFood in ascending order
// const sortByRec = dogs
//   .slice()
//   .map(dog => dog.recFood)
//   .sort((a, b) => a - b);

// console.log(sortByRec);

// const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
// console.log(dogsSorted);

// Next lecture. Section 12: numbers, dates, intl and timers =====================================================================

// Conversion
// console.log(Number('23'));
// console.log(+'23');

// // Parsing
// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseFloat('2.5rem', 10));

// console.log(Number.parseInt('2.5rem', 10));
// console.log(Number.isNaN(+'20X'));
// console.log(Number.isNaN(23 / 0));

// //
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));

// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.0));

// // Numbers;
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(5 ** 2);

// console.log(Math.max(5, 18, '23', 11, 6, 43, 43));
// console.log(Math.min(5, 18, '23', 11, 6, 43, 43));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);
// console.log(Math.trunc(Math.random() * 6 + 1));

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min; // with floor it works in neg and pos sides
// console.log(randomInt(10, 20));

// Rounding Int
// console.log(Math.trunc(23.3)); //delete decimal part
// console.log(Math.round(23.5)); //round nearest
// console.log(Math.ceil(23.2)); //round Up
// console.log(Math.floor(23.9)); // round down
// console.log(Math.trunc(-23.4));
// console.log(Math.floor(-23.4));

// // Rounding decimals
// console.log(+(2.7).toFixed(0)); // return string

// CordeWars
// function iqTest(numbers) {
//   let numArr = numbers.split(' ');
//   let oddNums = [];
//   let evenNums = [];
//   for (const num of numArr) {
//     if (Number(num) % 2 === 0) {
//       evenNums.push(Number(num));
//     } else {
//       oddNums.push(Number(num));
//     }
//   }
//   if (oddNums.length < evenNums.length) {
//     return Number(numArr.indexOf(oddNums[0].toString()) + 1);
//   } else {
//     return Number(numArr.indexOf(evenNums[0].toString()) + 1);
//   }
// }
// console.log(iqTest('2 4 7 8 10'));

// Dates
// console.log(
//   now.getTime(),
//   now.getFullYear(),
//   now.getDate(),
//   now.getMonth() + 1,
//   now.getDay(),
//   now.getHours(),
//   now.getMinutes(),
//   now.toISOString()
// );
// console.log(now.getHours());

// let twoYearsAgo = new Date(2019, 10, 19, 15, 23);

// console.log(Date(+now - twoYearsAgo));

// const checkDates = calcDaysPassed(
//   new Date(2019, 10, 19),
//   new Date(2019, 10, 4)
// );
// console.log(checkDates);

// setTimeOut
// setTimeout(() => {
//   console.log(`Here is your Pizza🍕`);
//  }, 1000);
// const ingredients = ['olives', ''];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => {
//     console.log(`Here is your Pizza🍕 with ${ing1} and ${ing2}`);
//   },
//   3000,
//   ...ingredients
// );
// console.log(`Waiting...`);
// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// setInterval
setInterval(() => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  // console.log(`${hours}:${minutes}:${seconds}`);
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  // console.log(new Intl.DateTimeFormat('en-AU', options).format(now));
}, 1000);
