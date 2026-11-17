/* ==========================================================
   MUMTAZ FASHION - cart.js
   Berisi: logika keranjang belanja (LocalStorage) dan
   tampilan halaman keranjang (cart.html).
   ========================================================== */

"use strict";

const MUMTAZ_CART_KEY = "mumtaz_cart";
const MUMTAZ_FREE_SHIPPING_MIN = 500000; // minimal belanja gratis ongkir reguler
const MUMTAZ_MAX_QTY = 10;

/* ---------- Membaca & menyimpan keranjang ---------- */
function mumtazGetCart() {
  try {
    const raw = localStorage.getItem(MUMTAZ_CART_KEY);
    const data = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(data)) return [];
    // buang item yang produknya sudah tidak ada
    return data.filter(function (item) {
      return mumtazGetProductById(item.id);
    });
  } catch (error) {
    return [];
  }
}

function mumtazSaveCart(cart) {
  try {
    localStorage.setItem(MUMTAZ_CART_KEY, JSON.stringify(cart));
  } catch (error) {
    /* penyimpanan penuh / diblokir: abaikan agar halaman tetap berjalan */
  }
  mumtazUpdateCartBadge();
}

/* Kunci unik tiap varian produk (produk + ukuran + warna) */
function mumtazCartKey(id, size, color) {
  return id + "|" + size + "|" + color;
}

/* ---------- Operasi keranjang ---------- */
function mumtazAddToCart(productId, size, colorName, quantity) {
  const product = mumtazGetProductById(productId);
  if (!product) return false;

  const qty = Math.max(1, Number(quantity) || 1);
  const finalSize = size || mumtazDefaultSize(product);
  const finalColor = colorName || product.colors[0].name;
  const key = mumtazCartKey(product.id, finalSize, finalColor);

  const cart = mumtazGetCart();
  const existing = cart.find(function (item) {
    return item.key === key;
  });

  if (existing) {
    existing.qty = Math.min(MUMTAZ_MAX_QTY, existing.qty + qty);
  } else {
    cart.push({
      key: key,
      id: product.id,
      size: finalSize,
      color: finalColor,
      qty: Math.min(MUMTAZ_MAX_QTY, qty)
    });
  }

  mumtazSaveCart(cart);
  return { product: product, size: finalSize, color: finalColor, qty: qty };
}

function mumtazRemoveFromCart(key) {
  const cart = mumtazGetCart().filter(function (item) {
    return item.key !== key;
  });
  mumtazSaveCart(cart);
}

function mumtazChangeQty(key, delta) {
  const cart = mumtazGetCart();
  const item = cart.find(function (entry) {
    return entry.key === key;
  });
  if (!item) return;

  const newQty = item.qty + delta;
  if (newQty < 1) return;
  if (newQty > MUMTAZ_MAX_QTY) {
    mumtazShowToast("Maksimal " + MUMTAZ_MAX_QTY + " pcs per produk.", "error");
    return;
  }
  item.qty = newQty;
  mumtazSaveCart(cart);
}

function mumtazClearCart() {
  mumtazSaveCart([]);
}

/* ---------- Perhitungan ---------- */
function mumtazCartCount() {
  return mumtazGetCart().reduce(function (total, item) {
    return total + item.qty;
  }, 0);
}

function mumtazCartSubtotal() {
  return mumtazGetCart().reduce(function (total, item) {
    const product = mumtazGetProductById(item.id);
    return total + product.price * item.qty;
  }, 0);
}

/* Memperbarui angka kecil di ikon keranjang pada navbar */
function mumtazUpdateCartBadge() {
  const badge = document.getElementById("mumtaz_cart_badge");
  if (!badge) return;
  const count = mumtazCartCount();
  badge.textContent = count;
  badge.classList.toggle("mumtaz_badge_empty", count === 0);
}

/* ==========================================================
   HALAMAN KERANJANG (cart.html)
   ========================================================== */
