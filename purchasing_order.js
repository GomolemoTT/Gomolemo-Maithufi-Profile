//Arry to store cart items
const cart = [];
let total = 0; //stores the total value in the cart

localStorage.setItem('calcTotal', total);

function addToCart(product,price){//adds items when clicked
    cart.push({product, price});
    total += price;
    displayCart();
}

function displayCart(){//displays items in the cart box
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";
    cart.forEach((item, index) =>{
        cartList.innerHTML += `
        <li>${item.product} - R${item.price}
        <button onclick="removeFromCart(${index})">Remove</button>
        </li>`;
    });
    document.getElementById("cart-total").textContent = total;
}

function removeFromCart(index){//removes an item from the cart box
    total -= cart[index].price;
    cart.splice(index, 1);
    displayCart();
}

function openCart() {//opens the cart box
    document.getElementById("cartModal").style.display = "block";
}

function closeCart() {//closes the cart
    document.getElementById("cartModal").style.display = "none";
}

function openPurchase() {//opens the purchase box
    document.getElementById("purchaseModal").style.display = "block";
    closeCart();
}

function closePurchase() {//closes the purchase box
    document.getElementById("purchaseModal").style.display = "none";
}

function showForm() {
    document.getElementById("loyalCustReg").style.display = "block";
}

function saveFormData() {
    localStorage.setItem("fName",document.getElementById("fName").value);
    localStorage.setItem("lName",document.getElementById("lName").value);
    localStorage.setItem("contactNo" ,document.getElementById("contactNo").value);
    displayFormDataReg();
    closePurchase();
}

function displayFormDataReg() {
    let fName = localStorage.getItem("fName");
    let lName = localStorage.getItem("lName");
    let contactNo = localStorage.getItem("contactNo");

    if (fName && lName && contactNo) {
        alert(fName + " " + lName + " you are a registered loyal customer with contact number " + contactNo + ". The total amount of your purchase is R" + total + ".");
        closePurchase();
    } else {
        alert("Please register as Loyal Customer");
        showForm();
    }
}