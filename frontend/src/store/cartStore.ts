import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CourseCardSubject } from "@/components/CourseCard";
import { useToastStore } from "./toastStore";

interface CartState {
  items: CourseCardSubject[];
  addToCart: (course: CourseCardSubject) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (course) => {
        const { items } = get();
        if (!items.find((item) => item.id === course.id)) {
          set({ items: [...items, course] });
          useToastStore.getState().showToast("Added to cart");
        }
      },
      removeFromCart: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        useToastStore.getState().showToast("Removed from cart");
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "lms-cart-storage",
    }
  )
);
