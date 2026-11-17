/* ==========================================================
   MUMTAZ FASHION - checkout.js
   Berisi: halaman checkout (form, ongkir, voucher, metode
   pembayaran) dan halaman pembayaran berhasil.

   CATATAN: seluruh proses pembayaran hanya SIMULASI di sisi
   frontend. Tidak ada transaksi uang yang sebenarnya.
   ========================================================== */

"use strict";

const MUMTAZ_ORDER_KEY = "mumtaz_last_order";
const MUMTAZ_ORDER_HISTORY_KEY = "mumtaz_orders";

/* ---------- Opsi pengiriman (simulasi) ---------- */
const MUMTAZ_SHIPPING = {
  reguler: { name: "Reguler (3-5 hari)", cost: 15000 },
  express: { name: "Express (1-2 hari)", cost: 30000 },
  sameday: { name: "Same Day (hari ini)", cost: 45000 }
};

/* ---------- Voucher (simulasi) ---------- */
const MUMTAZ_VOUCHERS = {
  MUMTAZ10: { label: "Diskon 10% (maks. Rp 50.000)" },
  GRATISONGKIR: { label: "Gratis ongkos kirim" }
};

/* ---------- Data pembayaran dummy ---------- */
const MUMTAZ_BANKS = {
  BCA: { number: "1234 5678 90", holder: "MUMTAZ FASHION (DUMMY)" },
  BNI: { number: "0123 4567 89", holder: "MUMTAZ FASHION (DUMMY)" },
  Mandiri: { number: "123 00 1234567 8", holder: "MUMTAZ FASHION (DUMMY)" },
  BRI: { number: "0123 01 123456 50 1", holder: "MUMTAZ FASHION (DUMMY)" }
};

const MUMTAZ_WALLETS = {
  DANA: { number: "0812-0000-1234", steps: ["Buka aplikasi DANA.", "Pilih menu Kirim lalu Ke Nomor DANA.", "Masukkan nomor tujuan dan nominal pembayaran.", "Konfirmasi dengan PIN (simulasi)."] },
  OVO: { number: "0813-0000-5678", steps: ["Buka aplikasi OVO.", "Pilih menu Transfer lalu Ke Sesama OVO.", "Masukkan nomor tujuan dan nominal pembayaran.", "Konfirmasi dengan PIN (simulasi)."] },
  GoPay: { number: "0857-0000-9012", steps: ["Buka aplikasi Gojek lalu pilih GoPay.", "Pilih menu Bayar atau Transfer.", "Masukkan nomor tujuan dan nominal pembayaran.", "Konfirmasi dengan PIN (simulasi)."] }
};

/* ==========================================================
   HALAMAN CHECKOUT
   ========================================================== */
