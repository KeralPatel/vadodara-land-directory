export const CITIES = [
  "Vadodara",
  "Anand",
  "Nadiad",
  "Ahmedabad",
  "Surat",
  "Bharuch",
];

export const LAND_TYPE_LABELS: Record<string, string> = {
  AGRICULTURAL: "Agricultural",
  NA_RESIDENTIAL: "NA Residential",
  NA_COMMERCIAL: "NA Commercial",
  INDUSTRIAL: "Industrial",
  FARM_HOUSE: "Farm House",
  PLOT: "Plot",
};

export const AREA_UNIT_LABELS: Record<string, string> = {
  BIGHA: "Bigha",
  ACRE: "Acre",
  GUNTHA: "Guntha",
  SQ_FT: "Sq Ft",
  SQ_METER: "Sq Meter",
  HECTARE: "Hectare",
};

export const ENQUIRY_STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  NEGOTIATING: "Negotiating",
  DEAL_CLOSED: "Deal Closed",
  NO_RESPONSE: "No Response",
};

export const ENQUIRY_STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  CONTACTED: "bg-yellow-100 text-yellow-800",
  NEGOTIATING: "bg-purple-100 text-purple-800",
  DEAL_CLOSED: "bg-green-100 text-green-800",
  NO_RESPONSE: "bg-gray-100 text-gray-800",
};

export const LISTING_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  SOLD: "bg-gray-100 text-gray-800",
};

export function formatPrice(value?: number | null): string {
  if (!value) return "Price on Request";
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatArea(value: number, unit: string): string {
  return `${value} ${AREA_UNIT_LABELS[unit] ?? unit}`;
}
