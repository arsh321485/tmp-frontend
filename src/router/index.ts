import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignupView from '@/views/SignupView.vue'
import SignInView from '@/views/SignIn.vue'
import EmailAuthView from '@/views/EmailAuthView.vue'
import ForgetPasswordView from '@/views/ForgetPasswordView.vue'
import SignupEmailView from '@/views/SignupEmailView.vue'
import OnboardingFormView from '@/views/OnboardingFormView.vue'
import TestView from '@/views/TestView.vue'
import MattermostView from '@/views/MattermostView.vue'
import EmailOnboardingView from '@/views/EmailOnboardingView.vue'
import AddLocationView from '@/views/AddLocationView.vue'
import LogIn from '@/components/LogIn.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
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
      name: 'logIn',
      component: LogIn,
    },
    {
      path: '/signup',
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
      path: '/signin',
      name: 'signin',
      component: SignInView
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

// main.ts (put this near the top, before `createApp(...)` and before mounting)
if (typeof window !== 'undefined') {
  // If the app was loaded from a non-root pathname AND the URL already has a hash route,
  // move the hash route to root so final URL becomes "/#/..." instead of "/somepath#/..."
  const { pathname, hash } = window.location;
  if (pathname !== '/' && hash && hash.startsWith('#/')) {
    // e.g. /signup-email#/onboarding?provider=teams  -->  /#/onboarding?provider=teams
    const newUrl = `/${hash}`; // includes leading '#'
    // Use replaceState so it doesn't reload the page
    window.history.replaceState({}, '', newUrl);
    // location now: pathname === '/' and hash preserved
  }
}

export default router