function mumtazRenderCartPage() {
  const listBox = document.getElementById("mumtaz_cart_list");
  if (!listBox) return; // bukan halaman keranjang

  const cart = mumtazGetCart();
  const content = document.getElementById("mumtaz_cart_content");
  const emptyBox = document.getElementById("mumtaz_cart_empty");

  if (cart.length === 0) {
    content.classList.add("mumtaz_hidden");
    emptyBox.classList.remove("mumtaz_hidden");
    return;
  }

  content.classList.remove("mumtaz_hidden");
  emptyBox.classList.add("mumtaz_hidden");

  /* Daftar item */
  listBox.innerHTML = cart.map(function (item) {
    const product = mumtazGetProductById(item.id);
    const color = mumtazFindColor(product, item.color);
    const image = mumtazProductImage(product.type, color.hex);
    return '' +
      '<article class="mumtaz_cart_item">' +
        '<a class="mumtaz_cart_item_image" href="product-detail.html?id=' + product.id + '">' +
          '<img src="' + image + '" alt="' + product.name + '" width="96" height="115">' +
        "</a>" +
        '<div class="mumtaz_cart_item_info">' +
          '<h3 class="mumtaz_cart_item_name"><a href="product-detail.html?id=' + product.id + '">' + product.name + "</a></h3>" +
          '<p class="mumtaz_cart_item_variant">Ukuran: <strong>' + item.size + '</strong> &nbsp;•&nbsp; Warna: <strong>' + item.color + "</strong></p>" +
          '<p class="mumtaz_cart_item_price">' + mumtazFormatRupiah(product.price) + "</p>" +
          '<div class="mumtaz_cart_item_controls">' +
            '<div class="mumtaz_qty_control" role="group" aria-label="Jumlah produk">' +
              '<button type="button" class="mumtaz_qty_btn" data-mumtaz-action="minus" data-mumtaz-key="' + item.key + '" aria-label="Kurangi jumlah">−</button>' +
              '<span class="mumtaz_qty_value">' + item.qty + "</span>" +
              '<button type="button" class="mumtaz_qty_btn" data-mumtaz-action="plus" data-mumtaz-key="' + item.key + '" aria-label="Tambah jumlah">+</button>' +
            "</div>" +
            '<button type="button" class="mumtaz_remove_btn" data-mumtaz-action="remove" data-mumtaz-key="' + item.key + '">Hapus</button>' +
          "</div>" +
        "</div>" +
        '<p class="mumtaz_cart_item_total">' + mumtazFormatRupiah(product.price * item.qty) + "</p>" +
      "</article>";
  }).join("");

  /* Ringkasan */
  const subtotal = mumtazCartSubtotal();
  document.getElementById("mumtaz_cart_count").textContent = mumtazCartCount() + " item";
  document.getElementById("mumtaz_cart_subtotal").textContent = mumtazFormatRupiah(subtotal);
  document.getElementById("mumtaz_cart_total").textContent = mumtazFormatRupiah(subtotal);

  /* Progress gratis ongkir */
  const remaining = MUMTAZ_FREE_SHIPPING_MIN - subtotal;
  const percent = Math.min(100, Math.round((subtotal / MUMTAZ_FREE_SHIPPING_MIN) * 100));
  document.getElementById("mumtaz_progress_fill").style.width = percent + "%";
  document.getElementById("mumtaz_progress_text").textContent = remaining > 0
    ? "Belanja " + mumtazFormatRupiah(remaining) + " lagi untuk gratis ongkir reguler!"
    : "Selamat! Kamu mendapat gratis ongkir reguler.";
}

/* Event keranjang (tambah, kurangi, hapus, kosongkan) */
function mumtazInitCartPage() {
  const listBox = document.getElementById("mumtaz_cart_list");
  if (!listBox) return;

  listBox.addEventListener("click", function (event) {
    const button = event.target.closest("[data-mumtaz-action]");
    if (!button) return;

    const action = button.getAttribute("data-mumtaz-action");
    const key = button.getAttribute("data-mumtaz-key");

    if (action === "plus") mumtazChangeQty(key, 1);
    if (action === "minus") mumtazChangeQty(key, -1);
    if (action === "remove") {
      mumtazRemoveFromCart(key);
      mumtazShowToast("Produk dihapus dari keranjang.", "success");
    }
    mumtazRenderCartPage();
  });

  const clearButton = document.getElementById("mumtaz_clear_cart");
  if (clearButton) {
    clearButton.addEventListener("click", function () {
      if (window.confirm("Kosongkan seluruh isi keranjang?")) {
        mumtazClearCart();
        mumtazShowToast("Keranjang dikosongkan.", "success");
        mumtazRenderCartPage();
      }
    });
  }

  mumtazRenderCartPage();
}

document.addEventListener("DOMContentLoaded", function () {
  mumtazUpdateCartBadge();
  mumtazInitCartPage();
});

/* Sinkronkan badge jika keranjang berubah di tab lain */
window.addEventListener("storage", function (event) {
  if (event.key === MUMTAZ_CART_KEY) {
    mumtazUpdateCartBadge();
    mumtazRenderCartPage();
  }
});
