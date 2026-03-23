import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CourseCardSubject } from "@/components/CourseCard";
import { useToastStore } from "./toastStore";

interface WishlistState {
  items: CourseCardSubject[];
  addToWishlist: (course: CourseCardSubject) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (course: CourseCardSubject) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (course) => {
        const { items } = get();
        if (!items.find((item) => item.id === course.id)) {
          set({ items: [...items, course] });
          useToastStore.getState().showToast("Added to wishlist");
        }
      },
      removeFromWishlist: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        useToastStore.getState().showToast("Removed from wishlist");
      },
      toggleWishlist: (course) => {
        const { items, addToWishlist, removeFromWishlist } = get();
        if (items.find((item) => item.id === course.id)) {
          removeFromWishlist(course.id);
        } else {
          addToWishlist(course);
        }
      },
      isInWishlist: (id) => {
        return !!get().items.find((item) => item.id === id);
      },
    }),
    {
      name: "lms-wishlist-storage",
    }
  )
);
