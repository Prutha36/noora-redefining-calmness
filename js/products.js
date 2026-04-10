const SCENT_GROUPS = {
  sculpted: [
    'French Lavender','Lavender Fresh','Rose & Lotus','Pink Rose',
    'Red Rose','Jasmine','Mogra','Sakura','Orchid','White Tea',
    'Butterfly Pea','Ylang Ylang','Sweet Osmanthus','Lotus',
    'Pear & Freesia','Cherry Blossom','Lemongrass',
  ],
  pillar: [
    'Eucalyptus','Peppermint','Rose & Lotus','Lemongrass',
    'Rosemary','Orange & Eucalyptus','Mogra','Jasmine','Periwinkle',
  ],
  floral_jar: [
    'Jasmine & Mogra','Lemon Grass','Calming Lavender',
    'Berry Blast','Citrus Punch','Sun Ripened Orange',
    'Peach, Mango & Strawberry','Fresh Ocean',
    'Rose & Lotus','Lemongrass & Chamomile',
  ],
  arabic: [
    'Arabic Fragrance','Agarwood & Rose','Sandalwood',
    'Patchouli','Cinnamon','Midnight','Opium','Suede',
  ],
  cafe: [
    'Strawberry frappuccino','Mocha cookie crumble frappuccino',
    'Smooth Vanilla','Matcha latte','Brewed Coffee',
    'Pistachio Latte','Caramel Drizzle','White Chocolate Mocha',
    'Caramel Swirl','Creamy Milk','Light Cocoa',
    'Dubai Chocolate Mocha','Mango & Ice',
    'Sweet Caramel','Vanilla','Coconut',
  ],
};

