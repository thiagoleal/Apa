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
  // {
  //   'name': 'Nicolini',
  //   'items': {
  //     'maça': 5,
  //     'laranja': 3,
  //     'banana': 6,
  //     'tomate': 6,
  //     'feijao': 11,
  //     'camarao': 8,
  //   },
  //   'delivery': 13,
  // },
  // {
  //   'name': 'teste',
  //   'items': {
  //     'maça': 5,
  //     'laranja': 3,
  //     'banana': 6,
  //     'tomate': 6,
  //     'feijao': 11,
  //     'camarao': 8,
  //     'a': 10,
  //     'aa': 10,
  //     'aaa': 10,
  //     'aaaa': 10,
  //     'aaaaa': 10,
  //     'aaaaaa': 10,
  //     'aaaaaaa': 10,
  //     'aaaaaaaa': 10,
  //     'aaaaaaaaa': 10,
  //     'aaaaaaaaaa': 10,
  //     'aaaaaaaaaa': 10,
  //     'aaaaaaaaaa': 10,
  //     'aaaaaaaaaa': 10,
  //     'aaaaaaaaaa': 10,
  //     'aaaaaaaaaa': 10,
  //   },
  //   'delivery': 13,
  // },
  // {
  //   'name': 'teste',
  //   'items': {
  //     'maça': 5,
  //     'laranja': 3,
  //     'banana': 6,
  //     'tomate': 6,
  //     'feijao': 11,
  //     'camarao': 8,
  //     'a': 10,
  //     'aa': 10,
  //     'aaa': 10,
  //     'aaaa': 10,
  //     'aaaaa': 10,
  //     'aaaaaa': 10,
  //     'aaaaaaa': 10,
  //     'aaaaaaaa': 10,
  //     'aaaaaaaaa': 10,
  //     'aaaaaaaaaa': 10,
  //     'aaaaaaaaaa': 10,
  //     'aaaaaaaaaa': 10,
  //     'aaaaaaaaaa': 10,
  //     'aaaaaaaaaa': 10,
  //     'aaaaaaaaaa': 10,
  //   },
  //   'delivery': 13,
  // },
];

/**
 * salvando o preço total do array de fornecedores escolhidos
 * [1] = 18
 * [1,5]= 18 + 20
 * [1,5,1]= 38 + 5
 */

// Items to buy
//const items = ['banana', 'maça', 'tomate', 'a', 'aa', 'aaa', 'aaaa', 'aaaaa', 'aaaaaa', 'aaaaaaa', 'aaaaaaaa'];
const items = ['banana', 'maça', 'tomate'];

let prices = {};

let buffer = [];

/**
 * @param item => current item index
 * @param supplier => current supplier index
 * @param selectedSuppliers => array with selected suppliers in the form:
 *    item0  ,   item1  , ...,   itemN
 * [supplier0, supplier1, ..., supplierN]
 */
const selectItems = function (item, supplier, selectedSuppliers) {
  //test
  let resp = `${item}  ${supplier}  [${selectedSuppliers}]`;

  if (item == items.length || supplier == suppliers.length) {
    if (selectedSuppliers.length != items.length) {
      //test
      buffer.push(
        `${resp}
  NaN`);
      return NaN;
    }

    //test
    buffer.push(`${resp}
  [${selectedSuppliers}]`);
    return selectedSuppliers;
  }

  // If going to buy this item
  const newSelectedSuppliers = [...selectedSuppliers];
  newSelectedSuppliers.push(supplier);

  const nextSupplier = supplier + 1;

  // If not going to buy this item
  const nextItem = item + 1;

  // Check if supplier has current item
  const itemName = items[item];
  if (suppliers[supplier].items[itemName] == null) {
    // If true, it can only go to next supplier

    //test
    const resposta = selectItems(item, nextSupplier, selectedSuppliers);
    //test
    buffer.push(`${resp}
  [${resposta}]`);
    return resposta;
  }

  const resposta = minimum(
    // Going to buy this item -> go to next item with first supplier
    selectItems(nextItem, 0, newSelectedSuppliers),
    // Not going to buy this item -> stay in this item with next supplier
    selectItems(item, nextSupplier, selectedSuppliers)
  );

  //test
  buffer.push(`${resp}
  [${resposta}]`);
  return resposta;
};

const bestBuy = function () { };

const totalPrice = function (selectedSuppliers) {
  if (!Array.isArray(selectedSuppliers)) {
    return NaN;
  }

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

// const minimum = function (value1, value2) {

//   if (isNaN(value1) || value1 == null) {
//     return value2;
//   } else if (isNaN(value2) || value2 == null) {
//     return value1;
//   }

//   return Math.min(value1, value2);
// };

const minimum = function (array1, array2) {
  const price1 = totalPrice(array1);
  const price2 = totalPrice(array2);

  if (isNaN(price1) || price1 == null) {
    return array2;
  } else if (isNaN(price2) || price2 == null) {
    return array1;
  }

  if (Math.min(price1, price2) == price1) {
    return array1;
  }

  return array2;
};

const test = selectItems(0, 0, []);
const price = totalPrice(test);

console.log(`[${test}] -> ${price}`);


for (let i = buffer.length - 1; i >= 0; i--) {
  console.log(buffer[i]);
  buffer.pop();
}