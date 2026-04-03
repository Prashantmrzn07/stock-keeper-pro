export const sampleProducts = [
  { id: "1", name: "Wireless Mouse", sku: "WM-001", category: "Electronics", stock: 45, reorderLevel: 20, unitPrice: 29.99, costPrice: 15.00, supplier: "TechParts Inc" },
  { id: "2", name: "USB-C Cable 2m", sku: "UC-002", category: "Electronics", stock: 120, reorderLevel: 50, unitPrice: 12.99, costPrice: 4.50, supplier: "TechParts Inc" },
  { id: "3", name: "Mechanical Keyboard", sku: "MK-003", category: "Electronics", stock: 8, reorderLevel: 15, unitPrice: 89.99, costPrice: 42.00, supplier: "TechParts Inc" },
  { id: "4", name: "Office Chair", sku: "OC-004", category: "Furniture", stock: 12, reorderLevel: 5, unitPrice: 299.99, costPrice: 150.00, supplier: "FurniSupply Co" },
  { id: "5", name: "Standing Desk", sku: "SD-005", category: "Furniture", stock: 3, reorderLevel: 5, unitPrice: 499.99, costPrice: 250.00, supplier: "FurniSupply Co" },
  { id: "6", name: "Monitor 27\"", sku: "MN-006", category: "Electronics", stock: 0, reorderLevel: 10, unitPrice: 349.99, costPrice: 200.00, supplier: "TechParts Inc" },
  { id: "7", name: "Desk Lamp LED", sku: "DL-007", category: "Furniture", stock: 67, reorderLevel: 20, unitPrice: 34.99, costPrice: 12.00, supplier: "FurniSupply Co" },
  { id: "8", name: "Webcam HD 1080p", sku: "WC-008", category: "Electronics", stock: 25, reorderLevel: 15, unitPrice: 59.99, costPrice: 28.00, supplier: "TechParts Inc" },
];

export const sampleCategories = [
  { id: "1", name: "Electronics", productCount: 5 },
  { id: "2", name: "Furniture", productCount: 3 },
];

export const sampleSuppliers = [
  { id: "1", name: "TechParts Inc", contact: "John Smith", email: "john@techparts.com", phone: "+1-555-0101", productCount: 5 },
  { id: "2", name: "FurniSupply Co", contact: "Jane Doe", email: "jane@furnisupply.com", phone: "+1-555-0202", productCount: 3 },
];

export const sampleStockMovements = [
  { id: "1", product: "Wireless Mouse", type: "in" as const, quantity: 50, date: "2024-01-15", user: "Admin" },
  { id: "2", product: "USB-C Cable 2m", type: "in" as const, quantity: 100, date: "2024-01-14", user: "Manager" },
  { id: "3", product: "Mechanical Keyboard", type: "out" as const, quantity: 5, date: "2024-01-14", user: "Staff" },
  { id: "4", product: "Monitor 27\"", type: "out" as const, quantity: 10, date: "2024-01-13", user: "Admin" },
  { id: "5", product: "Standing Desk", type: "out" as const, quantity: 2, date: "2024-01-13", user: "Manager" },
  { id: "6", product: "Desk Lamp LED", type: "in" as const, quantity: 30, date: "2024-01-12", user: "Staff" },
  { id: "7", product: "Webcam HD 1080p", type: "in" as const, quantity: 20, date: "2024-01-11", user: "Admin" },
];

export const stockChartData = [
  { day: "Mon", incoming: 45, outgoing: 20 },
  { day: "Tue", incoming: 30, outgoing: 35 },
  { day: "Wed", incoming: 60, outgoing: 15 },
  { day: "Thu", incoming: 20, outgoing: 40 },
  { day: "Fri", incoming: 50, outgoing: 25 },
  { day: "Sat", incoming: 10, outgoing: 8 },
  { day: "Sun", incoming: 5, outgoing: 3 },
];
