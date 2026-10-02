import type { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'cat-utensils',
    name: 'Kitchen Utensils',
    iconName: 'Utensils',
    productCount: 142,
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=400&q=80',
    description: 'Wooden Turners, Whisks, Ladles & Spatulas',
    subcategories: ['Wooden Spoons', 'Stainless Steel Whisks', 'Slotted Turners', 'Deep Ladles', 'Tongs & Clips']
  },
  {
    id: 'cat-cutlery',
    name: 'Cutlery & Spoons',
    iconName: 'UtensilsCrossed',
    productCount: 96,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80',
    description: 'Dinner Spoon Sets, Forks & Vintage Cutlery',
    subcategories: ['Dinner Spoons', 'Dessert Forks', 'Butter Knives', 'Serving Spoons', 'Chopsticks']
  },
  {
    id: 'cat-cookware',
    name: 'Cookware & Pans',
    iconName: 'Flame',
    productCount: 88,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    description: 'Cast Iron Skillets, Kadai & Sauce Pans',
    subcategories: ['Cast Iron Skillets', 'Non-Stick Pans', 'Deep Kadai', 'Milk Pots', 'Tawa & Griddles']
  },
  {
    id: 'cat-plates',
    name: 'Plates & Bowls',
    iconName: 'Disc',
    productCount: 118,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80',
    description: 'Stoneware, Dinner Thalis & Ceramic Bowls',
    subcategories: ['Ceramic Salad Bowls', 'Stainless Dinner Thalis', 'Soup Bowls', 'Quarter Plates', 'Serving Platters']
  },
  {
    id: 'cat-cups',
    name: 'Cups & Mugs',
    iconName: 'Coffee',
    productCount: 74,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    description: 'Vintage Tea Cups, Coffee Mugs & Saucers',
    subcategories: ['Amber Glass Cups', 'Stoneware Mugs', 'Chai Glasses', 'Thermal Flasks', 'Tea Sets']
  },
  {
    id: 'cat-storage',
    name: 'Storage & Jars',
    iconName: 'PackageOpen',
    productCount: 130,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&q=80',
    description: 'Borosilicate Glass Jars & Food Containers',
    subcategories: ['Airtight Glass Jars', 'Acacia Wood Lid Jars', 'Spice Organizers', 'Lunch Boxes', 'Oil Bottles']
  },
  {
    id: 'cat-home',
    name: 'Home & Dining',
    iconName: 'Home',
    productCount: 105,
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80',
    description: 'Serving Trays, Coasters & Table Runners',
    subcategories: ['Teak Wooden Trays', 'Jute Coaster Sets', 'Dining Placemats', 'Towel Holders', 'Napkin Rings']
  },
  {
    id: 'cat-preowned',
    name: 'Pre-Owned Deals',
    iconName: 'Sparkles',
    productCount: 220,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    description: 'Inspected, Sanitized & Certified Savings',
    subcategories: ['Like New Utensils', 'Vintage Collectibles', 'Re-Seasoned Skillets', 'Under ₹299 Corner', 'Clearance Picks']
  },
  {
    id: 'cat-appliances',
    name: 'Small Appliances',
    iconName: 'Zap',
    productCount: 65,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&q=80',
    description: 'Electric Kettles, Blenders & Kitchen Scales',
    subcategories: ['Electric Kettles', 'Hand Blenders', 'Digital Food Scales', 'Toasters', 'Coffee Grinders']
  }
];
