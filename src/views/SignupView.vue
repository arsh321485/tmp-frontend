<!-- SplitSignupProvidersOnly_FullLeftImage.vue -->
<template>
  <main class="split-signup min-vh-100 d-flex align-items-stretch">
    <div class="container-fluid px-0">
      <div class="row gx-0">
        <!-- LEFT: full-bleed image with centered H3 overlay -->
        <aside class="col-12 col-lg-6 left-image-panel">
          <div class="left-image-wrapper" aria-hidden="false">
            <img src="../assets/img/main2.jpg" alt="illustration" class="left-image" />
            <!-- centered text over the image -->
            <div class="left-overlay-text">
              <h1>Create your account
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </h1>
            </div>
          </div>
        </aside>

        <!-- RIGHT: provider buttons only (no form) -->
        <section class="col-12 col-lg-6 right-panel d-flex align-items-center justify-content-center py-5">
          <div class="right-inner w-100 d-flex flex-column" style="max-width:520px; min-height:72vh;">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 class="mb-0">Sign up for TestMyPlan</h4>
                <small class="text-muted">Choose a provider to continue</small>
              </div>

              <a class="small text-muted" href="#" @click.prevent="goToSignin">Sign in →</a>
            </div>

            <!-- Buttons block (centered vertically) -->
            <div class="d-grid gap-3 my-3 align-self-stretch" style="align-content:center;">
              <!-- Slack -->
              <button class="btn btn-outline-primary d-flex align-items-center gap-3 provider-btn"
                @click="signup('slack')" aria-label="Sign up with Slack">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/slack.svg" alt="slack"
                  style="height:18px" />
                Sign up with Slack
              </button>

              <!-- Jira -->
              <button class="btn btn-outline-primary d-flex align-items-center gap-3 provider-btn"
                @click="signup('jira')" aria-label="Sign up with Jira">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/atlassian.svg" alt="jira"
                  style="height:18px" />
                Sign up with Jira
              </button>

              <!-- Teams -->
              <button class="btn btn-outline-primary d-flex align-items-center gap-3 provider-btn"
                @click="signup('teams')" aria-label="Sign up with Teams">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/microsoftteams.svg" alt="teams"
                  style="height:18px" />
                Sign up with Teams
              </button>

              <!-- Email (navigates to next page) -->
              <button class="btn btn-outline-primary provider-btn" @click="goToEmail" aria-label="Sign up with Email">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/gmail.svg" alt="email"
                  style="height:18px" />
                Sign up with Email
              </button>
            </div>

            <!-- small legal / note pinned to bottom of the right column -->
            <p class="small text-muted ">
              By continuing you agree to our <a href="#" class="text-decoration-underline">Terms</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
export default {
  name: "SplitSignupProvidersOnly_FullLeftImage",
  methods: {
    /**
     * Called when user clicks Slack / Jira / Teams.
     * Navigates to /teams-info and attaches ?provider=<provider>
     */
    signup(provider: string) {
      // analytics hook (optional)
      console.log("start provider signup:", provider);

      // prefer Vue router if available
      if (this.$router) {
        this.$router.push({ path: "/teams-info", query: { provider } });
        return;
      }

      // fallback
      const url = `/teams-info?provider=${encodeURIComponent(provider)}`;
      window.location.href = url;
    },

    /**
     * Email button -> /signup-email
     */
    goToEmail() {
      if (this.$router) {
        this.$router.push({ path: "/signup-email" });
        return;
      }
      window.location.href = "/signup-email";
    },

    goToSignin() {
      if (this.$router) {
        this.$router.push({ path: "/login" });
        return;
      }
      window.location.href = "/login";
    },
  },
};
</script>

<style scoped>
/* reset container gaps */
.split-signup {
  background: #fff;
}

/* LEFT: full-bleed image panel */
.left-image-panel {
  position: relative;
  padding: 0;
  /* remove default padding */
  min-height: 100vh;
  overflow: hidden;
  display: block;
}

/* wrapper ensures position context */
.left-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

/* image covers the whole left panel */
.left-image {
  position: absolute;
  inset: 0;
  /* top:0; right:0; bottom:0; left:0 */
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* fill, cropping if needed */
  display: block;
  /* remove border radius so image touches edges */
  border-radius: 0;
}

/* centered overlay text */
.left-overlay-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  text-align: center;
  pointer-events: none;
  /* allow clicks through if necessary */
}

/* style for the h3 — tuned to be visible over image */
.left-overlay-text h1 {
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  margin: 0;
  padding: 0 18px;
  line-height: 1.1;
}

/* RIGHT panel */
.right-panel {
  background: #fff;
  min-height: 100vh;
  padding-left: 48px;
  padding-right: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* buttons & look */
.provider-btn {
  padding: 12px 16px;
  font-weight: 600;
  border-radius: 8px;
  text-align: left;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
}

/* variants */
.btn-outline-primary {
  color: #0f0f0f;
  border-color: rgba(11, 42, 102, 0.12);
  background: #fff;
}

.btn-outline-secondary {
  background: #fff;
  border: 1px solid #e6e9ec;
  color: #111;
}

.btn-dark {
  background: #111;
  color: #fff;
  border: none;
}

/* responsive */
@media (max-width: 991.98px) {
  .left-image-panel {
    min-height: 40vh;
  }

  .left-overlay-text h3 {
    font-size: 1.5rem;
  }

  .right-inner {
    min-height: 50vh;
    padding-left: 24px;
    padding-right: 24px;
  }
}
</style>