const products = [
  {
    id: 1, name: 'Amethyst Bloom', category: 'Sculpted',
    fragranceFamily: ['floral'], emoji: '🌹', tag: 'Gift',
    image: 'images/products/amethyst-bloom-purple.jpg',
    basePrice: 749, scentGroup: 'sculpted',
    priceMap: {
      'Velvet Rose & Oud': 849, 'Mogra': 849,
      'Ylang Ylang': 849, 'Orchid': 849,
    },
    imageMap: {
      'French Lavender':   'images/products/amethyst-bloom-purple.jpg',
      'Lavender Fresh':    'images/products/amethyst-bloom-purple.jpg',
      'Butterfly Pea':     'images/products/amethyst-bloom-blue.jpg',
      'Mogra':             'images/products/amethyst-bloom-beige.jpg',
      'Sweet Osmanthus':   'images/products/amethyst-bloom-beige.jpg',
      'Jasmine':           'images/products/amethyst-bloom-white.jpg',
      'White Tea':         'images/products/amethyst-bloom-white.jpg',
      'Pear & Freesia':    'images/products/amethyst-bloom-white.jpg',
      'Rose & Lotus':      'images/products/amethyst-bloom-pink.jpg',
      'Pink Rose':         'images/products/amethyst-bloom-pink.jpg',
      'Cherry Blossom':    'images/products/amethyst-bloom-pink.jpg',
      'Red Rose':          'images/products/amethyst-bloom-burgundy.jpg',
      'Velvet Rose & Oud': 'images/products/amethyst-bloom-burgundy.jpg',
    },
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '70g', priceAdd: 0 } ],
  },
  {
    id: 2, name: 'Garden Collection', category: 'Sculpted',
    fragranceFamily: ['floral'], emoji: '🌿', tag: '',
    image: 'images/products/garden collection.png',
    basePrice: 399, scentGroup: 'sculpted',
    priceMap: {
      'Mogra': 499, 'Velvet Rose & Oud': 499, 'Lavender Fresh': 449,
    },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '70g', priceAdd: 0 } ],
  },
  {
    id: 3, name: 'Iced Strawberry Matcha Latte', category: 'Cafe',
    fragranceFamily: ['cafe','fruity'], emoji: '🍂', tag: '',
    image: 'images/products/strawberry latte.jpg',
    basePrice: 1149, scentGroup: 'cafe',
    priceMap: { 'White Chocolate Mocha': 1199, 'Brewed Coffee': 1199, 'Light Cocoa': 1199 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '120g', priceAdd: 0 } ],
  },
  {
    id: 4, name: 'Vanilla Latte', category: 'Cafe',
    fragranceFamily: ['cafe'], emoji: '🕯️', tag: 'Refreshing',
    image: 'images/products/Vanilla Latte.jpeg',
    basePrice: 1049, scentGroup: 'cafe',
    priceMap: { 'Brewed Coffee': 1199, 'White Chocolate Mocha': 1099, 'Light Cocoa': 1199 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '120g', priceAdd: 0 } ],
  },
  {
    id: 5, name: 'Iced Coffee Latte', category: 'Cafe',
    fragranceFamily: ['cafe'], emoji: '🌸', tag: '',
    image: 'images/products/Iced coffee latte.jpg',
    basePrice: 1149, scentGroup: 'cafe',
    priceMap: { 'Light Cocoa': 1199 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '120g', priceAdd: 0 } ],
  },
  {
    id: 6, name: 'Serene Muse', category: 'Sculpted',
    fragranceFamily: ['floral','fresh'], emoji: '🎁', tag: 'Gift',
    image: 'images/products/Serene Muse.jpg',
    basePrice: 999, scentGroup: 'sculpted',
    priceMap: { 'Ylang Ylang': 1099, 'Orchid': 1099 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '80g', priceAdd: 0 } ],
  },
  {
    id: 7, name: 'Minted Roses', category: 'Pillar',
    fragranceFamily: ['floral','fresh'], emoji: '🌲', tag: '',
    image: 'images/products/minted roses.jpg',
    basePrice: 899, scentGroup: 'pillar',
    priceMap: {
      'Eucalyptus': 1099, 'Lemongrass': 1099, 'Rose & Lotus': 999,
      'Jasmine': 1099, 'Periwinkle': 899, 'Mogra': 949,
    },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '80g', priceAdd: 0 } ],
  },
  {
    id: 8, name: 'Teddy Bloom', category: 'Sculpted',
    fragranceFamily: ['floral'], emoji: '🧸', tag: 'New',
    image: 'images/products/teddy bloom.jpg',
    basePrice: 799, scentGroup: 'sculpted',
    priceMap: { 'Mogra': 849, 'Orchid': 849 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '70g', priceAdd: 0 } ],
  },
  {
    id: 9, name: 'Petal Reverie', category: 'Sculpted',
    fragranceFamily: ['floral'], emoji: '🌸', tag: 'Gift',
    image: 'images/products/petal reverie.jpg',
    basePrice: 999, scentGroup: 'sculpted',
    priceMap: { 'Mogra': 1099, 'Ylang Ylang': 1099, 'Orchid': 1099 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '100g', priceAdd: 0 } ],
  },
  {
    id: 10, name: 'Berry Blush Spritz', category: 'Floral',
    fragranceFamily: ['fruity'], emoji: '🍸', tag: 'Limited',
    image: 'images/products/Berry spritz.jpg',
    basePrice: 950, scentGroup: 'floral_jar',
    priceMap: { 'Berry Blast': 1199, 'Citrus Punch': 1099, 'Fresh Ocean': 1200 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '350g', priceAdd: 0 } ],
  },
  {
    id: 11, name: 'Blush Orbit', category: 'Sculpted',
    fragranceFamily: ['floral','fruity','fresh'], emoji: '🌺', tag: 'New',
    image: 'images/products/Blush orbit.jpg',
    basePrice: 899, scentGroup: 'sculpted',
    priceMap: { 'Mogra': 1149, 'Ylang Ylang': 1049, 'Orchid': 1049, 'Velvet Rose & Oud': 949 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '130g', priceAdd: 0 } ],
  },
  {
    id: 12, name: 'Mango Frost', category: 'Cafe',
    fragranceFamily: ['fruity','cafe'], emoji: '🧊', tag: '',
    image: 'images/products/Mango Frost.jpeg',
    basePrice: 1049, scentGroup: 'cafe',
    priceMap: {},
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '120g', priceAdd: 0 } ],
  },
  {
    id: 13, name: 'Moonlit Garden', category: 'Floral',
    fragranceFamily: ['floral'], emoji: '✨', tag: '',
    image: 'images/products/Moonlit Graden .jpeg',
    basePrice: 950, scentGroup: 'floral_jar',
    priceMap: { 'Fresh Ocean': 1200, 'Berry Blast': 1199, 'Citrus Punch': 1099 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '145g', priceAdd: 0 } ],
  },
  {
    id: 14, name: 'Morning Meadow', category: 'Floral',
    fragranceFamily: ['fresh'], emoji: '🍃', tag: '',
    image: 'images/products/Morning Meadow .jpeg',
    basePrice: 950, scentGroup: 'floral_jar',
    priceMap: { 'Fresh Ocean': 1200, 'Berry Blast': 1199, 'Citrus Punch': 1099 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '145g', priceAdd: 0 } ],
  },
  {
    id: 15, name: 'Sunset Nectar', category: 'Floral',
    fragranceFamily: ['fruity'], emoji: '♥️', tag: 'Limited',
    image: 'images/products/Sunset Nectar.jpeg',
    basePrice: 950, scentGroup: 'floral_jar',
    priceMap: { 'Fresh Ocean': 1200, 'Berry Blast': 1199, 'Citrus Punch': 1099 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '145g', priceAdd: 0 } ],
  },
  {
    id: 16, name: 'Ocean Breeze', category: 'Floral',
    fragranceFamily: ['fresh'], emoji: '🌊', tag: 'Limited',
    image: 'images/products/Ocean Breeze .jpeg',
    basePrice: 950, scentGroup: 'floral_jar',
    priceMap: { 'Fresh Ocean': 1200, 'Berry Blast': 1199, 'Citrus Punch': 1099 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '200g', priceAdd: 0 } ],
  },
  {
    id: 17, name: 'Arabian Secret', category: 'Arabic',
    fragranceFamily: ['woody'], emoji: '🕌', tag: 'BestSeller',
    image: 'images/products/Arabian Secret .jpeg',
    basePrice: 999, scentGroup: 'arabic',
    priceMap: { 'Agarwood & Rose': 1200, 'Midnight': 1099, 'Opium': 1099, 'Suede': 1099 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '145g', priceAdd: 0 } ],
  },
  {
    id: 18, name: 'Oud Bloom', category: 'Arabic',
    fragranceFamily: ['woody'], emoji: '🌹', tag: 'BestSeller',
    image: 'images/products/Oud Bloom.jpeg',
    basePrice: 999, scentGroup: 'arabic',
    priceMap: { 'Agarwood & Rose': 1200, 'Midnight': 1099, 'Opium': 1099, 'Suede': 1099 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '145g', priceAdd: 0 } ],
  },
  {
    id: 19, name: 'Amber Orange', category: 'Floral',
    fragranceFamily: ['fruity'], emoji: '🍊', tag: 'Limited',
    image: 'images/products/Amber Orange.jpeg',
    basePrice: 950, scentGroup: 'floral_jar',
    priceMap: { 'Sun Ripened Orange': 990, 'Fresh Ocean': 1200, 'Berry Blast': 1199 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '145g', priceAdd: 0 } ],
  },
  {
    id: 20, name: 'Twilight Calm', category: 'Floral',
    fragranceFamily: ['floral'], emoji: '🪻', tag: '',
    image: 'images/products/Twilight Calm.jpeg',
    basePrice: 950, scentGroup: 'floral_jar',
    priceMap: { 'Fresh Ocean': 1200, 'Berry Blast': 1199, 'Citrus Punch': 1099 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '145g', priceAdd: 0 } ],
  },
  {
    id: 21, name: 'Sunbeam Spiral', category: 'Sculpted',
    fragranceFamily: ['floral'], emoji: '🌹', tag: 'New',
    image: 'images/products/amethyst bloom.jpg',
    basePrice: 749, scentGroup: 'sculpted',
    priceMap: { 'Mogra': 849, 'Orchid': 849, 'Ylang Ylang': 849 },
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '70g', priceAdd: 0 } ],
  },
  {
    id: 22, name: 'Satin Swirl', category: 'Sculpted',
    fragranceFamily: ['floral'], emoji: '🌹', tag: '',
    image: 'images/products/amethyst bloom.jpg',
    basePrice: 749, scentGroup: 'sculpted',
    priceMap: {},
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '70g', priceAdd: 0 } ],
  },
  {
    id: 23, name: 'Alpine Twist', category: 'Sculpted',
    fragranceFamily: ['floral'], emoji: '🌹', tag: '',
    image: 'images/products/amethyst bloom.jpg',
    basePrice: 749, scentGroup: 'sculpted',
    priceMap: {},
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '70g', priceAdd: 0 } ],
  },
  {
    id: 24, name: 'Satin Petal', category: 'Sculpted',
    fragranceFamily: ['floral'], emoji: '🌹', tag: '',
    image: 'images/products/amethyst bloom.jpg',
    basePrice: 749, scentGroup: 'sculpted',
    priceMap: {},
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '70g', priceAdd: 0 } ],
  },
  {
    id: 25, name: 'Filigree Floral', category: 'Sculpted',
    fragranceFamily: ['floral'], emoji: '🌹', tag: '',
    image: 'images/products/amethyst bloom.jpg',
    basePrice: 749, scentGroup: 'sculpted',
    priceMap: {},
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '70g', priceAdd: 0 } ],
  },
  {
    id: 26, name: 'Rosette Arch', category: 'Sculpted',
    fragranceFamily: ['floral'], emoji: '🌹', tag: '',
    image: 'images/products/amethyst bloom.jpg',
    basePrice: 749, scentGroup: 'sculpted',
    priceMap: {},
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '70g', priceAdd: 0 } ],
  },
  {
    id: 27, name: 'Gilded Iris', category: 'Sculpted',
    fragranceFamily: ['floral'], emoji: '🌹', tag: '',
    image: 'images/products/amethyst bloom.jpg',
    basePrice: 749, scentGroup: 'sculpted',
    priceMap: {},
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '70g', priceAdd: 0 } ],
  },
  {
    id: 28, name: 'Blossom Tarts', category: 'Sculpted',
    fragranceFamily: ['floral'], emoji: '🌹', tag: '',
    image: 'images/products/amethyst bloom.jpg',
    basePrice: 749, scentGroup: 'sculpted',
    priceMap: {},
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '70g', priceAdd: 0 } ],
  },
  {
    id: 29, name: 'Lunar Bliss', category: 'Sculpted',
    fragranceFamily: ['floral'], emoji: '🌹', tag: '',
    image: 'images/products/amethyst bloom.jpg',
    basePrice: 749, scentGroup: 'sculpted',
    priceMap: {},
    imageMap: {},
    get fragrances() {
      return SCENT_GROUPS[this.scentGroup].map(n => ({
        name:  n,
        price: this.priceMap?.[n] ?? this.basePrice,
        image: this.imageMap?.[n] ?? this.image,
      }));
    },
    sizes: [ { label: '70g', priceAdd: 0 } ],
  },
];

const siteImages = {
  hero:   'images/products/Hero.png',
  about1: 'images/products/about 1.jpeg',
  about2: 'images/products/about 2.jpeg',
  about3: 'images/products/about 3.jpeg',
};