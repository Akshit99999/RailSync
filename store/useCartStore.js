import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [
        {
          id: 'cart-sample-1',
          trainNumber: '12952',
          trainName: 'Tejas Rajdhani Express',
          fromStation: 'NDLS',
          toStation: 'MMCT',
          travelDate: '2026-10-25',
          travelClass: '3A',
          quota: 'GN',
          baseFare: 1850,
          passengers: [
            { name: 'Aditya Sharma', age: 24, gender: 'Male', berthPref: 'Lower' },
          ],
        },
      ],
      isCartOpen: false,
      activeCoupon: null,
      couponDiscountPercent: 0,

      // Open/close cart drawer
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

      // Add train ticket booking to cart
      addItem: (item) => {
        const id = 'ticket-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
        const newItem = {
          ...item,
          id,
          addedAt: new Date().toISOString(),
        };
        set((state) => ({
          items: [newItem, ...state.items],
          isCartOpen: true, // open cart automatically to give feedback
        }));
      },

      // Remove item by ID
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      // Clear all items
      clearCart: () => {
        set({ items: [], activeCoupon: null, couponDiscountPercent: 0 });
      },

      // Apply promo coupon code
      applyCoupon: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'RAIL10') {
          set({ activeCoupon: 'RAIL10', couponDiscountPercent: 10 });
          return { success: true, message: 'Coupon RAIL10 applied: 10% discount!' };
        } else if (clean === 'STUDENT20') {
          set({ activeCoupon: 'STUDENT20', couponDiscountPercent: 20 });
          return { success: true, message: 'Student Concession applied: 20% discount!' };
        } else if (clean === 'TATKAL0') {
          set({ activeCoupon: 'TATKAL0', couponDiscountPercent: 5 });
          return { success: true, message: '5% Early-Bird RailSync rebate applied!' };
        }
        return { success: false, message: 'Invalid coupon code. Try RAIL10 or STUDENT20.' };
      },

      // Remove coupon
      removeCoupon: () => {
        set({ activeCoupon: null, couponDiscountPercent: 0 });
      },

      // Calculate totals
      getCartTotals: () => {
        const items = get().items;
        const discountPercent = get().couponDiscountPercent;

        let totalBase = 0;
        let totalPassengers = 0;

        items.forEach((item) => {
          const passCount = (item.passengers && item.passengers.length) || 1;
          totalPassengers += passCount;
          totalBase += (item.baseFare || 500) * passCount;
        });

        const superfastCharge = items.length * 45;
        const reservationFee = totalPassengers * 40;
        const subtotal = totalBase + superfastCharge + reservationFee;
        const gst = Math.round(subtotal * 0.05); // 5% GST on AC classes
        const discount = Math.round((subtotal * discountPercent) / 100);
        const grandTotal = Math.max(0, subtotal + gst - discount);

        return {
          totalBase,
          totalPassengers,
          superfastCharge,
          reservationFee,
          subtotal,
          gst,
          discount,
          grandTotal,
        };
      },
    }),
    {
      name: 'railsync_cart_store',
      partialize: (state) => ({ items: state.items, activeCoupon: state.activeCoupon, couponDiscountPercent: state.couponDiscountPercent }),
    }
  )
);
