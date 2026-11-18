const CART_STORAGE_KEY = "gtech-cart";
let cart = [];
let total = 0;

try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (!Array.isArray(parsedCart) || parsedCart.some(item =>
            !item ||
            typeof item.product !== "string" ||
            typeof item.price !== "number" ||
            !Number.isFinite(item.price) ||
            item.price < 0
        )) {
            throw new Error("Saved cart data has an invalid format.");
        }
        cart = parsedCart;
    }
} catch (error) {
    console.error("Unable to restore the saved cart.", error);
    window.alert("Your saved cart could not be restored. A new cart has been started.");
    cart = [];
}

total = cart.reduce((sum, item) => sum + item.price, 0);

function persistCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error("Unable to save the cart.", error);
        window.alert("Your cart could not be saved in this browser. It may not be available after you leave this page.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    displayCart();
});

function addToCart(product,price){//adds items when clicked
    cart.push({product, price});
    total += price;
    persistCart();
    displayCart();
    showCartFeedback(product);
}

function displayCart(){//displays items in the cart box
    const cartList = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    if (cartList) {
        cartList.innerHTML = "";
        cart.forEach((item, index) =>{
            cartList.innerHTML += `
        <li>${item.product} - R${item.price}
        <button onclick="removeFromCart(${index})">Remove</button>
        </li>`;
        });
    }

    const cartTotal = document.getElementById("cart-total");
    if (cartTotal) {
        cartTotal.textContent = total;
    }
    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.setAttribute("aria-label", `${cart.length} ${cart.length === 1 ? "item" : "items"} in cart`);
    }
}

function showCartFeedback(product) {
    const feedback = document.getElementById("cart-feedback");
    const itemCount = cart.length;
    feedback.textContent = `${product} added. ${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart.`;
    feedback.classList.add("is-visible");

    window.clearTimeout(showCartFeedback.timeoutId);
    showCartFeedback.timeoutId = window.setTimeout(() => {
        feedback.classList.remove("is-visible");
    }, 3500);
}

function removeFromCart(index){//removes an item from the cart box
    if (!cart[index]) {
        return;
    }

    total -= cart[index].price;
    cart.splice(index, 1);
    persistCart();
    displayCart();
}

function openCart() {//opens the cart box
    document.getElementById("cartModal").style.display = "block";
}

function closeCart() {//closes the cart
    document.getElementById("cartModal").style.display = "none";
}

function openPurchase() {//opens the purchase box
    if (cart.length === 0) {
        window.alert("Add at least one service to your cart before placing an order request.");
        return;
    }

    document.getElementById("orderConfirmation").hidden = true;
    document.getElementById("purchaseModal").style.display = "block";
    closeCart();
}

function closePurchase() {//closes the purchase box
    document.getElementById("purchaseModal").style.display = "none";
}

function sendOrderRequest(form) {
    if (cart.length === 0) {
        window.alert("Your cart is empty. Add a service before placing an order request.");
        closePurchase();
        return false;
    }

    const customerName = form.elements.customerName.value.trim();
    const customerPhone = form.elements.customerPhone.value.trim();
    const paymentMethod = form.elements.paymentMethod.value;
    const orderItems = cart.map(item => `- ${item.product} - R${item.price}`).join("\n");
    const message = [
        "Hi GTECH, I would like to request an order. This is not a payment confirmation.",
        "",
        `Name: ${customerName}`,
        `Contact number: ${customerPhone}`,
        "",
        "Requested services:",
        orderItems,
        "",
        `Total: R${total}`,
        `Preferred payment method: ${paymentMethod}`,
        "",
        "Please confirm the order and send me the payment instructions."
    ].join("\n");
    const whatsappUrl = `https://wa.me/27684352360?text=${encodeURIComponent(message)}`;
    const whatsappLink = document.getElementById("orderWhatsAppLink");

    whatsappLink.href = whatsappUrl;
    document.getElementById("orderConfirmation").hidden = false;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    return false;
}

function searchSite(form) {
    const input = form.elements.q;
    const message = form.querySelector(".search-message");
    const query = input.value.trim().toLowerCase();
    const destinations = [
        {
            page: "computersoftwareup.html",
            terms: ["computer", "pc", "laptop", "desktop", "system update", "software update", "software installation", "installation", "install", "troubleshoot"]
        },
        {
            page: "phonesoftwareup.html",
            terms: ["phone", "smartphone", "mobile", "pin", "password", "unlock", "device", "technical problem", "software problem"]
        },
        {
            page: "logodesign.html",
            terms: ["logo", "document design", "document", "branding", "brand design", "graphic design", "stationery"]
        },
        {
            page: "services.html",
            terms: ["service", "support", "software development", "web development", "website development", "app", "apps", "application development"]
        },
        {
            page: "gallery.html",
            terms: ["gallery", "portfolio", "project", "client", "website maintenance", "website", "maiths enterprise", "maithsenterprise"]
        },
        {
            page: "services.html",
            terms: ["software", "business"]
        },
        {
            page: "index.html",
            terms: ["home", "profile", "about", "gomolemo", "gtech"]
        }
    ];
    const destination = destinations.find(item =>
        item.terms.some(term => query === term || query.includes(term))
    );

    if (!destination) {
        message.textContent = "No matching page found. Try “logo”, “computer”, “phone”, or “services”.";
        input.setAttribute("aria-invalid", "true");
        return false;
    }

    input.removeAttribute("aria-invalid");
    window.location.href = destination.page;
    return false;
}