/* ==========================================================
   MUMTAZ FASHION - main.js
   Berisi: navigasi, notifikasi (toast), validasi formulir,
   serta logika halaman Home, Shop, Category, Product Detail
   dan Contact.
   ========================================================== */

"use strict";

/* Tandai bahwa JavaScript aktif (dipakai CSS untuk animasi) */
document.documentElement.classList.add("mumtaz_js");

/* ==========================================================
   1. NOTIFIKASI (TOAST)
   ========================================================== */
function mumtazShowToast(message, type, link) {
  let container = document.getElementById("mumtaz_toast_container");
  if (!container) {
    container = document.createElement("div");
    container.id = "mumtaz_toast_container";
    container.className = "mumtaz_toast_container";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }

  // batasi maksimal 3 notifikasi tampil bersamaan
  while (container.children.length >= 3) {
    container.removeChild(container.firstChild);
  }

  const toastType = type === "error" ? "error" : "success";
  const toast = document.createElement("div");
  toast.className = "mumtaz_toast mumtaz_toast_" + toastType;
  toast.setAttribute("role", "status");

  const icon = document.createElement("span");
  icon.className = "mumtaz_toast_icon";
  icon.textContent = toastType === "error" ? "!" : "✓";

  const text = document.createElement("span");
  text.className = "mumtaz_toast_text";
  text.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(text);

  if (link) {
    const anchor = document.createElement("a");
    anchor.className = "mumtaz_toast_link";
    anchor.href = link.href;
    anchor.textContent = link.text;
    toast.appendChild(anchor);
  }

  container.appendChild(toast);
  requestAnimationFrame(function () {
    toast.classList.add("mumtaz_show");
  });

  setTimeout(function () {
    toast.classList.remove("mumtaz_show");
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 350);
  }, 3600);
}

/* Menyalin teks ke clipboard (dengan cadangan untuk browser lama) */
function mumtazCopyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise(function (resolve, reject) {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    try {
      const ok = document.execCommand("copy");
      document.body.removeChild(helper);
      ok ? resolve() : reject();
    } catch (error) {
      document.body.removeChild(helper);
      reject(error);
    }
  });
}

/* ==========================================================
   2. VALIDASI FORMULIR (dipakai Contact, Checkout, Newsletter)
   Input diberi atribut data-mumtaz-rule="name|phone|email|..."
   ========================================================== */
