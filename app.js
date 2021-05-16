console.time("Execution Time:");

const fs = require('fs');

/** Functions **/


/**
 * Get all permutations of an array
 * @param list => array
 * @param maxLen => length of permutations
 * @return array with all possible permutations
 */
var getPermutations = function (list, maxLen) {
  // Copy initial values as arrays
  var perm = list.map(function (val) {
    return [val];
  });
  // Permutation generator
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

/**
 * Get total delivery fee
 * @param selSuppliers => array with selected items suppliers
 * @return delivery fee for informed suppliers
 */
const getDeliveryFee = function (selSuppliers) {
  const uniqueSuppliers = selSuppliers.filter((v, i, a) => a.indexOf(v) === i);

  if (memoDelivery[uniqueSuppliers]) {
    return memoDelivery[uniqueSuppliers];
  }

  let deliveryFee = 0;
  uniqueSuppliers.forEach((supplier) => {
    deliveryFee += parseInt(suppliersArr[supplier].delivery);
  });

  memoDelivery[uniqueSuppliers] = deliveryFee;

  return memoDelivery[uniqueSuppliers];
};

// Get total items price by adding current item price to the last price calculated
/**
 * Get total by items price by adding current item price to the last items prices calculated
 * @param selSuppliers => array with selected items suppliers
 * @return total price for informed items
 */
const getItemsPrice = function (selSuppliers) {
  // Get current item and supplier data
  const currSupplierInd = selSuppliers[selSuppliers.length - 1];
  const currItemInd = selSuppliers.length - 1;
  const currItemName = itemsArr[currItemInd];
  const currItemPrice = suppliersArr[currSupplierInd]['items'][currItemName];

  // If supplier doesn't have current item, return -1
  if (!currItemPrice) {
    memoItems[selSuppliers] = -1;
    return memoItems[selSuppliers];
  };

  // If it's the first item
  if (currItemInd == 0) {
    memoItems[selSuppliers] = currItemPrice;
    return memoItems[selSuppliers];
  }

  // Get previous selected suppliers
  let prevSelSuppliers = selSuppliers.slice(0, -1);

  // Check previous calculated items price
  prevItemsPrice = memoItems[prevSelSuppliers];

  // If price hasn't been calculated, recurses
  if (!prevItemsPrice) {
    prevItemsPrice = getItemsPrice(prevSelSuppliers);
  }

  if (prevItemsPrice == -1) {
    memoItems[selSuppliers] = -1;
  } else {
    memoItems[selSuppliers] = prevItemsPrice + currItemPrice;
  }

  return memoItems[selSuppliers];
};

/**
 * Get minimum total price from all possibles
 * @return objected containing path, items price, delivery fee and total price
 */
const getMinimumTotalPrice = function () {
  var minimum = null;

  possiblePaths.forEach(function (path) {

    let deliveryFee = getDeliveryFee(path);
    let itemsPrice = getItemsPrice(path);

    if (itemsPrice == -1) return;

    let total = deliveryFee + itemsPrice;

    if (minimum == null || total < minimum.total) {
      minimum = {
        path,
        deliveryFee,
        itemsPrice,
        total
      };
    }

  });

  return minimum;
};

/**
 * Prints detailed info
 * @param obj objected containd path, delivery fee, items price and total price
 */
const printInfo = function (obj) {

  let { path, deliveryFee, itemsPrice, total } = obj;

  console.log("Lista de Compras:");

  console.log("[Item]\t\t[Fornecedor]");
  for (let i = 0; i < path.length; i++) {
    console.log(itemsArr[i] + "\t\t" + suppliersArr[path[i]].name);
  }

  console.log("\nTotal dos itens: R$ " + itemsPrice.toFixed(2));
  console.log("Frete: R$ " + deliveryFee.toFixed(2));
  console.log("Preço total: R$ " + total.toFixed(2));

};

/** /Functions **/


/**
 Script call example:
  npm start data/casoA data/itens/2itens.csv
 */


// Get files paths from command line arguments
const suppliersFile = process.argv[2] + 'fornecedores.csv';
const deliveryFile = process.argv[2] + 'frete.csv';
const itensFile = process.argv[3];

// Get items to buy from file
let itemsArr = fs.readFileSync(itensFile).toString().split('\n');
// Remove blank spaces
itemsArr = itemsArr.filter(el => {
  return el != null && el != '';
});

// Get delivery fees from file
let deliveryArr = fs.readFileSync(deliveryFile).toString().split('\n');
// Remove CSV headers
deliveryArr.shift();


let suppliersObj = {};

// First build suppliers object from delivery fees array
deliveryArr.forEach(function (lineStr) {
  if (lineStr == '') return;
  const line = lineStr.split(',');
  const supplier = line[0];
  const price = parseInt(line[1]);

  suppliersObj[supplier] = {
    name: supplier,
    items: {},
    delivery: price
  };
});

// Read suppliers from file
let suppliersArr = fs.readFileSync(suppliersFile).toString().split('\n');
// Remove CSV headers
suppliersArr.shift();

// Iterate array of read suppliers
suppliersArr.forEach(function (lineStr) {
  if (lineStr == '') return;

  const line = lineStr.split(',');
  const item = line[0];
  const supplier = line[1];
  const price = parseInt(line[2]);

  // If supplier object wasn't initialized with delivery fees file
  if (!suppliersObj[supplier]) {
    return;
  }

  suppliersObj[supplier]['items'][item] = price;
});

// Turn suppliers into an array of objects to get their indexes
suppliersArr = Object.keys(suppliersObj).map((key) => {
  return suppliersObj[key];
});

// Build another array with all suppliers indexes
let suppliersInds = [];
for (let i = 0; i < suppliersArr.length; i++) {
  suppliersInds.push(i);
}

// Get all possible paths
let possiblePaths = getPermutations(suppliersInds, itemsArr.length);

let memoItems = {};
let memoDelivery = {};

const minimumTotal = getMinimumTotalPrice();

console.timeEnd("Execution Time:");

printInfo(minimumTotal);