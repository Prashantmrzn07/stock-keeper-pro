CREATE POLICY "Authenticated users can delete sales" ON public.sales FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete sale_items" ON public.sale_items FOR DELETE TO authenticated USING (true);
GRANT DELETE ON public.sales TO authenticated;
GRANT DELETE ON public.sale_items TO authenticated;