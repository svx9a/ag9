import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Features from './views/Features.vue';
import ContactPage from './views/ContactPage.vue';
import Dashboard from './views/Dashboard.vue';
import Auth from './views/Auth.vue';
import NotFound from './views/NotFound.vue';

// Smart Farming Views
import RoleSelection from './views/kaset/RoleSelection.vue';
import AdminDashboard from './views/kaset/AdminDashboard.vue';
import ProviderDashboard from './views/kaset/ProviderDashboard.vue';
import DroneHubLanding from './views/kaset/DroneHubLanding.vue';
import ImageProcessingDemo from './views/kaset/ImageProcessingDemo.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/features', name: 'Features', component: Features },
  { path: '/contact', name: 'Contact', component: ContactPage },
  { path: '/auth', name: 'Auth', component: Auth },
  { path: '/image-processor', name: 'ImageProcessor', component: ImageProcessingDemo },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },

  // Smart Farming Routes
  { path: '/kaset/role', name: 'KasetRole', component: RoleSelection },
  {
    path: '/kaset/farmer',
    name: 'KasetFarmer',
    redirect: { name: 'Dashboard', query: { tab: 'farmer' } }
  },
  {
    path: '/kaset/pilot',
    name: 'KasetPilot',
    redirect: { name: 'Dashboard', query: { tab: 'pilot' } }
  },
  {
    path: '/kaset/admin',
    name: 'KasetAdmin',
    redirect: { name: 'Dashboard', query: { tab: 'admin' } }
  },
  {
    path: '/kaset/provider',
    name: 'KasetProvider',
    redirect: { name: 'Dashboard', query: { tab: 'provider' } }
  },
  { path: '/drone-hub', name: 'DroneHub', component: DroneHubLanding },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80, // Offset for fixed navbar
      };
    }
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth');
  } else {
    next();
  }
});

export default router;
