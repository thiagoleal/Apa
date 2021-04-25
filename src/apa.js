const suppliers = [
  {
    'name': 'Peruzzo',
    'items': {
      'maça': 3,
      'laranja': 6,
      'tomate': 5,
      'camarao': 8,
    },
    'delivery': 8,
  },
  {
    'name': 'Big',
    'items': {
      'banana': 7,
      'maça': 3,
      'laranja': 5,
      'tomate': 6,
      'feijao': 4,
      'camarao': 9,
    },
    'delivery': 12,
  },
  {
    'name': 'Nacional',
    'items': {
      'banana': 2,
      'laranja': 8,
      'tomate': 12,
      'feijao': 6,
    },
    'delivery': 9,
  },
  {
    'name': 'Nicolini',
    'items': {
      'maça': 5,
      'laranja': 3,
      'banana': 6,
      'tomate': 6,
      'feijao': 11,
      'camarao': 8,
    },
    'delivery': 13,
  },
  {
    'name': 'teste',
    'items': {
      'maça': 5,
      'laranja': 3,
      'banana': 6,
      'tomate': 6,
      'feijao': 11,
      'camarao': 8,
      'a': 10,
      'aa': 10,
      'aaa': 10,
      'aaaa': 10,
      'aaaaa': 10,
      'aaaaaa': 10,
      'aaaaaaa': 10,
      'aaaaaaaa': 10,
      'aaaaaaaaa': 10,
      'aaaaaaaaaa': 10,
    },
    'delivery': 13,
  },
];

// Items to buy
const items = ['banana', 'maça', 'tomate', 'a', 'aa', 'aaa', 'aaaa', 'aaaaa', 'aaaaaa', 'aaaaaaa', 'aaaaaaaa'];

//console.log('i  s  array');

/**
 * @param item => current item index
 * @param supplier => current supplier index
 * @param selectedSuppliers => array with selected suppliers in the form:
 *    item0  ,   item1  , ...,   itemN
 * [supplier0, supplier1, ..., supplierN]
 */
const bestBuy = function (item, supplier, selectedSuppliers) {

  if (selectedSuppliers.length == items.length) {
    return totalPrice(selectedSuppliers);
  } else if (item == items.length || supplier == suppliers.length) {
    if (selectedSuppliers.length != items.length) {
      return NaN;
    }
    return totalPrice(selectedSuppliers);
  }


  // If not going to buy this item
  const nextItem = item + 1;

  // If going to buy this item
  const newSelectedSuppliers = [...selectedSuppliers];
  newSelectedSuppliers.push(supplier);

  const nextSupplier = supplier + 1;


  let resp = `${item}  ${supplier}  [${selectedSuppliers}]`;

  // Check if supplier has current item
  const itemName = items[item];
  if (suppliers[supplier].items[itemName] == null) {
    // If true, it can only go to next supplier

    //test
    const resposta = bestBuy(item, nextSupplier, selectedSuppliers);
    //console.log(`${resp} \t${resposta}`);
    return resposta;
  }

  // If supplier has item it can que selected or not

  // Return best buy (smaller total price)

  // return mininum(
  //   // Going to buy this item -> go to next item with first supplier
  //   bestBuy(nextItem, 0, newSelectedSuppliers),
  //   // Not going to buy this item -> stay in this item with next supplier
  //   bestBuy(item, nextSupplier, selectedSuppliers)
  // );

  //test
  const resposta = mininum(
    // Going to buy this item -> go to next item with first supplier
    bestBuy(nextItem, 0, newSelectedSuppliers),
    // Not going to buy this item -> stay in this item with next supplier
    bestBuy(item, nextSupplier, selectedSuppliers)
  );

  //console.log(`${resp} \t${resposta}`);
  return resposta;
};

const totalPrice = function (selectedSuppliers) {
  const uniqueSuppliers = selectedSuppliers.filter((v, i, a) => a.indexOf(v) === i);

  let deliveryFee = 0;
  uniqueSuppliers.forEach((supplier) => {
    deliveryFee += suppliers[supplier].delivery;
  });

  let itemsPrices = 0;
  selectedSuppliers.forEach((supplier, itemIndex) => {
    const item = items[itemIndex];

    itemsPrices += suppliers[supplier].items[item];
  });

  const total = itemsPrices + deliveryFee;

  return total;
};

const mininum = function (value1, value2) {
  if (isNaN(value1) || value1 == null) {
    return value2;
  } else if (isNaN(value2) || value2 == null) {
    return value1;
  }

  return Math.min(value1, value2);
};

const test = bestBuy(0, 0, []);

console.log(test);