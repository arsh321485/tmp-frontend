<template>
  <main class="se-page min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container-fluid px-0">
      <div class="row gx-0 justify-content-center w-100">

        <!-- Card centered on all breakpoints -->
        <div class="col-12 col-sm-11 col-md-10 col-lg-10 col-xl-10 col-xxl-9 mx-auto se-card-col">
          <div class="se-card d-flex overflow-hidden rounded-3 shadow-sm mx-auto">

            <!-- LEFT: image panel (visible lg and up) -->
            <aside class="se-left d-none d-lg-block">
              <img src="../assets/img/main.jpg" alt="illustration" class="se-left-img" />
              <div class="se-left-overlay">
                <h2 class="se-left-title">Create your account</h2>
                <p class="se-left-sub">Join TestMyPlan — collaborate faster, ship safer.</p>
                <div class="se-data-protection">DATA PROTECTION</div>
              </div>
            </aside>

            <!-- RIGHT: providers -->
            <section class="se-right d-flex align-items-center">
              <div class="w-100 se-right-inner">

                <!-- header: title on left, sign-in link on right (single row) -->
                <div class="d-flex justify-content-between align-items-start se-header-row">
                  <div>
                    <h4 class="se-title mb-1">Sign up for TestMyPlan</h4>
                    <small class="text-muted">Choose a provider to continue</small>
                  </div>

                  <a class="small text-muted tmp-signin-link align-self-start" href="#" @click.prevent="goToSignin">Sign
                    in →</a>
                </div>

                <!-- provider list -->
                <div class="se-providers">
                  <button class="se-provider d-flex align-items-center btn w-100 text-start" @click="signup('slack')">
                    <span class="se-icon">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/slack.svg" alt="slack" />
                    </span>
                    <div class="se-labels">
                      <div class="se-main">Sign up with Slack</div>
                      <div class="se-sub">Use your Slack workspace</div>
                    </div>
                    <span class="se-arrow">›</span>
                  </button>

                  <button class="se-provider d-flex align-items-center btn w-100 text-start" @click="signup('asana')">
                    <span class="se-icon">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/atlassian.svg" alt="asana" />
                    </span>
                    <div class="se-labels">
                      <div class="se-main">Sign up with Asana</div>
                      <div class="se-sub">Connect your Atlassian account</div>
                    </div>
                    <span class="se-arrow">›</span>
                  </button>

                  <button class="se-provider d-flex align-items-center btn w-100 text-start" @click="signup('teams')">
                    <span class="se-icon">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/microsoftteams.svg" alt="teams" />
                    </span>
                    <div class="se-labels">
                      <div class="se-main">Sign up with Teams</div>
                      <div class="se-sub">Use Microsoft Teams for SSO</div>
                    </div>
                    <span class="se-arrow">›</span>
                  </button>

                  <!-- Desktop: underline link (visible md and up) -->
                  <div class="text-center mt-3 d-none d-md-block">
                    <a href="/signup-email" class="se-email-link">I dont have any of these</a>
                  </div>

                  <!-- Mobile: full-width button (visible below md) -->
                  <div class=" d-md-none mt-3">
                    <a href="/signup-email" class=" w-100  small">I dont have any of
                      these</a>
                  </div>

                </div>

                <!-- optionally show terms on larger screens -->
                <p class="small text-muted mt-4 se-terms mb-0 d-none d-md-block  text-center ">
                  By continuing you agree to our <a href="#" class="text-decoration-underline">Terms</a>.
                </p>

              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Router } from "vue-router";

export default defineComponent({
  name: "SignupExact",
  methods: {
    // give `this` a narrow type that includes $router
    signup(this: { $router?: Router }, provider: string) {
      const router = this.$router;
      if (router) {
        router.push({ path: "/onboarding", query: { provider } });
        return;
      }
      window.location.href = `/onboarding?provider=${provider}`;
    },

    // same pattern for goToSignin
    goToSignin(this: { $router?: Router }) {
      const router = this.$router;
      if (router) {
        router.push("/login");
        return;
      }
      window.location.href = "/login";
    }
  }
});
</script>
