"use client";

import { useToastStore } from "@/store/toastStore";
import Toast from "./Toast";

export default function ToastProvider() {
  const { message, hideToast, durationMs } = useToastStore();
  return <Toast message={message} onDismiss={hideToast} durationMs={durationMs} />;
}