function mumtazCheckValue(rule, value) {
  const text = value.trim();

  switch (rule) {
    case "name":
      if (text === "") return "Nama lengkap wajib diisi.";
      if (text.length < 3) return "Nama minimal 3 karakter.";
      if (!/^[A-Za-z .'-]+$/.test(text)) return "Nama hanya boleh berisi huruf.";
      return "";
    case "phone": {
      if (text === "") return "Nomor telepon wajib diisi.";
      const digits = text.replace(/[\s-]/g, "");
      if (!/^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(digits)) {
        return "Format nomor tidak valid. Contoh: 081234567890.";
      }
      return "";
    }
    case "email":
      if (text === "") return "Email wajib diisi.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text)) return "Format email tidak valid.";
      return "";
    case "address":
      if (text === "") return "Alamat pengiriman wajib diisi.";
      if (text.length < 10) return "Alamat terlalu singkat (minimal 10 karakter).";
      return "";
    case "city":
      if (text === "") return "Kota / kabupaten wajib diisi.";
      if (text.length < 3) return "Nama kota minimal 3 karakter.";
      return "";
    case "postal":
      if (text === "") return "Kode pos wajib diisi.";
      if (!/^[0-9]{5}$/.test(text)) return "Kode pos harus 5 digit angka.";
      return "";
    case "message":
      if (text === "") return "Pesan wajib diisi.";
      if (text.length < 10) return "Pesan minimal 10 karakter.";
      return "";
    case "select":
      if (text === "") return "Silakan pilih salah satu.";
      return "";
    default:
      return "";
  }
}

/* Menampilkan / menghapus pesan error pada sebuah input */
function mumtazSetFieldError(input, message) {
  const group = input.closest(".mumtaz_form_group");
  if (group) {
    const errorBox = group.querySelector(".mumtaz_field_error");
    if (errorBox) errorBox.textContent = message || "";
  }
  input.classList.toggle("mumtaz_invalid", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function mumtazValidateInput(input) {
  const rule = input.getAttribute("data-mumtaz-rule");
  if (!rule) return true;
  const message = mumtazCheckValue(rule, input.value);
  mumtazSetFieldError(input, message);
  return message === "";
}

/* Validasi seluruh input pada sebuah form. Mengembalikan true/false */
function mumtazValidateForm(form) {
  const inputs = form.querySelectorAll("[data-mumtaz-rule]");
  let firstInvalid = null;
  inputs.forEach(function (input) {
    if (!mumtazValidateInput(input) && !firstInvalid) firstInvalid = input;
  });
  if (firstInvalid) firstInvalid.focus();
  return firstInvalid === null;
}

/* Validasi langsung saat pengguna mengetik / berpindah kolom */
function mumtazBindLiveValidation(form) {
  form.querySelectorAll("[data-mumtaz-rule]").forEach(function (input) {
    input.addEventListener("blur", function () {
      mumtazValidateInput(input);
    });
    input.addEventListener("input", function () {
      if (input.classList.contains("mumtaz_invalid")) mumtazValidateInput(input);
    });
  });
}

/* ==========================================================
   3. KOMPONEN UMUM (navbar, tombol tambah keranjang, dll.)
   ========================================================== */
function mumtazInitNavbar() {
  const header = document.getElementById("mumtaz_header");
  const toggle = document.getElementById("mumtaz_menu_toggle");
  const menu = document.getElementById("mumtaz_nav_menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      const isOpen = menu.classList.toggle("mumtaz_open");
      toggle.classList.toggle("mumtaz_open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("mumtaz_open");
        toggle.classList.remove("mumtaz_open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("mumtaz_open")) {
        menu.classList.remove("mumtaz_open");
        toggle.classList.remove("mumtaz_open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (header) {
    const onScroll = function () {
      header.classList.toggle("mumtaz_scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
}

/* Tombol kembali ke atas */
function mumtazInitBackToTop() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "mumtaz_back_top";
  button.setAttribute("aria-label", "Kembali ke atas");
  button.textContent = "↑";
  document.body.appendChild(button);

  window.addEventListener("scroll", function () {
    button.classList.toggle("mumtaz_show", window.scrollY > 500);
  }, { passive: true });

  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* Animasi muncul saat di-scroll */
function mumtazInitReveal() {
  const items = document.querySelectorAll(".mumtaz_reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (item) { item.classList.add("mumtaz_visible"); });
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("mumtaz_visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(function (item) { observer.observe(item); });
}

/* Tombol "Tambah ke Keranjang" pada semua kartu produk */
function mumtazInitAddButtons() {
  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-mumtaz-add]");
    if (!button) return;

    const result = mumtazAddToCart(Number(button.getAttribute("data-mumtaz-add")));
    if (!result) return;

    mumtazShowToast(
      result.product.name + " (" + result.size + ", " + result.color + ") ditambahkan ke keranjang.",
      "success",
      { text: "Lihat Keranjang", href: "cart.html" }
    );

    const original = button.getAttribute("data-mumtaz-label") || button.textContent;
    button.setAttribute("data-mumtaz-label", original);
    button.textContent = "✓ Ditambahkan";
    button.classList.add("mumtaz_btn_done");
    setTimeout(function () {
      button.textContent = original;
      button.classList.remove("mumtaz_btn_done");
    }, 1300);
  });
}

/* Formulir newsletter di footer */
function mumtazInitNewsletter() {
  const form = document.getElementById("mumtaz_newsletter_form");
  if (!form) return;

  mumtazBindLiveValidation(form);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!mumtazValidateForm(form)) return;

    const input = form.querySelector("input");
    try {
      const list = JSON.parse(localStorage.getItem("mumtaz_newsletter") || "[]");
      if (list.indexOf(input.value.trim()) === -1) list.push(input.value.trim());
      localStorage.setItem("mumtaz_newsletter", JSON.stringify(list));
    } catch (error) { /* abaikan */ }

    mumtazShowToast("Terima kasih! Email kamu sudah terdaftar di newsletter.", "success");
    form.reset();
  });
}

/* Tombol salin kode promo di halaman Home */
function mumtazInitPromoCopy() {
  const button = document.getElementById("mumtaz_copy_promo");
  if (!button) return;
  button.addEventListener("click", function () {
    mumtazCopyText("MUMTAZ10").then(function () {
      mumtazShowToast("Kode MUMTAZ10 disalin. Pakai di halaman checkout!", "success");
    }).catch(function () {
      mumtazShowToast("Gagal menyalin. Ketik manual: MUMTAZ10", "error");
    });
  });
}

/* ==========================================================
   4. HALAMAN HOME
   ========================================================== */
function mumtazInitHome() {
  if (!document.getElementById("mumtaz_featured_grid")) return;

  // Produk unggulan
  mumtazRenderProducts("mumtaz_featured_grid",
    MUMTAZ_PRODUCTS.filter(function (product) { return product.featured; }));

  // Produk terbaru (4 produk dengan id terbesar yang bertanda "baru")
  mumtazRenderProducts("mumtaz_new_grid",
    MUMTAZ_PRODUCTS
      .filter(function (product) { return product.isNew; })
      .sort(function (a, b) { return b.id - a.id; })
      .slice(0, 4));

  // Produk diskon terbesar
  mumtazRenderProducts("mumtaz_sale_grid",
    MUMTAZ_PRODUCTS
      .filter(function (product) { return product.oldPrice; })
      .sort(function (a, b) { return mumtazDiscountPercent(b) - mumtazDiscountPercent(a); })
      .slice(0, 4));

  // Jumlah produk pada kartu kategori
  document.querySelectorAll("[data-mumtaz-count]").forEach(function (label) {
    const category = label.getAttribute("data-mumtaz-count");
    const total = MUMTAZ_PRODUCTS.filter(function (product) {
      return product.category === category;
    }).length;
    label.textContent = total + " produk";
  });
}

/* ==========================================================
   5. FILTER & SORTING (dipakai Shop dan Category)
   ========================================================== */
function mumtazFilterProducts(options) {
  const keyword = (options.search || "").trim().toLowerCase();
  let list = MUMTAZ_PRODUCTS.filter(function (product) {
    // kategori
    if (options.category && options.category !== "semua" && product.category !== options.category) {
      return false;
    }
    // pencarian (nama, kategori, warna)
    if (keyword) {
      const haystack = (
        product.name + " " +
        MUMTAZ_CATEGORIES[product.category].name + " " +
        product.colors.map(function (color) { return color.name; }).join(" ")
      ).toLowerCase();
      if (haystack.indexOf(keyword) === -1) return false;
    }
    // rentang harga "min-max"
    if (options.price && options.price !== "all") {
      const range = options.price.split("-");
      const min = Number(range[0]);
      const max = Number(range[1]);
      if (product.price < min || product.price > max) return false;
    }
    return true;
  });

  switch (options.sort) {
    case "price-asc":
      list.sort(function (a, b) { return a.price - b.price; });
      break;
    case "price-desc":
      list.sort(function (a, b) { return b.price - a.price; });
      break;
    case "name-asc":
      list.sort(function (a, b) { return a.name.localeCompare(b.name, "id"); });
      break;
    case "newest":
      list.sort(function (a, b) {
        if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
        return b.id - a.id;
      });
      break;
    default:
      break; // urutan bawaan = urutan data
  }
  return list;
}

/* ==========================================================
   6. HALAMAN SHOP
   ========================================================== */
function mumtazInitShop() {
  const grid = document.getElementById("mumtaz_shop_grid");
  if (!grid) return;

  const searchInput = document.getElementById("mumtaz_search_input");
  const priceSelect = document.getElementById("mumtaz_price_filter");
  const sortSelect = document.getElementById("mumtaz_sort_select");
  const resultCount = document.getElementById("mumtaz_result_count");
  const emptyState = document.getElementById("mumtaz_empty_state");
  const resetButtons = document.querySelectorAll("[data-mumtaz-reset]");
  const chips = document.querySelectorAll("#mumtaz_filter_chips .mumtaz_filter_chip");
  const filterPanel = document.getElementById("mumtaz_filter_panel");
  const filterToggle = document.getElementById("mumtaz_filter_toggle");

  const state = { search: "", category: "semua", price: "all", sort: "default" };

  // Baca parameter URL, contoh: shop.html?q=kemeja&cat=pria
  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) state.search = params.get("q");
  if (MUMTAZ_CATEGORIES[params.get("cat")]) state.category = params.get("cat");
  searchInput.value = state.search;

  function render() {
    const list = mumtazFilterProducts(state);
    resultCount.textContent = "Menampilkan " + list.length + " dari " + MUMTAZ_PRODUCTS.length + " produk";
    grid.innerHTML = list.map(mumtazCreateProductCard).join("");
    emptyState.classList.toggle("mumtaz_hidden", list.length !== 0);
    grid.classList.toggle("mumtaz_hidden", list.length === 0);

    chips.forEach(function (chip) {
      chip.classList.toggle("mumtaz_active", chip.getAttribute("data-mumtaz-cat") === state.category);
    });
  }

  searchInput.addEventListener("input", function () {
    state.search = searchInput.value;
    render();
  });

  document.getElementById("mumtaz_search_form").addEventListener("submit", function (event) {
    event.preventDefault();
    state.search = searchInput.value;
    render();
  });

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      state.category = chip.getAttribute("data-mumtaz-cat");
      render();
    });
  });

  priceSelect.addEventListener("change", function () {
    state.price = priceSelect.value;
    render();
  });

  sortSelect.addEventListener("change", function () {
    state.sort = sortSelect.value;
    render();
  });

  resetButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.search = "";
      state.category = "semua";
      state.price = "all";
      state.sort = "default";
      searchInput.value = "";
      priceSelect.value = "all";
      sortSelect.value = "default";
      render();
    });
  });

  // Tombol buka/tutup filter pada layar kecil
  if (filterToggle && filterPanel) {
    filterToggle.addEventListener("click", function () {
      const isOpen = filterPanel.classList.toggle("mumtaz_open");
      filterToggle.setAttribute("aria-expanded", String(isOpen));
      filterToggle.textContent = isOpen ? "Tutup Filter ✕" : "Tampilkan Filter ☰";
    });
  }

  render();
}

