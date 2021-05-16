console.time("Execution Time:");

const fs = require('fs');

// Get files path from arguments
const suppliersFile = process.argv[2] + 'fornecedores.csv';
const deliveryFile = process.argv[2] + 'frete.csv';
const itensFile = process.argv[3];

let itemsArr = fs.readFileSync(itensFile).toString().split('\n');
itemsArr = itemsArr.filter(el => {
  return el != null && el != '';
});

let suppliersObj = {};

let deliveryArr = fs.readFileSync(deliveryFile).toString().split('\n');
// Remove CSV headers
deliveryArr.shift();

deliveryArr.forEach(function (lineStr) {
  if (lineStr == '') return;
  const line = lineStr.split(',');
  const supplier = line[0];
  const price = line[1];

  suppliersObj[supplier] = {
    name: supplier,
    items: {},
    delivery: price
  };
});

let suppliersArr = fs.readFileSync(suppliersFile).toString().split('\n');

// Remove CSV headers
suppliersArr.shift();

suppliersArr.forEach(function (lineStr) {
  if (lineStr == '') return;

  const line = lineStr.split(',');
  const item = line[0];
  const supplier = line[1];
  const price = line[2];

  if (!suppliersObj[supplier]) {
    return;
  }

  suppliersObj[supplier]['items'][item] = price;
});

// Turn suppliers objects into an array of objects to get their indexes
suppliersArr = Object.keys(suppliersObj).map((key) => {
  return suppliersObj[key];
});

// Build an array with all suppliers indexes
let suppliersInds = [];
for (let i = 0; i < suppliersArr.length; i++) {
  suppliersInds.push(i);
}

// Get all permutations of suppliers indexes
var getPermutations = function (list, maxLen) {
  // Copy initial values as arrays
  var perm = list.map(function (val) {
    return [val];
  });
  // Our permutation generator
  var generate = function (perm, maxLen, currLen) {
    // Reached desired length
    if (currLen === maxLen) {
      return perm;
    }
    // For each existing permutation
    for (var i = 0, len = perm.length; i < len; i++) {
      var currPerm = perm.shift();
      // Create new permutation
      for (var k = 0; k < list.length; k++) {
        perm.push(currPerm.concat(list[k]));
      }
    }
    // Recurse
    return generate(perm, maxLen, currLen + 1);
  };
  // Start with size 1 because of initial values
  return generate(perm, maxLen, 1);
};

let possiblePaths = getPermutations(suppliersInds, itemsArr.length);

const totalPrice = function (selectedSuppliers) {

  const uniqueSuppliers = selectedSuppliers.filter((v, i, a) => a.indexOf(v) === i);

  let deliveryFee = 0;
  uniqueSuppliers.forEach((supplier) => {
    deliveryFee += parseInt(suppliersArr[supplier].delivery);
  });

  let itemsPrices = 0;

  let error = false;

  selectedSuppliers.forEach((supplier, itemIndex) => {

    const item = itemsArr[itemIndex];

    if (!suppliersArr[supplier].items[item]) {
      error = true;
      return NaN;
    }

    itemsPrices += parseInt(suppliersArr[supplier].items[item]);
  });

  if (error) return NaN;

  return itemsPrices + deliveryFee;
};

const getMinimum = function () {
  var minimum = {
    path: null,
    total: null
  };

  possiblePaths.forEach(function (path) {

    let total = totalPrice(path);

    if (isNaN(total)) return;

    if (minimum.total == null || total < minimum.total) {
      minimum = {
        path,
        total
      };
    }

  });

  return minimum;
};

let minimumTotal = getMinimum();

const printInfo = function (obj) {

  let { path, total } = obj;

  console.log("Lista de Compras:");

  console.log("[Item]\t\t[Fornecedor]");
  for (let i = 0; i < path.length; i++) {
    console.log(itemsArr[i] + "\t\t" + suppliersArr[path[i]].name);
  }

  console.log("\nPreço total: R$ " + total.toFixed(2));

};

console.timeEnd("Execution Time:");

console.log(minimumTotal);
printInfo(minimumTotal);
