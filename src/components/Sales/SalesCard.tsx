"use client";

import { useState } from "react";
import { formatCurrency, formatDateShort } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { SaleWithDetails } from "@/lib/types";
import { Calendar, User, ShoppingBag, DollarSign, Image as ImageIcon, MessageSquare } from "lucide-react";

interface SalesCardProps {
  sale: SaleWithDetails;
}

export function SalesCard({ sale }: SalesCardProps) {
  const [isImageOpen, setIsImageOpen] = useState(false);
  
  // Convert 'uploads/filename.jpg' to '/api/uploads/filename.jpg'
  const imageUrl = sale.screenshot ? `/api/${sale.screenshot}` : null;

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col sm:flex-row">
        {/* Left Section: Main Info */}
        <div className="flex-1 p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 line-clamp-1">{sale.schedule_title}</h3>
              <div className="mt-1 flex items-center gap-3 text-sm text-zinc-500">
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-violet-500" />
                  <span className="font-medium text-violet-600">{sale.streamer_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDateShort(sale.start_at)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
            <div>
              <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <DollarSign className="h-3 w-3" />
                Omzet
              </p>
              <p className="text-lg font-black text-green-600">{formatCurrency(sale.amount)}</p>
            </div>
            <br/>
            <div>
              <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <ShoppingBag className="h-3 w-3" />
                Pesanan
              </p>
              <p className="text-lg font-black text-zinc-900">{sale.order_count}</p>
            </div>
          </div>

          {sale.notes && (
            <div className="mt-4 flex gap-2 rounded-xl bg-violet-50/50 p-3 text-sm text-zinc-600">
              <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 text-violet-400" />
              <p>{sale.notes}</p>
            </div>
          )}
        </div>

        {/* Right Section: Image/Action */}
        {imageUrl && (
          <div className="relative h-48 w-full shrink-0 border-t border-zinc-100 sm:h-auto sm:w-40 sm:border-l sm:border-t-0">
            <button 
              onClick={() => setIsImageOpen(true)}
              className="group relative h-full w-full overflow-hidden"
            >
              <img 
                src={imageUrl} 
                alt="Bukti Sales" 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="rounded-full bg-white/90 p-2 shadow-sm">
                  <ImageIcon className="h-5 w-5 text-zinc-900" />
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
        title="Bukti Penjualan"
        description={`${sale.streamer_name} • ${sale.schedule_title}`}
      >
        <div className="flex flex-col items-center">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt="Bukti Sales Full" 
              className="max-h-[70vh] w-auto rounded-xl object-contain shadow-xl"
            />
          )}
          <a 
            href={imageUrl || "#"} 
            target="_blank" 
            className="mt-6 text-sm font-semibold text-violet-600 hover:underline"
          >
            Buka gambar asli
          </a>
        </div>
      </Modal>
    </Card>
  );
}