/* ==========================================================
   7. HALAMAN CATEGORY
   ========================================================== */
function mumtazInitCategory() {
  const grid = document.getElementById("mumtaz_cat_grid");
  if (!grid) return;

  const tabs = document.querySelectorAll("#mumtaz_cat_tabs .mumtaz_cat_tab");
  const title = document.getElementById("mumtaz_cat_title");
  const description = document.getElementById("mumtaz_cat_desc");
  const image = document.getElementById("mumtaz_cat_image");
  const count = document.getElementById("mumtaz_cat_count");
  const sortSelect = document.getElementById("mumtaz_cat_sort");

  const params = new URLSearchParams(window.location.search);
  const state = {
    category: MUMTAZ_CATEGORIES[params.get("kat")] ? params.get("kat") : "pria",
    sort: "default"
  };

  function render() {
    const info = MUMTAZ_CATEGORIES[state.category];
    const list = mumtazFilterProducts({ category: state.category, sort: state.sort });

    title.textContent = info.name;
    description.textContent = info.description;
    image.src = info.image;
    image.alt = "Koleksi " + info.name;
    count.textContent = list.length + " produk";
    grid.innerHTML = list.map(mumtazCreateProductCard).join("");
    document.title = info.name + " | MUMTAZ FASHION";

    tabs.forEach(function (tab) {
      const active = tab.getAttribute("data-mumtaz-cat") === state.category;
      tab.classList.toggle("mumtaz_active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    // perbarui alamat URL tanpa memuat ulang halaman
    try {
      window.history.replaceState(null, "", "category.html?kat=" + state.category);
    } catch (error) { /* beberapa browser memblokir pada file:// */ }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      state.category = tab.getAttribute("data-mumtaz-cat");
      render();
    });
  });

  sortSelect.addEventListener("change", function () {
    state.sort = sortSelect.value;
    render();
  });

  render();
}

