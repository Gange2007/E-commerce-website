const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'seed.js');
let content = fs.readFileSync(seedPath, 'utf8');

// Discount percentages to apply based on price vs originalPrice for remaining products
// Products that already have discountPercentage were already updated
const replacements = [
  // Dell XPS 14 Plus
  { from: "price: 185000, originalPrice: 195000, category: electronics._id", to: "price: 185000, originalPrice: 195000, discountPercentage: 5, category: electronics._id" },
  // HP Spectre x360 14
  { from: "price: 165000, originalPrice: 175000, category: electronics._id", to: "price: 165000, originalPrice: 175000, discountPercentage: 6, category: electronics._id" },
  // Lenovo Legion Pro 5i
  { from: "price: 145999, originalPrice: 165999, category: electronics._id", to: "price: 145999, originalPrice: 165999, discountPercentage: 12, category: electronics._id" },
  // Asus ROG Zephyrus G14
  { from: "price: 154990, originalPrice: 169990, category: electronics._id", to: "price: 154990, originalPrice: 169990, discountPercentage: 9, category: electronics._id" },
  // Acer Predator Helios Neo 16
  { from: "price: 109999, originalPrice: 129999, category: electronics._id", to: "price: 109999, originalPrice: 129999, discountPercentage: 15, category: electronics._id" },
  // Apple MacBook Air M3
  { from: "price: 114900, originalPrice: 114900, category: electronics._id", to: "price: 114900, originalPrice: 114900, discountPercentage: 0, category: electronics._id" },
  // HP Pavilion 15
  { from: "price: 62999, originalPrice: 72999, category: electronics._id", to: "price: 62999, originalPrice: 72999, discountPercentage: 14, category: electronics._id" },
  // Lenovo IdeaPad Slim 3
  { from: "price: 54990, originalPrice: 65990, category: electronics._id", to: "price: 54990, originalPrice: 65990, discountPercentage: 17, category: electronics._id" },
  // Dell Inspiron 15
  { from: "price: 38990, originalPrice: 45990, category: electronics._id", to: "price: 38990, originalPrice: 45990, discountPercentage: 15, category: electronics._id" },
  // Apple Watch Series 10
  { from: "price: 46900, originalPrice: 46900, category: electronics._id", to: "price: 46900, originalPrice: 46900, discountPercentage: 0, category: electronics._id" },
  // Samsung Galaxy Watch 7 Classic
  { from: "price: 34999, originalPrice: 39999, category: electronics._id", to: "price: 34999, originalPrice: 39999, discountPercentage: 13, category: electronics._id" },
  // OnePlus Watch 2
  { from: "price: 24999, originalPrice: 27999, category: electronics._id", to: "price: 24999, originalPrice: 27999, discountPercentage: 11, category: electronics._id" },
  // boAt Lunar Pro
  { from: "price: 9999, originalPrice: 14999, category: electronics._id", to: "price: 9999, originalPrice: 14999, discountPercentage: 33, category: electronics._id" },
  // Fastrack FS1 Pro
  { from: "price: 3995, originalPrice: 7995, category: electronics._id", to: "price: 3995, originalPrice: 7995, discountPercentage: 50, category: electronics._id" },
  // Sony WH-1000XM5
  { from: "price: 29990, originalPrice: 34990, category: electronics._id", to: "price: 29990, originalPrice: 34990, discountPercentage: 14, category: electronics._id" },
  // Apple AirPods Pro
  { from: "price: 24900, originalPrice: 24900, category: electronics._id", to: "price: 24900, originalPrice: 24900, discountPercentage: 0, category: electronics._id" },
  // JBL Tour One M2
  { from: "price: 19999, originalPrice: 24999, category: electronics._id", to: "price: 19999, originalPrice: 24999, discountPercentage: 20, category: electronics._id" },
  // OnePlus Buds Pro 3
  { from: "price: 11999, originalPrice: 13999, category: electronics._id", to: "price: 11999, originalPrice: 13999, discountPercentage: 14, category: electronics._id" },
  // boAt Nirvana Ion
  { from: "price: 2799, originalPrice: 7990, category: electronics._id", to: "price: 2799, originalPrice: 7990, discountPercentage: 65, category: electronics._id" },
  // Sony Alpha ILCE-7M4
  { from: "price: 224990, originalPrice: 244990, category: electronics._id", to: "price: 224990, originalPrice: 244990, discountPercentage: 8, category: electronics._id" },
  // Canon EOS R6 Mark II
  { from: "price: 214990, originalPrice: 229990, category: electronics._id", to: "price: 214990, originalPrice: 229990, discountPercentage: 7, category: electronics._id" },
  // Nikon Z6 II
  { from: "price: 175990, originalPrice: 195990, category: electronics._id", to: "price: 175990, originalPrice: 195990, discountPercentage: 10, category: electronics._id" },
  // Levi's Men 511
  { from: "price: 2499, originalPrice: 3299, category: clothing._id", to: "price: 2499, originalPrice: 3299, discountPercentage: 24, category: clothing._id" },
  // Allen Solly Men
  { from: "price: 1499, originalPrice: 2299, category: clothing._id", to: "price: 1499, originalPrice: 2299, discountPercentage: 35, category: clothing._id" },
  // Peter England Polo
  { from: "price: 799, originalPrice: 1299, category: clothing._id", to: "price: 799, originalPrice: 1299, discountPercentage: 38, category: clothing._id" },
  // Nike Sportswear Hoodie
  { from: "price: 3495, originalPrice: 3495, category: clothing._id", to: "price: 3495, originalPrice: 3495, discountPercentage: 0, category: clothing._id" },
  // Adidas Essentials Track Pants
  { from: "price: 2299, originalPrice: 2999, category: clothing._id", to: "price: 2299, originalPrice: 2999, discountPercentage: 23, category: clothing._id" },
  // Biba Kurta
  { from: "price: 1299, originalPrice: 2599, category: clothing._id", to: "price: 1299, originalPrice: 2599, discountPercentage: 50, category: clothing._id" },
  // Levi's Women 711
  { from: "price: 2599, originalPrice: 3499, category: clothing._id", to: "price: 2599, originalPrice: 3499, discountPercentage: 26, category: clothing._id" },
  // M&S Floral Midi Dress
  { from: "price: 3499, originalPrice: 4999, category: clothing._id", to: "price: 3499, originalPrice: 4999, discountPercentage: 30, category: clothing._id" },
  // Puma Women T-Shirt
  { from: "price: 999, originalPrice: 1599, category: clothing._id", to: "price: 999, originalPrice: 1599, discountPercentage: 38, category: clothing._id" },
  // H&M Oversized Denim Jacket
  { from: "price: 2999, originalPrice: 2999, category: clothing._id", to: "price: 2999, originalPrice: 2999, discountPercentage: 0, category: clothing._id" },
  // Nike Air Max 270
  { from: "price: 12995, originalPrice: 12995, category: sports._id", to: "price: 12995, originalPrice: 12995, discountPercentage: 0, category: sports._id" },
  // Adidas Ultraboost
  { from: "price: 18999, originalPrice: 18999, category: sports._id", to: "price: 18999, originalPrice: 18999, discountPercentage: 0, category: sports._id" },
  // Puma RS-X
  { from: "price: 6999, originalPrice: 9999, category: sports._id", to: "price: 6999, originalPrice: 9999, discountPercentage: 30, category: sports._id" },
  // Nike Air Force 1
  { from: "price: 9695, originalPrice: 9695, category: clothing._id", to: "price: 9695, originalPrice: 9695, discountPercentage: 0, category: clothing._id" },
  // Crocs Classic
  { from: "price: 2995, originalPrice: 3495, category: clothing._id", to: "price: 2995, originalPrice: 3495, discountPercentage: 14, category: clothing._id" },
  // LG Washing Machine
  { from: "price: 34990, originalPrice: 45990, category: homeGarden._id", to: "price: 34990, originalPrice: 45990, discountPercentage: 24, category: homeGarden._id" },
  // Philips Air Fryer
  { from: "price: 8499, originalPrice: 11995, category: homeGarden._id", to: "price: 8499, originalPrice: 11995, discountPercentage: 29, category: homeGarden._id" },
  // Whirlpool Refrigerator
  { from: "price: 26990, originalPrice: 33150, category: homeGarden._id", to: "price: 26990, originalPrice: 33150, discountPercentage: 19, category: homeGarden._id" },
  // Dyson V12
  { from: "price: 55900, originalPrice: 55900, category: homeGarden._id", to: "price: 55900, originalPrice: 55900, discountPercentage: 0, category: homeGarden._id" },
  // Prestige Mixer
  { from: "price: 2999, originalPrice: 6295, category: homeGarden._id", to: "price: 2999, originalPrice: 6295, discountPercentage: 52, category: homeGarden._id" },
  // Atomic Habits
  { from: "price: 499, originalPrice: 799, category: books._id", to: "price: 499, originalPrice: 799, discountPercentage: 38, category: books._id" },
  // Clean Code
  { from: "price: 1299, originalPrice: 1599, category: books._id", to: "price: 1299, originalPrice: 1599, discountPercentage: 19, category: books._id" },
  // Psychology of Money
  { from: "price: 349, originalPrice: 399, category: books._id", to: "price: 349, originalPrice: 399, discountPercentage: 13, category: books._id" },
  // Dune
  { from: "price: 599, originalPrice: 799, category: books._id", to: "price: 599, originalPrice: 799, discountPercentage: 25, category: books._id" },
  // Deep Work
  { from: "price: 450, originalPrice: 599, category: books._id", to: "price: 450, originalPrice: 599, discountPercentage: 25, category: books._id" },
  // Lakme Absolute
  { from: "price: 650, originalPrice: 850, category: beauty._id", to: "price: 650, originalPrice: 850, discountPercentage: 24, category: beauty._id" },
  // Maybelline Foundation
  { from: "price: 459, originalPrice: 599, category: beauty._id", to: "price: 459, originalPrice: 599, discountPercentage: 23, category: beauty._id" },
  // L'Oreal Serum
  { from: "price: 899, originalPrice: 999, category: beauty._id", to: "price: 899, originalPrice: 999, discountPercentage: 10, category: beauty._id" },
  // Minimalist Serum
  { from: "price: 599, originalPrice: 599, category: beauty._id", to: "price: 599, originalPrice: 599, discountPercentage: 0, category: beauty._id" },
  // Biotique Toner
  { from: "price: 145, originalPrice: 210, category: beauty._id", to: "price: 145, originalPrice: 210, discountPercentage: 31, category: beauty._id" },
  // Yonex Astrox
  { from: "price: 2999, originalPrice: 4290, category: sports._id", to: "price: 2999, originalPrice: 4290, discountPercentage: 30, category: sports._id" },
  // Nivia Football
  { from: "price: 450, originalPrice: 650, category: sports._id", to: "price: 450, originalPrice: 650, discountPercentage: 31, category: sports._id" },
  // Cosco Tennis Ball
  { from: "price: 399, originalPrice: 450, category: sports._id", to: "price: 399, originalPrice: 450, discountPercentage: 11, category: sports._id" },
  // Adidas Real Madrid Jersey
  { from: "price: 4999, originalPrice: 4999, category: sports._id", to: "price: 4999, originalPrice: 4999, discountPercentage: 0, category: sports._id" },
  // Puma Cricket Shoes
  { from: "price: 3499, originalPrice: 5999, category: sports._id", to: "price: 3499, originalPrice: 5999, discountPercentage: 42, category: sports._id" },
  // Samsung QLED TV
  { from: "price: 64990, originalPrice: 99900, category: electronics._id", to: "price: 64990, originalPrice: 99900, discountPercentage: 35, category: electronics._id" },
  // LG OLED TV
  { from: "price: 154990, originalPrice: 249990, category: electronics._id", to: "price: 154990, originalPrice: 249990, discountPercentage: 38, category: electronics._id" },
  // PS5
  { from: "price: 44990, originalPrice: 54990, category: electronics._id", to: "price: 44990, originalPrice: 54990, discountPercentage: 18, category: electronics._id" },
  // Xbox Series X
  { from: "price: 49990, originalPrice: 55990, category: electronics._id", to: "price: 49990, originalPrice: 55990, discountPercentage: 11, category: electronics._id" },
  // Logitech G Pro X
  { from: "price: 12995, originalPrice: 13995, category: electronics._id", to: "price: 12995, originalPrice: 13995, discountPercentage: 7, category: electronics._id" },
  // Philips Grooming Kit
  { from: "price: 1699, originalPrice: 1995, category: beauty._id", to: "price: 1699, originalPrice: 1995, discountPercentage: 15, category: beauty._id" },
  // Dyson Airwrap
  { from: "price: 49900, originalPrice: 49900, category: beauty._id", to: "price: 49900, originalPrice: 49900, discountPercentage: 0, category: beauty._id" },
  // Nivea Cream
  { from: "price: 250, originalPrice: 349, category: beauty._id", to: "price: 250, originalPrice: 349, discountPercentage: 28, category: beauty._id" },
  // M.A.C Lipstick
  { from: "price: 1950, originalPrice: 1950, category: beauty._id", to: "price: 1950, originalPrice: 1950, discountPercentage: 0, category: beauty._id" },
  // Tata Tea
  { from: "price: 440, originalPrice: 520, category: homeGarden._id", to: "price: 440, originalPrice: 520, discountPercentage: 15, category: homeGarden._id" },
  // India Gate Rice
  { from: "price: 899, originalPrice: 1050, category: homeGarden._id", to: "price: 899, originalPrice: 1050, discountPercentage: 14, category: homeGarden._id" },
  // Aashirvaad Atta
  { from: "price: 299, originalPrice: 345, category: homeGarden._id", to: "price: 299, originalPrice: 345, discountPercentage: 13, category: homeGarden._id" },
  // Fortune Oil
  { from: "price: 799, originalPrice: 950, category: homeGarden._id", to: "price: 799, originalPrice: 950, discountPercentage: 16, category: homeGarden._id" },
  // Fastrack Reflex
  { from: "price: 4995, originalPrice: 7995, category: electronics._id", to: "price: 4995, originalPrice: 7995, discountPercentage: 38, category: electronics._id" },
  // Titan Edge
  { from: "price: 12495, originalPrice: 12495, category: electronics._id", to: "price: 12495, originalPrice: 12495, discountPercentage: 0, category: electronics._id" },
  // Woodland Boots
  { from: "price: 3499, originalPrice: 4295, category: clothing._id", to: "price: 3499, originalPrice: 4295, discountPercentage: 19, category: clothing._id" },
  // Red Tape Sneakers
  { from: "price: 1499, originalPrice: 4999, category: clothing._id", to: "price: 1499, originalPrice: 4999, discountPercentage: 70, category: clothing._id" },
  // iPhone 16 Pro Max
  { from: "price: 144900, originalPrice: 144900, category: electronics._id", to: "price: 144900, originalPrice: 144900, discountPercentage: 0, category: electronics._id" },
  // Samsung Galaxy S25
  { from: "price: 129999, originalPrice: 139999, category: electronics._id", to: "price: 129999, originalPrice: 139999, discountPercentage: 7, category: electronics._id" },
  // OnePlus 13
  { from: "price: 69999, originalPrice: 74999, category: electronics._id", to: "price: 69999, originalPrice: 74999, discountPercentage: 7, category: electronics._id" },
  // Xiaomi 14 Ultra
  { from: "price: 99999, originalPrice: 109999, category: electronics._id", to: "price: 99999, originalPrice: 109999, discountPercentage: 9, category: electronics._id" },
  // Vivo X100 Pro
  { from: "price: 89999, originalPrice: 95999, category: electronics._id", to: "price: 89999, originalPrice: 95999, discountPercentage: 6, category: electronics._id" },
  // Oppo Find X7
  { from: "price: 94999, originalPrice: 99999, category: electronics._id", to: "price: 94999, originalPrice: 99999, discountPercentage: 5, category: electronics._id" },
  // iPhone 15
  { from: "price: 71999, originalPrice: 79900, category: electronics._id", to: "price: 71999, originalPrice: 79900, discountPercentage: 10, category: electronics._id" },
  // Galaxy A55
  { from: "price: 39999, originalPrice: 42999, category: electronics._id", to: "price: 39999, originalPrice: 42999, discountPercentage: 7, category: electronics._id" },
  // OnePlus Nord 4
  { from: "price: 29999, originalPrice: 32999, category: electronics._id", to: "price: 29999, originalPrice: 32999, discountPercentage: 9, category: electronics._id" },
  // Redmi Note 14 Pro+
  { from: "price: 25999, originalPrice: 30999, category: electronics._id", to: "price: 25999, originalPrice: 30999, discountPercentage: 16, category: electronics._id" },
];

let modified = content;
let count = 0;

for (const { from, to } of replacements) {
  if (modified.includes(from)) {
    // Only replace if discountPercentage isn't already there
    const afterPrice = modified.substring(modified.indexOf(from) + from.length);
    if (!afterPrice.startsWith(', discountPercentage')) {
      modified = modified.replace(from, to);
      count++;
    }
  }
}

fs.writeFileSync(seedPath, modified, 'utf8');
console.log(`✅ Added ${count} discountPercentage values to seed.js`);
