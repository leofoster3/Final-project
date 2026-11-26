const providers = [
  {
    id: "north-star",
    name: "North Star Nourish",
    owner: "Fictional kitchen · Bowl food",
    emoji: "🌿",
    color: "#e1e9d2",
    bio: "Bright, balanced bowls made for long days and even longer to-do lists.",
    pickup: "Sample pickup: Main Street Market, Antigonish"
  },
  {
    id: "hearth-and-harvest",
    name: "Hearth & Harvest",
    owner: "Fictional kitchen · Comfort food",
    emoji: "🍲",
    color: "#f0d7bd",
    bio: "The kind of cosy, from-scratch food that feels like a deep breath.",
    pickup: "Sample pickup: Greenhouse Café, Antigonish"
  },
  {
    id: "little-green-spoon",
    name: "The Little Green Spoon",
    owner: "Fictional kitchen · Plant-forward",
    emoji: "🥑",
    color: "#dce6c8",
    bio: "Plant-forward favourites packed with colour, crunch, and feel-good flavour.",
    pickup: "Sample pickup: Market Square, Antigonish"
  }
];

const meals = [
  { id: "maple-chicken", name: "Maple-glazed chicken bowl", provider: "north-star", price: 14.50, protein: 32, vegetarian: false, description: "Roasted sweet potato, wild rice & maple tahini.", emoji: "🍗", color: "#f0d9ba", tag: "STUDENT FAVOURITE" },
  { id: "green-goddess", name: "Green goddess grain bowl", provider: "north-star", price: 12.75, protein: 18, vegetarian: true, description: "Herby grains, crisp greens & creamy avocado.", emoji: "🥑", color: "#dce8c9", tag: "PLANT-POWERED" },
  { id: "miso-salmon", name: "Miso-glazed salmon", provider: "north-star", price: 17.50, protein: 35, vegetarian: false, description: "Ginger rice, sesame broccoli & a little zing.", emoji: "🍣", color: "#f4d0bc", tag: "HIGH PROTEIN" },
  { id: "roasted-squash", name: "Roasted squash & lentil bowl", provider: "north-star", price: 11.50, protein: 17, vegetarian: true, description: "Warm lentils, squash, greens & lemon dressing.", emoji: "🥗", color: "#e9dfba", tag: "VEGGIE" },
  { id: "turkey-chili", name: "Smoky turkey chili", provider: "hearth-and-harvest", price: 13.25, protein: 29, vegetarian: false, description: "Slow-simmered turkey, beans & a dollop of yogurt.", emoji: "🌶️", color: "#edcfb6", tag: "HIGH PROTEIN" },
  { id: "mac-cheese", name: "Roasted tomato mac & cheese", provider: "hearth-and-harvest", price: 12.00, protein: 21, vegetarian: true, description: "Golden cheddar sauce with sweet roasted tomatoes.", emoji: "🧀", color: "#f0e2b9", tag: "COMFORT FOOD" },
  { id: "beef-meatballs", name: "Sunday beef meatballs", provider: "hearth-and-harvest", price: 16.25, protein: 34, vegetarian: false, description: "Herby tomato sauce, parmesan & fluffy grains.", emoji: "🍝", color: "#edcfbe", tag: "HIGH PROTEIN" },
  { id: "chickpea-stew", name: "Coconut chickpea stew", provider: "hearth-and-harvest", price: 11.75, protein: 16, vegetarian: true, description: "Cosy coconut broth, chickpeas & warm spices.", emoji: "🍛", color: "#e9d8b8", tag: "VEGGIE" },
  { id: "peanut-tofu", name: "Sticky peanut tofu bowl", provider: "little-green-spoon", price: 13.50, protein: 26, vegetarian: true, description: "Crispy tofu, crunchy slaw & peanut-lime sauce.", emoji: "🥜", color: "#e5d5ba", tag: "HIGH PROTEIN" },
  { id: "rainbow-wrap", name: "Rainbow crunch wrap", provider: "little-green-spoon", price: 10.50, protein: 14, vegetarian: true, description: "Hummus, crisp veg & pickled cabbage in a wrap.", emoji: "🌯", color: "#dce4c3", tag: "FRESH PICK" },
  { id: "lentil-bolognese", name: "Lentil bolognese", provider: "little-green-spoon", price: 12.50, protein: 22, vegetarian: true, description: "Rich tomato-lentil sauce over whole wheat pasta.", emoji: "🍝", color: "#efd4ba", tag: "PLANT-POWERED" },
  { id: "edamame-noodles", name: "Sesame edamame noodles", provider: "little-green-spoon", price: 13.00, protein: 27, vegetarian: true, description: "Chilled noodles, edamame & a bright sesame dressing.", emoji: "🍜", color: "#dbe6ca", tag: "HIGH PROTEIN" }
];

