import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for choosing Deeksha Candles. Your order has been placed successfully and will be processed shortly.
        </p>

        <Link href="/" className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-4 px-8 font-bold text-lg flex items-center justify-center w-full shadow-xl shadow-gray-900/20 active:scale-[0.98] transition-all">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
