import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Sale {
  id: string;
  customer_name: string;
  total_amount: number;
  payment_status: string;
  user_id: string | null;
  created_at: string;
}

export interface SaleItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export function useSales() {
  return useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sales").select("*, sale_items(*, products(name))").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ customer_name, payment_status, items }: { customer_name: string; payment_status: string; items: SaleItem[] }) => {
      const total_amount = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({ customer_name, total_amount, payment_status, user_id: user?.id })
        .select()
        .single();
      if (saleError) throw saleError;
      const saleItems = items.map(i => ({ ...i, sale_id: sale.id }));
      const { error: itemsError } = await supabase.from("sale_items").insert(saleItems);
      if (itemsError) throw itemsError;
      for (const item of items) {
        await supabase.from("stock_movements").insert({
          product_id: item.product_id,
          type: "out",
          quantity: item.quantity,
          reason: "sold",
          notes: `Sale to ${customer_name}`,
          user_id: user?.id,
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stock_movements"] });
      toast.success("Sale recorded");
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useUpdateSaleStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payment_status }: { id: string; payment_status: string }) => {
      const { error } = await supabase.from("sales").update({ payment_status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["sales"] }); toast.success("Status updated"); },
    onError: (e) => toast.error(e.message),
  });
}
