import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./assets/main.css";

import HomePage from "./pages/HomePage.vue";
import ProductListingPage from "./pages/ProductListingPage.vue";
import SingleProductPage from "./pages/SingleProductPage.vue";
import CartPage from "./pages/CartPage.vue";
import CheckoutPage from "./pages/CheckoutPage.vue";
import ThankYouPage from "./pages/ThankYouPage.vue";
import ComingSoonPage from "./pages/ComingSoonPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./layouts/MainLayout.vue"),
      children: [
        {
          path: "",
          component: HomePage,
        },
        {
          path: "/products",
          component: ProductListingPage,
        },
        {
          path: "/single-product/:id",
          component: SingleProductPage,
        },
        {
          path: "/cart",
          component: CartPage,
        },
        {
          path: "/checkout",
          component: CheckoutPage,
        },
        {
          path: "/thank-you",
          component: ThankYouPage,
        },
        {
          path: "/:pathMatch(.*)*",
          component: ComingSoonPage,
        },
      ],
    },
  ],
});

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount("#app");
