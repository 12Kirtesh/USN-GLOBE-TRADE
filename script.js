// =========================================
// USN GLOBAL TRADE
// MAIN JAVASCRIPT
// Supabase + Contact + Products + Cart + Orders
// =========================================


// =========================================
// SUPABASE CONNECTION
// =========================================

const SUPABASE_URL = "https://dvyqeiftxliczhllpvvc.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_ZulvWci7BNTGbGpiJjoBvQ_pwZu32XV";

let supabaseClient = null;

if (
    window.supabase &&
    SUPABASE_URL &&
    SUPABASE_ANON_KEY
) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    console.log("✅ Supabase connected");
} else {
    console.error("❌ Supabase connection failed");
}


// =========================================
// MOBILE MENU
// =========================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("active");

        if (navLinks.classList.contains("active")) {
            menuToggle.textContent = "✕";
        } else {
            menuToggle.textContent = "☰";
        }

    });


    document.querySelectorAll(".nav-links a").forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");
            menuToggle.textContent = "☰";

        });

    });


    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            navLinks.classList.remove("active");
            menuToggle.textContent = "☰";

        }

    });

}


// =========================================
// FOOTER YEAR
// =========================================

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// =========================================
// CONTACT FORM
// =========================================

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name")?.value.trim() || "";

        const company =
            document.getElementById("company")?.value.trim() || "";

        const email =
            document.getElementById("email")?.value.trim() || "";

        const message =
            document.getElementById("message")?.value.trim() || "";


        if (!name || !email || !message) {

            if (formMessage) {

                formMessage.textContent =
                    "Please fill in your name, email and message.";

                formMessage.style.color = "#c0392b";
            }

            return;
        }


        if (!supabaseClient) {

            if (formMessage) {

                formMessage.textContent =
                    "Supabase connection is not available.";

                formMessage.style.color = "#c0392b";
            }

            return;
        }


        if (formMessage) {

            formMessage.textContent =
                "Sending your enquiry...";

            formMessage.style.color = "#687780";
        }


        try {

            const { error } = await supabaseClient
                .from("enquiries")
                .insert([
                    {
                        name: name,
                        company: company || null,
                        email: email,
                        message: message
                    }
                ]);


            if (error) {

                console.error("Enquiry error:", error);

                if (formMessage) {

                    formMessage.textContent =
                        "Unable to send enquiry. Please try again.";

                    formMessage.style.color = "#c0392b";
                }

                return;
            }


            if (formMessage) {

                formMessage.textContent =
                    "Thank you! Your enquiry has been sent successfully.";

                formMessage.style.color = "#1f7a4d";
            }


            contactForm.reset();


        } catch (error) {

            console.error(error);

            if (formMessage) {

                formMessage.textContent =
                    "Something went wrong. Please try again.";

                formMessage.style.color = "#c0392b";
            }

        }

    });

}


// =========================================
// PRODUCTS
// =========================================

let products = [];

async function loadProducts() {

    if (!supabaseClient) {
        console.error("Supabase is not connected.");
        return;
    }


    try {

        const { data, error } = await supabaseClient
            .from("products")
            .select("*")
            .order("id", {
                ascending: true
            });


        if (error) {

            console.error("Products error:", error);
            return;
        }


        products = data || [];

        console.log("✅ Products loaded:", products);


        displayProducts(products);


    } catch (error) {

        console.error("Product loading error:", error);

    }

}


// =========================================
// DISPLAY PRODUCTS
// =========================================

function displayProducts(productList) {

    const productContainer =
        document.getElementById("productGrid") ||
        document.querySelector(".product-grid");

    if (!productContainer) {
        return;
    }


    if (!productList || productList.length === 0) {

        productContainer.innerHTML =
            "<p>No products available.</p>";

        return;
    }


    productContainer.innerHTML = "";


    productList.forEach(function (product) {

        const card = document.createElement("div");

        card.className = "product-card";


        const productName =
            product.name ||
            product.product_name ||
            "Product";


        const description =
            product.description ||
            "Premium quality product from USN GLOBAL TRADE.";


        const category =
            product.category ||
            "PRODUCT";


        const price =
            Number(product.price || 0);


        card.innerHTML = `

            <div class="product-icon">
                🌿
            </div>

            <span>
                ${category}
            </span>

            <h3>
                ${productName}
            </h3>

            <p>
                ${description}
            </p>

            <div class="product-price">
                NPR ${price.toLocaleString()}
            </div>

            <button
                class="btn btn-primary add-to-cart"
                type="button"
                data-id="${product.id}"
            >
                Add to Cart
            </button>

        `;


        productContainer.appendChild(card);

    });


    document
        .querySelectorAll(".add-to-cart")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        this.getAttribute("data-id");

                    addToCart(productId);

                }
            );

        });

}


// =========================================
// CART
// =========================================

let cart =
    JSON.parse(
        localStorage.getItem("usnCart")
    ) || [];


function saveCart() {

    localStorage.setItem(
        "usnCart",
        JSON.stringify(cart)
    );

}


function addToCart(productId) {

    const product =
        products.find(
            function (item) {

                return String(item.id) ===
                    String(productId);

            }
        );


    if (!product) {

        console.error(
            "Product not found:",
            productId
        );

        return;
    }


    const existing =
        cart.find(
            function (item) {

                return String(item.id) ===
                    String(product.id);

            }
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name:
                product.name ||
                product.product_name ||
                "Product",

            price:
                Number(product.price || 0),

            quantity: 1

        });

    }


    saveCart();

    updateCartCount();

    alert(
        (product.name ||
            product.product_name ||
            "Product") +
        " added to cart!"
    );

}


