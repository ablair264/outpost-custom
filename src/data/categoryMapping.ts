export interface CategoryMapping {
  id: string;
  name: string;
  displayName: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  group: string;
}

// Comprehensive category mapping with suggested groupings
export const defaultCategoryMappings: CategoryMapping[] = [
  // Clothing - Tops
  { id: 'hoodies', name: 'Hoodies', displayName: 'Hoodies', imageUrl: '/images/categories/hoodies.jpg', isActive: true, sortOrder: 1, group: 'Tops' },
  { id: 't-shirts', name: 'T-Shirts', displayName: 'T-Shirts', imageUrl: '/images/categories/t-shirts.jpg', isActive: true, sortOrder: 2, group: 'Tops' },
  { id: 'polos', name: 'Polos', displayName: 'Polo Shirts', imageUrl: '/images/categories/polos.jpg', isActive: true, sortOrder: 3, group: 'Tops' },
  { id: 'sweatshirts', name: 'Sweatshirts', displayName: 'Sweatshirts', imageUrl: '/images/categories/sweatshirts.jpg', isActive: true, sortOrder: 4, group: 'Tops' },
  { id: 'shirts', name: 'Shirts', displayName: 'Shirts', imageUrl: '/images/categories/shirts.jpg', isActive: true, sortOrder: 5, group: 'Tops' },
  { id: 'rugby-shirts', name: 'Rugby Shirts', displayName: 'Rugby Shirts', imageUrl: '/images/categories/rugby-shirts.jpg', isActive: true, sortOrder: 6, group: 'Tops' },
  { id: 'blouses', name: 'Blouses', displayName: 'Blouses', imageUrl: '/images/categories/blouses.jpg', isActive: true, sortOrder: 7, group: 'Tops' },
  { id: 'cardigans', name: 'Cardigans', displayName: 'Cardigans', imageUrl: '/images/categories/cardigans.jpg', isActive: true, sortOrder: 8, group: 'Tops' },
  { id: 'knitted-jumpers', name: 'Knitted Jumpers', displayName: 'Knitted Jumpers', imageUrl: '/images/categories/knitted-jumpers.jpg', isActive: true, sortOrder: 9, group: 'Tops' },

  // Clothing - Bottoms
  { id: 'jeans', name: 'Jeans', displayName: 'Jeans', imageUrl: '/images/categories/jeans.jpg', isActive: true, sortOrder: 10, group: 'Bottoms' },
  { id: 'shorts', name: 'Shorts', displayName: 'Shorts', imageUrl: '/images/categories/shorts.jpg', isActive: true, sortOrder: 11, group: 'Bottoms' },
  { id: 'chinos', name: 'Chinos', displayName: 'Chinos', imageUrl: '/images/categories/chinos.jpg', isActive: true, sortOrder: 12, group: 'Bottoms' },
  { id: 'sweatpants', name: 'Sweatpants', displayName: 'Sweatpants', imageUrl: '/images/categories/sweatpants.jpg', isActive: true, sortOrder: 13, group: 'Bottoms' },
  { id: 'leggings', name: 'Leggings', displayName: 'Leggings', imageUrl: '/images/categories/leggings.jpg', isActive: true, sortOrder: 14, group: 'Bottoms' },
  { id: 'skirts', name: 'Skirts', displayName: 'Skirts', imageUrl: '/images/categories/skirts.jpg', isActive: true, sortOrder: 15, group: 'Bottoms' },
  { id: 'skorts', name: 'Skorts', displayName: 'Skorts', imageUrl: '/images/categories/skorts.jpg', isActive: true, sortOrder: 16, group: 'Bottoms' },
  { id: 'trackwear', name: 'Trackwear', displayName: 'Trackwear', imageUrl: '/images/categories/trackwear.jpg', isActive: true, sortOrder: 17, group: 'Bottoms' },
  { id: 'loungewear-bottoms', name: 'Loungewear Bottoms', displayName: 'Loungewear Bottoms', imageUrl: '/images/categories/loungewear-bottoms.jpg', isActive: true, sortOrder: 18, group: 'Bottoms' },

  // Outerwear
  { id: 'jackets', name: 'Jackets', displayName: 'Jackets', imageUrl: '/images/categories/jackets.jpg', isActive: true, sortOrder: 19, group: 'Outerwear' },
  { id: 'gilets-body-warmers', name: 'Gilets & Body Warmers', displayName: 'Gilets & Body Warmers', imageUrl: '/images/categories/gilets.jpg', isActive: true, sortOrder: 20, group: 'Outerwear' },
  { id: 'fleece', name: 'Fleece', displayName: 'Fleece', imageUrl: '/images/categories/fleece.jpg', isActive: true, sortOrder: 21, group: 'Outerwear' },
  { id: 'softshells', name: 'Softshells', displayName: 'Softshells', imageUrl: '/images/categories/softshells.jpg', isActive: true, sortOrder: 22, group: 'Outerwear' },
  { id: 'rain-suits', name: 'Rain Suits', displayName: 'Rain Suits', imageUrl: '/images/categories/rain-suits.jpg', isActive: true, sortOrder: 23, group: 'Outerwear' },
  { id: 'ponchos', name: 'Ponchos', displayName: 'Ponchos', imageUrl: '/images/categories/ponchos.jpg', isActive: true, sortOrder: 24, group: 'Outerwear' },

  // Workwear & Safety
  { id: 'coveralls', name: 'Coveralls', displayName: 'Coveralls', imageUrl: '/images/categories/coveralls.jpg', isActive: true, sortOrder: 25, group: 'Workwear' },
  { id: 'safety-vests', name: 'Safety Vests', displayName: 'Safety Vests', imageUrl: '/images/categories/safety-vests.jpg', isActive: true, sortOrder: 26, group: 'Workwear' },
  { id: 'chef-jackets', name: 'Chef Jackets', displayName: 'Chef Jackets', imageUrl: '/images/categories/chef-jackets.jpg', isActive: true, sortOrder: 27, group: 'Workwear' },
  { id: 'aprons', name: 'Aprons', displayName: 'Aprons', imageUrl: '/images/categories/aprons.jpg', isActive: true, sortOrder: 28, group: 'Workwear' },
  { id: 'tabards', name: 'Tabards', displayName: 'Tabards', imageUrl: '/images/categories/tabards.jpg', isActive: true, sortOrder: 29, group: 'Workwear' },
  { id: 'bibs', name: 'Bibs', displayName: 'Bibs', imageUrl: '/images/categories/bibs.jpg', isActive: true, sortOrder: 30, group: 'Workwear' },
  { id: 'dungarees', name: 'Dungarees', displayName: 'Dungarees', imageUrl: '/images/categories/dungarees.jpg', isActive: true, sortOrder: 31, group: 'Workwear' },

  // Headwear
  { id: 'caps', name: 'Caps', displayName: 'Caps', imageUrl: '/images/categories/caps.jpg', isActive: true, sortOrder: 32, group: 'Headwear' },
  { id: 'hats', name: 'Hats', displayName: 'Hats', imageUrl: '/images/categories/hats.jpg', isActive: true, sortOrder: 33, group: 'Headwear' },
  { id: 'beanies', name: 'Beanies', displayName: 'Beanies', imageUrl: '/images/categories/beanies.jpg', isActive: true, sortOrder: 34, group: 'Headwear' },
  { id: 'helmets', name: 'Helmets', displayName: 'Helmets', imageUrl: '/images/categories/helmets.jpg', isActive: true, sortOrder: 35, group: 'Headwear' },
  { id: 'headbands', name: 'Headbands', displayName: 'Headbands', imageUrl: '/images/categories/headbands.jpg', isActive: true, sortOrder: 36, group: 'Headwear' },

  // Footwear
  { id: 'shoes', name: 'Shoes', displayName: 'Shoes', imageUrl: '/images/categories/shoes.jpg', isActive: true, sortOrder: 37, group: 'Footwear' },
  { id: 'boots', name: 'Boots', displayName: 'Boots', imageUrl: '/images/categories/boots.jpg', isActive: true, sortOrder: 38, group: 'Footwear' },
  { id: 'trainers', name: 'Trainers', displayName: 'Trainers', imageUrl: '/images/categories/trainers.jpg', isActive: true, sortOrder: 39, group: 'Footwear' },
  { id: 'slippers', name: 'Slippers', displayName: 'Slippers', imageUrl: '/images/categories/slippers.jpg', isActive: true, sortOrder: 40, group: 'Footwear' },

  // Bags & Accessories
  { id: 'bags', name: 'Bags', displayName: 'Bags', imageUrl: '/images/categories/bags.jpg', isActive: true, sortOrder: 41, group: 'Bags & Accessories' },
  { id: 'laptop-cases', name: 'Laptop Cases', displayName: 'Laptop Cases', imageUrl: '/images/categories/laptop-cases.jpg', isActive: true, sortOrder: 42, group: 'Bags & Accessories' },
  { id: 'document-wallets', name: 'Document Wallets', displayName: 'Document Wallets', imageUrl: '/images/categories/document-wallets.jpg', isActive: true, sortOrder: 43, group: 'Bags & Accessories' },
  { id: 'pencil-cases', name: 'Pencil Cases', displayName: 'Pencil Cases', imageUrl: '/images/categories/pencil-cases.jpg', isActive: true, sortOrder: 44, group: 'Bags & Accessories' },
  { id: 'accessories', name: 'Accessories', displayName: 'Accessories', imageUrl: '/images/categories/accessories.jpg', isActive: true, sortOrder: 45, group: 'Bags & Accessories' },

  // Underwear & Sleepwear
  { id: 'boxers', name: 'Boxers', displayName: 'Boxers', imageUrl: '/images/categories/boxers.jpg', isActive: true, sortOrder: 46, group: 'Underwear & Sleepwear' },
  { id: 'bras', name: 'Bras', displayName: 'Bras', imageUrl: '/images/categories/bras.jpg', isActive: true, sortOrder: 47, group: 'Underwear & Sleepwear' },
  { id: 'pyjamas', name: 'Pyjamas', displayName: 'Pyjamas', imageUrl: '/images/categories/pyjamas.jpg', isActive: true, sortOrder: 48, group: 'Underwear & Sleepwear' },
  { id: 'onesies', name: 'Onesies', displayName: 'Onesies', imageUrl: '/images/categories/onesies.jpg', isActive: true, sortOrder: 49, group: 'Underwear & Sleepwear' },
  { id: 'bodysuits', name: 'Bodysuits', displayName: 'Bodysuits', imageUrl: '/images/categories/bodysuits.jpg', isActive: true, sortOrder: 50, group: 'Underwear & Sleepwear' },
  { id: 'sleepsuits', name: 'Sleepsuits', displayName: 'Sleepsuits', imageUrl: '/images/categories/sleepsuits.jpg', isActive: true, sortOrder: 51, group: 'Underwear & Sleepwear' },
  { id: 'robes', name: 'Robes', displayName: 'Robes', imageUrl: '/images/categories/robes.jpg', isActive: true, sortOrder: 52, group: 'Underwear & Sleepwear' },
  { id: 'gowns', name: 'Gowns', displayName: 'Gowns', imageUrl: '/images/categories/gowns.jpg', isActive: true, sortOrder: 53, group: 'Underwear & Sleepwear' },

  // Special Clothing
  { id: 'dresses', name: 'Dresses', displayName: 'Dresses', imageUrl: '/images/categories/dresses.jpg', isActive: true, sortOrder: 54, group: 'Special Clothing' },
  { id: 'sports-overtops', name: 'Sports Overtops', displayName: 'Sports Overtops', imageUrl: '/images/categories/sports-overtops.jpg', isActive: true, sortOrder: 55, group: 'Special Clothing' },
  { id: 'baselayers', name: 'Baselayers', displayName: 'Baselayers', imageUrl: '/images/categories/baselayers.jpg', isActive: true, sortOrder: 56, group: 'Special Clothing' },

  // Safety & Protection
  { id: 'gloves', name: 'Gloves', displayName: 'Gloves', imageUrl: '/images/categories/gloves.jpg', isActive: true, sortOrder: 57, group: 'Safety & Protection' },
  { id: 'goggles', name: 'Goggles', displayName: 'Goggles', imageUrl: '/images/categories/goggles.jpg', isActive: true, sortOrder: 58, group: 'Safety & Protection' },
  { id: 'glasses', name: 'Glasses', displayName: 'Glasses', imageUrl: '/images/categories/glasses.jpg', isActive: true, sortOrder: 59, group: 'Safety & Protection' },
  { id: 'kneepads', name: 'Kneepads', displayName: 'Kneepads', imageUrl: '/images/categories/kneepads.jpg', isActive: true, sortOrder: 60, group: 'Safety & Protection' },
  { id: 'arm-guards', name: 'Arm Guards', displayName: 'Arm Guards', imageUrl: '/images/categories/arm-guards.jpg', isActive: true, sortOrder: 61, group: 'Safety & Protection' },
  { id: 'quad-guards', name: 'Quad Guards', displayName: 'Quad Guards', imageUrl: '/images/categories/quad-guards.jpg', isActive: true, sortOrder: 62, group: 'Safety & Protection' },
  { id: 'ear-muffs', name: 'Ear Muffs', displayName: 'Ear Muffs', imageUrl: '/images/categories/ear-muffs.jpg', isActive: true, sortOrder: 63, group: 'Safety & Protection' },

  // Small Accessories
  { id: 'socks', name: 'Socks', displayName: 'Socks', imageUrl: '/images/categories/socks.jpg', isActive: true, sortOrder: 64, group: 'Small Accessories' },
  { id: 'scarves', name: 'Scarves', displayName: 'Scarves', imageUrl: '/images/categories/scarves.jpg', isActive: true, sortOrder: 65, group: 'Small Accessories' },
  { id: 'snoods', name: 'Snoods', displayName: 'Snoods', imageUrl: '/images/categories/snoods.jpg', isActive: true, sortOrder: 66, group: 'Small Accessories' },
  { id: 'ties', name: 'Ties', displayName: 'Ties', imageUrl: '/images/categories/ties.jpg', isActive: true, sortOrder: 67, group: 'Small Accessories' },
  { id: 'belts', name: 'Belts', displayName: 'Belts', imageUrl: '/images/categories/belts.jpg', isActive: true, sortOrder: 68, group: 'Small Accessories' },
  { id: 'braces', name: 'Braces', displayName: 'Braces', imageUrl: '/images/categories/braces.jpg', isActive: true, sortOrder: 69, group: 'Small Accessories' },
  { id: 'armbands', name: 'Armbands', displayName: 'Armbands', imageUrl: '/images/categories/armbands.jpg', isActive: true, sortOrder: 70, group: 'Small Accessories' },
  { id: 'keyrings', name: 'Keyrings', displayName: 'Keyrings', imageUrl: '/images/categories/keyrings.jpg', isActive: true, sortOrder: 71, group: 'Small Accessories' },
  { id: 'laces', name: 'Laces', displayName: 'Laces', imageUrl: '/images/categories/laces.jpg', isActive: true, sortOrder: 72, group: 'Small Accessories' },

  // Home & Lifestyle
  { id: 'towels', name: 'Towels', displayName: 'Towels', imageUrl: '/images/categories/towels.jpg', isActive: true, sortOrder: 73, group: 'Home & Lifestyle' },
  { id: 'blankets', name: 'Blankets', displayName: 'Blankets', imageUrl: '/images/categories/blankets.jpg', isActive: true, sortOrder: 74, group: 'Home & Lifestyle' },
  { id: 'bedding', name: 'Bedding', displayName: 'Bedding', imageUrl: '/images/categories/bedding.jpg', isActive: true, sortOrder: 75, group: 'Home & Lifestyle' },
  { id: 'cushions', name: 'Cushions', displayName: 'Cushions', imageUrl: '/images/categories/cushions.jpg', isActive: true, sortOrder: 76, group: 'Home & Lifestyle' },
  { id: 'cushion-covers', name: 'Cushion Covers', displayName: 'Cushion Covers', imageUrl: '/images/categories/cushion-covers.jpg', isActive: true, sortOrder: 77, group: 'Home & Lifestyle' },
  { id: 'tablecloths', name: 'Tablecloths', displayName: 'Tablecloths', imageUrl: '/images/categories/tablecloths.jpg', isActive: true, sortOrder: 78, group: 'Home & Lifestyle' },
  { id: 'hot-water-bottles-covers', name: 'Hot Water Bottles & Covers', displayName: 'Hot Water Bottles & Covers', imageUrl: '/images/categories/hot-water-bottles.jpg', isActive: true, sortOrder: 79, group: 'Home & Lifestyle' },

  // Gifts & Novelty
  { id: 'gifts', name: 'Gifts', displayName: 'Gifts', imageUrl: '/images/categories/gifts.jpg', isActive: true, sortOrder: 80, group: 'Gifts & Novelty' },
  { id: 'soft-toys', name: 'Soft Toys', displayName: 'Soft Toys', imageUrl: '/images/categories/soft-toys.jpg', isActive: true, sortOrder: 81, group: 'Gifts & Novelty' },
  { id: 'christmas-animated-characters', name: 'Christmas Animated Characters', displayName: 'Christmas Characters', imageUrl: '/images/categories/christmas-characters.jpg', isActive: true, sortOrder: 82, group: 'Gifts & Novelty' },
  { id: 'dog-vests', name: 'Dog Vests', displayName: 'Dog Vests', imageUrl: '/images/categories/dog-vests.jpg', isActive: true, sortOrder: 83, group: 'Gifts & Novelty' },
  { id: 'travel-sets', name: 'Travel Sets', displayName: 'Travel Sets', imageUrl: '/images/categories/travel-sets.jpg', isActive: true, sortOrder: 84, group: 'Gifts & Novelty' },

  // Tools & Supplies
  { id: 'bottles', name: 'Bottles', displayName: 'Bottles', imageUrl: '/images/categories/bottles.jpg', isActive: false, sortOrder: 85, group: 'Tools & Supplies' },
  { id: 'freezer-blocks', name: 'Freezer Blocks', displayName: 'Freezer Blocks', imageUrl: '/images/categories/freezer-blocks.jpg', isActive: false, sortOrder: 86, group: 'Tools & Supplies' },
  { id: 'batteries', name: 'Batteries', displayName: 'Batteries', imageUrl: '/images/categories/batteries.jpg', isActive: false, sortOrder: 87, group: 'Tools & Supplies' },
  { id: 'storage', name: 'Storage', displayName: 'Storage', imageUrl: '/images/categories/storage.jpg', isActive: false, sortOrder: 88, group: 'Tools & Supplies' },
  { id: 'straps', name: 'Straps', displayName: 'Straps', imageUrl: '/images/categories/straps.jpg', isActive: false, sortOrder: 89, group: 'Tools & Supplies' },
  { id: 'reflective-tape', name: 'Reflective Tape', displayName: 'Reflective Tape', imageUrl: '/images/categories/reflective-tape.jpg', isActive: false, sortOrder: 90, group: 'Tools & Supplies' },
  { id: 'packing-tape', name: 'Packing Tape', displayName: 'Packing Tape', imageUrl: '/images/categories/packing-tape.jpg', isActive: false, sortOrder: 91, group: 'Tools & Supplies' },
  { id: 'paper', name: 'Paper', displayName: 'Paper', imageUrl: '/images/categories/paper.jpg', isActive: false, sortOrder: 92, group: 'Tools & Supplies' },
  { id: 'bin-bags', name: 'Bin Bags', displayName: 'Bin Bags', imageUrl: '/images/categories/bin-bags.jpg', isActive: false, sortOrder: 93, group: 'Tools & Supplies' },
  { id: 'mail-order-bags', name: 'Mail Order Bags', displayName: 'Mail Order Bags', imageUrl: '/images/categories/mail-order-bags.jpg', isActive: false, sortOrder: 94, group: 'Tools & Supplies' },
  { id: 'shirt-bags', name: 'Shirt Bags', displayName: 'Shirt Bags', imageUrl: '/images/categories/shirt-bags.jpg', isActive: false, sortOrder: 95, group: 'Tools & Supplies' },
  { id: 'disinfectent-wipes', name: 'Disinfectent Wipes', displayName: 'Disinfectant Wipes', imageUrl: '/images/categories/disinfectant-wipes.jpg', isActive: false, sortOrder: 96, group: 'Tools & Supplies' },
  { id: 'first-aid-boxes', name: 'First Aid Boxes', displayName: 'First Aid Boxes', imageUrl: '/images/categories/first-aid-boxes.jpg', isActive: false, sortOrder: 97, group: 'Tools & Supplies' },

  // Embroidery & Customization
  { id: 'embroidery-accessories', name: 'Embroidery Accessories', displayName: 'Embroidery Accessories', imageUrl: '/images/categories/embroidery-accessories.jpg', isActive: false, sortOrder: 98, group: 'Embroidery & Customization' },
  { id: 'embroidery-backing', name: 'Embroidery Backing', displayName: 'Embroidery Backing', imageUrl: '/images/categories/embroidery-backing.jpg', isActive: false, sortOrder: 99, group: 'Embroidery & Customization' },
  { id: 'chef-jacket-studs', name: 'Chef Jacket Studs', displayName: 'Chef Jacket Studs', imageUrl: '/images/categories/chef-jacket-studs.jpg', isActive: false, sortOrder: 100, group: 'Embroidery & Customization' }
];

// Get active categories only
export const getActiveCategoryMappings = (): CategoryMapping[] => {
  return defaultCategoryMappings.filter(cat => cat.isActive);
};

// Get categories by group
export const getCategoriesByGroup = (): Record<string, CategoryMapping[]> => {
  const activeCategories = getActiveCategoryMappings();
  return activeCategories.reduce((groups, category) => {
    if (!groups[category.group]) {
      groups[category.group] = [];
    }
    groups[category.group].push(category);
    return groups;
  }, {} as Record<string, CategoryMapping[]>);
};

// Get category by name
export const getCategoryByName = (name: string): CategoryMapping | undefined => {
  return defaultCategoryMappings.find(cat => cat.name === name);
};