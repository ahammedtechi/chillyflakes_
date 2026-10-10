import type { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'cat-natural',
    name: 'Natural Products',
    iconName: 'Sparkles',
    productCount: 148,
    image: 'https://images.unsplash.com/photo-1608248597359-52d119288fa6?auto=format&fit=crop&w=400&q=80',
    description: '100% Organic face creams, botanical elixirs & essential oils',
    subcategories: ['Face Creams', 'Botanical Oils', 'Herbal Salves', 'Body Butters', 'Aromatherapy']
  },
  {
    id: 'cat-handmade',
    name: 'Handmade Products',
    iconName: 'PackageOpen',
    productCount: 192,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    description: 'Woven wicker baskets, hand-carved wood & artisanal soaps',
    subcategories: ['Woven Baskets', 'Artisan Soaps', 'Pottery & Ceramics', 'Carved Wood', 'Hand-Knitted Goods']
  },
  {
    id: 'cat-jewelry',
    name: 'Jewelry',
    iconName: 'Gem',
    productCount: 114,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    description: 'Handcrafted silver, moonstone necklaces & artisan rings',
    subcategories: ['Silver Necklaces', 'Gemstone Rings', 'Boho Earrings', 'Beaded Bracelets', 'Pendants']
  },
  {
    id: 'cat-fashion',
    name: 'Clothes & Fashion',
    iconName: 'Shirt',
    productCount: 86,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80',
    description: 'Eco-friendly breathable linen, summer dresses & organic cotton',
    subcategories: ['Summer Dresses', 'Organic Cotton Tops', 'Linen Trousers', 'Hand-dyed Scarves', 'Kimono Wraps']
  },
  {
    id: 'cat-homeliving',
    name: 'Home & Living',
    iconName: 'Home',
    productCount: 165,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
    description: 'Macrame plant hangers, terracotta pottery & soy candles',
    subcategories: ['Macrame Planters', 'Terracotta Vases', 'Soy Wax Candles', 'Jute Rugs', 'Wooden Trays']
  },
  {
    id: 'cat-gifts',
    name: 'Gifts',
    iconName: 'Gift',
    productCount: 78,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
    description: 'Handcrafted gift sets, ribbon-wrapped bundles & curated hampers',
    subcategories: ['Spa Gift Sets', 'Artisan Bundles', 'Anniversary Hampers', 'Scented Candle Sets', 'Handmade Cards']
  },
  {
    id: 'cat-services',
    name: 'Services',
    iconName: 'Briefcase',
    productCount: 34,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80',
    description: 'Holistic wellness, relaxing massage, natural beauty & home care',
    subcategories: ['Massage Therapy', 'Beauty & Skincare', 'Academic Tutoring', 'Home Eco-Cleaning', 'Personal Care']
  }
];