function removeFromCart(productId) {

    cart =
        cart.filter(
            function (item) {

                return String(item.id) !==
                    String(productId);

            }
        );


    saveCart();

    updateCartCount();

    displayCart();

}


function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");


    if (!cartCount) {
        return;
    }


    const totalItems =
        cart.reduce(
            function (total, item) {

                return total + item.quantity;

            },
            0
        );


    cartCount.textContent = totalItems;

}


// =========================================
// DISPLAY CART
// =========================================

function displayCart() {

    const cartContainer =
        document.getElementById("cartItems");


    if (!cartContainer) {
        return;
    }


    if (cart.length === 0) {

        cartContainer.innerHTML =
            "<p>Your cart is empty.</p>";

        updateCartTotal();

        return;
    }


    cartContainer.innerHTML = "";


    cart.forEach(function (item) {

        const div =
            document.createElement("div");


        div.className = "cart-item";


        div.innerHTML = `

            <div>
                <strong>${item.name}</strong>
                <p>
                    NPR ${Number(item.price).toLocaleString()}
                    × ${item.quantity}
                </p>
            </div>

            <button
                type="button"
                class="btn btn-primary remove-cart"
                data-id="${item.id}"
            >
                Remove
            </button>

        `;


        cartContainer.appendChild(div);

    });


    document
        .querySelectorAll(".remove-cart")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    removeFromCart(
                        this.getAttribute("data-id")
                    );

                }
            );

        });


    updateCartTotal();

}


// =========================================
// CART TOTAL
// =========================================

function updateCartTotal() {

    const totalElement =
        document.getElementById("cartTotal");


    if (!totalElement) {
        return;
    }


    const total =
        cart.reduce(
            function (sum, item) {

                return sum +
                    Number(item.price) *
                    Number(item.quantity);

            },
            0
        );


    totalElement.textContent =
        "NPR " + total.toLocaleString();

}


// =========================================
// ORDER FORM
// =========================================

const orderForm =
    document.getElementById("orderForm");


if (orderForm) {

    orderForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!supabaseClient) {

                alert(
                    "Supabase connection is not available."
                );

                return;
            }


            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            const customerName =
                document.getElementById(
                    "customerName"
                )?.value.trim() || "";


            const customerEmail =
                document.getElementById(
                    "customerEmail"
                )?.value.trim() || "";


            const customerPhone =
                document.getElementById(
                    "customerPhone"
                )?.value.trim() || "";


            const customerAddress =
                document.getElementById(
                    "customerAddress"
                )?.value.trim() || "";


            if (
                !customerName ||
                !customerEmail ||
                !customerPhone ||
                !customerAddress
            ) {

                alert(
                    "Please fill all customer details."
                );

                return;
            }


            const totalAmount =
                cart.reduce(
                    function (sum, item) {

                        return sum +
                            Number(item.price) *
                            Number(item.quantity);

                    },
                    0
                );


            try {

                const { error } =
                    await supabaseClient
                        .from("orders")
                        .insert([
                            {

                                customer_name:
                                    customerName,

                                customer_email:
                                    customerEmail,

                                customer_phone:
                                    customerPhone,

                                customer_address:
                                    customerAddress,

                                total_amount:
                                    totalAmount,

                                status:
                                    "pending"

                            }
                        ]);


                if (error) {

                    console.error(
                        "Order error:",
                        error
                    );

                    alert(
                        "Unable to place order. Please try again."
                    );

                    return;
                }


                alert(
                    "🎉 Order placed successfully!"
                );


                cart = [];

                saveCart();

                updateCartCount();

                displayCart();

                orderForm.reset();


            } catch (error) {

                console.error(error);

                alert(
                    "Something went wrong."
                );

            }

        }
    );

}


// =========================================
// LOAD CART WHEN PAGE OPENS
// =========================================

updateCartCount();

displayCart();


// =========================================
// LOAD PRODUCTS WHEN PAGE OPENS
// =========================================

loadProducts();


// =========================================
// SCROLL REVEAL
// =========================================

const revealElements =
    document.querySelectorAll(
        ".product-card, .feature, .about-content, .contact-info, .contact-form-wrapper"
    );


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        function (element) {

            element.style.opacity = "0";

            element.style.transform =
                "translateY(25px)";

            element.style.transition =
                "opacity 0.7s ease, transform 0.7s ease";

            revealObserver.observe(element);

        }
    );

}


// =========================================
// HEADER SHADOW
// =========================================

const header =
    document.querySelector(".header");


if (header) {

    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 50) {

                header.style.boxShadow =
                    "0 8px 30px rgba(7, 28, 44, 0.08)";

            } else {

                header.style.boxShadow =
                    "none";

            }

        }
    );

}


// =========================================
// CONNECTION TEST
// =========================================

async function testSupabaseConnection() {

    if (!supabaseClient) {

        console.error(
            "❌ Supabase client not created."
        );

        return;
    }


    try {

        const { error } =
            await supabaseClient
                .from("products")
                .select("id")
                .limit(1);


        if (error) {

            console.error(
                "❌ Supabase test failed:",
                error
            );

        } else {

            console.log(
                "✅ Supabase connection working!"
            );

        }

    } catch (error) {

        console.error(
            "❌ Supabase connection error:",
            error
        );

    }

}


testSupabaseConnection();