function mumtazInitCheckout() {
  const form = document.getElementById("mumtaz_checkout_form");
  if (!form) return;

  const content = document.getElementById("mumtaz_checkout_content");
  const emptyBox = document.getElementById("mumtaz_checkout_empty");

  /* Keranjang kosong -> tampilkan pesan, bukan halaman kosong */
  if (mumtazGetCart().length === 0) {
    content.classList.add("mumtaz_hidden");
    emptyBox.classList.remove("mumtaz_hidden");
    return;
  }

  const state = { shipping: "reguler", payment: "qris", bank: "BCA", wallet: "DANA", voucher: "" };
  let isProcessing = false;

  /* ----- Ringkasan pesanan ----- */
  function renderItems() {
    document.getElementById("mumtaz_order_items").innerHTML = mumtazGetCart().map(function (item) {
      const product = mumtazGetProductById(item.id);
      const color = mumtazFindColor(product, item.color);
      return '' +
        '<li class="mumtaz_order_item">' +
          '<span class="mumtaz_order_thumb">' +
            '<img src="' + mumtazProductImage(product.type, color.hex) + '" alt="' + product.name + '" width="56" height="67">' +
            '<span class="mumtaz_order_qty">' + item.qty + "</span>" +
          "</span>" +
          '<span class="mumtaz_order_info">' +
            '<span class="mumtaz_order_name">' + product.name + "</span>" +
            '<span class="mumtaz_order_variant">' + item.size + " • " + item.color + "</span>" +
          "</span>" +
          '<span class="mumtaz_order_price">' + mumtazFormatRupiah(product.price * item.qty) + "</span>" +
        "</li>";
    }).join("");
  }

  function calculate() {
    const subtotal = mumtazCartSubtotal();
    let shippingCost = MUMTAZ_SHIPPING[state.shipping].cost;
    if (state.shipping === "reguler" && subtotal >= MUMTAZ_FREE_SHIPPING_MIN) shippingCost = 0;

    let discount = 0;
    if (state.voucher === "MUMTAZ10") discount = Math.min(50000, Math.round(subtotal * 0.1));
    if (state.voucher === "GRATISONGKIR") discount = shippingCost;

    return {
      subtotal: subtotal,
      shippingCost: shippingCost,
      discount: discount,
      total: subtotal + shippingCost - discount
    };
  }

  function updateSummary() {
    const result = calculate();
    document.getElementById("mumtaz_sum_subtotal").textContent = mumtazFormatRupiah(result.subtotal);
    document.getElementById("mumtaz_sum_shipping").textContent = result.shippingCost === 0 ? "Gratis" : mumtazFormatRupiah(result.shippingCost);
    document.getElementById("mumtaz_sum_total").textContent = mumtazFormatRupiah(result.total);

    const discountRow = document.getElementById("mumtaz_discount_row");
    discountRow.classList.toggle("mumtaz_hidden", result.discount === 0);
    document.getElementById("mumtaz_sum_discount").textContent = "- " + mumtazFormatRupiah(result.discount);
    document.getElementById("mumtaz_sum_discount_label").textContent = "Diskon (" + state.voucher + ")";

    // harga ongkir pada pilihan pengiriman
    document.getElementById("mumtaz_ship_price_reguler").textContent =
      result.subtotal >= MUMTAZ_FREE_SHIPPING_MIN ? "Gratis" : mumtazFormatRupiah(MUMTAZ_SHIPPING.reguler.cost);

    // nominal di panel pembayaran
    document.querySelectorAll("[data-mumtaz-amount]").forEach(function (element) {
      element.textContent = mumtazFormatRupiah(result.total);
    });
  }

  /* ----- Panel metode pembayaran ----- */
  function updatePaymentPanels() {
    ["qris", "bank", "ewallet"].forEach(function (method) {
      document.getElementById("mumtaz_panel_" + method).classList.toggle("mumtaz_hidden", state.payment !== method);
    });

    document.querySelectorAll(".mumtaz_pay_method").forEach(function (card) {
      card.classList.toggle("mumtaz_selected", card.querySelector("input").value === state.payment);
    });

    const bank = MUMTAZ_BANKS[state.bank];
    document.getElementById("mumtaz_bank_number").textContent = bank.number;
    document.getElementById("mumtaz_bank_holder").textContent = bank.holder;
    document.getElementById("mumtaz_bank_name").textContent = "Bank " + state.bank;

    const wallet = MUMTAZ_WALLETS[state.wallet];
    document.getElementById("mumtaz_wallet_number").textContent = wallet.number;
    document.getElementById("mumtaz_wallet_name").textContent = state.wallet;
    document.getElementById("mumtaz_wallet_steps").innerHTML = wallet.steps.map(function (step) {
      return "<li>" + step + "</li>";
    }).join("");
    document.querySelectorAll("#mumtaz_ewallet_tabs .mumtaz_ewallet_tab").forEach(function (tab) {
      tab.classList.toggle("mumtaz_active", tab.getAttribute("data-mumtaz-wallet") === state.wallet);
    });
  }

  function updateShippingCards() {
    document.querySelectorAll(".mumtaz_ship_method").forEach(function (card) {
      card.classList.toggle("mumtaz_selected", card.querySelector("input").value === state.shipping);
    });
  }

  /* ----- Event ----- */
  form.querySelectorAll('input[name="shipping"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      state.shipping = radio.value;
      updateShippingCards();
      updateSummary();
    });
  });

  form.querySelectorAll('input[name="payment"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      state.payment = radio.value;
      updatePaymentPanels();
    });
  });

  document.getElementById("mumtaz_bank_select").addEventListener("change", function (event) {
    state.bank = event.target.value;
    updatePaymentPanels();
  });

  document.getElementById("mumtaz_ewallet_tabs").addEventListener("click", function (event) {
    const tab = event.target.closest("[data-mumtaz-wallet]");
    if (!tab) return;
    state.wallet = tab.getAttribute("data-mumtaz-wallet");
    updatePaymentPanels();
  });

  document.getElementById("mumtaz_bank_copy").addEventListener("click", function () {
    const number = MUMTAZ_BANKS[state.bank].number.replace(/\s/g, "");
    mumtazCopyText(number).then(function () {
      mumtazShowToast("Nomor rekening dummy disalin.", "success");
    }).catch(function () {
      mumtazShowToast("Gagal menyalin nomor rekening.", "error");
    });
  });

  /* Voucher */
  const voucherInput = document.getElementById("mumtaz_voucher_input");
  const voucherMessage = document.getElementById("mumtaz_voucher_msg");

  function applyVoucher() {
    const code = voucherInput.value.trim().toUpperCase();
    if (code === "") {
      voucherMessage.textContent = "Masukkan kode voucher terlebih dahulu.";
      voucherMessage.className = "mumtaz_voucher_msg mumtaz_voucher_error";
      return;
    }
    if (!MUMTAZ_VOUCHERS[code]) {
      state.voucher = "";
      voucherMessage.textContent = "Kode voucher tidak valid. Coba: MUMTAZ10 atau GRATISONGKIR.";
      voucherMessage.className = "mumtaz_voucher_msg mumtaz_voucher_error";
    } else {
      state.voucher = code;
      voucherMessage.textContent = "Voucher berhasil dipakai: " + MUMTAZ_VOUCHERS[code].label + ".";
      voucherMessage.className = "mumtaz_voucher_msg mumtaz_voucher_ok";
      mumtazShowToast("Voucher " + code + " diterapkan.", "success");
    }
    updateSummary();
  }

  document.getElementById("mumtaz_voucher_apply").addEventListener("click", applyVoucher);
  voucherInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      applyVoucher();
    }
  });

  mumtazBindLiveValidation(form);

  /* ----- Bayar Sekarang ----- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (isProcessing) return;

    if (!mumtazValidateForm(form)) {
      mumtazShowToast("Mohon lengkapi data pengiriman dengan benar.", "error");
      return;
    }

    const cart = mumtazGetCart();
    if (cart.length === 0) {
      mumtazShowToast("Keranjang kosong.", "error");
      return;
    }

    isProcessing = true;
    document.getElementById("mumtaz_pay_btn").disabled = true;
    document.getElementById("mumtaz_pay_modal").classList.remove("mumtaz_hidden");

    const result = calculate();
    const paymentLabel = state.payment === "qris"
      ? "QRIS"
      : state.payment === "bank"
        ? "Transfer Bank " + state.bank
        : "E-Wallet " + state.wallet;

    const now = new Date();
    const stamp = now.getFullYear() +
      ("0" + (now.getMonth() + 1)).slice(-2) +
      ("0" + now.getDate()).slice(-2);
    const order = {
      id: "MZF-" + stamp + "-" + ("000" + Math.floor(Math.random() * 10000)).slice(-4),
      createdAt: now.toISOString(),
      customer: {
        name: document.getElementById("mumtaz_co_name").value.trim(),
        phone: document.getElementById("mumtaz_co_phone").value.trim(),
        email: document.getElementById("mumtaz_co_email").value.trim(),
        address: document.getElementById("mumtaz_co_address").value.trim(),
        city: document.getElementById("mumtaz_co_city").value.trim(),
        postal: document.getElementById("mumtaz_co_postal").value.trim()
      },
      shippingName: MUMTAZ_SHIPPING[state.shipping].name,
      payment: paymentLabel,
      voucher: state.voucher,
      items: cart.map(function (item) {
        const product = mumtazGetProductById(item.id);
        return { id: product.id, name: product.name, price: product.price, size: item.size, color: item.color, qty: item.qty };
      }),
      subtotal: result.subtotal,
      shippingCost: result.shippingCost,
      discount: result.discount,
      total: result.total
    };

    // simulasi proses pembayaran selama ±2 detik
    setTimeout(function () {
      try {
        localStorage.setItem(MUMTAZ_ORDER_KEY, JSON.stringify(order));
        const history = JSON.parse(localStorage.getItem(MUMTAZ_ORDER_HISTORY_KEY) || "[]");
        history.push(order);
        localStorage.setItem(MUMTAZ_ORDER_HISTORY_KEY, JSON.stringify(history));
      } catch (error) { /* abaikan */ }

      mumtazClearCart();
      window.location.href = "payment-success.html";
    }, 2000);
  });

  renderItems();
  updateShippingCards();
  updatePaymentPanels();
  updateSummary();
}

