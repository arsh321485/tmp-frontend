import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignupView from '@/views/SignupView.vue'
import LoginView from '@/views/LoginView.vue'
import EmailAuthView from '@/views/EmailAuthView.vue'
import ForgetPasswordView from '@/views/ForgetPasswordView.vue'
import SignupEmailView from '@/views/SignupEmailView.vue'
import OnboardingFormView from '@/views/OnboardingFormView.vue'
import TestView from '@/views/TestView.vue'
import MattermostView from '@/views/MattermostView.vue'
import EmailOnboardingView from '@/views/EmailOnboardingView.vue'
import AddLocationView from '@/views/AddLocationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
    {
      path: '/',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/add-location',
      name: 'addlocation',
      component: AddLocationView
    },

    {
      path: '/test',
      name: 'test',
      component: TestView
    }, {
      path: '/email-onboarding',
      name: 'email-onboarding',
      component: EmailOnboardingView
    }, {
      path: '/mattermost',
      name: 'mattermost',
      component: MattermostView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/emailauth',
      name: 'emailauth',
      component: EmailAuthView
    },
    {
      path: '/forgetpassword',
      name: 'forgetpassword',
      component: ForgetPasswordView
    },
    {
      path: '/signup-email',
      name: 'signupemail',
      component: SignupEmailView,
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingFormView,
    },


  ],
})

export default router
