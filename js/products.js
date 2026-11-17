/* ==========================================================
   MUMTAZ FASHION - products.js
   Berisi: data produk, data kategori, helper format harga,
   generator gambar produk (SVG) dan template kartu produk.
   ========================================================== */

"use strict";

/* ---------- Data kategori ---------- */
const MUMTAZ_CATEGORIES = {
  pria: {
    name: "Pakaian Pria",
    description: "Kemeja, kaos, jaket, dan celana dengan potongan modern untuk gaya harian maupun formal.",
    image: "assets/images/cat-pria.svg"
  },
  wanita: {
    name: "Pakaian Wanita",
    description: "Dress, blouse, rok, dan hijab dengan siluet elegan yang nyaman dipakai seharian.",
    image: "assets/images/cat-wanita.svg"
  },
  aksesoris: {
    name: "Aksesoris",
    description: "Tas, topi, jam tangan, dan pelengkap lain untuk menyempurnakan penampilanmu.",
    image: "assets/images/cat-aksesoris.svg"
  },
  sepatu: {
    name: "Sepatu",
    description: "Sneakers, loafer, sandal, dan boots dengan bahan nyaman serta desain stylish.",
    image: "assets/images/cat-sepatu.svg"
  }
};

/* ---------- Palet warna produk ---------- */
const MUMTAZ_COLOR = {
  navy: { name: "Navy", hex: "#142B4A" },
  cream: { name: "Cream", hex: "#E8DFC8" },
  putih: { name: "Putih", hex: "#F4F4F0" },
  hitam: { name: "Hitam", hex: "#262626" },
  abu: { name: "Abu-abu", hex: "#77797D" },
  abuMuda: { name: "Abu Muda", hex: "#BFC1C4" },
  biruMuda: { name: "Biru Muda", hex: "#8FB1D9" },
  olive: { name: "Olive", hex: "#5B6444" },
  khaki: { name: "Khaki", hex: "#B89F7A" },
  maroon: { name: "Maroon", hex: "#7B2D3B" },
  rose: { name: "Dusty Rose", hex: "#D1A3A4" },
  sage: { name: "Sage", hex: "#9CAF88" },
  mocca: { name: "Mocca", hex: "#8B6B4F" },
  coklat: { name: "Coklat Tua", hex: "#5A3E2B" },
  tan: { name: "Tan", hex: "#A67B4F" }
};

/* ---------- Pilihan ukuran ---------- */
const MUMTAZ_SIZE_CLOTHES = ["S", "M", "L", "XL"];
const MUMTAZ_SIZE_SHOES_UNISEX = ["39", "40", "41", "42", "43", "44"];
const MUMTAZ_SIZE_SHOES_WOMEN = ["36", "37", "38", "39", "40"];
const MUMTAZ_SIZE_ONE = ["All Size"];

