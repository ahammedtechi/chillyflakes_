import React from 'react';
import { 
  Store, 
  Sparkles, 
  Gift, 
  HelpCircle 
} from 'lucide-react';

export const Footer: React.FC = () => {

  return (
    <footer className="bg-[#131e1c] text-[#F1EFE5] pt-10 border-t border-[#355247]/50 text-xs">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        
        {/* Main 4+2 Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-10 border-b border-[#263936]">
          
          {/* ABOUT */}
          <div className="space-y-2.5">
            <h4 className="text-[#8A9C82] text-[11px] font-bold uppercase tracking-wider mb-3">
              ABOUT
            </h4>
            <ul className="space-y-2 text-[#F1EFE5]/80">
              <li><a href="#about" onClick={(e) => { e.preventDefault(); alert("Contact Us: support@chillyflakes.in"); }} className="hover:text-[#F1EFE5] hover:underline">Contact Us</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); alert("About Chilly Flakes: Sustainable Kitchen & Homeware marketplace."); }} className="hover:text-[#F1EFE5] hover:underline">About Us</a></li>
              <li><a href="#careers" onClick={(e) => { e.preventDefault(); alert("Careers: 12 open engineering and workshop roles."); }} className="hover:text-[#F1EFE5] hover:underline">Careers</a></li>
              <li><a href="#stories" onClick={(e) => { e.preventDefault(); alert("Chilly Flakes Stories: Circular kitchen movements."); }} className="hover:text-[#F1EFE5] hover:underline">Chilly Flakes Stories</a></li>
              <li><a href="#press" onClick={(e) => { e.preventDefault(); alert("Press: Featured in The Hindu & Times Lifestyle."); }} className="hover:text-[#F1EFE5] hover:underline">Press</a></li>
              <li><a href="#corporate" onClick={(e) => { e.preventDefault(); alert("Corporate Information: Chilly Flakes India Pvt Ltd."); }} className="hover:text-[#F1EFE5] hover:underline">Corporate Information</a></li>
            </ul>
          </div>

          {/* HELP */}
          <div className="space-y-2.5">
            <h4 className="text-[#8A9C82] text-[11px] font-bold uppercase tracking-wider mb-3">
              HELP
            </h4>
            <ul className="space-y-2 text-[#F1EFE5]/80">
              <li><a href="#payments" onClick={(e) => { e.preventDefault(); alert("Payments: UPI, Cards, NetBanking & Cash on Delivery supported."); }} className="hover:text-[#F1EFE5] hover:underline">Payments</a></li>
              <li><a href="#shipping" onClick={(e) => { e.preventDefault(); alert("Shipping: Fast dispatch within 24h, delivered in 48-72h."); }} className="hover:text-[#F1EFE5] hover:underline">Shipping</a></li>
              <li><a href="#cancellation" onClick={(e) => { e.preventDefault(); alert("Cancellation & Returns: 7-day hassle-free doorstep returns."); }} className="hover:text-[#F1EFE5] hover:underline">Cancellation & Returns</a></li>
              <li><a href="#faq" onClick={(e) => { e.preventDefault(); alert("FAQ: Products undergo ultrasonic sanitation and structural grading."); }} className="hover:text-[#F1EFE5] hover:underline">FAQ</a></li>
              <li><a href="#report" onClick={(e) => { e.preventDefault(); alert("Report Infringement: compliance@chillyflakes.in"); }} className="hover:text-[#F1EFE5] hover:underline">Report Infringement</a></li>
            </ul>
          </div>

          {/* CONSUMER POLICY */}
          <div className="space-y-2.5">
            <h4 className="text-[#8A9C82] text-[11px] font-bold uppercase tracking-wider mb-3">
              CONSUMER POLICY
            </h4>
            <ul className="space-y-2 text-[#F1EFE5]/80">
              <li><a href="#policy" onClick={(e) => { e.preventDefault(); alert("Cancellation & Returns Policy"); }} className="hover:text-[#F1EFE5] hover:underline">Cancellation & Returns</a></li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms Of Use"); }} className="hover:text-[#F1EFE5] hover:underline">Terms Of Use</a></li>
              <li><a href="#security" onClick={(e) => { e.preventDefault(); alert("Security: 256-bit SSL encrypted checkout."); }} className="hover:text-[#F1EFE5] hover:underline">Security</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy"); }} className="hover:text-[#F1EFE5] hover:underline">Privacy</a></li>
              <li><a href="#sitemap" onClick={(e) => { e.preventDefault(); alert("Sitemap"); }} className="hover:text-[#F1EFE5] hover:underline">Sitemap</a></li>
              <li><a href="#grievance" onClick={(e) => { e.preventDefault(); alert("Grievance Redressal Officer: nodalofficer@chillyflakes.in"); }} className="hover:text-[#F1EFE5] hover:underline">Grievance Redressal</a></li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div className="space-y-2.5">
            <h4 className="text-[#8A9C82] text-[11px] font-bold uppercase tracking-wider mb-3">
              SOCIAL
            </h4>
            <ul className="space-y-2 text-[#F1EFE5]/80">
              <li><a href="#fb" onClick={(e) => { e.preventDefault(); alert("Facebook @ChillyFlakesOnline"); }} className="hover:text-[#F1EFE5] hover:underline">Facebook</a></li>
              <li><a href="#tw" onClick={(e) => { e.preventDefault(); alert("Twitter / X @ChillyFlakes"); }} className="hover:text-[#F1EFE5] hover:underline">Twitter</a></li>
              <li><a href="#yt" onClick={(e) => { e.preventDefault(); alert("YouTube: Chilly Flakes Kitchen Care"); }} className="hover:text-[#F1EFE5] hover:underline">YouTube</a></li>
              <li><a href="#ig" onClick={(e) => { e.preventDefault(); alert("Instagram @chillyflakes.store"); }} className="hover:text-[#F1EFE5] hover:underline">Instagram</a></li>
            </ul>
          </div>

          {/* Mail Us: (Border left on desktop) */}
          <div className="space-y-2.5 border-t lg:border-t-0 lg:border-l border-[#263936] lg:pl-6 col-span-2 sm:col-span-1">
            <h4 className="text-[#8A9C82] text-[11px] font-bold uppercase tracking-wider mb-3">
              Mail Us:
            </h4>
            <p className="text-[#F1EFE5]/80 leading-relaxed">
              Chilly Flakes Retail Pvt. Ltd.,<br />
              Building No. 1223, 4th Floor,<br />
              Greenwood Tech Park, Sector 7,<br />
              Bengaluru, 560001, Karnataka, India
            </p>
          </div>

          {/* Registered Office Address: */}
          <div className="space-y-2.5 col-span-2 sm:col-span-1">
            <h4 className="text-[#8A9C82] text-[11px] font-bold uppercase tracking-wider mb-3">
              Registered Office Address:
            </h4>
            <p className="text-[#F1EFE5]/80 leading-relaxed">
              Chilly Flakes Retail Pvt. Ltd.,<br />
              Building No. 1223, 4th Floor,<br />
              Greenwood Tech Park, Sector 7,<br />
              Bengaluru, 560001, Karnataka, India<br />
              CIN : U51109KA2026PTC001223<br />
              Telephone: 1800-123-4567 / 080-12345678
            </p>
          </div>

        </div>

        {/* Bottom Bar (Flipkart Signature Icons) */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#dfab7e]">
            <a href="#seller" onClick={(e) => { e.preventDefault(); alert("Become a Seller on Chilly Flakes"); }} className="flex items-center gap-1.5 hover:underline">
              <Store className="w-4 h-4 text-[#dfab7e]" />
              <span className="text-[#F1EFE5] font-medium">Become a Seller</span>
            </a>

            <a href="#advertise" onClick={(e) => { e.preventDefault(); alert("Advertise on Chilly Flakes"); }} className="flex items-center gap-1.5 hover:underline">
              <Sparkles className="w-4 h-4 text-[#dfab7e]" />
              <span className="text-[#F1EFE5] font-medium">Advertise</span>
            </a>

            <a href="#gift" onClick={(e) => { e.preventDefault(); alert("Chilly Flakes Gift Cards"); }} className="flex items-center gap-1.5 hover:underline">
              <Gift className="w-4 h-4 text-[#dfab7e]" />
              <span className="text-[#F1EFE5] font-medium">Gift Cards</span>
            </a>

            <a href="#help" onClick={(e) => { e.preventDefault(); alert("Help Center"); }} className="flex items-center gap-1.5 hover:underline">
              <HelpCircle className="w-4 h-4 text-[#dfab7e]" />
              <span className="text-[#F1EFE5] font-medium">Help Center</span>
            </a>
          </div>

          {/* Copyright & Cards */}
          <div className="flex items-center gap-4 text-[#8A9C82]">
            <span>© 2026 ChillyFlakes.com</span>
            <div className="flex items-center gap-1 text-[10px] text-[#F1EFE5]/70">
              <span className="px-1.5 py-0.5 bg-[#1E2D2A] border border-[#355247]/60 rounded">VISA</span>
              <span className="px-1.5 py-0.5 bg-[#1E2D2A] border border-[#355247]/60 rounded">Mastercard</span>
              <span className="px-1.5 py-0.5 bg-[#1E2D2A] border border-[#355247]/60 rounded">RuPay</span>
              <span className="px-1.5 py-0.5 bg-[#1E2D2A] border border-[#355247]/60 rounded">UPI</span>
              <span className="px-1.5 py-0.5 bg-[#1E2D2A] border border-[#355247]/60 rounded">COD</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
