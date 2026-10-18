'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  Trash2, 
  Train, 
  Tag, 
  ArrowRight, 
  ShoppingBag, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Sparkles,
  Ticket
} from 'lucide-react';
import DigitalTicketModal from './DigitalTicketModal';

export default function CartDrawer() {
  const { 
    items, 
    isCartOpen, 
    setCartOpen, 
    removeItem, 
    clearCart, 
    activeCoupon, 
    couponDiscountPercent, 
    applyCoupon, 
    removeCoupon, 
    getCartTotals 
  } = useCartStore();

  const { addToast } = useApp();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);
  const [selectedTicketForPass, setSelectedTicketForPass] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isCartOpen) return null;

  const totals = getCartTotals();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg(res);
    if (res.success) {
      addToast(res.message, 'success');
      setCouponInput('');
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    addToast('Processing IRCTC PRS electronic reservation...', 'info');

    setTimeout(() => {
      setIsCheckingOut(false);
      const bookedTicket = items[0];
      const pnrGenerated = '2' + Math.floor(100000000 + Math.random() * 900000000);
      setSelectedTicketForPass({ ...bookedTicket, pnr: pnrGenerated });
      addToast(`Booking Confirmed! PNR Generated: ${pnrGenerated}`, 'success');
      clearCart();
    }, 1200);
  };

  return (
    <>
      {/* Slide-over Backdrop */}
      <div 
        onClick={() => setCartOpen(false)}
        className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      {/* Slide-over Drawer Panel */}
      <aside className="fixed inset-y-0 right-0 z-[111] w-full max-w-md bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between font-mono animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-amber-500 dark:text-station-yellow" />
            <span className="text-sm font-bold text-slate-800 dark:text-zinc-100 tracking-wide">
              JOURNEY RESERVATION CART ({items.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 p-1"
                title="Clear all tickets"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setCartOpen(false)}
              className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-400 dark:text-zinc-600">
                <Ticket size={28} />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">Your Journey Cart is Empty</p>
              <p className="text-xs text-slate-500 dark:text-zinc-500 max-w-xs">
                Search trains between any stations and click "Book / Add to Cart" to reserve berths.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm space-y-3 transition-all hover:border-amber-400 dark:hover:border-station-yellow/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-zinc-100">
                      <Train size={15} className="text-amber-500 dark:text-station-yellow" />
                      <span>{item.trainNumber}</span>
                      <span className="text-xs text-slate-500 dark:text-zinc-400 font-normal truncate max-w-[170px]">
                        {item.trainName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-zinc-400 font-semibold">
                      <span>{item.fromStation}</span>
                      <ArrowRight size={12} className="text-amber-500" />
                      <span>{item.toStation}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Remove ticket"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-station-yellow font-bold">
                    CLASS {item.travelClass || '3A'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                    QUOTA {item.quota || 'GN'}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 dark:text-zinc-400">
                    <Calendar size={11} /> {item.travelDate || 'Selected Run'}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 dark:text-zinc-400 ml-auto">
                    <Users size={11} /> {(item.passengers?.length || 1)} Pax
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Base Fare:</span>
                  <span className="text-sm font-black text-slate-900 dark:text-zinc-100">
                    ₹{item.baseFare * (item.passengers?.length || 1)}
                  </span>
                </div>
              </div>
            ))
          )}

          {/* Coupon Code Section */}
          {items.length > 0 && (
            <div className="pt-2">
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag size={13} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon (e.g. RAIL10)"
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg outline-none focus:border-station-yellow"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs font-bold rounded-lg bg-slate-200 dark:bg-zinc-800 hover:bg-station-yellow hover:text-black transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {activeCoupon && (
                  <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} /> {activeCoupon} ({couponDiscountPercent}% OFF applied)
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-slate-400 hover:text-rose-500 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Order Summary & Checkout Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Base Fares ({totals.totalPassengers} Pax):</span>
                <span>₹{totals.totalBase}</span>
              </div>
              <div className="flex justify-between">
                <span>Superfast Surcharge:</span>
                <span>₹{totals.superfastCharge}</span>
              </div>
              <div className="flex justify-between">
                <span>PRS Reservation Fee:</span>
                <span>₹{totals.reservationFee}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5% AC Rail):</span>
                <span>₹{totals.gst}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Discount Applied:</span>
                  <span>-₹{totals.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex justify-between text-sm font-black text-slate-900 dark:text-zinc-100">
                <span>Grand Total:</span>
                <span className="text-amber-600 dark:text-station-yellow text-base">₹{totals.grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-3 rounded-xl bg-amber-500 dark:bg-station-yellow text-black font-black text-xs tracking-wider uppercase hover:opacity-95 active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCheckingOut ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full"></span>
                  <span>ALLOCATING PRS BERTHS...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>CONFIRM & GENERATE E-TICKET</span>
                </>
              )}
            </button>
          </div>
        )}
      </aside>

      {/* Digital Boarding Pass Modal */}
      {selectedTicketForPass && (
        <DigitalTicketModal
          ticket={selectedTicketForPass}
          isOpen={Boolean(selectedTicketForPass)}
          onClose={() => setSelectedTicketForPass(null)}
        />
      )}
    </>
  );
}