/* ==========================================================
   HALAMAN PEMBAYARAN BERHASIL
   ========================================================== */
function mumtazInitPaymentSuccess() {
  const content = document.getElementById("mumtaz_success_content");
  if (!content) return;

  const emptyBox = document.getElementById("mumtaz_success_empty");
  let order = null;
  try {
    order = JSON.parse(localStorage.getItem(MUMTAZ_ORDER_KEY) || "null");
  } catch (error) {
    order = null;
  }

  if (!order) {
    content.classList.add("mumtaz_hidden");
    emptyBox.classList.remove("mumtaz_hidden");
    return;
  }

  document.getElementById("mumtaz_order_id").textContent = order.id;
  document.getElementById("mumtaz_order_date").textContent = new Date(order.createdAt).toLocaleString("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
  document.getElementById("mumtaz_order_method").textContent = order.payment;
  document.getElementById("mumtaz_order_shipping").textContent = order.shippingName;

  // data pelanggan memakai textContent agar aman dari kode HTML
  document.getElementById("mumtaz_order_customer").textContent = order.customer.name + " (" + order.customer.phone + ")";
  document.getElementById("mumtaz_order_address").textContent =
    order.customer.address + ", " + order.customer.city + " " + order.customer.postal;

  document.getElementById("mumtaz_success_items").innerHTML = order.items.map(function (item) {
    const product = mumtazGetProductById(item.id);
    const color = product ? mumtazFindColor(product, item.color) : { hex: "#142B4A" };
    const image = product ? mumtazProductImage(product.type, color.hex) : "";
    return '' +
      '<li class="mumtaz_order_item">' +
        '<span class="mumtaz_order_thumb">' +
          (image ? '<img src="' + image + '" alt="' + item.name + '" width="56" height="67">' : "") +
          '<span class="mumtaz_order_qty">' + item.qty + "</span>" +
        "</span>" +
        '<span class="mumtaz_order_info">' +
          '<span class="mumtaz_order_name">' + item.name + "</span>" +
          '<span class="mumtaz_order_variant">' + item.size + " • " + item.color + "</span>" +
        "</span>" +
        '<span class="mumtaz_order_price">' + mumtazFormatRupiah(item.price * item.qty) + "</span>" +
      "</li>";
  }).join("");

  document.getElementById("mumtaz_success_subtotal").textContent = mumtazFormatRupiah(order.subtotal);
  document.getElementById("mumtaz_success_shipping").textContent = order.shippingCost === 0 ? "Gratis" : mumtazFormatRupiah(order.shippingCost);
  document.getElementById("mumtaz_success_total").textContent = mumtazFormatRupiah(order.total);

  const discountRow = document.getElementById("mumtaz_success_discount_row");
  if (order.discount > 0) {
    discountRow.classList.remove("mumtaz_hidden");
    document.getElementById("mumtaz_success_discount").textContent = "- " + mumtazFormatRupiah(order.discount);
  }

  document.getElementById("mumtaz_print_btn").addEventListener("click", function () {
    window.print();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  mumtazInitCheckout();
  mumtazInitPaymentSuccess();
});
