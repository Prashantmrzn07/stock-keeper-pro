import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface StockMovement {
  id: string;
  product_id: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  reason: string;
  notes: string;
  user_id: string | null;
  created_at: string;
}

export function useStockMovements() {
  return useQuery({
    queryKey: ["stock_movements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_movements")
        .select("*, products(name, sku)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateStockMovement() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (m: { product_id: string; type: string; quantity: number; reason?: string; notes?: string }) => {
      const { error } = await supabase.from("stock_movements").insert({
        ...m,
        user_id: user?.id,
        reason: m.reason || "",
        notes: m.notes || "",
      });
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["stock_movements"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      if (variables.type === "in") {
        toast.success("Stock Arrived!", {
          description: `${variables.quantity} units added to inventory successfully.`,
        });
      } else if (variables.type === "out") {
        toast.success("Stock Removed", {
          description: `${variables.quantity} units removed from inventory.`,
        });
      } else {
        toast.success("Stock Adjusted", {
          description: `Stock level adjusted to ${variables.quantity} units.`,
        });
      }
    },
    onError: (e) => toast.error(e.message),
  });
}
