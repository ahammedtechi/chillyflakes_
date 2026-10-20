import type { Category } from '../types';

export interface MarketplaceCategory extends Category {
  id: string;
  name: string;
  i18nKey: string;
  image: string;
}

/**
 * Single source of truth for marketplace categories across the platform
 * (Landing page Shop by Category, CategoryBar, and Vendor Registration).
 */
export const categories: MarketplaceCategory[] = [
  {
    id: 'natural-products',
    name: 'Natural Products',
    i18nKey: 'categories.naturalProducts',
    iconName: 'Sparkles',
    productCount: 148,
    // Using clean local botanical care image to prevent broken image / alt text issue
    image: '/botanical-care-banner.jpg',
    description: '100% Organic face creams, botanical elixirs & essential oils',
    subcategories: ['Face Creams', 'Botanical Oils', 'Herbal Salves', 'Body Butters', 'Aromatherapy']
  },
  {
    id: 'handmade-products',
    name: 'Handmade Products',
    i18nKey: 'categories.handmadeProducts',
    iconName: 'PackageOpen',
    productCount: 192,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    description: 'Woven wicker baskets, hand-carved wood & artisanal soaps',
    subcategories: ['Woven Baskets', 'Artisan Soaps', 'Pottery & Ceramics', 'Carved Wood', 'Hand-Knitted Goods']
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    i18nKey: 'categories.jewelry',
    iconName: 'Gem',
    productCount: 114,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    description: 'Handcrafted silver, moonstone necklaces & artisan rings',
    subcategories: ['Silver Necklaces', 'Gemstone Rings', 'Boho Earrings', 'Beaded Bracelets', 'Pendants']
  },
  {
    id: 'clothes-fashion',
    name: 'Clothes & Fashion',
    i18nKey: 'categories.clothesFashion',
    iconName: 'Shirt',
    productCount: 86,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80',
    description: 'Eco-friendly breathable linen, summer dresses & organic cotton',
    subcategories: ['Summer Dresses', 'Organic Cotton Tops', 'Linen Trousers', 'Hand-dyed Scarves', 'Kimono Wraps']
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    i18nKey: 'categories.homeLiving',
    iconName: 'Home',
    productCount: 165,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
    description: 'Macrame plant hangers, terracotta pottery & soy candles',
    subcategories: ['Macrame Planters', 'Terracotta Vases', 'Soy Wax Candles', 'Jute Rugs', 'Wooden Trays']
  },
  {
    id: 'retail-products',
    name: 'Retail Products',
    i18nKey: 'categories.retailProducts',
    iconName: 'ShoppingBag',
    productCount: 142,
    image: '/retail-products.jpg',
    description: 'Curated pantry goods, artisanal spices, natural oils & packaged grocery',
    subcategories: ['Artisan Pantry', 'Botanical Oils & Vinegar', 'Organic Teas & Granola', 'Specialty Spices', 'Everyday Essentials']
  },
  {
    id: 'services',
    name: 'Services',
    i18nKey: 'categories.services',
    iconName: 'Briefcase',
    productCount: 34,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80',
    description: 'Holistic wellness, relaxing massage, natural beauty & home care',
    subcategories: ['Massage Therapy', 'Beauty & Skincare', 'Academic Tutoring', 'Home Eco-Cleaning', 'Personal Care']
  },
  {
    id: 'books',
    name: 'Books',
    i18nKey: 'categories.books',
    iconName: 'BookOpen',
    productCount: 52,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    description: 'Authentic literature, traditional wellness guides, art & regional books',
    subcategories: ['Indian Literature', 'Wellness & Yoga', 'Art & Craft Guides', 'Children Stories', 'Cookbooks']
  }
];

export default categories;