const cart = new Map();
const mealGrid = document.querySelector("#meal-grid");
const providerGrid = document.querySelector("#provider-grid");
const providerFilter = document.querySelector("#provider-filter");
const priceFilter = document.querySelector("#price-filter");
const vegetarianFilter = document.querySelector("#vegetarian-filter");
const proteinFilter = document.querySelector("#protein-filter");
const mealSearch = document.querySelector("#meal-search");
const cartDrawer = document.querySelector("#cart-drawer");
const modalBackdrop = document.querySelector("#modal-backdrop");
const checkoutModal = document.querySelector("#checkout-modal");
const toast = document.querySelector("#toast");
let toastTimer;
let lastFocusedElement;

const money = amount => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount);
const providerById = id => providers.find(provider => provider.id === id);

function renderProviders() {
  providers.forEach(provider => {
    const option = document.createElement("option");
    option.value = provider.id;
    option.textContent = provider.name;
    providerFilter.append(option);
  });

  providerGrid.innerHTML = providers.map(provider => `
    <article class="provider-card">
      <div class="provider-top">
        <span class="provider-avatar" style="--provider-color:${provider.color}" aria-hidden="true">${provider.emoji}</span>
        <div><h3>${provider.name}</h3><p>${provider.owner}</p></div>
        <span class="fictional-tag">Fictional</span>
      </div>
      <p class="provider-bio">${provider.bio}</p>
      <div class="provider-pickup"><span>PICKUP OPTION (SAMPLE)</span><strong>${provider.pickup}</strong></div>
    </article>
  `).join("");
}

function renderMeals() {
  const maxPrice = priceFilter.value === "all" ? Infinity : Number(priceFilter.value);
  const searchTerm = mealSearch.value.trim().toLowerCase();
  const filteredMeals = meals.filter(meal => {
    const provider = providerById(meal.provider);
    const searchableText = `${meal.name} ${meal.description} ${meal.tag} ${provider.name}`.toLowerCase();

    return (providerFilter.value === "all" || meal.provider === providerFilter.value) &&
      meal.price < maxPrice &&
      (!vegetarianFilter.checked || meal.vegetarian) &&
      (!proteinFilter.checked || meal.protein >= 25) &&
      (!searchTerm || searchableText.includes(searchTerm));
  });

  document.querySelector("#result-count").textContent = `${filteredMeals.length} ${filteredMeals.length === 1 ? "meal" : "meals"} to explore`;
  document.querySelector("#empty-state").hidden = filteredMeals.length !== 0;
  mealGrid.hidden = filteredMeals.length === 0;
  mealGrid.innerHTML = filteredMeals.map(meal => {
    const provider = providerById(meal.provider);
    return `
      <article class="meal-card">
        <div class="meal-visual" style="background:${meal.color}">
          <span class="meal-tag ${meal.vegetarian ? "vegetarian" : ""}">${meal.tag}</span>
          <span class="meal-art" style="--meal-bg:${meal.color}" role="img" aria-label="${meal.name} sample illustration">${meal.emoji}</span>
        </div>
        <div class="meal-info">
          <p class="meal-provider">${provider.name} · fictional</p>
          <h3>${meal.name}</h3>
          <p class="meal-description">${meal.description}</p>
          <div class="meal-meta"><span class="meal-protein">${meal.protein}g protein</span>${meal.vegetarian ? '<span class="meal-vegetarian-note">Veggie</span>' : ""}</div>
          <button class="meal-buy" type="button" data-add-meal="${meal.id}" aria-label="Add ${meal.name}, ${money(meal.price)}, to cart"><span aria-hidden="true">＋</span><span>Add to cart</span><span>${money(meal.price)}</span></button>
        </div>
      </article>
    `;
  }).join("");
}

