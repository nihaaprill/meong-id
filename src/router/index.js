import { createRouter, createWebHistory } from "vue-router";

// 1. Import Semua Halaman (Views)
import HomeView from "../views/HomeView.vue";
import AdoptionView from "../views/AdoptionView.vue";
import AdoptionDetailView from "../views/AdoptionDetailView.vue";
import ArticlesView from "../views/ArticlesView.vue";
import ArticleDetailView from "../views/ArticleDetailView.vue";
import CommunityView from "../views/CommunityView.vue";
// Pastikan DonationView HANYA DIIMPORT SATU KALI
import DonationListView from "../views/DonationListView.vue"; 
import DonationDetailView from "../views/DonationDetailView.vue";
import DonationView from "../views/DonationView.vue"; // Ini form donasi
import ReportView from "../views/ReportView.vue";
import SignupView from "../views/SignupView.vue";
import LoginView from "../views/LoginView.vue";
import ProfilView from "../views/ProfilView.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import AboutUsView from "../views/AboutUsView.vue";
import LostCatView from "../views/LostCatView.vue";
import HospitalShelter from "../views/HospitalShelter.vue"; 
import HospitalShelterDetailView from "../views/HospitalShelterDetailView.vue";
import EditProfilView from "../views/EditProfilView.vue";
import LearningView from "../views/LearningView.vue";
import ClassroomView from "../views/ClassroomView.vue";
import ShopView from "../views/ShopView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/about-us", component: AboutUsView },
  
  // Auth
  { path: "/login", component: LoginView },
  { path: "/signup", component: SignupView },
  { path: "/forgot-password", component: ForgotPassword },
  
  // Profile
  { path: "/profile", component: ProfilView },
  { path: "/profile/edit", component: EditProfilView },

  // Articles
  { path: "/articles", component: ArticlesView },
  { path: "/articles/:id", component: ArticleDetailView },

  // Adoption
  { path: "/adoption", component: AdoptionView },
  { path: "/adoption/:id", component: AdoptionDetailView },

  // Hospital & Shelter
  { path: "/hospital-shelter", component: HospitalShelter}, 
  { path: "/hospital-shelter/:id", component: HospitalShelterDetailView }, 

  // Report Lost Cat
  { path: "/report", component: ReportView },
  { path: "/lost-cats", component: LostCatView },

  // Community
  { path: "/community", component: CommunityView },

  // Donation (Alur Baru)
  { path: "/donation", component: DonationListView },      // Daftar Kampanye
  { path: "/donation/:id", component: DonationDetailView }, // Detail Kampanye
  { path: "/donation/:id/pay", component: DonationView },   // Form Bayar

  { path: "/learning", component: LearningView },
  { path: "/learning/:id", component: ClassroomView },

  { path: "/shop", component: ShopView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll ke atas setiap pindah halaman
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
});

export default router;