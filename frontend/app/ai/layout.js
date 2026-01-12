import { ToastProvider } from "@/contexts/toast";

export default function AiLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-zinc-200 font-mono selection:bg-zinc-800 selection:text-white">
      <ToastProvider>
        {children}
      </ToastProvider>
    </div>
  );
}