import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./assets/main.css";
import { useAuth } from "./context/AuthContext";

import HomePage from "./pages/HomePage.vue";
import ProductListingPage from "./pages/ProductListingPage.vue";
import SingleProductPage from "./pages/SingleProductPage.vue";
import CartPage from "./pages/CartPage.vue";
import CheckoutPage from "./pages/CheckoutPage.vue";
import ThankYouPage from "./pages/ThankYouPage.vue";
import ComingSoonPage from "./pages/ComingSoonPage.vue";
import UserProfile from "./pages/UserProfile.vue";
import LoginPage from "./pages/LoginPage.vue";
import RegisterPage from "./pages/RegisterPage.vue";
import MainLayout from "./layouts/MainLayout.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      component: LoginPage,
      meta: { guestOnly: true },
    },
    {
      path: "/register",
      component: RegisterPage,
      meta: { guestOnly: true },
    },
    {
      path: "/",
      component: MainLayout,
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
          meta: { requiresAuth: true },
        },
        {
          path: "/thank-you",
          component: ThankYouPage,
          meta: { requiresAuth: true },
        },
        {
          path: "/profile",
          component: UserProfile,
          meta: { requiresAuth: true },
        },
        {
          path: "/:pathMatch(.*)*",
          component: ComingSoonPage,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const auth = useAuth();

  if (to.meta.requiresAuth && !auth.user) {
    next("/login");
  } else if (to.meta.guestOnly && auth.user) {
    next("/");
  } else {
    next();
  }
});

const pinia = createPinia();
const app = createApp(App);

app.provide("auth", useAuth());

app.use(pinia);
app.use(router);
app.mount("#app");