/* ---------- Data produk (24 produk) ---------- */
const MUMTAZ_PRODUCTS = [
  /* ===== PRIA ===== */
  {
    id: 1, name: "Kemeja Oxford Slim Fit", category: "pria", type: "shirt",
    price: 249000, oldPrice: 299000, rating: 4.8, featured: true, isNew: false,
    colors: [MUMTAZ_COLOR.navy, MUMTAZ_COLOR.putih, MUMTAZ_COLOR.biruMuda],
    sizes: MUMTAZ_SIZE_CLOTHES,
    description: "Kemeja oxford berbahan katun tebal yang adem dan tidak mudah kusut. Potongan slim fit membuat tampilan rapi untuk kuliah, kerja, maupun acara semi formal."
  },
  {
    id: 2, name: "Kaos Basic Premium Cotton", category: "pria", type: "tshirt",
    price: 99000, oldPrice: null, rating: 4.7, featured: false, isNew: true,
    colors: [MUMTAZ_COLOR.cream, MUMTAZ_COLOR.hitam, MUMTAZ_COLOR.navy],
    sizes: MUMTAZ_SIZE_CLOTHES,
    description: "Kaos polos cotton combed 24s yang lembut di kulit. Jahitan rapi dan warna tidak mudah pudar, cocok dipadukan dengan outfit apa pun."
  },
  {
    id: 3, name: "Jaket Bomber Urban", category: "pria", type: "jacket",
    price: 399000, oldPrice: 459000, rating: 4.9, featured: true, isNew: false,
    colors: [MUMTAZ_COLOR.navy, MUMTAZ_COLOR.olive, MUMTAZ_COLOR.hitam],
    sizes: MUMTAZ_SIZE_CLOTHES,
    description: "Jaket bomber dengan lapisan dalam halus dan resleting kuat. Desain kekinian yang membuat gayamu langsung terlihat lebih keren."
  },
  {
    id: 4, name: "Celana Chino Slim", category: "pria", type: "pants",
    price: 279000, oldPrice: null, rating: 4.6, featured: false, isNew: false,
    colors: [MUMTAZ_COLOR.khaki, MUMTAZ_COLOR.navy, MUMTAZ_COLOR.abu],
    sizes: ["28", "30", "32", "34", "36"],
    description: "Celana chino berbahan twill stretch yang nyaman untuk bergerak. Potongan slim yang rapi, mudah dipadukan dengan kemeja maupun kaos."
  },
  {
    id: 5, name: "Kemeja Flanel Kotak", category: "pria", type: "shirt",
    price: 229000, oldPrice: null, rating: 4.5, featured: false, isNew: true,
    colors: [MUMTAZ_COLOR.maroon, MUMTAZ_COLOR.navy],
    sizes: MUMTAZ_SIZE_CLOTHES,
    description: "Kemeja flanel lembut dan hangat dengan motif kotak klasik. Bisa dipakai sebagai atasan utama atau outer santai."
  },
  {
    id: 6, name: "Hoodie Zipper Fleece", category: "pria", type: "hoodie",
    price: 329000, oldPrice: 379000, rating: 4.8, featured: true, isNew: false,
    colors: [MUMTAZ_COLOR.abu, MUMTAZ_COLOR.navy, MUMTAZ_COLOR.cream],
    sizes: MUMTAZ_SIZE_CLOTHES,
    description: "Hoodie zipper berbahan fleece tebal yang hangat dan lembut. Dilengkapi kantong depan dan tali serut untuk kenyamanan maksimal."
  },

  /* ===== WANITA ===== */
  {
    id: 7, name: "Dress Midi Elegan", category: "wanita", type: "dress",
    price: 349000, oldPrice: 419000, rating: 4.9, featured: true, isNew: false,
    colors: [MUMTAZ_COLOR.navy, MUMTAZ_COLOR.rose, MUMTAZ_COLOR.sage],
    sizes: MUMTAZ_SIZE_CLOTHES,
    description: "Dress midi dengan potongan A-line yang jatuh cantik. Bahan adem dan tidak menerawang, pas untuk acara santai hingga formal."
  },
  {
    id: 8, name: "Blouse Satin Classic", category: "wanita", type: "blouse",
    price: 199000, oldPrice: null, rating: 4.7, featured: false, isNew: true,
    colors: [MUMTAZ_COLOR.cream, MUMTAZ_COLOR.navy, MUMTAZ_COLOR.rose],
    sizes: MUMTAZ_SIZE_CLOTHES,
    description: "Blouse satin dengan kilau lembut dan jatuh yang halus. Tampil anggun dipadukan dengan rok maupun celana kulot."
  },
  {
    id: 9, name: "Rok Plisket Panjang", category: "wanita", type: "skirt",
    price: 179000, oldPrice: null, rating: 4.6, featured: false, isNew: false,
    colors: [MUMTAZ_COLOR.navy, MUMTAZ_COLOR.cream, MUMTAZ_COLOR.mocca],
    sizes: MUMTAZ_SIZE_CLOTHES,
    description: "Rok plisket panjang dengan pinggang karet yang nyaman. Lipatannya awet dan tidak mudah hilang setelah dicuci."
  },
  {
    id: 10, name: "Cardigan Rajut Soft", category: "wanita", type: "cardigan",
    price: 259000, oldPrice: null, rating: 4.8, featured: true, isNew: true,
    colors: [MUMTAZ_COLOR.cream, MUMTAZ_COLOR.mocca, MUMTAZ_COLOR.abuMuda],
    sizes: MUMTAZ_SIZE_CLOTHES,
    description: "Cardigan rajut halus yang hangat tapi tetap ringan. Cocok sebagai outer di ruangan ber-AC atau saat cuaca mendung."
  },
  {
    id: 11, name: "Hijab Pashmina Premium", category: "wanita", type: "hijab",
    price: 89000, oldPrice: null, rating: 4.7, featured: false, isNew: false,
    colors: [MUMTAZ_COLOR.cream, MUMTAZ_COLOR.navy, MUMTAZ_COLOR.rose],
    sizes: ["110 x 110 cm"],
    description: "Pashmina berbahan ceruty premium yang ringan, mudah dibentuk, dan tidak licin. Tersedia dalam warna-warna netral yang mudah dipadukan."
  },
  {
    id: 12, name: "Tunik Linen Casual", category: "wanita", type: "tunic",
    price: 219000, oldPrice: null, rating: 4.5, featured: false, isNew: true,
    colors: [MUMTAZ_COLOR.putih, MUMTAZ_COLOR.sage, MUMTAZ_COLOR.navy],
    sizes: MUMTAZ_SIZE_CLOTHES,
    description: "Tunik berbahan linen blend yang sejuk dan nyaman. Potongan longgar yang cocok untuk aktivitas harian."
  },

  /* ===== AKSESORIS ===== */
  {
    id: 13, name: "Totebag Kanvas Premium", category: "aksesoris", type: "tote",
    price: 129000, oldPrice: null, rating: 4.8, featured: true, isNew: false,
    colors: [MUMTAZ_COLOR.cream, MUMTAZ_COLOR.navy],
    sizes: MUMTAZ_SIZE_ONE,
    description: "Totebag kanvas tebal dengan tali kuat dan kantong dalam. Muat laptop 14 inci, buku, dan perlengkapan harian."
  },
  {
    id: 14, name: "Topi Baseball Classic", category: "aksesoris", type: "cap",
    price: 79000, oldPrice: null, rating: 4.4, featured: false, isNew: false,
    colors: [MUMTAZ_COLOR.navy, MUMTAZ_COLOR.hitam, MUMTAZ_COLOR.cream],
    sizes: MUMTAZ_SIZE_ONE,
    description: "Topi baseball dengan bahan twill dan strap belakang yang dapat diatur. Ringan, nyaman, dan cocok untuk gaya kasual."
  },
  {
    id: 15, name: "Jam Tangan Minimalis", category: "aksesoris", type: "watch",
    price: 459000, oldPrice: 549000, rating: 4.9, featured: true, isNew: false,
    colors: [MUMTAZ_COLOR.coklat, MUMTAZ_COLOR.navy],
    sizes: MUMTAZ_SIZE_ONE,
    description: "Jam tangan analog dengan desain minimalis dan strap kulit sintetis. Tahan percikan air dan nyaman dipakai seharian."
  },
  {
    id: 16, name: "Ikat Pinggang Kulit", category: "aksesoris", type: "belt",
    price: 149000, oldPrice: null, rating: 4.5, featured: false, isNew: false,
    colors: [MUMTAZ_COLOR.coklat, MUMTAZ_COLOR.hitam],
    sizes: ["90 cm", "100 cm", "110 cm"],
    description: "Ikat pinggang kulit sintetis premium dengan gesper logam berwarna emas. Kuat, fleksibel, dan tampil formal."
  },
  {
    id: 17, name: "Syal Rajut Hangat", category: "aksesoris", type: "scarf",
    price: 119000, oldPrice: null, rating: 4.6, featured: false, isNew: true,
    colors: [MUMTAZ_COLOR.navy, MUMTAZ_COLOR.maroon, MUMTAZ_COLOR.cream],
    sizes: MUMTAZ_SIZE_ONE,
    description: "Syal rajut tebal dan lembut untuk menambah kehangatan sekaligus gaya. Ujung berumbai memberi kesan klasik."
  },
  {
    id: 18, name: "Dompet Kulit Pria", category: "aksesoris", type: "wallet",
    price: 169000, oldPrice: 199000, rating: 4.7, featured: false, isNew: false,
    colors: [MUMTAZ_COLOR.coklat, MUMTAZ_COLOR.hitam, MUMTAZ_COLOR.navy],
    sizes: MUMTAZ_SIZE_ONE,
    description: "Dompet lipat berbahan kulit sintetis dengan slot kartu dan kantong uang. Ramping sehingga mudah masuk saku celana."
  },

  /* ===== SEPATU ===== */
  {
    id: 19, name: "Sneakers Putih Daily", category: "sepatu", type: "sneaker",
    price: 389000, oldPrice: 449000, rating: 4.9, featured: true, isNew: false,
    colors: [MUMTAZ_COLOR.putih, MUMTAZ_COLOR.cream, MUMTAZ_COLOR.navy],
    sizes: MUMTAZ_SIZE_SHOES_UNISEX,
    description: "Sneakers putih dengan sol karet empuk dan upper anti-lecet. Desain bersih yang cocok untuk kuliah, jalan-jalan, hingga nongkrong."
  },
  {
    id: 20, name: "Loafer Kulit Formal", category: "sepatu", type: "loafer",
    price: 459000, oldPrice: null, rating: 4.7, featured: false, isNew: false,
    colors: [MUMTAZ_COLOR.coklat, MUMTAZ_COLOR.hitam],
    sizes: MUMTAZ_SIZE_SHOES_UNISEX,
    description: "Loafer berbahan kulit sintetis premium dengan insole empuk. Tampilan rapi untuk presentasi, wawancara, maupun acara formal."
  },
  {
    id: 21, name: "Sandal Slide Nyaman", category: "sepatu", type: "slide",
    price: 129000, oldPrice: null, rating: 4.4, featured: false, isNew: true,
    colors: [MUMTAZ_COLOR.navy, MUMTAZ_COLOR.hitam, MUMTAZ_COLOR.cream],
    sizes: MUMTAZ_SIZE_SHOES_UNISEX,
    description: "Sandal slide dengan sol lentur anti-slip dan footbed yang mengikuti bentuk kaki. Ringan untuk dipakai di dalam maupun luar rumah."
  },
  {
    id: 22, name: "Boots Chelsea Suede", category: "sepatu", type: "boot",
    price: 549000, oldPrice: 649000, rating: 4.8, featured: false, isNew: false,
    colors: [MUMTAZ_COLOR.tan, MUMTAZ_COLOR.hitam],
    sizes: MUMTAZ_SIZE_SHOES_UNISEX,
    description: "Boots chelsea berbahan suede dengan panel elastis di sisi. Awet, mudah dipakai, dan menambah karakter pada outfit."
  },
  {
    id: 23, name: "Sepatu Lari Ultralight", category: "sepatu", type: "runner",
    price: 429000, oldPrice: null, rating: 4.6, featured: false, isNew: true,
    colors: [MUMTAZ_COLOR.navy, MUMTAZ_COLOR.abu, MUMTAZ_COLOR.maroon],
    sizes: MUMTAZ_SIZE_SHOES_UNISEX,
    description: "Sepatu lari ringan dengan bantalan sol responsif dan upper berpori agar kaki tetap sejuk saat berolahraga."
  },
  {
    id: 24, name: "Flat Shoes Wanita Ballet", category: "sepatu", type: "flat",
    price: 199000, oldPrice: null, rating: 4.5, featured: false, isNew: true,
    colors: [MUMTAZ_COLOR.cream, MUMTAZ_COLOR.rose, MUMTAZ_COLOR.hitam],
    sizes: MUMTAZ_SIZE_SHOES_WOMEN,
    description: "Flat shoes model ballet dengan bagian dalam empuk. Ringan, feminin, dan nyaman dipakai berjam-jam."
  }
];

