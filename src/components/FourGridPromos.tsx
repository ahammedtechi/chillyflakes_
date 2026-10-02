import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

interface PromoBoxItem {
  name: string;
  price: string;
  image: string;
}

interface PromoBox {
  title: string;
  category: string;
  items: PromoBoxItem[];
}

const promoBoxes: PromoBox[] = [
  {
    title: 'Top Deals on Kitchen Utensils',
    category: 'Kitchen Utensils',
    items: [
      { name: 'Wooden Spoons', price: 'From ₹189', image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=300&q=80' },
      { name: 'Stainless Whisks', price: 'From ₹149', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80' },
      { name: 'Slotted Turners', price: 'From ₹179', image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=300&q=80' },
      { name: 'Deep Ladles', price: 'From ₹199', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  {
    title: 'Pre-Owned Verified Bestsellers',
    category: 'Pre-Owned Deals',
    items: [
      { name: 'Vintage Teak Trays', price: 'From ₹299', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80' },
      { name: 'Brass Measuring Spoons', price: 'From ₹369', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80' },
      { name: 'Amber Tea Cups', price: 'From ₹219', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80' },
      { name: 'Dinner Thali Plates', price: 'From ₹249', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  {
    title: 'Smart Pantry Storage Essentials',
    category: 'Storage & Jars',
    items: [
      { name: 'Airtight Glass Jars', price: 'From ₹289', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=300&q=80' },
      { name: 'Acacia Lid Canisters', price: 'From ₹229', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=300&q=80' },
      { name: 'Spice Box Organizers', price: 'From ₹199', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80' },
      { name: 'Thermal Jars', price: 'From ₹349', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  {
    title: 'Stoneware & Dining Decor',
    category: 'Plates & Bowls',
    items: [
      { name: 'Studio Salad Bowls', price: 'From ₹349', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=300&q=80' },
      { name: 'Cutlery 6-Piece Sets', price: 'From ₹399', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&q=80' },
      { name: 'Woven Jute Coasters', price: 'From ₹199', image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=300&q=80' },
      { name: 'Ceramic Tea Mugs', price: 'From ₹199', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80' },
    ]
  },
];

export const FourGridPromos: React.FC = () => {
  const { setSelectedCategory } = useStore();

  const handleCardClick = (cat: string) => {
    setSelectedCategory(cat);
    const shopEl = document.getElementById('shop-section');
    if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-[1360px] mx-auto px-2 sm:px-4 py-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {promoBoxes.map((box, index) => (
          <div
            key={index}
            className="bg-[#263936] text-[#F1EFE5] rounded-xl shadow-forest border border-[#355247] p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-base font-serif font-light text-[#F1EFE5] leading-tight mb-3">
                {box.title}
              </h3>

              {/* 2x2 Image Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {box.items.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleCardClick(box.category)}
                    className="p-2 border border-[#355247] rounded-lg hover:border-[#8A9C82]/60 cursor-pointer group bg-[#1E2D2A] flex flex-col justify-between transition-colors"
                  >
                    <div className="w-full aspect-square mb-1.5 flex items-center justify-center overflow-hidden rounded bg-[#F7F5ED] p-1.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-[11px] font-medium text-[#F1EFE5] line-clamp-1 group-hover:text-[#8A9C82] transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[11px] font-mono text-[#dfab7e]">
                      {item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleCardClick(box.category)}
              className="text-xs font-semibold text-[#8A9C82] hover:text-[#F1EFE5] flex items-center gap-1 pt-1 transition-colors uppercase tracking-wider"
            >
              <span>Explore More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
