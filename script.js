```javascript
document.addEventListener("DOMContentLoaded", function () {

    var SUPABASE_URL = "https://dvyqeiftxliczhllpvvc.supabase.co";

    var SUPABASE_ANON_KEY = "sb_publishable_ZulvWci7BNTGbGpiJjoBvQ_pwZu32XV";

    var supabaseClient = null;


    /* SUPABASE */

    if (window.supabase) {

        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

        console.log("Supabase connected.");

    } else {

        console.log("Supabase library not found.");

    }


    /* FOOTER YEAR */

    var year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* MOBILE MENU */

    var menuToggle = document.getElementById("menuToggle");

    var navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            navLinks.classList.toggle("active");

            if (navLinks.classList.contains("active")) {

                menuToggle.textContent = "X";

            } else {

                menuToggle.textContent = "☰";

            }

        });


        var menuItems = navLinks.querySelectorAll("a");

        menuItems.forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("active");

                menuToggle.textContent = "☰";

            });

        });

    }


    /* PRODUCTS */

    var productGrid = document.getElementById("productGrid");

    if (!productGrid) {

        console.log("Product grid not found.");

        return;

    }


    if (!supabaseClient) {

        productGrid.textContent =
            "Unable to connect to product database.";

        return;

    }


    productGrid.textContent = "Loading products...";


    supabaseClient
        .from("products")
        .select("id, name, description, category, price, image_url")
        .order("id", { ascending: true })

        .then(function (result) {

            var data = result.data;

            var error = result.error;


            if (error) {

                console.log("Product database error:", error);

                productGrid.textContent =
                    "Unable to load products.";

                return;

            }


            if (!data || data.length === 0) {

                productGrid.textContent =
                    "No products available.";

                return;

            }


            productGrid.innerHTML = "";


            data.forEach(function (product) {

                var card = document.createElement("div");

                card.className = "product-card";


                /* IMAGE */

                var imageWrap =
                    document.createElement("div");

                imageWrap.className =
                    "product-image-wrap";


                if (product.image_url) {

                    var image =
                        document.createElement("img");

                    image.src =
                        product.image_url;

                    image.alt =
                        product.name || "Product";

                    image.className =
                        "product-image";

                    image.loading =
                        "lazy";


                    image.onerror =
                        function () {

                            image.style.display = "none";

                            imageWrap.innerHTML =
                                "🌿";

                            imageWrap.style.display =
                                "grid";

                            imageWrap.style.placeItems =
                                "center";

                            imageWrap.style.fontSize =
                                "50px";

                        };


                    imageWrap.appendChild(image);

                } else {

                    imageWrap.textContent = "🌿";

                    imageWrap.style.display = "grid";

                    imageWrap.style.placeItems = "center";

                    imageWrap.style.fontSize = "50px";

                }


                /* PRODUCT INFO */

                var info =
                    document.createElement("div");

                info.className =
                    "product-info";


                var category =
                    document.createElement("span");

                category.className =
                    "product-category";

                category.textContent =
                    product.category || "PRODUCT";


                var name =
                    document.createElement("h3");

                name.textContent =
                    product.name || "Product";


                var description =
                    document.createElement("p");

                description.textContent =
                    product.description ||
                    "Premium quality product from Nepal.";


                var button =
                    document.createElement("a");

                button.className =
                    "product-enquire";

                button.href =
                    "contact.html";


                button.textContent =
                    "Enquire Now →";


                info.appendChild(category);

                info.appendChild(name);

                info.appendChild(description);

                info.appendChild(button);


                card.appendChild(imageWrap);

                card.appendChild(info);


                productGrid.appendChild(card);

            });


            console.log(
                "Products loaded successfully:",
                data.length
            );

        })

        .catch(function (error) {

            console.log(
                "Product loading failed:",
                error
            );

            productGrid.textContent =
                "Something went wrong while loading products.";

        });


    /* HEADER SHADOW */

    var header =
        document.querySelector(".header");


    if (header) {

        window.addEventListener(
            "scroll",
            function () {

                if (window.scrollY > 40) {

                    header.style.boxShadow =
                        "0 8px 30px rgba(7, 28, 44, 0.10)";

                } else {

                    header.style.boxShadow =
                        "none";

                }

            }
        );

    }

});
```
