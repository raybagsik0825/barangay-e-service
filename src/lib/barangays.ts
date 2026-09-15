export interface Barangay {
  slug: string;
  code: string;
  name: string;
  district: string;
  dbName: string;
}

// Official list of Navotas City barangays (2026)
export const barangays: Barangay[] = [
  { slug: "binuangan",       code: "B01", name: "Binuangan",               district: "Navotas South", dbName: "brgy_binuangan" },
  { slug: "nbbs-kaunlaran",  code: "B02", name: "NBBS Kaunlaran",          district: "Navotas South", dbName: "brgy_nbbs_kaunlaran" },
  { slug: "nbbs-dagat",      code: "B03", name: "NBBS Dagat-dagatan",      district: "Navotas South", dbName: "brgy_nbbs_dagat" },
  { slug: "nbbs-proper",     code: "B04", name: "NBBS Proper",             district: "Navotas South", dbName: "brgy_nbbs_proper" },
  { slug: "san-jose",        code: "B05", name: "San Jose",                district: "Navotas South", dbName: "brgy_san_jose" },
  { slug: "san-roque",       code: "B06", name: "San Roque",               district: "Navotas South", dbName: "brgy_san_roque" },
  { slug: "sipac-almacen",   code: "B07", name: "Sipac-Almacen",           district: "Navotas South", dbName: "brgy_sipac_almacen" },
  { slug: "tangos-north",    code: "B08", name: "Tangos North",            district: "Navotas South", dbName: "brgy_tangos_north" },
  { slug: "tangos-south",    code: "B09", name: "Tangos South",            district: "Navotas South", dbName: "brgy_tangos_south" },
  { slug: "tanza-1",         code: "B10", name: "Tanza 1",                 district: "Navotas South", dbName: "brgy_tanza_1" },
  { slug: "tanza-2",         code: "B11", name: "Tanza 2",                 district: "Navotas South", dbName: "brgy_tanza_2" },
  { slug: "navotas-south",   code: "B12", name: "Navotas South District",  district: "Navotas South", dbName: "brgy_navotas_south" },
  { slug: "bagumbayan-north",code: "B13", name: "Bagumbayan North",        district: "Navotas North", dbName: "brgy_bagumbayan_north" },
  { slug: "daanghari",       code: "B14", name: "Daanghari",               district: "Navotas North", dbName: "brgy_daanghari" },
  { slug: "navotas-west",    code: "B15", name: "Navotas West",            district: "Navotas North", dbName: "brgy_navotas_west" },
  { slug: "navotas-east",    code: "B16", name: "Navotas East",            district: "Navotas North", dbName: "brgy_navotas_east" },
  { slug: "hulong-duhat",    code: "B17", name: "Hulong Duhat",            district: "Navotas North", dbName: "brgy_hulong_duhat" },
  { slug: "dampalit",        code: "B18", name: "Dampalit",                district: "Navotas North", dbName: "brgy_dampalit" },
  { slug: "salambao",        code: "B19", name: "Salambao",                district: "Navotas North", dbName: "brgy_salambao" },
];

export function getBarangay(slug: string): Barangay | undefined {
  return barangays.find((b) => b.slug === slug);
}

export function getBarangays(): Barangay[] {
  return barangays;
}