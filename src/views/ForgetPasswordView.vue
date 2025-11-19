<!-- ForgotPassword.vue -->
<template>
  <main class="split-signup min-vh-100 d-flex align-items-stretch">
    <div class="container-fluid px-0">
      <div class="row gx-0">
        <!-- LEFT: full-bleed image (desktop only) -->
        <aside class="col-12 col-lg-6 left-image-panel d-none d-lg-block">
          <div class="left-image-wrapper">
            <img src="../assets/img/main2.jpg" alt="illustration" class="left-image" />
            <div class="left-overlay-text">
              <h1>Reset your password <p class="overlay-sub">Enter your email and we'll send reset instructions.</p>
              </h1>

            </div>
          </div>
        </aside>

        <!-- RIGHT: forgot password form -->
        <section class="col-12 col-lg-6 right-panel d-flex align-items-center justify-content-center py-5">
          <div class="right-inner w-100" style="max-width:520px; min-height:60vh;">
            <div class="mb-3">
              <h4 class="mb-0">Forgot password</h4>
              <small class="text-muted">We will send a reset link to your email</small>
            </div>

            <form @submit.prevent="onReset" novalidate :class="{ 'was-validated': tried }">
              <div class="mb-3">
                <label class="form-label small mb-1">Email</label>
                <input v-model.trim="email" required type="email" class="form-control form-control-sm"
                  :class="{ 'is-invalid': emailError }" placeholder="you@example.com" />
                <div class="invalid-feedback small">{{ emailError }}</div>
              </div>

              <div class="text-center mb-3 d-flex justify-content-end small">
                <a href="#" @click.prevent="goToSignin">Back to sign in</a>
              </div>
              <div class="d-grid mb-3">
                <button type="submit" class="btn btn-primary btn-md" :disabled="sending">
                  <span v-if="sending" class="spinner-border spinner-border-sm me-2"></span>
                  Send reset instructions
                </button>
              </div>

              <div v-if="message" :class="['mt-2', messageClass, 'small']" role="alert">{{ message }}</div>


            </form>

            <div class="text-center small text-muted">
              Didn't receive the email? Check spam or try again in a few minutes.
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
/* If you use axios, uncomment the import and replace the commented call */
// import axios from 'axios'

export default {
  name: "ForgotPassword",
  data() {
    return {
      email: "",
      tried: false,
      sending: false,
      message: "",
      messageClass: "",
      emailError: ""
    };
  },
  methods: {
    validateEmail() {
      this.emailError = "";
      if (!this.email) {
        this.emailError = "Email is required";
        return false;
      }
      if (!/^\S+@\S+\.\S+$/.test(this.email)) {
        this.emailError = "Enter a valid email";
        return false;
      }
      return true;
    },
    async onReset() {
      this.tried = true;
      this.message = "";
      if (!this.validateEmail()) return;
      this.sending = true;
      try {
        // ---- Replace this with a real request to your API ----
        // Example using axios:
        // await axios.post('/api/auth/forgot-password', { email: this.email });
        await new Promise((r) => setTimeout(r, 900)); // demo
        // -----------------------------------------------------
        this.message =
          "If this email exists, we sent password reset instructions. Check your inbox.";
        this.messageClass = "text-success";
      } catch (err) {
        this.message = "Unable to send reset email. Please try again later.";
        this.messageClass = "text-danger";
      } finally {
        this.sending = false;
      }
    },
    goToSignin() {
      if (this.$router) {
        this.$router.push({ path: "/signin" });
        return;
      }
      window.location.href = "/signin";
    }
  }
};
</script>

<style scoped>
/* Reuse the same visual tokens as your login page */
.split-signup {
  background: #fff;
}

/* LEFT image panel (desktop only) */
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

/* RIGHT form panel */
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
  justify-content: flex-start;
}

/* compact form controls */
.form-control {
  font-size: 0.92rem;
  padding: 0.42rem 0.6rem;
}

/* primary button */
.btn-primary {
  background: #070707;
  border: none;
}

/* small helper color */
.text-muted {
  color: #6b7280 !important;
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
}
</style>
