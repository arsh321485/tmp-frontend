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
<style>
/* Page background */
.se-page {
  background: linear-gradient(180deg, #f6f9ff 0%, #eef5fb 100%);
}

/* Card container spacing to match screenshot */
.se-card-col {
  padding: 48px 10px;
}

/* Card style */
.se-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(11, 42, 102, 0.06);
  box-shadow: 0 8px 30px rgba(18, 38, 84, 0.06);
  min-height: 560px;
  max-width: 1000px;
  margin: 0 auto;
}

/* LEFT image panel */
.se-left {
  width: 52%;
  min-height: 560px;
  position: relative;
  padding: 0;
  /* background: #061333; */
}

.se-left-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(1.05) contrast(0.98);
}

/* overlay text */
.se-left-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  pointer-events: none;
  padding: 24px;
}

.se-left-title {
  font-size: 26px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 8px 24px rgba(0, 0, 0, 0.55);
}

.se-left-sub {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
}

/* DATA PROTECTION pill */
.se-data-protection {
  margin-top: 60px;
  padding: 10px 18px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-weight: 700;
  letter-spacing: 0.4px;
  color: #c7ffff;
}

/* RIGHT panel */
.se-right {
  width: 48%;
  padding: 40px 56px;
  background: #fff;
  display: flex;
  align-items: center;
}

.se-right-inner {
  width: 100%;
}

/* header row increased gap so providers sit lower */
.se-header-row {
  margin-bottom: 24px;
  gap: 12px;
  align-items: flex-start;
}

/* sign-in link style */
.tmp-signin-link {
  color: #6c757d;
  text-decoration: none;
}

.tmp-signin-link:hover {
  color: #03318d;
  text-decoration: underline;
}

/* header/title */
.se-title {
  color: #03318d;
  font-weight: 700;
}

/* providers list */
.se-providers {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: stretch;
  margin-top: 0;
}

/* provider row */
.se-provider {
  background: #fff;
  border: 1px solid rgba(11, 42, 102, 0.06);
  border-radius: 12px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: transform .12s ease, box-shadow .12s ease;
}

.se-provider:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 34px rgba(9, 30, 66, 0.06);
}

/* icon pill */
.se-icon {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f5f7fa, #ebf1f9);
}

.se-icon img {
  width: 18px;
  height: 18px;
  filter: brightness(0) saturate(100%) invert(10%) sepia(90%) saturate(3000%) hue-rotate(205deg) brightness(80%) contrast(105%);
}

/* labels */
.se-labels .se-main {
  font-weight: 600;
  color: #03318d;
}

.se-labels .se-sub {
  color: #687388;
  font-size: 13px;
  margin-top: 3px;
}

/* arrow */
.se-arrow {
  margin-left: auto;
  color: rgba(11, 42, 102, 0.18);
  font-size: 22px;
}

/* email link and terms */
.se-email-link {
  color: #6c6c6c;
  text-decoration: underline;
}

/* mobile button styling override (keeps bootstrap btn styles) */
.se-email-btn {
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  color: #03318d;
}

/* Responsive: hide left panel on md and below; reduce paddings so no big bottom gap */
@media (max-width: 991.98px) {
  .se-card {
    flex-direction: column;
    min-height: auto;
  }

  .se-left {
    display: none !important;
  }

  .se-right {
    width: 100%;
    padding: 28px 20px;
  }

  .se-card-col {
    padding: 24px 10px;
  }

  .se-data-protection {
    display: none;
  }

  .se-left-title {
    font-size: 20px;
  }

  .se-header-row {
    margin-bottom: 18px;
  }

  /* on small screens make provider buttons slightly taller for touch */
  .se-provider {
    padding: 16px 18px;
  }

  .se-provider .se-main {
    font-size: 1rem;
  }

  .se-provider .se-sub {
    font-size: 0.85rem;
  }
}

/* Very large screens: cap width so card doesn't become extremely wide */
@media (min-width: 1600px) {
  .se-card {
    max-width: 1200px;
  }
}
</style>