/* ==========================================================
   HELPER UMUM
   ========================================================== */

/* Format angka menjadi Rupiah, contoh: 249000 -> "Rp 249.000" */
function mumtazFormatRupiah(number) {
  return "Rp " + Number(number).toLocaleString("id-ID");
}

/* Cari produk berdasarkan id */
function mumtazGetProductById(id) {
  return MUMTAZ_PRODUCTS.find(function (product) {
    return product.id === Number(id);
  }) || null;
}

/* Hitung persentase diskon (0 jika tidak ada diskon) */
function mumtazDiscountPercent(product) {
  if (!product.oldPrice) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

/* Ukuran bawaan saat produk ditambahkan langsung dari kartu produk */
function mumtazDefaultSize(product) {
  if (product.sizes.indexOf("M") !== -1) return "M";
  return product.sizes[Math.floor(product.sizes.length / 2)];
}

/* Ubah angka rating menjadi teks bintang, contoh 4.8 -> "★★★★★" */
function mumtazStars(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

/* ==========================================================
   GENERATOR GAMBAR PRODUK (SVG)
   Gambar dibuat dengan kode sehingga warna produk bisa berubah
   sesuai pilihan warna pengguna dan tidak butuh file foto.
   ========================================================== */

/* Menggelapkan / mencerahkan warna hex. amount: -100 s/d 100 */
function mumtazShade(hex, amount) {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map(function (start) {
    let channel = parseInt(value.substr(start, 2), 16);
    channel = amount < 0
      ? Math.round(channel * (1 + amount / 100))
      : Math.round(channel + (255 - channel) * (amount / 100));
    channel = Math.max(0, Math.min(255, channel));
    return ("0" + channel.toString(16)).slice(-2);
  });
  return "#" + channels.join("");
}

/* Bentuk SVG tiap jenis produk. c = warna utama, d = gelap, l = terang */
const MUMTAZ_GOLD = "#C5A46D";

const MUMTAZ_SHAPES = {
  tshirt: function (c, d, l) {
    return '<path d="M125 80 L165 60 Q200 100 235 60 L275 80 L348 150 L310 196 L276 168 L276 392 L124 392 L124 168 L90 196 L52 150 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M165 60 Q200 100 235 60" fill="none" stroke="' + d + '" stroke-width="6"/>' +
      '<path d="M124 168 V392 M276 168 V392" stroke="' + l + '" stroke-opacity=".3" stroke-width="2"/>';
  },
  shirt: function (c, d, l) {
    return '<path d="M120 85 L165 65 L200 112 L235 65 L280 85 L352 160 L314 206 L279 176 L279 398 L121 398 L121 176 L86 206 L48 160 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M165 65 L200 112 L172 124 L146 84 Z M235 65 L200 112 L228 124 L254 84 Z" fill="' + l + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M200 112 V398" stroke="' + d + '" stroke-width="3"/>' +
      '<g fill="' + l + '" stroke="' + d + '" stroke-width="2"><circle cx="212" cy="160" r="5"/><circle cx="212" cy="215" r="5"/><circle cx="212" cy="270" r="5"/><circle cx="212" cy="325" r="5"/><circle cx="212" cy="375" r="5"/></g>' +
      '<rect x="140" y="215" width="40" height="44" rx="4" fill="none" stroke="' + d + '" stroke-width="2"/>';
  },
  jacket: function (c, d, l) {
    return '<path d="M122 78 L165 58 L200 82 L235 58 L278 78 L356 168 L342 352 L302 352 L288 400 L112 400 L98 352 L58 352 L44 168 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M165 58 L200 90 L235 58 L235 96 L200 124 L165 96 Z" fill="' + d + '" fill-opacity=".55" stroke="' + d + '" stroke-width="2"/>' +
      '<path d="M200 90 V400" stroke="' + MUMTAZ_GOLD + '" stroke-width="4"/>' +
      '<path d="M58 352 H98 M302 352 H342 M112 400 H288" stroke="' + d + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M130 300 L170 300 M230 300 L270 300" stroke="' + l + '" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>';
  },
  hoodie: function (c, d, l) {
    return '<path d="M122 90 L168 72 L200 96 L232 72 L278 90 L356 176 L342 356 L302 356 L288 404 L112 404 L98 356 L58 356 L44 176 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M150 82 Q150 28 200 28 Q250 28 250 82 Q226 120 200 120 Q174 120 150 82 Z" fill="' + l + '" fill-opacity=".35" stroke="' + d + '" stroke-width="3"/>' +
      '<path d="M200 120 V404" stroke="' + MUMTAZ_GOLD + '" stroke-width="4"/>' +
      '<path d="M185 120 V170 M215 120 V170" stroke="' + d + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M135 290 L190 290 M210 290 L265 290 M135 290 L124 360 M265 290 L276 360" fill="none" stroke="' + d + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M58 356 H98 M302 356 H342 M112 404 H288" stroke="' + d + '" stroke-width="10" stroke-linecap="round"/>';
  },
  pants: function (c, d, l) {
    return '<path d="M120 50 L280 50 L300 420 L222 420 L200 160 L178 420 L100 420 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M120 50 L280 50 L282 80 L118 80 Z" fill="' + d + '" fill-opacity=".45" stroke="' + d + '" stroke-width="2"/>' +
      '<path d="M200 80 V160" stroke="' + d + '" stroke-width="3"/>' +
      '<path d="M140 84 Q150 130 168 140 M260 84 Q250 130 232 140" fill="none" stroke="' + l + '" stroke-opacity=".5" stroke-width="3"/>' +
      '<rect x="190" y="52" width="20" height="26" rx="3" fill="none" stroke="' + MUMTAZ_GOLD + '" stroke-width="3"/>';
  },
  dress: function (c, d, l) {
    return '<path d="M162 48 L182 48 Q200 82 218 48 L238 48 L250 164 L322 424 L78 424 L150 164 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M150 164 L250 164 L252 188 L148 188 Z" fill="' + MUMTAZ_GOLD + '" stroke="' + d + '" stroke-width="2"/>' +
      '<path d="M168 214 L132 420 M200 214 V420 M232 214 L268 420" stroke="' + l + '" stroke-opacity=".35" stroke-width="3"/>';
  },
  blouse: function (c, d, l) {
    return '<path d="M124 82 L165 62 Q200 118 235 62 L276 82 L352 232 L318 252 L277 170 L277 388 L123 388 L123 170 L82 252 L48 232 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M165 62 Q200 118 235 62" fill="none" stroke="' + d + '" stroke-width="5"/>' +
      '<path d="M190 108 L160 140 L196 128 Z M210 108 L240 140 L204 128 Z" fill="' + l + '" stroke="' + d + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M123 170 V388 M277 170 V388" stroke="' + l + '" stroke-opacity=".3" stroke-width="2"/>' +
      '<path d="M60 236 L88 252 M340 236 L312 252" stroke="' + d + '" stroke-width="6" stroke-linecap="round"/>';
  },
  skirt: function (c, d, l) {
    var lines = "";
    for (var i = 0; i < 9; i++) {
      var x1 = 140 + i * 15;
      var x2 = 72 + i * 32;
      lines += "M" + x1 + " 100 L" + x2 + " 424 ";
    }
    return '<path d="M136 90 L264 90 L340 424 L60 424 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="' + lines + '" stroke="' + l + '" stroke-opacity=".35" stroke-width="2.5" fill="none"/>' +
      '<rect x="136" y="76" width="128" height="26" rx="4" fill="' + d + '" fill-opacity=".6" stroke="' + d + '" stroke-width="2"/>';
  },
  cardigan: function (c, d, l) {
    return '<path d="M124 80 L166 60 L200 112 L234 60 L276 80 L352 240 L318 260 L278 176 L278 404 L122 404 L122 176 L82 260 L48 240 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M166 60 L200 112 L234 60" fill="none" stroke="' + d + '" stroke-width="6" stroke-linejoin="round"/>' +
      '<path d="M200 112 V404" stroke="' + d + '" stroke-width="4"/>' +
      '<g fill="' + MUMTAZ_GOLD + '" stroke="' + d + '" stroke-width="2"><circle cx="190" cy="170" r="6"/><circle cx="190" cy="230" r="6"/><circle cx="190" cy="290" r="6"/><circle cx="190" cy="350" r="6"/></g>' +
      '<path d="M122 392 H278 M60 246 L88 262 M340 246 L312 262" stroke="' + d + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M140 200 V380 M160 200 V380 M240 200 V380 M260 200 V380" stroke="' + l + '" stroke-opacity=".25" stroke-width="2"/>';
  },
  hijab: function (c, d, l) {
    return '<path d="M108 72 Q200 6 292 72 Q338 200 306 426 L94 426 Q62 200 108 72 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<ellipse cx="200" cy="186" rx="56" ry="74" fill="#F5F0E6" stroke="' + d + '" stroke-width="3"/>' +
      '<path d="M120 300 Q200 340 280 300 M110 350 Q200 392 290 350" fill="none" stroke="' + l + '" stroke-opacity=".35" stroke-width="3"/>' +
      '<circle cx="200" cy="262" r="5" fill="' + MUMTAZ_GOLD + '"/>';
  },
  tunic: function (c, d, l) {
    return '<path d="M125 78 L165 58 Q200 100 235 58 L275 78 L348 150 L310 196 L276 168 L292 414 L108 414 L124 168 L90 196 L52 150 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M165 58 Q200 100 235 58" fill="none" stroke="' + d + '" stroke-width="6"/>' +
      '<path d="M200 96 V190" stroke="' + d + '" stroke-width="3"/>' +
      '<g fill="' + l + '" stroke="' + d + '" stroke-width="2"><circle cx="200" cy="120" r="4"/><circle cx="200" cy="146" r="4"/><circle cx="200" cy="172" r="4"/></g>' +
      '<path d="M112 380 H288" stroke="' + l + '" stroke-opacity=".4" stroke-width="3"/>';
  },
  tote: function (c, d, l) {
    return '<path d="M140 200 Q140 84 200 84 Q260 84 260 200" fill="none" stroke="' + d + '" stroke-width="14" stroke-linecap="round"/>' +
      '<path d="M88 196 L312 196 L334 434 L66 434 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="146" y="290" width="108" height="74" rx="8" fill="none" stroke="' + l + '" stroke-opacity=".7" stroke-width="4"/>' +
      '<circle cx="200" cy="327" r="9" fill="' + MUMTAZ_GOLD + '"/>';
  },
  cap: function (c, d, l) {
    return '<path d="M82 262 Q82 112 200 112 Q318 112 318 262 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M200 112 V262 M140 124 Q124 190 130 262 M260 124 Q276 190 270 262" fill="none" stroke="' + l + '" stroke-opacity=".35" stroke-width="3"/>' +
      '<path d="M62 266 L330 266 Q392 290 336 322 Q200 346 78 312 Q40 292 62 266 Z" fill="' + d + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle cx="200" cy="112" r="9" fill="' + MUMTAZ_GOLD + '"/>' +
      '<rect x="172" y="196" width="56" height="26" rx="5" fill="' + MUMTAZ_GOLD + '"/>';
  },
  watch: function (c, d, l) {
    var ticks = "";
    for (var i = 0; i < 12; i++) {
      var angle = (i * 30) * Math.PI / 180;
      var x1 = 200 + Math.sin(angle) * 62;
      var y1 = 240 - Math.cos(angle) * 62;
      var x2 = 200 + Math.sin(angle) * 72;
      var y2 = 240 - Math.cos(angle) * 72;
      ticks += "M" + x1.toFixed(1) + " " + y1.toFixed(1) + " L" + x2.toFixed(1) + " " + y2.toFixed(1) + " ";
    }
    return '<path d="M162 32 L238 32 L246 156 L154 156 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M154 324 L246 324 L238 448 L162 448 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<g fill="' + d + '"><circle cx="200" cy="376" r="5"/><circle cx="200" cy="404" r="5"/><circle cx="200" cy="100" r="5"/></g>' +
      '<circle cx="200" cy="240" r="98" fill="' + MUMTAZ_GOLD + '" stroke="' + d + '" stroke-width="3"/>' +
      '<circle cx="200" cy="240" r="82" fill="#F5F0E6" stroke="' + d + '" stroke-width="3"/>' +
      '<path d="' + ticks + '" stroke="' + d + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M200 240 V190 M200 240 L234 262" stroke="' + d + '" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="200" cy="240" r="6" fill="' + MUMTAZ_GOLD + '"/>';
  },
  belt: function (c, d, l) {
    return '<circle cx="200" cy="244" r="140" fill="none" stroke="' + c + '" stroke-width="36"/>' +
      '<circle cx="200" cy="244" r="158" fill="none" stroke="' + d + '" stroke-width="2.5"/>' +
      '<circle cx="200" cy="244" r="122" fill="none" stroke="' + d + '" stroke-width="2.5"/>' +
      '<rect x="156" y="62" width="88" height="74" rx="10" fill="none" stroke="' + MUMTAZ_GOLD + '" stroke-width="12"/>' +
      '<path d="M200 70 V132" stroke="' + MUMTAZ_GOLD + '" stroke-width="8" stroke-linecap="round"/>' +
      '<g fill="' + l + '"><circle cx="330" cy="244" r="4"/><circle cx="342" cy="244" r="4"/></g>';
  },
  scarf: function (c, d, l) {
    return '<ellipse cx="200" cy="122" rx="116" ry="62" fill="none" stroke="' + c + '" stroke-width="46"/>' +
      '<ellipse cx="200" cy="122" rx="116" ry="62" fill="none" stroke="' + d + '" stroke-width="3" transform="translate(0,-23)"/>' +
      '<path d="M146 168 L218 168 L222 396 L142 396 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M206 176 L276 186 L284 366 L204 364 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M146 214 H220 M146 270 H220 M205 232 H280 M205 288 H282" stroke="' + MUMTAZ_GOLD + '" stroke-width="6"/>' +
      '<path d="M148 396 V430 M164 396 V430 M180 396 V430 M196 396 V430 M212 396 V430 M208 366 V400 M224 366 V400 M240 366 V400 M256 366 V400 M272 366 V400" stroke="' + d + '" stroke-width="4" stroke-linecap="round"/>';
  },
  wallet: function (c, d, l) {
    return '<rect x="64" y="130" width="272" height="208" rx="24" fill="' + c + '" stroke="' + d + '" stroke-width="3"/>' +
      '<path d="M64 190 Q200 262 336 190 L336 156 Q336 130 310 130 L90 130 Q64 130 64 156 Z" fill="' + d + '" fill-opacity=".7" stroke="' + d + '" stroke-width="3"/>' +
      '<circle cx="200" cy="238" r="16" fill="' + MUMTAZ_GOLD + '" stroke="' + d + '" stroke-width="2"/>' +
      '<path d="M86 312 H314" stroke="' + l + '" stroke-opacity=".5" stroke-width="3" stroke-dasharray="8 7"/>';
  },
  sneaker: function (c, d, l) {
    return '<g transform="translate(0,50)">' +
      '<path d="M44 290 L44 200 Q44 182 70 177 L120 168 Q148 168 168 192 Q192 226 245 236 Q325 246 356 280 L356 292 L44 292 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M44 268 L356 268 L356 296 Q356 324 322 324 L78 324 Q44 324 44 296 Z" fill="#FFFFFF" stroke="' + d + '" stroke-width="3"/>' +
      '<path d="M148 196 L178 184 M162 212 L192 200 M178 228 L208 216" stroke="' + d + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M44 236 H112" stroke="' + MUMTAZ_GOLD + '" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M270 244 Q320 250 346 276" fill="none" stroke="' + d + '" stroke-opacity=".5" stroke-width="3"/>' +
      '</g>';
  },
  runner: function (c, d, l) {
    return '<g transform="translate(0,50)">' +
      '<path d="M44 286 L44 196 Q44 176 74 172 L118 166 Q150 164 172 190 Q196 220 250 230 Q332 242 358 278 L358 288 L44 288 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M40 270 L360 270 L360 300 Q360 332 322 332 L76 332 Q40 332 40 300 Z" fill="' + MUMTAZ_GOLD + '" stroke="' + d + '" stroke-width="3"/>' +
      '<path d="M70 300 H330" stroke="' + d + '" stroke-opacity=".5" stroke-width="3" stroke-dasharray="10 8"/>' +
      '<path d="M96 262 Q170 196 292 262" fill="none" stroke="' + l + '" stroke-opacity=".8" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M150 192 L178 180 M164 208 L192 196" stroke="' + d + '" stroke-width="5" stroke-linecap="round"/>' +
      '</g>';
  },
  loafer: function (c, d, l) {
    return '<g transform="translate(0,50)">' +
      '<path d="M54 292 L54 232 Q54 212 84 212 L150 218 Q200 208 250 244 Q340 254 360 290 L360 300 L54 300 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="48" y="298" width="150" height="26" rx="6" fill="' + d + '"/>' +
      '<path d="M202 298 L364 298 L364 314 Q364 322 352 322 L202 322 Z" fill="' + d + '"/>' +
      '<path d="M170 228 Q206 262 248 252 L244 230 Q206 232 170 228 Z" fill="' + MUMTAZ_GOLD + '" stroke="' + d + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M84 220 Q130 214 160 228" fill="none" stroke="' + l + '" stroke-opacity=".5" stroke-width="3"/>' +
      '</g>';
  },
  slide: function (c, d, l) {
    return '<g transform="translate(0,40)">' +
      '<path d="M58 332 Q36 332 48 304 L130 220 Q152 198 192 210 L332 252 Q372 264 366 302 Q360 340 318 340 Z" fill="' + d + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M62 316 Q42 316 52 296 L132 214 Q152 194 190 204 L330 246 Q364 256 360 290 Q356 322 320 324 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M146 232 Q224 184 300 262 L296 292 Q226 238 158 288 Z" fill="' + l + '" fill-opacity=".45" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '</g>';
  },
  boot: function (c, d, l) {
    return '<g transform="translate(0,40)">' +
      '<path d="M104 70 L226 70 L229 205 Q302 218 352 258 Q372 280 364 300 L100 300 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="94" y="298" width="278" height="32" rx="10" fill="' + d + '"/>' +
      '<path d="M104 140 L228 140 L228 182 L104 182 Z" fill="' + d + '" fill-opacity=".6" stroke="' + d + '" stroke-width="2"/>' +
      '<path d="M104 140 L228 140 M104 182 L228 182" stroke="' + l + '" stroke-opacity=".4" stroke-width="3" stroke-dasharray="6 5"/>' +
      '<rect x="122" y="48" width="26" height="30" rx="5" fill="' + MUMTAZ_GOLD + '" stroke="' + d + '" stroke-width="2"/>' +
      '</g>';
  },
  flat: function (c, d, l) {
    return '<g transform="translate(0,50)">' +
      '<path d="M70 296 Q70 232 142 228 Q188 226 214 252 Q338 252 358 292 L358 302 L70 302 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M66 300 L360 300 Q362 316 346 318 L82 318 Q66 316 66 300 Z" fill="' + d + '"/>' +
      '<path d="M142 228 Q190 262 214 252" fill="none" stroke="' + d + '" stroke-width="4"/>' +
      '<path d="M178 244 Q196 224 214 240 Q196 246 178 244 Z M178 244 Q196 262 214 240" fill="' + MUMTAZ_GOLD + '" stroke="' + d + '" stroke-width="2" stroke-linejoin="round"/>' +
      '</g>';
  }
};

/* Membuat data URI gambar produk berdasarkan jenis dan warna */
function mumtazProductImage(type, hexColor) {
  const base = hexColor;
  const dark = mumtazShade(hexColor, -38);
  const light = mumtazShade(hexColor, 32);
  const drawShape = MUMTAZ_SHAPES[type] || MUMTAZ_SHAPES.tshirt;

  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480">' +
    '<defs><linearGradient id="mumtaz_grad_bg" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#FBF8F1"/><stop offset="1" stop-color="#E9DFCB"/></linearGradient></defs>' +
    '<rect width="400" height="480" fill="url(#mumtaz_grad_bg)"/>' +
    '<circle cx="200" cy="236" r="168" fill="#FFFFFF" opacity="0.55"/>' +
    '<ellipse cx="200" cy="452" rx="132" ry="11" fill="#142B4A" opacity="0.13"/>' +
    drawShape(base, dark, light) +
    "</svg>";

  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

/* Gambar utama produk (warna pertama) */
function mumtazProductMainImage(product) {
  return mumtazProductImage(product.type, product.colors[0].hex);
}

/* Cari data warna berdasarkan nama pada sebuah produk */
function mumtazFindColor(product, colorName) {
  return product.colors.find(function (color) {
    return color.name === colorName;
  }) || product.colors[0];
}

/* ==========================================================
   TEMPLATE KARTU PRODUK (dipakai di Home, Shop, Category, Detail)
   ========================================================== */
function mumtazCreateProductCard(product) {
  const discount = mumtazDiscountPercent(product);
  let badges = "";
  if (discount > 0) badges += '<span class="mumtaz_badge_sale">-' + discount + "%</span>";
  if (product.isNew) badges += '<span class="mumtaz_badge_new">Baru</span>';

  const oldPrice = product.oldPrice
    ? '<span class="mumtaz_price_old">' + mumtazFormatRupiah(product.oldPrice) + "</span>"
    : "";

  const swatches = product.colors.map(function (color) {
    return '<span class="mumtaz_card_swatch" style="background:' + color.hex + '" title="' + color.name + '"></span>';
  }).join("");

  return '' +
    '<article class="mumtaz_product_card">' +
      '<a class="mumtaz_product_media" href="product-detail.html?id=' + product.id + '" aria-label="Lihat detail ' + product.name + '">' +
        '<img class="mumtaz_product_image" src="' + mumtazProductMainImage(product) + '" alt="' + product.name + '" loading="lazy" width="400" height="480">' +
        '<div class="mumtaz_product_badges">' + badges + "</div>" +
      "</a>" +
      '<div class="mumtaz_product_body">' +
        '<p class="mumtaz_product_cat">' + MUMTAZ_CATEGORIES[product.category].name + "</p>" +
        '<h3 class="mumtaz_product_name"><a href="product-detail.html?id=' + product.id + '">' + product.name + "</a></h3>" +
        '<div class="mumtaz_product_meta">' +
          '<span class="mumtaz_product_rating" aria-label="Rating ' + product.rating + ' dari 5">★ ' + product.rating.toFixed(1) + "</span>" +
          '<span class="mumtaz_card_swatches">' + swatches + "</span>" +
        "</div>" +
        '<p class="mumtaz_product_price"><span class="mumtaz_price_now">' + mumtazFormatRupiah(product.price) + "</span>" + oldPrice + "</p>" +
        '<button type="button" class="mumtaz_btn mumtaz_btn_primary mumtaz_btn_block mumtaz_add_btn" data-mumtaz-add="' + product.id + '">Tambah ke Keranjang</button>' +
      "</div>" +
    "</article>";
}

/* Menampilkan banyak produk sekaligus ke dalam sebuah elemen */
function mumtazRenderProducts(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = products.map(mumtazCreateProductCard).join("");
}
