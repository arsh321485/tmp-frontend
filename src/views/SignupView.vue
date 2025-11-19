<template>
  <main class="split-signup min-vh-100 d-flex align-items-stretch">
    <div class="container-fluid px-0">
      <div class="row gx-0 justify-content-center">

        <!-- CENTERED CARD -->
        <div class="col-12 col-xl-10">
          <div class="card-shell d-flex overflow-hidden shadow-soft rounded-4">

            <!-- LEFT: full-bleed image with centered H3 overlay -->
            <aside class="col-12 col-lg-6 left-image-panel">
              <div class="" aria-hidden="false">
                <img src="../assets/img/main.jpg" alt="illustration" class="left-image" />
                <!-- <div class="left-gradient"></div> -->
                <div class="left-overlay-text">
                  <h1 class="overlay-title ">Create your account</h1>
                  <p class="overlay-sub">Join TestMyPlan — collaborate faster, ship safer.</p>
                </div>
              </div>
            </aside>

            <!-- RIGHT: provider buttons -->
            <section class="col-12 col-lg-6 right-panel d-flex align-items-center justify-content-center py-5">
              <div class="right-inner w-100 d-flex flex-column" style="max-width:520px; min-height:72vh;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4 class="title mb-0">Sign up for TestMyPlan</h4>
                    <small class="text-muted">Choose a provider to continue</small>
                  </div>

                  <a class="small text-muted signin-link" href="#" @click.prevent="goToSignin">Sign in →</a>
                </div>

                <div class="providers-block my-3 align-self-stretch">

                  <!-- Slack -->
                  <button class="provider-btn shadow-sm d-flex align-items-center gap-3" @click="signup('slack')"
                    aria-label="Sign up with Slack">
                    <span class="icon-pill">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/slack.svg" alt="slack" />
                    </span>
                    <div class="provider-labels">
                      <div class="main">Sign up with Slack</div>
                      <div class="sub">Use your Slack workspace</div>
                    </div>
                    <span class="chev">›</span>
                  </button>

                  <!-- Jira -->
                  <button class="provider-btn shadow-sm d-flex align-items-center gap-3" @click="signup('jira')"
                    aria-label="Sign up with Jira">
                    <span class="icon-pill">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/atlassian.svg" alt="jira" />
                    </span>
                    <div class="provider-labels">
                      <div class="main">Sign up with Jira</div>
                      <div class="sub">Connect your Atlassian account</div>
                    </div>
                    <span class="chev">›</span>
                  </button>

                  <!-- Teams -->
                  <button class="provider-btn shadow-sm d-flex align-items-center gap-3" @click="signup('teams')"
                    aria-label="Sign up with Teams">
                    <span class="icon-pill">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/microsoftteams.svg" alt="teams" />
                    </span>
                    <div class="provider-labels">
                      <div class="main">Sign up with Teams</div>
                      <div class="sub">Use Microsoft Teams for SSO</div>
                    </div>
                    <span class="chev">›</span>
                  </button>

                  <!-- Email -->
                  <button class="provider-btn shadow-sm d-flex align-items-center gap-3" @click="goToEmail"
                    aria-label="Sign up with Email">
                    <span class="icon-pill">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/gmail.svg" alt="email" />
                    </span>
                    <div class="provider-labels">
                      <div class="main">I dont have any of these</div>
                      <div class="sub">Use any email address</div>
                    </div>
                    <span class="chev">›</span>
                  </button>

                </div>

                <p class="small text-muted mt-auto mb-0">
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
export default {
  name: "SplitSignupProvidersOnly_FullLeftImage",
  methods: {
    signup(provider: string) {
      // Navigate to onboarding page with provider
      if (this.$router) {
        this.$router.push({ path: "/onboarding", query: { provider } });
        return;
      }
      window.location.href = `/onboarding?provider=${provider}`;
    },

    goToEmail() {
      if (this.$router) {
        this.$router.push("/signup-email");
        return;
      }
      window.location.href = "/signup-email";
    },

    goToSignin() {
      if (this.$router) {
        this.$router.push("/login");
        return;
      }
      window.location.href = "/login";
    },
  },
};
</script>

<style scoped>
/* Page background */
.split-signup {
  background: linear-gradient(180deg, #f6f9ff 0%, #eef5fb 100%);
  padding: 48px 16px;
}

/* card shell */
.card-shell {
  display: flex;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.88));
  box-shadow: 0 8px 30px rgba(18, 38, 84, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(11, 42, 102, 0.06);
}

/* LEFT IMAGE PANEL */
.left-image-panel {
  position: relative;
  padding: 0;
  min-height: 520px;
  overflow: hidden;
}

.left-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.05) contrast(0.98);
}

/* .left-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(1, 24, 39, 0.45), rgba(1, 24, 39, 0.12), rgba(1, 24, 39, 0.02));
} */

.left-overlay-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  padding: 40px;
  z-index: 3;
  color: #fff;
}

.overlay-title {
  font-size: 2.1rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 8px 24px rgba(0, 0, 0, 0.55);
}

.overlay-sub {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.95);
}

/* RIGHT PANEL */
.right-panel {
  padding-left: 48px;
  padding-right: 48px;
  background: #ffffff;
}

/* title color updated */
.title {
  font-weight: 700;
  font-size: 1.125rem;
  color: #03318d;
}

.providers-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.provider-btn {
  background: #fff;
  border: 1px solid rgba(11, 42, 102, 0.08);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: 0.2s ease;
}

.provider-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 34px rgba(9, 30, 66, 0.08);
}

/* icon pill */
.icon-pill {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(180deg, #f5f7fa, #ebf1f9);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ⭐ EXACT BLUE COLOR FOR ICONS (#03318d) */
.icon-pill img {
  width: 18px;
  height: 18px;

  /* exact deep blue filter for #03318d */
  filter: brightness(0) saturate(100%) invert(10%) sepia(90%) saturate(3000%) hue-rotate(205deg) brightness(80%) contrast(105%);
}


.provider-labels .main {
  font-weight: 600;
  color: #03318d;
  /* SAME exact blue */
}


.provider-labels .sub {
  font-size: 12px;
  color: #687388;
}

.chev {
  font-size: 22px;
  color: rgba(11, 42, 102, 0.18);
}

@media (max-width: 991.98px) {
  .card-shell {
    flex-direction: column-reverse;
  }
}
</style>