/* ==========================================================
   8. HALAMAN PRODUCT DETAIL
   ========================================================== */
function mumtazInitProductDetail() {
  const root = document.getElementById("mumtaz_detail_root");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  const product = idParam === null ? MUMTAZ_PRODUCTS[0] : mumtazGetProductById(idParam);

  if (!product) {
    root.innerHTML =
      '<div class="mumtaz_empty_state">' +
        "<h2>Produk tidak ditemukan</h2>" +
        "<p>Produk yang kamu cari tidak tersedia atau sudah dihapus.</p>" +
        '<a class="mumtaz_btn mumtaz_btn_primary" href="shop.html">Kembali ke Shop</a>' +
      "</div>";
    return;
  }

  const category = MUMTAZ_CATEGORIES[product.category];
  const discount = mumtazDiscountPercent(product);
  const selection = {
    size: product.sizes.length === 1 ? product.sizes[0] : null,
    color: product.colors[0].name,
    qty: 1
  };

  document.title = product.name + " | MUMTAZ FASHION";
  const crumb = document.getElementById("mumtaz_breadcrumb_current");
  if (crumb) crumb.textContent = product.name;
  const crumbCat = document.getElementById("mumtaz_breadcrumb_category");
  if (crumbCat) {
    crumbCat.textContent = category.name;
    crumbCat.href = "category.html?kat=" + product.category;
  }

  const thumbs = product.colors.map(function (color, index) {
    return '<button type="button" class="mumtaz_thumb_btn' + (index === 0 ? " mumtaz_active" : "") + '" data-mumtaz-color="' + color.name + '" aria-label="Lihat warna ' + color.name + '">' +
      '<img src="' + mumtazProductImage(product.type, color.hex) + '" alt="' + product.name + " warna " + color.name + '" width="80" height="96">' +
      "</button>";
  }).join("");

  const sizeButtons = product.sizes.map(function (size) {
    const active = selection.size === size ? " mumtaz_active" : "";
    return '<button type="button" class="mumtaz_size_btn' + active + '" data-mumtaz-size="' + size + '">' + size + "</button>";
  }).join("");

  const colorButtons = product.colors.map(function (color, index) {
    return '<button type="button" class="mumtaz_color_btn' + (index === 0 ? " mumtaz_active" : "") + '" data-mumtaz-color="' + color.name + '" aria-label="Warna ' + color.name + '">' +
      '<span class="mumtaz_color_dot" style="background:' + color.hex + '"></span></button>';
  }).join("");

  const oldPrice = product.oldPrice
    ? '<span class="mumtaz_price_old">' + mumtazFormatRupiah(product.oldPrice) + "</span>" +
      '<span class="mumtaz_badge_sale">Hemat ' + discount + "%</span>"
    : "";

  root.innerHTML = '' +
    '<div class="mumtaz_detail_layout">' +
      '<div class="mumtaz_gallery">' +
        '<div class="mumtaz_gallery_main">' +
          '<img id="mumtaz_detail_image" src="' + mumtazProductMainImage(product) + '" alt="' + product.name + '" width="400" height="480">' +
          (product.isNew ? '<span class="mumtaz_badge_new mumtaz_gallery_badge">Baru</span>' : "") +
        "</div>" +
        '<div class="mumtaz_gallery_thumbs" id="mumtaz_thumbs">' + thumbs + "</div>" +
      "</div>" +
      '<div class="mumtaz_detail_info">' +
        '<p class="mumtaz_detail_cat"><a href="category.html?kat=' + product.category + '">' + category.name + "</a></p>" +
        '<h1 class="mumtaz_detail_title">' + product.name + "</h1>" +
        '<p class="mumtaz_detail_rating"><span class="mumtaz_stars">' + mumtazStars(product.rating) + "</span> " + product.rating.toFixed(1) + " / 5 &nbsp;•&nbsp; Stok tersedia</p>" +
        '<p class="mumtaz_detail_price"><span class="mumtaz_price_now">' + mumtazFormatRupiah(product.price) + "</span>" + oldPrice + "</p>" +
        '<p class="mumtaz_detail_desc">' + product.description + "</p>" +

        '<div class="mumtaz_option_group" id="mumtaz_size_group">' +
          '<p class="mumtaz_option_label">Ukuran: <strong id="mumtaz_size_name">' + (selection.size || "belum dipilih") + "</strong></p>" +
          '<div class="mumtaz_size_options" id="mumtaz_size_options">' + sizeButtons + "</div>" +
          '<p class="mumtaz_option_error" id="mumtaz_size_error">Silakan pilih ukuran terlebih dahulu.</p>' +
        "</div>" +

        '<div class="mumtaz_option_group">' +
          '<p class="mumtaz_option_label">Warna: <strong id="mumtaz_color_name">' + selection.color + "</strong></p>" +
          '<div class="mumtaz_color_options" id="mumtaz_color_options">' + colorButtons + "</div>" +
        "</div>" +

        '<div class="mumtaz_option_group">' +
          '<p class="mumtaz_option_label">Jumlah:</p>' +
          '<div class="mumtaz_qty_row">' +
            '<div class="mumtaz_qty_control" role="group" aria-label="Jumlah produk">' +
              '<button type="button" class="mumtaz_qty_btn" id="mumtaz_detail_minus" aria-label="Kurangi jumlah">−</button>' +
              '<span class="mumtaz_qty_value" id="mumtaz_detail_qty">1</span>' +
              '<button type="button" class="mumtaz_qty_btn" id="mumtaz_detail_plus" aria-label="Tambah jumlah">+</button>' +
            "</div>" +
            '<p class="mumtaz_detail_subtotal">Subtotal: <strong id="mumtaz_detail_subtotal">' + mumtazFormatRupiah(product.price) + "</strong></p>" +
          "</div>" +
        "</div>" +

        '<div class="mumtaz_detail_actions">' +
          '<button type="button" class="mumtaz_btn mumtaz_btn_primary" id="mumtaz_detail_add">Tambah ke Keranjang</button>' +
          '<button type="button" class="mumtaz_btn mumtaz_btn_gold" id="mumtaz_detail_buy">Beli Sekarang</button>' +
        "</div>" +

        '<ul class="mumtaz_detail_perks">' +
          "<li>Gratis ongkir reguler untuk belanja min. Rp 500.000</li>" +
          "<li>Retur 7 hari jika ukuran tidak sesuai</li>" +
          "<li>Bahan nyaman dengan kualitas terjamin</li>" +
        "</ul>" +
      "</div>" +
    "</div>";

  const mainImage = document.getElementById("mumtaz_detail_image");
  const sizeGroup = document.getElementById("mumtaz_size_group");

  function setColor(colorName) {
    selection.color = colorName;
    const color = mumtazFindColor(product, colorName);
    mainImage.src = mumtazProductImage(product.type, color.hex);
    document.getElementById("mumtaz_color_name").textContent = color.name;
    root.querySelectorAll("#mumtaz_color_options .mumtaz_color_btn, #mumtaz_thumbs .mumtaz_thumb_btn").forEach(function (button) {
      button.classList.toggle("mumtaz_active", button.getAttribute("data-mumtaz-color") === color.name);
    });
  }

  function updateQty() {
    document.getElementById("mumtaz_detail_qty").textContent = selection.qty;
    document.getElementById("mumtaz_detail_subtotal").textContent = mumtazFormatRupiah(product.price * selection.qty);
  }

  // pilih warna (lewat bulatan warna atau gambar kecil)
  root.addEventListener("click", function (event) {
    const colorButton = event.target.closest("[data-mumtaz-color]");
    if (colorButton) setColor(colorButton.getAttribute("data-mumtaz-color"));

    const sizeButton = event.target.closest("[data-mumtaz-size]");
    if (sizeButton) {
      selection.size = sizeButton.getAttribute("data-mumtaz-size");
      document.getElementById("mumtaz_size_name").textContent = selection.size;
      sizeGroup.classList.remove("mumtaz_has_error");
      root.querySelectorAll("#mumtaz_size_options .mumtaz_size_btn").forEach(function (button) {
        button.classList.toggle("mumtaz_active", button === sizeButton);
      });
    }
  });

  document.getElementById("mumtaz_detail_minus").addEventListener("click", function () {
    if (selection.qty > 1) {
      selection.qty -= 1;
      updateQty();
    }
  });

  document.getElementById("mumtaz_detail_plus").addEventListener("click", function () {
    if (selection.qty < MUMTAZ_MAX_QTY) {
      selection.qty += 1;
      updateQty();
    } else {
      mumtazShowToast("Maksimal " + MUMTAZ_MAX_QTY + " pcs per pembelian.", "error");
    }
  });

  function addCurrentSelection() {
    if (!selection.size) {
      sizeGroup.classList.add("mumtaz_has_error");
      mumtazShowToast("Pilih ukuran terlebih dahulu.", "error");
      sizeGroup.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    mumtazAddToCart(product.id, selection.size, selection.color, selection.qty);
    return true;
  }

  document.getElementById("mumtaz_detail_add").addEventListener("click", function () {
    if (addCurrentSelection()) {
      mumtazShowToast(
        selection.qty + " × " + product.name + " (" + selection.size + ", " + selection.color + ") ditambahkan ke keranjang.",
        "success",
        { text: "Lihat Keranjang", href: "cart.html" }
      );
    }
  });

  document.getElementById("mumtaz_detail_buy").addEventListener("click", function () {
    if (addCurrentSelection()) window.location.href = "cart.html";
  });

  // Produk terkait (kategori sama)
  const related = MUMTAZ_PRODUCTS.filter(function (item) {
    return item.category === product.category && item.id !== product.id;
  }).slice(0, 4);
  mumtazRenderProducts("mumtaz_related_grid", related);
}

/* ==========================================================
   9. HALAMAN CONTACT
   ========================================================== */
function mumtazInitContact() {
  const form = document.getElementById("mumtaz_contact_form");
  if (!form) return;

  const successBox = document.getElementById("mumtaz_contact_success");
  mumtazBindLiveValidation(form);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!mumtazValidateForm(form)) {
      mumtazShowToast("Mohon lengkapi formulir dengan benar.", "error");
      return;
    }

    const data = {
      name: document.getElementById("mumtaz_contact_name").value.trim(),
      email: document.getElementById("mumtaz_contact_email").value.trim(),
      phone: document.getElementById("mumtaz_contact_phone").value.trim(),
      subject: document.getElementById("mumtaz_contact_subject").value,
      message: document.getElementById("mumtaz_contact_message").value.trim(),
      date: new Date().toISOString()
    };

    // Simulasi: pesan hanya disimpan di browser (tidak ada server)
    try {
      const messages = JSON.parse(localStorage.getItem("mumtaz_messages") || "[]");
      messages.push(data);
      localStorage.setItem("mumtaz_messages", JSON.stringify(messages));
    } catch (error) { /* abaikan */ }

    document.getElementById("mumtaz_contact_success_name").textContent = data.name;
    successBox.classList.remove("mumtaz_hidden");
    form.reset();
    mumtazShowToast("Pesan berhasil dikirim (simulasi).", "success");
    successBox.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  const closeButton = document.getElementById("mumtaz_contact_success_close");
  if (closeButton) {
    closeButton.addEventListener("click", function () {
      successBox.classList.add("mumtaz_hidden");
    });
  }

  // FAQ accordion
  document.querySelectorAll(".mumtaz_faq_question").forEach(function (question) {
    question.addEventListener("click", function () {
      const item = question.closest(".mumtaz_faq_item");
      const isOpen = item.classList.toggle("mumtaz_open");
      question.setAttribute("aria-expanded", String(isOpen));
    });
  });
}

/* ==========================================================
   10. JALANKAN SEMUA SETELAH HALAMAN SIAP
   ========================================================== */
document.addEventListener("DOMContentLoaded", function () {
  mumtazInitNavbar();
  mumtazInitBackToTop();
  mumtazInitAddButtons();
  mumtazInitNewsletter();
  mumtazInitPromoCopy();

  mumtazInitHome();
  mumtazInitShop();
  mumtazInitCategory();
  mumtazInitProductDetail();
  mumtazInitContact();

  mumtazInitReveal();
});
