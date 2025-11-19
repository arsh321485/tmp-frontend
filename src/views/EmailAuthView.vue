<!-- VerifyEmailThemeFrontendOnly.vue (UI-only, no API calls) -->
<template>
  <main class="split-signup min-vh-100 d-flex align-items-stretch">
    <div class="container-fluid px-0">
      <div class="row gx-0">
        <!-- LEFT: full-bleed image with overlay -->
        <aside class="col-12 col-lg-6 left-image-panel d-none d-lg-block">
          <div class="left-image-wrapper">
            <img src="../assets/img/main2.jpg" alt="illustration" class="left-image" />
            <div class="left-overlay-text">
              <h1>
                Verify your email
                <p class="overlay-sub">Enter the email associated with your account and we'll send instructions.</p>
              </h1>
            </div>
          </div>
        </aside>

        <!-- RIGHT: white panel (themed) -->
        <section class="col-12 col-lg-6 right-panel d-flex align-items-center justify-content-center py-5">
          <div class="right-inner w-100 d-flex flex-column justify-content-center align-items-center">
            <!-- header -->
            <div class="mb-3 ">
              <h4 class="mb-0">Verify your email</h4>
              <small class="text-muted">Frontend-only demo — no API calls</small>
            </div>

            <!-- loading state -->
            <div v-if="view === 'loading'" class="text-center py-4">
              <div class="spinner-border text-secondary" role="status" aria-hidden="true"></div>
              <div class="mt-3 small text-muted">Verifying your email…</div>
            </div>

            <!-- success state -->
            <div v-else-if="view === 'success'" class="text-center">
              <div class="icon-circle success mb-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" stroke="#fff" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </div>
              <h5 class="mb-1">Email verified</h5>
              <p class="text-muted small mb-3">Thanks — your email has been verified. You can now sign in.</p>
              <div class="d-grid" style="width:220px;">
                <button class="btn btn-success" @click="goToSignin">Sign in</button>
              </div>
            </div>

            <!-- failure state -->
            <div v-else class="text-center" style="max-width:420px; width:100%;">
              <div class="icon-circle fail mb-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" stroke="#fff" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>

              <h5 class="mb-1">Verification failed</h5>
              <p class="text-muted small mb-3">{{ failMessage }}</p>

              <div v-if="mode === 'init'" class="d-grid gap-2 mb-3">
                <button class="btn btn-outline-primary" @click="mode = 'resend'">Resend verification email</button>
                <button class="btn btn-light" @click="goHome">Back to home</button>
              </div>

              <!-- resend form -->
              <div v-if="mode === 'resend'">
                <form @submit.prevent="onResend" novalidate :class="{ 'was-validated': tried }">
                  <div class="mb-3">
                    <label class="form-label small mb-1">Email</label>
                    <input v-model.trim="resendEmail" type="email" required class="form-control form-control-sm"
                      :class="{ 'is-invalid': resendError }" placeholder="you@example.com" />
                    <div class="invalid-feedback small">{{ resendError }}</div>
                  </div>

                  <div class="d-grid gap-2 mb-3">
                    <button class="btn btn-primary" :disabled="resendLoading">
                      <span v-if="resendLoading" class="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"></span>
                      Resend verification email
                    </button>
                    <button type="button" class="btn btn-light" @click="mode = 'init'">Cancel</button>
                  </div>

                  <div v-if="resendMessage" :class="['small', resendMessageClass]">{{ resendMessage }}</div>
                </form>
              </div>
            </div>

            <div class="mt-4 text-center small text-muted" v-if="showHint">
              Tip: preview states with <code>?status=success</code> or <code>?status=fail</code>, or use
              <code>?token=ok</code>
              to simulate success.
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
export default {
  name: "VerifyEmailThemeFrontendOnly",
  data() {
    return {
      view: "loading", // 'loading' | 'success' | 'fail'
      mode: "init", // 'init' | 'resend'
      failMessage: "Verification token is invalid or expired.",
      resendEmail: "",
      tried: false,
      resendLoading: false,
      resendMessage: "",
      resendMessageClass: "",
      resendError: "",
      showHint: true
    };
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const token = params.get("token");

    // 1) explicit preview control via ?status=
    if (status === "success" || status === "fail" || status === "loading") {
      this.view = status;
      if (status === "fail" && params.get("msg")) {
        this.failMessage = params.get("msg")!;
      }
      return;
    }

    // 2) token-based demo: if token == 'ok' -> success, else fail
    if (token) {
      this.view = "loading";
      // small delay to simulate network
      setTimeout(() => {
        if (token === "ok") {
          this.view = "success";
        } else {
          this.view = "fail";
          this.failMessage = "Verification failed — demo token invalid or expired.";
        }
      }, 700);
      return;
    }

    // 3) default behaviour: show loading briefly then fail so user can try resend
    this.view = "loading";
    setTimeout(() => {
      this.view = "fail";
      this.failMessage = "No verification token provided. You can resend a verification email.";
    }, 700);
  },
  methods: {
    onResend() {
      this.tried = true;
      this.resendMessage = "";
      this.resendError = "";

      if (!this.resendEmail) {
        this.resendError = "Email is required";
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(this.resendEmail)) {
        this.resendError = "Enter a valid email";
        return;
      }

      this.resendLoading = true;
      // simulate network/resend delay
      setTimeout(() => {
        this.resendLoading = false;
        this.resendMessage = "Verification email resent — check your inbox (demo).";
        this.resendMessageClass = "text-success";
        this.mode = "init";
      }, 900);
    },

    goToSignin() {
      if ((this as any).$router) (this as any).$router.push({ path: "/signin" });
      else window.location.href = "/signin";
    },

    goHome() {
      if ((this as any).$router) (this as any).$router.push({ path: "/" });
      else window.location.href = "/";
    }
  }
};
</script>

<style scoped>
/* theme-consistent styles */
.split-signup {
  background: #fff;
}

/* LEFT image */
.left-image-panel {
  position: relative;
  padding: 0;
  min-height: 100vh;
  overflow: hidden;
}

.left-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.left-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.left-overlay-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  text-align: center;
  pointer-events: none;
}

.left-overlay-text h1 {
  color: #fff;
  font-size: 2.1rem;
  font-weight: 700;
  text-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  margin: 0;
  padding: 0 18px;
}

.left-overlay-text .overlay-sub {
  margin-top: 8px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.95);
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

.right-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* icons */
.icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.icon-circle.success {
  background: rgba(47, 133, 90, 0.12);
  color: #2f855a;
}

.icon-circle.fail {
  background: rgba(229, 62, 62, 0.12);
  color: #e53e3e;
}

/* buttons */
.btn-primary {
  background: #2f855a;
  border: none;
}

.btn-outline-primary {
  border-color: rgba(11, 42, 102, 0.08);
}

/* small helpers */
.text-muted {
  color: #6b7280 !important;
}

.form-control {
  font-size: 0.95rem;
  padding: 0.42rem 0.6rem;
}

/* code hint */
code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.85em;
}

/* responsive */
@media (max-width: 991.98px) {
  .left-image-panel {
    display: none;
  }

  .right-inner {
    padding-left: 24px;
    padding-right: 24px;
    min-height: 60vh;
  }

  .left-overlay-text h1 {
    font-size: 1.5rem;
  }
}
</style>
