/* ============================================================
   js/products.js — Noora Candles Product Catalog
   ============================================================ */
 
function makeFragrances(scents, basePrice, priceMap, imageMap, defaultImage) {
  return scents.map(function(n) {
    return {
      name:  n,
      price: (priceMap && priceMap[n]) ? priceMap[n] : basePrice,
      image: (imageMap && imageMap[n]) ? imageMap[n] : defaultImage,
    };
  });
}
  
  const SCENTS = {
    amethystBloom: [
      'French Lavender','Rose & Lotus','Rose','White Tea',
      'Sakura','Lily','Orchid','Lotus','Jasmine','Frangipani','Champaka','Cherry Blossom',
    ],
    teddyBloom: [
      'Lavender','Rose & Lotus','Pink Rose',
      'Sweet Osmanthus','Strawberry','Peach','Vanilla','Candy Melon','Cherry Blossom',
    ],
    sunbeamSpiral: [
      'Lavender','Sakura','Orchid','White Tea',
      'Ocean Breeze','Lemon','Bergamot','Orange','Mix Fruit','Sandalwood','Patchouli',
    ],
    satinSwirl: [
      'French Lavender','White Tea','Eucalyptus',
      'Ocean Breeze','Bergamot','Sandalwood','Patchouli','White Mask',
    ],
    rosetteArch: [
      'Rose & Lotus','Pink Rose','Red Rose','Lavender',
      'Strawberry','Vanilla','Cherry Blossom',
    ],
    satinPetal: [
      'Rose & Lotus','Pink Rose','Red Rose','Black Rose','Lavender',
      'Sakura','Lotus','Jasmine','Frangipani','Champaka','Cherry Blossom',
    ],
    petalReverie: [
      'Lavender','Lily','Orchid','Pink Rose','Lotus','Champaka',
    ],
    EternalDaisy: [
      'Lavender','White Tea','Lily','Sweet Osmanthus',
      'Ocean Breeze','Lemon','Rose','Vanilla','Mogra',
    ],
    glidingIris: [
      'Frangipani','Lotus','Champaka','Lavender',
      'White Tea','Orchid','Lily','Ocean Breeze',
    ],
    filigreeFloral: [
      'Rose & Lotus','Pink Rose','Red Rose','French Lavender','Lavender Fresh','Cherry Blossom',
    ],
    blushOrbit: [
      'Rose & Lotus','Pink Rose','Sakura','Lavender',
      'Strawberry','Peach','Candy Melon','Watermelon','Cherry Blossom',
    ],
    blossomTarts: [
      'Vanilla','Strawberry','Chocolate','Coffee','Lavender',
      'Pink Rose','Sweet Osmanthus','Vanilla & Mint',
    ],
    alpineTwist: [
      'Lavender','White Tea','Eucalyptus','Ocean Breeze',
      'Bergamot','Lemon','Sandalwood','Patchouli','Cinnamon','White Mask','Suede',
    ],
    gardenCollection: [
      'Rose & Lotus','Pink Rose','Red Rose','Lavender', 'Mogra',
      'Lily','Orchid','Sakura','Lotus','Champaka','Jasmine','Cherry Blossom',
    ],
    mintedRoses: [
      'Rose & Lotus','Pink Rose','Red Rose','Lavender',
      'Eucalyptus','Ocean Breeze','Patchouli','Sandalwood','Vanilla & Mint',
    ],
    sereneMuse: [
      'Lavender','White Tea','Lily','Orchid',
      'Ocean Breeze','Sandalwood','Agarwood',
    ],

    Mochacookiecrumble:['Mocha cookie crumble'],

    SmoothVanilla:['Smooth Vanilla'],
    CaramelDrizzle:['Caramel Drizzle'],
    BrewedCoffee:['Brewed Coffee'],
    WhiteChocolateMocha:['White Chocolate Mocha'],
    CaramelSwirl:['Caramel Swirl'],
    CreamyMilk:['Creamy Milk'],



    arabic: [
      'Arabic Fragrance','Agarwood & Rose','Sandalwood',
      'Patchouli','Cinnamon','Midnight','Opium','Suede',
    ],

    latte: ['Iced Coffee Latte','Pistachio Latte','Matcha Latte','Vanilla Latte','Iced Strawberry Matcha Latte'],
    

    DubaiChocolate:['Dubai Chocolate'],

    LightCocoa:['Light Cocoa'],

    Spritz:['Berry Blush Spritz'],

    MangoFrost:['Mango Frost'],

    MoonlitGarden:['Moonlit Garden'],

    MorningMeadow:['Morning Meadow'],

    SunsetNectar:['Sunset Nectar'],

    AmberOrange:['Amber Orange'],

    OceanBreeze:['Ocean Breeze'],

    TwilightCalm:['Twilight Calm'],

    Cupcake:['Berry Cake', 'Chocolate Cake','Fruit Cake'],




  };
  
  const products = [
    {
      id: 1, name: 'Amethyst Bloom', category: 'Sculpted',
      fragranceFamily: ['floral'], emoji: '🌹', tag: 'Gift',
      image: 'images/products/Amethyst Bloom/Lavender.jpg',
      basePrice: 549, scentKey: 'amethystBloom',
      priceMap: { 'Orchid': 615, 'Champaka': 565, 'Frangipani': 645 },
      imageMap: {
        'French Lavender': 'images/products/Amethyst Bloom/Lavender.jpg',
        'Frangipani':      'images/products/Amethyst Bloom/Lavender.jpg',
        'Jasmine':         'images/products/Amethyst Bloom/butterfly pea.png',
        'White Tea':       'images/products/Amethyst Bloom/pearl white.png',
        'Lily':            'images/products/Amethyst Bloom/pearl white.png',
        'Lotus':           'images/products/Amethyst Bloom/pearl white.png',
        'Rose & Lotus':    'images/products/Amethyst Bloom/blush pink.png',
        'Pink Rose':       'images/products/Amethyst Bloom/blush pink.png',
        'Sakura':          'images/products/Amethyst Bloom/beige.png',
        'Cherry Blossom':  'images/products/Amethyst Bloom/blush pink.png',
        'Red Rose':        'images/products/Amethyst Bloom/burgundy.png',
        'Orchid':          'images/products/Amethyst Bloom/butterfly pea.png',
      },
      sizes: [ { label: '190g', priceAdd: 0 } ],
    },
    {
      id: 2, name: 'Garden Collection', category: 'Sculpted',
      fragranceFamily: ['floral'], emoji: '🌿', tag: '',
      image: 'images/products/Garden Collection/green.jpeg',
      basePrice: 145, scentKey: 'gardenCollection',
      priceMap: { 'Champaka': 155, 'Frangipani': 175 },
      imageMap: {
        'French Lavender': 'images/products/Garden Collection/Purple.png',
        'Champaka':        'images/products/Garden Collection/green.jpeg',
        'Orchid':          'images/products/Garden Collection/green.jpeg',
        'Jasmine':         'images/products/Garden Collection/periwinkle blue.jpeg',
        'Lily':            'images/products/Garden Collection/yellow.jpeg',
        'Lotus':           'images/products/Garden Collection/Pearl White.jpeg',
        'Rose & Lotus':    'images/products/Garden Collection/Dusty Pink.jpeg',
        'Pink Rose':       'images/products/Garden Collection/pink.jpeg',
        'Sakura':          'images/products/Garden Collection/wam beige.jpeg',
        'Cherry Blossom':  'images/products/Garden Collection/blue.jpeg',
        'Red Rose':        'images/products/Garden Collection/burgundy.jpeg',
        'Mogra':           'images/products/Garden Collection/Pearl White.jpeg',
      },
      sizes: [ { label: '60g', priceAdd: 154 },
        { label: '90g', priceAdd: 204 },
        { label: '32g', priceAdd: 0 }
       ],
    },
    {
      id: 3, name: 'Dubai Chocolate', category: 'cafe',
      fragranceFamily: ['cafe'], emoji: '☕', tag: '',
      image: 'images/products/Dubai Chocolate.jpeg',
      basePrice: 799, scentKey: 'DubaiChocolate',
      priceMap: { },
      imageMap: {},
      sizes: [ { label: '120g', priceAdd: 0 } ],
    },
    {
      id: 4, name: 'Light Cocoa', category: 'Cafe',
      fragranceFamily: ['cafe'], emoji: '☕', tag: 'Refreshing',
      image: 'images/products/Light Cocoa.png',
      basePrice: 675, scentKey: 'LightCocoa',
      priceMap: {   },
      imageMap: {},
      sizes: [ { label: '120g', priceAdd: 0 } ],
    },
    {
      id: 5, name: 'Latte', category: 'cafe',
      fragranceFamily: ['latte'], emoji: '☕', tag: '',
      image: 'images/products/strawberry latte.jpg',
      basePrice: 625, scentKey: 'latte',
      priceMap: { 'Iced Coffee Latte': 625, 'Vanilla Latte': 595, 'Pistachio Latte': 575, 'Matcha Latte':515, 'Iced Strawberry Matcha Latte':565 },
      imageMap: {
        'Iced Strawberry Matcha Latte': "images/products/strawberry latte.jpg",
        'Iced Coffee Latte': "images/products/Iced coffee latte.jpg",
        'Pistachio Latte':"images/products/Pistachio Latte.png",
        'Matcha Latte':"images/products/Matcha Latte.png",
        'Vanilla Latte':"images/products/Vanilla Latte.jpeg"

        
      },
      sizes: [ { label: '120g', priceAdd: 0 } ],
    },
    {
      id: 6, name: 'Serene Muse', category: 'Sculpted',
      fragranceFamily: ['floral','fresh','woody'], emoji: '🎁', tag: 'Gift',
      image: 'images/products/Serene Muse.jpg',
      basePrice: 325, scentKey: 'sereneMuse',
      priceMap: { 'Agarwood': 399, 'Sandalwood': 345, 'Orchid': 330 },
      imageMap: {},
      sizes: [ { label: '80g', priceAdd: 0 } ],
    },
    {
      id: 7, name: 'Minted Roses', category: 'Pillar',
      fragranceFamily: ['floral','fresh'], emoji: '🌲', tag: '',
      image: 'images/products/minted roses.jpg',
      basePrice: 299, scentKey: 'mintedRoses',
      priceMap: { 'Sandalwood': 325, 'Patchouli': 315, 'Eucalyptus': 309 },
      imageMap: {},
      sizes: [ { label: '70g', priceAdd: 0 } ],
    },
    {
      id: 8, name: 'Teddy Bloom', category: 'Sculpted',
      fragranceFamily: ['floral','fruity'], emoji: '🧸', tag: 'New',
      image: 'images/products/teddy bloom/blue.jpeg',
      basePrice: 315, scentKey: 'teddyBloom',
      priceMap: { 'Cherry Blossom': 369 },
      imageMap: {
        'Lavender':"images/products/teddy bloom/purple.jpeg",
        'Rose & Lotus':"images/products/teddy bloom/teddy bloom.jpg",
        'Pink Rose':"images/products/teddy bloom/teddy bloom.jpg",
      'Sweet Osmanthus':"images/products/teddy bloom/yellow.jpeg",
      'Strawberry':"images/products/teddy bloom/teddy bloom.jpg",
      'Peach':"images/products/teddy bloom/black.jpeg",
      'Vanilla':"images/products/teddy bloom/white.jpeg",
      'Candy Melon':"images/products/teddy bloom/blue.jpeg",
      'Cherry Blossom':"images/products/teddy bloom/teddy bloom.jpg",
      },
      sizes: [ { label: '70g', priceAdd: 0 } ],
    },
    {
      id: 9, name: 'Petal Reverie', category: 'Sculpted',
      fragranceFamily: ['floral'], emoji: '🌸', tag: 'Gift',
      image: 'images/products/Petal reverie/red.jpeg',
      basePrice: 369, scentKey: 'petalReverie',
      priceMap: { 'Champaka': 375, 'Lotus': 395 },
      imageMap: {
        'Lavender':"images/products/Petal reverie/purple.jpeg",
        'Lily':"images/products/Petal reverie/pink.jpeg",
        'Orchid':"images/products/Petal reverie/white.jpeg",
        'Pink Rose':"images/products/Petal reverie/red.jpeg",
        'Lotus':"images/products/Petal reverie/pink.jpeg",
        'Champaka':"images/products/Petal reverie/black.jpeg"},
      sizes: [ { label: '100g', priceAdd: 0 } ],
    },
    {
      id: 10, name: 'Berry Blush Spritz', category: 'Exotic',
      fragranceFamily: ['fruity'], emoji: '🍸', tag: 'Limited',
      image: 'images/products/Berry spritz.jpg',
      basePrice: 990, scentKey: 'Spritz',
      priceMap: { 'Berry Blast': 1199, 'Citrus Punch': 1099, 'Fresh Ocean': 1200 },
      imageMap: {},
      sizes: [ { label: '350g', priceAdd: 0 } ],
    },
    {
      id: 11, name: 'Blush Orbit', category: 'Sculpted',
      fragranceFamily: ['floral','fruity'], emoji: '🌺', tag: 'New',
      image: 'images/products/Blush Orbit/Blush orbit.jpg',
      basePrice: 390, scentKey: 'blushOrbit',
      priceMap: {},
      imageMap: {},
      sizes: [ { label: '130g', priceAdd: 0 } ],
    },
    {
      id: 12, name: 'Mango Frost', category: 'Exotic',
      fragranceFamily: ['Fruity'], emoji: '🥭', tag: '',
      image: 'images/products/Mango Frost.jpeg',
      basePrice: 695, scentKey: 'MangoFrost',
      priceMap: {},
      imageMap: {},
      sizes: [ { label: '120g', priceAdd: 0 } ],
    },
    {
      id: 13, name: 'Moonlit Garden', category: 'Exotic',
      fragranceFamily: ['floral'], emoji: '✨', tag: '',
      image: 'images/products/Moonlit Graden .jpeg',
      basePrice: 555, scentKey: 'MoonlitGarden',
      priceMap: { },
      imageMap: {},
      sizes: [ { label: '150g', priceAdd: 0 } ],
    },
    {
      id: 14, name: 'Morning Meadow', category: 'Exotic',
      fragranceFamily: ['fresh'], emoji: '🍃', tag: '',
      image: 'images/products/Morning Meadow .jpeg',
      basePrice: 695, scentKey: 'MorningMeadow',
      priceMap: { },
      imageMap: {},
      sizes: [ { label: '150g', priceAdd: 0 } ],
    },
    {
      id: 15, name: 'Sunset Nectar', category: 'Exotic',
      fragranceFamily: ['fruity'], emoji: '🍑', tag: 'Limited',
      image: 'images/products/Sunset Nectar.jpeg',
      basePrice: 695, scentKey: 'SunsetNectar',
      priceMap: { },
      imageMap: {},
      sizes: [ { label: '150g', priceAdd: 0 } ],
    },
    {
      id: 16, name: 'Ocean Breeze', category: 'Exotic',
      fragranceFamily: ['fresh'], emoji: '🌊', tag: 'Limited',
      image: 'images/products/Ocean Breeze .jpeg',
      basePrice: 1195, scentKey: 'OceanBreeze',
      priceMap: { },
      imageMap: {},
      sizes: [ { label: '200g', priceAdd: 0 } ],
    },
    {
      id: 17, name: 'Arabian Secret', category: 'Arabic',
      fragranceFamily: ['woody'], emoji: '🕌', tag: 'BestSeller',
      image: 'images/products/Arabian Secret .jpeg',
      basePrice: 1090, scentKey: 'arabic',
      priceMap: { },
      imageMap: {},
      sizes: [ { label: '150g', priceAdd: 0 } ],
    },
    {
      id: 18, name: 'Oud Bloom', category: 'Arabic',
      fragranceFamily: ['woody'], emoji: '🌹', tag: 'BestSeller',
      image: 'images/products/Oud Bloom.jpeg',
      basePrice: 1125, scentKey: 'arabic',
      priceMap: {  },
      imageMap: {},
      sizes: [ { label: '150g', priceAdd: 0 } ],
    },
    {
      id: 19, name: 'Amber Orange', category: 'Exotic',
      fragranceFamily: ['fruity'], emoji: '🍊', tag: 'Limited',
      image: 'images/products/Amber Orange.jpeg',
      basePrice: 695, scentKey: 'AmberOrange',
      priceMap: {  },
      imageMap: {},
      sizes: [ { label: '150g', priceAdd: 0 } ],
    },
    {
      id: 20, name: 'Twilight Calm', category: 'Exotic',
      fragranceFamily: ['floral'], emoji: '🪻', tag: '',
      image: 'images/products/Twilight Calm.jpeg',
      basePrice: 695, scentKey: 'TwilightCalm',
      priceMap: {  },
      imageMap: {},
      sizes: [ { label: '150g', priceAdd: 0 } ],
    },
    {
      id: 21, name: 'Sunbeam Spiral', category: 'Sculpted',
      fragranceFamily: ['floral','fresh','fruity'], emoji: '🌀', tag: 'New',
      image: 'images/products/sunbeam spiral/Yellow.jpeg',
      basePrice: 369, scentKey: 'sunbeamSpiral',
      priceMap: { },
      imageMap: {
        'Lavender':"images/products/sunbeam spiral/purple.jpeg",
        'Sakura':"images/products/sunbeam spiral/Yellow.jpeg",
        'Orchid':"images/products/sunbeam spiral/purple.jpeg",
        'White Tea':"images/products/sunbeam spiral/white.jpeg",
      'Ocean Breeze':"images/products/sunbeam spiral/black.jpeg",
      'Lemon':"images/products/sunbeam spiral/Yellow.jpeg",
      'Bergamot':"images/products/sunbeam spiral/white.jpeg",
      'Orange':"images/products/sunbeam spiral/red.jpeg",
      'Mix Fruit':"images/products/sunbeam spiral/red.jpeg",
      'Sandalwood':"images/products/sunbeam spiral/Yellow.jpeg",
      'Patchouli':"images/products/sunbeam spiral/black.jpeg",
      },
      sizes: [ { label: '90g', priceAdd: 0 },
        { label: '200g', priceAdd: 196 }
       ],
    },
    {
      id: 22, name: 'Satin Swirl', category: 'Sculpted',
      fragranceFamily: ['floral','fresh','woody'], emoji: '🌸', tag: '',
      image: 'images/products/satin swirl/black.jpeg',
      basePrice: 369, scentKey: 'satinSwirl',
      priceMap: { 'Sandalwood': 385, 'Patchouli': 375 },
      imageMap: {
        'French Lavender':"images/products/satin swirl/purple.jpeg",
        'White Tea':"images/products/satin swirl/white.jpeg",
        'Eucalyptus':"images/products/satin swirl/red.jpeg",
      'Ocean Breeze':"images/products/satin swirl/black.jpeg",
      'Bergamot':"images/products/satin swirl/red.jpeg",
      'Sandalwood':"images/products/satin swirl/red.jpeg",
      'Patchouli':"images/products/satin swirl/purple.jpeg",
      'White Mask':"images/products/satin swirl/white.jpeg",
      },
      sizes: [ { label: '90g', priceAdd: 0 } ],
    },
    {
      id: 23, name: 'Alpine Twist', category: 'Sculpted',
      fragranceFamily: ['floral','fresh','woody'], emoji: '🌿', tag: '',
      image: 'images/products/Alpine twist/red.jpeg',
      basePrice: 369, scentKey: 'alpineTwist',
      priceMap: { 'Sandalwood': 385, 'Patchouli': 375, 'Suede': 379, 'Cinnamon': 379 },
      imageMap: {
        'Lavender':"images/products/Alpine twist/purple.jpeg",
        'White Tea':"images/products/Alpine twist/black.jpeg",
        'Eucalyptus':"images/products/Alpine twist/red.jpeg",
        'Ocean Breeze':"images/products/Alpine twist/black.jpeg",
        'Bergamot':"images/products/Alpine twist/purple.jpeg",
        'Lemon':"images/products/Alpine twist/white.jpeg",
        'Sandalwood':"images/products/Alpine twist/red.jpeg",
        'Patchouli':"images/products/Alpine twist/purple.jpeg",
        'Cinnamon':"images/products/Alpine twist/black.jpeg",
        'White Mask':"images/products/Alpine twist/white.jpeg",
        'Suede':"images/products/Alpine twist/red.jpeg",
      },
      sizes: [ { label: '100g', priceAdd: 0 } ],
    },
    {
      id: 24, name: 'Satin Petal', category: 'Sculpted',
      fragranceFamily: ['floral'], emoji: '🌹', tag: '',
      image: 'images/products/Satin Petal/red.jpeg',
      basePrice: 299, scentKey: 'satinPetal',
      priceMap: { 'Champaka': 349, 'Frangipani': 395 },
      imageMap: {
        'Rose & Lotus':"images/products/Satin Petal/red.jpeg",
        'Pink Rose':"images/products/Satin Petal/purple.jpeg",
        'Red Rose':"images/products/Satin Petal/red.jpeg",
        'Black Rose':"images/products/Satin Petal/black.jpeg",
        'Lavender':"images/products/Satin Petal/purple.jpeg",
      'Sakura':"images/products/Satin Petal/black.jpeg",
      'Lotus':"images/products/Satin Petal/yellow.jpeg",
      'Jasmine':"images/products/Satin Petal/yellow.jpeg",
      'Frangipani':"images/products/Satin Petal/purple.jpeg",
      'Champaka':"images/products/Satin Petal/yellow.jpeg",
      'Cherry Blossom':"images/products/Satin Petal/red.jpeg",
      },
      sizes: [ { label: '65g', priceAdd: 0 } ],
    },
    {
      id: 25, name: 'Filigree Floral', category: 'Sculpted',
      fragranceFamily: ['floral'], emoji: '🌸', tag: '',
      image: 'images/products/Filigree floral/yellow.jpeg',
      basePrice: 145, scentKey: 'filigreeFloral',
      priceMap: {},
      imageMap: {
        'Rose & Lotus':"images/products/Filigree floral/white.jpeg",
        'Pink Rose':"images/products/Filigree floral/yellow.jpeg",
        'Red Rose':"images/products/Filigree floral/red.jpeg",
        'French Lavender':"images/products/Filigree floral/black.jpeg",
        'Lavender Fresh':"images/products/Filigree floral/yellow.jpeg",
        'Cherry Blossom':"images/products/Filigree floral/red.jpeg",
      },
      sizes: [ { label: '30g', priceAdd: 0 } ],
    },
    {
      id: 26, name: 'Rosette Arch', category: 'Sculpted',
      fragranceFamily: ['floral','fruity'], emoji: '🌹', tag: '',
      image: 'images/products/Rosette Arch/Arch1.jpg',
      basePrice: 450, scentKey: 'rosetteArch',
      priceMap: {},
      imageMap: {},
      sizes: [ { label: '140g', priceAdd: 0 } ],
    },
    {
      id: 27, name: 'Gliding Iris', category: 'Sculpted',
      fragranceFamily: ['floral','fresh'], emoji: '🪻', tag: '',
      image: "images/products/Gliding Iris/black.jpeg",
      basePrice: 99, scentKey: 'glidingIris',
      priceMap: { 'Champaka': 105, 'Frangipani': 115 },
      imageMap: {
        'Frangipani':"images/products/Gliding Iris/purple.jpeg",
        'Lotus':"images/products/Gliding Iris/black.jpeg",
        'Champaka':"images/products/Gliding Iris/yellow.jpeg",
        'Lavender':"images/products/Gliding Iris/purple.jpeg",
      'White Tea':"images/products/Gliding Iris/white.jpeg",
      'Orchid':"images/products/Gliding Iris/yellow.jpeg",
      'Lily':"images/products/Gliding Iris/pink.jpeg",
      'Ocean Breeze':"images/products/Gliding Iris/white.jpeg",
      },
      sizes: [ { label: '20g', priceAdd: 0 } ],
    },
    {
      id: 28, name: 'Blossom Tarts', category: 'Sculpted',
      fragranceFamily: ['floral','cafe','fruity'], emoji: '🧁', tag: '',
      image: 'images/products/Blossom Tarts/white.jpeg',
      basePrice: 135, scentKey: 'blossomTarts',
      priceMap: { },
      imageMap: {
        'Vanilla':"images/products/Blossom Tarts/white.jpeg",
        'Strawberry':"images/products/Blossom Tarts/pink.jpeg",
        'Chocolate':"images/products/Blossom Tarts/white.jpeg",
        'Coffee':"images/products/Blossom Tarts/white.jpeg",
        'Lavender':"images/products/Blossom Tarts/purple.jpeg",
      'Pink Rose':"images/products/Blossom Tarts/pink.jpeg",
      'Sweet Osmanthus':"images/products/Blossom Tarts/pink.jpeg",
      'Vanilla & Mint':"images/products/Blossom Tarts/white.jpeg",
      },
      sizes: [ { label: '30g', priceAdd: 0 } ],
    },
    {
      id: 29, name: 'Eternal Daisy', category: 'Sculpted',
      fragranceFamily: ['floral','fresh'], emoji: '🌙', tag: '',
      image: 'images/products/Eternal Daisy/blue.jpeg',
      basePrice: 110, scentKey: 'EternalDaisy',
      priceMap: { 'Ocean Breeeze': 135 },
      imageMap: {
        'Lavender':"images/products/Eternal Daisy/purple.jpeg",
        'White Tea':"images/products/Eternal Daisy/grey.jpeg",
        'Lily':"images/products/Eternal Daisy/blue.jpeg",
        'Sweet Osmanthus':"images/products/Eternal Daisy/yellow.jpeg",
      'Ocean Breeze':"images/products/Eternal Daisy/blue.jpeg",
      'Lemon':"images/products/Eternal Daisy/yellow.jpeg",
      'Rose':"images/products/Eternal Daisy/red.jpeg",
      'Vanilla':"images/products/Eternal Daisy/grey.jpeg",
      'Mogra':"images/products/Eternal Daisy/purple.jpeg",

      },
      sizes: [ { label: '20g', priceAdd: 0 } ],
    },
    {
      id: 30, name: 'Cupcake', category: '',
      fragranceFamily: ['fruity'], emoji: '🧁', tag: 'New',
      image: 'images/products/Cupcake/cake1.jpeg',
      basePrice: 295, scentKey: 'Cupcake',
      priceMap: {},
      imageMap: {
        'Berry Cake':"images/products/Cupcake/cake1.jpeg",
        'Chocolate cake':"images/products/Cupcake/cake2.jpeg",
        'Fruit Cake':"images/products/Cupcake/cake3.jpeg"


      },
      sizes: [ { label: '55g', priceAdd: 0 } ],
    },

    {
      id: 31, name: 'Caramel Swirl', category: 'Cafe',
      fragranceFamily: ['cafe'], emoji: '☕', tag: 'Refreshing',
      image: 'images/products/Caramel Swirl.png',
      basePrice: 575, scentKey: 'CaramelSwirl',
      priceMap: { }, 
      imageMap: {},
      sizes: [ { label: '150g', priceAdd: 0 } ],
    },

    {
      id: 32, name: 'Caramel Drizzle', category: 'Cafe',
      fragranceFamily: ['cafe'], emoji: '☕', tag: 'Refreshing',
      image: 'images/products/Caramel Drizzle.png',
      basePrice: 575, scentKey: 'CaramelDrizzle',
      priceMap: { }, 
      imageMap: {},
      sizes: [ { label: '150g', priceAdd: 0 } ],
    },

    {
      id: 33, name: 'Smooth Vanilla', category: 'Cafe',
      fragranceFamily: ['cafe'], emoji: '☕', tag: 'Refreshing',
      image: 'images/products/Smooth Vanilla.png',
      basePrice: 595, scentKey: 'SmoothVanilla',
      priceMap: { }, 
      imageMap: {},
      sizes: [ { label: '150g', priceAdd: 0 } ],
    },

    {
      id: 34, name: 'Creamy Milk', category: 'Cafe',
      fragranceFamily: ['cafe'], emoji: '☕', tag: 'Refreshing',
      image: 'images/products/Creamy Milk.png',
      basePrice: 499, scentKey: 'CreamyMilk',
      priceMap: { }, 
      imageMap: {},
      sizes: [ { label: '150g', priceAdd: 0 } ],
    },

    {
      id: 35, name: 'Mocha Cookie Crumble', category: 'Cafe',
      fragranceFamily: ['cafe'], emoji: '☕', tag: 'Refreshing',
      image: 'images/products/Mocha Cookie Crumble.png',
      basePrice: 750, scentKey: 'Mochacookiecrumble',
      priceMap: { }, 
      imageMap: {},
      sizes: [ { label: '150g', priceAdd: 0 } ],
    },

    {
      id: 36, name: 'White Chocolate Mocha', category: 'Cafe',
      fragranceFamily: ['cafe'], emoji: '☕', tag: 'Refreshing',
      image: 'images/products/White Chocolate mocha.png',
      basePrice: 725, scentKey: 'WhiteChocolateMocha',
      priceMap: { }, 
      imageMap: {},
      sizes: [ { label: '150g', priceAdd: 0 } ],
    },

    {
      id: 37, name: 'Brewed Coffee', category: 'Cafe',
      fragranceFamily: ['cafe'], emoji: '☕', tag: 'Refreshing',
      image: 'images/products/Brewed Coffee.png',
      basePrice: 575, scentKey: 'BrewedCoffee',
      priceMap: { }, 
      imageMap: {},
      sizes: [ { label: '150g', priceAdd: 0 } ],
    },


  ];
  
  /* ── Populate .fragrances for every product ── */
  products.forEach(function(p) {
    p.fragrances = makeFragrances(
      SCENTS[p.scentKey],
      p.basePrice,
      p.priceMap,
      p.imageMap,
      p.image
    );
  });
  
  const siteImages = {
    hero:   'images/products/Hero.png',
    about1: 'images/products/about 1.jpeg',
    about2: 'images/products/about 2.jpeg',
    about3: 'images/products/about 3.jpeg',
  };