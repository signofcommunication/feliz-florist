let allProducts = []; // simpan semua produk global

// Load data dari JSON
function loadProducts() {
    fetch("./products.json")
        .then(response => {
            if (!response.ok) throw new Error("Gagal load JSON");
            return response.json();
        })
        .then(data => {
            allProducts = data;
            populateFilter(data);
            renderProducts(data);
        })
        .catch(error => console.error("Error loadProducts:", error));
}

// Render produk ke halaman
function renderProducts(data, search = "", filter = "all") {
    const catalog = document.getElementById("catalog");
    catalog.innerHTML = ""; // reset isi catalog

    let totalFound = 0; // counter produk yg berhasil dirender  

    data.forEach(category => {
        // cek filter kategori
        if (filter !== "all" && category.name !== filter) return;

        // filter berdasarkan pencarian
        const filteredProducts = category.products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );

        if (filteredProducts.length === 0) return; // skip kalau kosong

        totalFound += filteredProducts.length; // tambahkan jumlah produk

        const section = document.createElement("div");
        section.classList.add("category");

        const title = document.createElement("h2");
        title.textContent = category.name;
        section.appendChild(title);

        const productsDiv = document.createElement("div");
        productsDiv.classList.add("products");

        filteredProducts.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");

            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-content">
                    <h3>${product.name}</h3>
                    <p class="desc">${product.description || "Produk bunga indah untuk momen spesial."}</p>
                    <div class="price-tag">
                        <p class="price">Rp ${product.price.toLocaleString()}</p>
                        <span class="tag">${category.name}</span>
                    </div>
                    <button class="wa-btn" onclick="orderWhatsApp('${product.name}')">
                        Pesan via WhatsApp
                    </button>
                </div>
            `;
            productsDiv.appendChild(productDiv);
        });

        section.appendChild(productsDiv);
        catalog.appendChild(section);
    });

    // Jika tidak ada produk sama sekali
    if (totalFound === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "❌ Produk tidak ditemukan.";
        emptyMsg.style.textAlign = "center";
        emptyMsg.style.color = "#666";
        emptyMsg.style.fontSize = "16px";
        catalog.appendChild(emptyMsg);
    }
}

// Isi dropdown kategori
function populateFilter(data) {
    const categoryFilter = document.getElementById("categoryFilter");
    data.forEach(category => {
        const opt = document.createElement("option");
        opt.value = category.name;
        opt.textContent = category.name;
        categoryFilter.appendChild(opt);
    });
}

document.getElementById("searchBar").addEventListener("input", e => {
    renderProducts(allProducts, e.target.value, document.getElementById("categoryFilter").value);
});
document.getElementById("categoryFilter").addEventListener("change", e => {
    renderProducts(allProducts, document.getElementById("searchBar").value, e.target.value);
});

function orderWhatsApp(productName) {
    const phone = "6281905059458";
    const message = `Halo, saya mau pesan produk: ${productName}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}

// Jalankan load data
loadProducts();
