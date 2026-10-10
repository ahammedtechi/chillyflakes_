import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, X, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  price: string;
  image: string;
}

const servicesData: ServiceItem[] = [
  // Layer 1: Screenshot Row
  {
    id: 'srv-massage',
    title: 'Massage Therapy',
    subtitle: 'Relax & Rejuvenate',
    description: 'Therapeutic deep-tissue and Swedish massage with cold-pressed botanical essential oils. Relieves muscle tension and restores full-body tranquility.',
    duration: '60 - 90 mins',
    price: 'From CAD $75.00',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-beauty',
    title: 'Beauty & Skincare',
    subtitle: 'Look & Feel Your Best',
    description: 'Organic botanical facials, all-natural micro-exfoliation, and custom herbal masks formulated for sensitive and dry skin types.',
    duration: '45 - 60 mins',
    price: 'From CAD $55.00',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-tutoring',
    title: 'Tutoring',
    subtitle: 'Learn & Grow',
    description: 'Personalized 1-on-1 and small group academic tutoring in STEM, languages, and creative writing led by certified educators.',
    duration: '60 mins per session',
    price: 'From CAD $40.00 / hr',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-cleaning',
    title: 'Home Cleaning',
    subtitle: 'A Cleaner, Healthier Home',
    description: 'Eco-friendly, chemical-free home sanitation using natural plant-derived cleaners. Safe for children, pets, and the planet.',
    duration: '2 - 4 hours',
    price: 'From CAD $90.00',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
  },

  // Layer 2: Second Requested Feature Layer (Same Design, Different Services)
  {
    id: 'srv-pottery',
    title: 'Pottery Workshop',
    subtitle: 'Craft & Create',
    description: 'Hands-on wheel-throwing and ceramic sculpture classes guided by resident clay artisans. All materials, firing, and glazing included.',
    duration: '2 hours',
    price: 'From CAD $65.00',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-yoga',
    title: 'Yoga & Mindfulness',
    subtitle: 'Mind, Body & Spirit',
    description: 'Restorative Hatha & Vinyasa flow sessions combined with guided breathwork and sound healing for mental clarity and inner balance.',
    duration: '60 - 75 mins',
    price: 'From CAD $30.00',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-plant-styling',
    title: 'Plant Care & Styling',
    subtitle: 'Living Green Spaces',
    description: 'Custom botanical interior consultation, organic repotting, pest diagnosis, and seasonal greenery curation for homes and offices.',
    duration: '90 mins',
    price: 'From CAD $50.00',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-wood-restoration',
    title: 'Wood Restoration',
    subtitle: 'Revitalize & Preserve',
    description: 'Expert repair and rejuvenation of antique teak, oak, and rosewood furniture with natural shellac and beeswax finishes.',
    duration: 'Consultation & Service',
    price: 'From CAD $85.00',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  },
];

export const ServicesSection: React.FC = () => {
  const { showToast } = useStore();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleBookService = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
    showToast(`Appointment requested for ${selectedService?.title}! Our team will contact you shortly.`, 'success');
    setTimeout(() => {
      setSelectedService(null);
      setBookingConfirmed(false);
    }, 2200);
  };

  return (
    <section id="services-section" className="py-12 sm:py-16 bg-[#FAF7F2] border-b border-[#ECE7DD]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Heading "Services" & Description matching user request */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#223B28] tracking-tight">
              Services
            </h2>
            <p className="font-medium text-sm sm:text-base text-[#2D3A2F]">
              Skilled professionals, at your service
            </p>
            <p className="text-xs sm:text-sm text-[#506052] leading-relaxed max-w-sm font-normal">
              From wellness to personal care, find trusted service providers in your community.
            </p>

            {/* Value badges */}
            <div className="pt-2 space-y-2 text-xs text-[#556956]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2E4D34]" />
                <span>Verified & Vetted Community Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2E4D34]" />
                <span>100% Transparent Pricing</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => setSelectedService(servicesData[0])}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2E4D34] hover:bg-[#233B27] text-white text-xs sm:text-sm font-medium rounded-full shadow-xs transition-all duration-300 group"
              >
                <span>Browse Services</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: 2 Layers of Service Cards (4 per row on desktop, 2 per row on mobile) */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            
            {/* Layer 1 (Original Row) & Layer 2 (Requested Second Row) in a clean 4-column grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
              {servicesData.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#ECE7DD] hover:border-[#C4D5C2] transition-all duration-300 hover:shadow-lg flex flex-col justify-between cursor-pointer"
                >
                  {/* Service Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-[#F6F3EC]">
                    <img
                      src={service.image}
                      alt={service.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                  </div>

                  {/* Service Info matching screenshot */}
                  <div className="p-3 sm:p-3.5 text-center flex-grow flex flex-col justify-center">
                    <h3 className="font-semibold text-xs sm:text-sm text-[#223B28] group-hover:text-[#2E4D34] transition-colors line-clamp-1">
                      {service.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-[#6C7B6D] mt-0.5 line-clamp-1">
                      {service.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Interactive Service Detail & Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSelectedService(null)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#ECE7DD] text-[#223B28]">
              
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 text-[#7E8F80] hover:text-[#223B28] rounded-full hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-video w-full rounded-2xl overflow-hidden mb-5">
                <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#2E4D34] bg-[#EAF1EA] px-3 py-1 rounded-full">
                  {selectedService.price}
                </span>
                <span className="text-xs text-[#7E8F80] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {selectedService.duration}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#223B28]">{selectedService.title}</h3>
              <p className="text-xs font-medium text-[#6C7B6D] mt-0.5">{selectedService.subtitle}</p>
              <p className="text-xs text-[#506052] leading-relaxed mt-3">{selectedService.description}</p>

              {bookingConfirmed ? (
                <div className="mt-6 p-4 bg-[#EAF1EA] rounded-2xl flex items-center gap-3 text-[#2E4D34] text-xs font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-[#2E4D34]" />
                  <span>Your booking request has been submitted successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleBookService} className="mt-6 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-[#506052] uppercase">Preferred Date</label>
                      <input 
                        type="date" 
                        required 
                        defaultValue={new Date().toISOString().split('T')[0]} 
                        className="w-full mt-1 px-3 py-2 border border-[#ECE7DD] rounded-xl text-xs focus:outline-none focus:border-[#2E4D34]" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#506052] uppercase">Preferred Time</label>
                      <select className="w-full mt-1 px-3 py-2 border border-[#ECE7DD] rounded-xl text-xs focus:outline-none focus:border-[#2E4D34] bg-white">
                        <option>Morning (10:00 AM)</option>
                        <option>Afternoon (2:00 PM)</option>
                        <option>Evening (5:30 PM)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[#506052] uppercase">Your Name & Phone / Email</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Maya Sharma (+1 / +91)" 
                      className="w-full mt-1 px-3 py-2 border border-[#ECE7DD] rounded-xl text-xs focus:outline-none focus:border-[#2E4D34]" 
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#2E4D34] hover:bg-[#233B27] text-white text-xs font-semibold rounded-xl transition-colors mt-2"
                  >
                    Request Booking Now
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
