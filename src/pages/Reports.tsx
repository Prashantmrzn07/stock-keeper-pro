import { Download, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const reports = [
  { title: "Stock Value Report", desc: "Total inventory value by product", icon: "📦" },
  { title: "Stock Movement Report", desc: "Incoming and outgoing stock with date range", icon: "📊" },
  { title: "Sales Report", desc: "Daily, weekly, and monthly sales breakdown", icon: "💰" },
  { title: "Low Stock Report", desc: "Items below reorder level", icon: "⚠️" },
  { title: "Profit Report", desc: "Revenue minus cost analysis", icon: "📈" },
];

export default function Reports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">Generate and export reports</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.title} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="text-3xl mb-3">{r.icon}</div>
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{r.desc}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Download className="mr-1 h-3.5 w-3.5" /> PDF</Button>
                <Button variant="outline" size="sm"><Download className="mr-1 h-3.5 w-3.5" /> Excel</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