function renderCart() {
  const entries = [...cart.entries()];
  const quantity = entries.reduce((sum, [, count]) => sum + count, 0);
  const subtotal = entries.reduce((sum, [id, count]) => sum + meals.find(meal => meal.id === id).price * count, 0);
  document.querySelector("#cart-count").textContent = quantity;
  document.querySelector("#open-cart").setAttribute("aria-label", `Open cart, ${quantity} ${quantity === 1 ? "item" : "items"}`);
  document.querySelector("#drawer-count").textContent = `(${quantity})`;
  document.querySelector("#cart-empty").hidden = quantity > 0;
  document.querySelector("#cart-footer").hidden = quantity === 0;
  document.querySelector("#cart-subtotal").textContent = money(subtotal);
  document.querySelector("#checkout-item-count").textContent = `${quantity} ${quantity === 1 ? "item" : "items"}`;
  document.querySelector("#checkout-total").textContent = `${money(subtotal)} CAD`;
  document.querySelector("#cart-items").innerHTML = entries.map(([id, count]) => {
    const meal = meals.find(item => item.id === id);
    const provider = providerById(meal.provider);
    return `
      <article class="cart-line">
        <span class="cart-line-art" style="--line-bg:${meal.color}" aria-hidden="true">${meal.emoji}</span>
        <div><h3>${meal.name}</h3><p>${provider.name}</p>
          <div class="quantity-control" aria-label="Quantity for ${meal.name}">
            <button type="button" data-quantity="-1" data-meal-id="${id}" aria-label="Decrease ${meal.name} quantity">−</button>
            <span aria-live="polite">${count}</span>
            <button type="button" data-quantity="1" data-meal-id="${id}" aria-label="Increase ${meal.name} quantity">+</button>
          </div>
        </div>
        <span class="cart-line-price">${money(meal.price * count)}</span>
      </article>
    `;
  }).join("");

  const pickupChoice = document.querySelector("#pickup-choice");
  if (pickupChoice.options.length === 1) {
    providers.forEach(provider => {
      const option = document.createElement("option");
      option.value = provider.id;
      option.textContent = `${provider.name} — ${provider.pickup.replace("Sample pickup: ", "")}`;
      pickupChoice.append(option);
    });
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function openCart() {
  lastFocusedElement = document.activeElement;
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  modalBackdrop.hidden = false;
  document.body.classList.add("no-scroll");
  document.querySelector("#close-cart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  if (!checkoutModal.classList.contains("is-open")) {
    modalBackdrop.hidden = true;
    document.body.classList.remove("no-scroll");
  }
  if (lastFocusedElement) lastFocusedElement.focus();
}

function openCheckout() {
  if (cart.size === 0) return;
  lastFocusedElement = document.querySelector("#open-cart");
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  checkoutModal.classList.add("is-open");
  checkoutModal.setAttribute("aria-hidden", "false");
  document.querySelector("#checkout-content").hidden = false;
  document.querySelector("#confirmation").hidden = true;
  document.querySelector("#pickup-choice").value = "";
  document.querySelector("#close-checkout").focus();
}

function closeCheckout() {
  checkoutModal.classList.remove("is-open");
  checkoutModal.setAttribute("aria-hidden", "true");
  modalBackdrop.hidden = true;
  document.body.classList.remove("no-scroll");
  if (lastFocusedElement) lastFocusedElement.focus();
}

document.querySelector("#meal-grid").addEventListener("click", event => {
  const button = event.target.closest("[data-add-meal]");
  if (!button) return;
  const id = button.dataset.addMeal;
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  showToast(`${meals.find(meal => meal.id === id).name} added to your demo cart`);
});

document.querySelector("#cart-items").addEventListener("click", event => {
  const button = event.target.closest("[data-quantity]");
  if (!button) return;
  const id = button.dataset.mealId;
  const nextCount = (cart.get(id) || 0) + Number(button.dataset.quantity);
  if (nextCount <= 0) cart.delete(id);
  else cart.set(id, nextCount);
  renderCart();
});

[providerFilter, priceFilter, vegetarianFilter, proteinFilter].forEach(control => control.addEventListener("change", renderMeals));
mealSearch.addEventListener("input", renderMeals);
document.querySelector("#clear-filters").addEventListener("click", clearFilters);
document.querySelector("#empty-clear").addEventListener("click", clearFilters);
function clearFilters() {
  providerFilter.value = "all";
  priceFilter.value = "all";
  vegetarianFilter.checked = false;
  proteinFilter.checked = false;
  mealSearch.value = "";
  renderMeals();
}

document.querySelector("#open-cart").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
document.querySelector("#open-checkout").addEventListener("click", openCheckout);
document.querySelector("#close-checkout").addEventListener("click", closeCheckout);
document.querySelector("#browse-meals").addEventListener("click", () => {
  closeCart();
  document.querySelector("#meals").scrollIntoView({ behavior: "smooth" });
});
modalBackdrop.addEventListener("click", () => {
  if (checkoutModal.classList.contains("is-open")) closeCheckout();
  else closeCart();
});

document.querySelector("#place-order").addEventListener("click", () => {
  const pickupId = document.querySelector("#pickup-choice").value;
  if (!pickupId) {
    document.querySelector("#pickup-choice").focus();
    showToast("Choose a sample pickup option to continue");
    return;
  }
  const provider = providerById(pickupId);
  const itemCount = [...cart.values()].reduce((sum, count) => sum + count, 0);
  document.querySelector("#confirmation-message").textContent = `Your sample order for ${itemCount} ${itemCount === 1 ? "meal" : "meals"} is ready for pickup at ${provider.pickup.replace("Sample pickup: ", "")}.`;
  document.querySelector("#checkout-content").hidden = true;
  document.querySelector("#confirmation").hidden = false;
  document.querySelector("#finish-order").focus();
});

document.querySelector("#finish-order").addEventListener("click", () => {
  cart.clear();
  renderCart();
  closeCheckout();
  document.querySelector("#meals").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#provider-form").addEventListener("submit", event => {
  event.preventDefault();
  const businessName = document.querySelector("#business-name").value.trim();
  const feedback = document.querySelector("#provider-feedback");
  feedback.textContent = `Thanks for trying the demo, ${businessName}! This inquiry was not sent or stored.`;
  feedback.hidden = false;
  event.currentTarget.reset();
});

const menuToggle = document.querySelector("#menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !expanded);
});
primaryNav.addEventListener("click", event => {
  if (event.target.closest("a")) {
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (checkoutModal.classList.contains("is-open")) closeCheckout();
    else if (cartDrawer.classList.contains("is-open")) closeCart();
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

renderProviders();
renderMeals();
renderCart();

async function loadWebsiteCode() {
  const files = [
    ["html-code", "index.html"],
    ["css-code", "styles.css"],
    ["js-code", "app.js"]
  ];

  await Promise.all(files.map(async ([elementId, fileName]) => {
    const codeElement = document.querySelector(`#${elementId} code`);
    try {
      const response = await fetch(fileName, { cache: "no-store" });
      if (!response.ok) throw new Error(`Could not load ${fileName}`);
      codeElement.textContent = await response.text();
    } catch (error) {
      codeElement.textContent = `Unable to display ${fileName}. Open the file directly in the project workspace.`;
    }
  }));
}

document.querySelectorAll("[data-copy-target]").forEach(button => {
  button.addEventListener("click", async () => {
    const code = document.querySelector(`#${button.dataset.copyTarget} code`).textContent;
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = "Copied";
      showToast("Code copied to clipboard");
      window.setTimeout(() => { button.textContent = "Copy"; }, 1600);
    } catch (error) {
      showToast("Copy failed — select the code manually");
    }
  });
});

loadWebsiteCode();
