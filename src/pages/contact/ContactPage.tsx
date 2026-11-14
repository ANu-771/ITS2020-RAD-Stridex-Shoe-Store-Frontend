import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How long does island-wide delivery take in Sri Lanka?',
    answer: 'Deliveries within the Colombo district (Colombo 1–15) arrive within 24 to 48 hours. Deliveries to other regions (Kandy, Galle, Kurunegala, Jaffna, etc.) take between 2 to 4 business days via our verified courier partners.',
  },
  {
    question: 'How do I qualify for Free Express Shipping?',
    answer: 'All orders with a subtotal exceeding Rs. 15,000.00 qualify for complimentary island-wide express delivery across all districts in Sri Lanka.',
  },
  {
    question: 'What is the STRIDEX shoe size exchange policy?',
    answer: 'We offer a 30-day hassle-free size exchange policy. If your pair does not fit comfortably, contact our support team or visit our Colombo Flagship Showroom with the unworn shoes in their original box for an immediate swap.',
  },
  {
    question: 'Are all shoe models 100% authentic?',
    answer: 'Yes, absolutely. Every pair sold on STRIDEX is sourced directly from certified brand distributors (Nike, Adidas, Puma, New Balance, and DSI Premier) with full authenticity backing.',
  },
  {
    question: 'What payment methods are supported in Sri Lanka?',
    answer: 'We accept major Visa, MasterCard, and online bank transfers in Sri Lankan Rupees (LKR), as well as Cash on Delivery (COD) for eligible domestic postal codes.',
  },
];

export const ContactPage: FC = () => {
  const { showToast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSubmitted(true);
    showToast('Thank you! Your message has been received by our Colombo team.', 'success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Order Inquiry',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#F2FAF4] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="font-outfit text-4xl sm:text-5xl font-extrabold text-[#26352D]">
          Get in Touch
        </h1>
        <p className="text-sm sm:text-base text-[#718078] leading-relaxed">
          Have questions about shoe sizing, your recent order, or want to visit our flagship Colombo showroom? We are always here to help.
        </p>
      </div>

      {/* Grid: Contact Information + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================== */}
        {/* LEFT: SHOWROOM & REACH DETAILS (5 COLS)                   */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#DCEBE0] p-8 shadow-xs space-y-6">
            <h3 className="font-outfit font-bold text-xl text-[#26352D]">
              Colombo Flagship Showroom
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-[#718078]">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-[#DDF3E2] text-[#59B976] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-[#26352D] block mb-0.5">Physical Address</strong>
                  <p>No. 450, Galle Road, Colombo 03, Western Province, Sri Lanka</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-[#DDF3E2] text-[#59B976] shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-[#26352D] block mb-0.5">Hotline & WhatsApp</strong>
                  <p>+94 (11) 234 5678 / +94 (77) 123 4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-[#DDF3E2] text-[#59B976] shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-[#26352D] block mb-0.5">Customer Care Email</strong>
                  <p>support@stridex.lk / orders@stridex.lk</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-[#DDF3E2] text-[#59B976] shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-[#26352D] block mb-0.5">Showroom Hours</strong>
                  <p>Monday – Saturday: 9:30 AM – 8:00 PM</p>
                  <p>Sunday: 10:00 AM – 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT: INTERACTIVE CONTACT FORM (7 COLS)                 */}
        {/* ======================================================== */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-[#DCEBE0] p-8 sm:p-10 shadow-xs">
            <h3 className="font-outfit font-bold text-2xl text-[#26352D] mb-1">
              Send us a Message
            </h3>
            <p className="text-xs text-[#718078] mb-6">
              Our footwear support specialists typically respond within 2 to 4 business hours.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[#DDF3E2] border border-[#BDECCB] text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#35A866] mx-auto" />
                <h4 className="font-outfit font-bold text-lg text-[#26352D]">Inquiry Submitted!</h4>
                <p className="text-xs text-[#718078] max-w-sm mx-auto">
                  A representative has been assigned to your ticket. We will email you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-[#72C98A] text-white text-xs font-bold rounded-xl"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#26352D] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Kasun Perera"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] focus:border-[#72C98A] focus:outline-none text-[#26352D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#26352D] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. kasun@example.com"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] focus:border-[#72C98A] focus:outline-none text-[#26352D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#26352D] mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +94 77 123 4567"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] focus:border-[#72C98A] focus:outline-none text-[#26352D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#26352D] mb-1.5">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] focus:border-[#72C98A] focus:outline-none text-[#26352D]"
                    >
                      <option value="Order Inquiry">Order Status & Tracking</option>
                      <option value="Size Exchange">Size Exchange or Return</option>
                      <option value="Product Authenticity">Shoe Sizing Consultation</option>
                      <option value="Showroom Visit">Colombo Showroom Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26352D] mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can our footwear advisors assist you today?"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] focus:border-[#72C98A] focus:outline-none text-[#26352D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs shadow-md shadow-green-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FAQ ACCORDION SECTION                                    */}
      {/* ======================================================== */}
      <section id="faq" className="bg-white rounded-3xl border border-[#DCEBE0] p-8 sm:p-12 shadow-xs space-y-6">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#72C98A] uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">
          Everything You Need to Know
        </h2>

        <div className="space-y-3 pt-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[#DCEBE0] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-outfit font-bold text-sm sm:text-base text-[#26352D] hover:text-[#72C98A] transition-colors bg-[#F2FAF4]/30"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#72C98A] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#718078] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-[#718078] leading-relaxed bg-[#F2FAF4]/30 border-t border-[#DCEBE0]/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
