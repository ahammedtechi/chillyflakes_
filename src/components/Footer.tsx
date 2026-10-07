import React from 'react';
import { 
  Store, 
  Sparkles, 
  Gift, 
  HelpCircle 
} from 'lucide-react';

export const Footer: React.FC = () => {

  return (
    <footer className="bg-[#3C4A3E] text-[#F1F5EF] pt-12 border-t border-[#313E33] text-xs mt-8">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        
        {/* Main 4+2 Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-10 border-b border-[#4A5B4C]">
          
          {/* ABOUT */}
          <div className="space-y-2.5">
            <h4 className="text-[#C4D3C2] text-[11px] font-bold uppercase tracking-wider mb-3">
              ABOUT
            </h4>
            <ul className="space-y-2 text-[#E4EBE2]/80">
              <li><a href="#about" onClick={(e) => { e.preventDefault(); alert("Contact Us: support@chillyflakes.in"); }} className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); alert("About Chilly Flakes: Sustainable Kitchen & Homeware marketplace."); }} className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#careers" onClick={(e) => { e.preventDefault(); alert("Careers: 12 open roles in product and curation."); }} className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#stories" onClick={(e) => { e.preventDefault(); alert("Chilly Flakes Stories: Circular kitchen movements."); }} className="hover:text-white transition-colors">Chilly Flakes Stories</a></li>
              <li><a href="#press" onClick={(e) => { e.preventDefault(); alert("Press: Featured in The Hindu & Architectural Digest."); }} className="hover:text-white transition-colors">Press & Media</a></li>
              <li><a href="#corporate" onClick={(e) => { e.preventDefault(); alert("Corporate Information: Chilly Flakes India Pvt Ltd."); }} className="hover:text-white transition-colors">Corporate Info</a></li>
            </ul>
          </div>

          {/* HELP */}
          <div className="space-y-2.5">
            <h4 className="text-[#C4D3C2] text-[11px] font-bold uppercase tracking-wider mb-3">
              HELP
            </h4>
            <ul className="space-y-2 text-[#E4EBE2]/80">
              <li><a href="#payments" onClick={(e) => { e.preventDefault(); alert("Payments: UPI, Cards, NetBanking & Cash on Delivery supported."); }} className="hover:text-white transition-colors">Payments</a></li>
              <li><a href="#shipping" onClick={(e) => { e.preventDefault(); alert("Shipping: Fast dispatch within 24h, delivered in 48-72h."); }} className="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#cancellation" onClick={(e) => { e.preventDefault(); alert("Cancellation & Returns: 7-day hassle-free doorstep returns."); }} className="hover:text-white transition-colors">Cancellation & Returns</a></li>
              <li><a href="#faq" onClick={(e) => { e.preventDefault(); alert("FAQ: Products undergo ultrasonic sanitation and structural grading."); }} className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#report" onClick={(e) => { e.preventDefault(); alert("Report Infringement: compliance@chillyflakes.in"); }} className="hover:text-white transition-colors">Report Infringement</a></li>
            </ul>
          </div>

          {/* CONSUMER POLICY */}
          <div className="space-y-2.5">
            <h4 className="text-[#C4D3C2] text-[11px] font-bold uppercase tracking-wider mb-3">
              CONSUMER POLICY
            </h4>
            <ul className="space-y-2 text-[#E4EBE2]/80">
              <li><a href="#policy" onClick={(e) => { e.preventDefault(); alert("Cancellation & Returns Policy"); }} className="hover:text-white transition-colors">Returns Policy</a></li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms Of Use"); }} className="hover:text-white transition-colors">Terms Of Use</a></li>
              <li><a href="#security" onClick={(e) => { e.preventDefault(); alert("Security: 256-bit SSL encrypted checkout."); }} className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy"); }} className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#sitemap" onClick={(e) => { e.preventDefault(); alert("Sitemap"); }} className="hover:text-white transition-colors">Sitemap</a></li>
              <li><a href="#grievance" onClick={(e) => { e.preventDefault(); alert("Grievance Redressal Officer: nodalofficer@chillyflakes.in"); }} className="hover:text-white transition-colors">Grievance Redressal</a></li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div className="space-y-2.5">
            <h4 className="text-[#C4D3C2] text-[11px] font-bold uppercase tracking-wider mb-3">
              SOCIAL
            </h4>
            <ul className="space-y-2 text-[#E4EBE2]/80">
              <li><a href="#fb" onClick={(e) => { e.preventDefault(); alert("Facebook @ChillyFlakesOnline"); }} className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#tw" onClick={(e) => { e.preventDefault(); alert("Twitter / X @ChillyFlakes"); }} className="hover:text-white transition-colors">Twitter / X</a></li>
              <li><a href="#yt" onClick={(e) => { e.preventDefault(); alert("YouTube: Chilly Flakes Kitchen Care"); }} className="hover:text-white transition-colors">YouTube</a></li>
              <li><a href="#ig" onClick={(e) => { e.preventDefault(); alert("Instagram @chillyflakes.store"); }} className="hover:text-white transition-colors">Instagram</a></li>
            </ul>
          </div>

          {/* Mail Us */}
          <div className="space-y-2.5 border-t lg:border-t-0 lg:border-l border-[#4A5B4C] lg:pl-6 col-span-2 sm:col-span-1">
            <h4 className="text-[#C4D3C2] text-[11px] font-bold uppercase tracking-wider mb-3">
              Mail Us:
            </h4>
            <p className="text-[#E4EBE2]/80 leading-relaxed">
              Chilly Flakes Retail Pvt. Ltd.,<br />
              Building No. 1223, 4th Floor,<br />
              Greenwood Tech Park, Sector 7,<br />
              Bengaluru, 560001, Karnataka, India
            </p>
          </div>

          {/* Registered Office Address */}
          <div className="space-y-2.5 col-span-2 sm:col-span-1">
            <h4 className="text-[#C4D3C2] text-[11px] font-bold uppercase tracking-wider mb-3">
              Registered Office:
            </h4>
            <p className="text-[#E4EBE2]/80 leading-relaxed">
              Chilly Flakes Retail Pvt. Ltd.,<br />
              Building No. 1223, 4th Floor,<br />
              Greenwood Tech Park, Sector 7,<br />
              Bengaluru, 560001, Karnataka, India<br />
              CIN : U51109KA2026PTC001223<br />
              Telephone: 1800-123-4567
            </p>
          </div>

        </div>

        {/* Bottom Bar in Deep Olive */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#ECDBC2]">
            <a href="#seller" onClick={(e) => { e.preventDefault(); alert("Become a Seller on Chilly Flakes"); }} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Store className="w-4 h-4 text-[#ECDBC2]" />
              <span className="text-white font-medium">Become a Seller</span>
            </a>

            <a href="#advertise" onClick={(e) => { e.preventDefault(); alert("Advertise on Chilly Flakes"); }} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Sparkles className="w-4 h-4 text-[#ECDBC2]" />
              <span className="text-white font-medium">Advertise</span>
            </a>

            <a href="#gift" onClick={(e) => { e.preventDefault(); alert("Chilly Flakes Gift Cards"); }} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Gift className="w-4 h-4 text-[#ECDBC2]" />
              <span className="text-white font-medium">Gift Cards</span>
            </a>

            <a href="#help" onClick={(e) => { e.preventDefault(); alert("Help Center"); }} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <HelpCircle className="w-4 h-4 text-[#ECDBC2]" />
              <span className="text-white font-medium">Help Center</span>
            </a>
          </div>

          {/* Copyright & Cards */}
          <div className="flex items-center gap-4 text-[#C4D3C2]">
            <span>© 2026 ChillyFlakes.com</span>
            <div className="flex items-center gap-1 text-[10px] text-white">
              <span className="px-2 py-0.5 bg-[#2E3A2F] border border-[#4A5B4C] rounded">VISA</span>
              <span className="px-2 py-0.5 bg-[#2E3A2F] border border-[#4A5B4C] rounded">Mastercard</span>
              <span className="px-2 py-0.5 bg-[#2E3A2F] border border-[#4A5B4C] rounded">UPI</span>
              <span className="px-2 py-0.5 bg-[#2E3A2F] border border-[#4A5B4C] rounded">COD</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
