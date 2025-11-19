<template>
  <main class="split-signup min-vh-100 d-flex align-items-stretch">
    <div class="container-fluid px-0">
      <div class="row gx-0 justify-content-center">

        <!-- CENTERED CARD -->
        <div class="col-12 col-xl-10">
          <div class="card-shell d-flex overflow-hidden rounded-4">

            <!-- LEFT: full-bleed image (desktop only) -->
            <aside class="col-12 col-lg-6 left-image-panel d-none d-lg-block">
              <div class="left-image-wrapper">
                <img src="../assets/img/main2.jpg" alt="illustration" class="left-image" />
                <div class="left-gradient"></div>

                <div class="left-overlay-text">
                  <h1 class="overlay-title">Reset your password</h1>
                  <p class="overlay-sub">Enter your email and we'll send reset instructions.</p>
                </div>
              </div>
            </aside>

            <!-- RIGHT: forgot password form -->
            <section class="col-12 col-lg-6 right-panel d-flex align-items-center justify-content-center py-5">
              <div class="right-card w-100" style="max-width:520px; min-height:60vh;">
                <div class="mb-3">
                  <h4 class="mb-0 title">Forgot password</h4>
                  <small class="text-muted">We will send a reset link to your email</small>
                </div>

                <form @submit.prevent="onReset" novalidate :class="{ 'was-validated': tried }" autocomplete="email">
                  <div class="mb-3">
                    <label class="form-label small mb-1" for="forgot-email">Email</label>
                    <input id="forgot-email" v-model.trim="email" required type="email"
                      class="form-control form-control-sm" :class="{ 'is-invalid': emailError }"
                      placeholder="you@example.com" autocomplete="email" />
                    <div class="invalid-feedback small">{{ emailError }}</div>
                  </div>

                  <div class="d-flex justify-content-end mb-3 small">
                    <a href="#" @click.prevent="goToSignin">Back to sign in</a>
                  </div>

                  <div class="d-grid mb-3">
                    <button type="submit" class="btn btn-primary btn-md" :disabled="sending">
                      <span v-if="sending" class="spinner-border spinner-border-sm me-2" role="status"
                        aria-hidden="true"></span>
                      Send reset instructions
                    </button>
                  </div>

                  <div v-if="message" :class="['mt-2', messageClass, 'small']" role="alert">{{ message }}</div>
                </form>

                <div class="text-center small text-muted mt-3">
                  Didn't receive the email? Check spam or try again in a few minutes.
                </div>
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
  name: "ForgotPasswordThemeA",
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
        // Replace with your real API call if needed:
        // await axios.post('/api/auth/forgot-password', { email: this.email });
        await new Promise((r) => setTimeout(r, 900)); // demo delay

        this.message = "If this email exists, we sent password reset instructions. Check your inbox.";
        this.messageClass = "text-success";
      } catch (err: any) {
        this.message = "Unable to send reset email. Please try again later.";
        this.messageClass = "text-danger";
      } finally {
        this.sending = false;
      }
    },

    goToSignin() {
      if ((this as any).$router) {
        (this as any).$router.push({ path: "/signin" });
        return;
      }
      window.location.href = "/signin";
    }
  }
};
</script>

<style scoped>
/* THEME A: centered card shell + left image + right panel */

/* page background */
.split-signup {
  background: linear-gradient(180deg, #f6f9ff 0%, #eef5fb 100%);
  padding: 32px 12px;
}

/* centered card shell */
.card-shell {
  display: flex;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.92));
  box-shadow: 0 12px 40px rgba(18, 38, 84, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(11, 42, 102, 0.06);
}

/* LEFT image panel */
.left-image-panel {
  position: relative;
  padding: 0;
  min-height: 520px;
  overflow: hidden;
}

.left-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.left-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(1.04) contrast(0.98);
}

/* gradient to make white text pop */
.left-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(1, 24, 39, 0.45) 0%, rgba(1, 24, 39, 0.12) 40%, rgba(1, 24, 39, 0.02) 100%);
  pointer-events: none;
}

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
  font-size: 0.95rem;
}

/* RIGHT panel */
.right-panel {
  background: #fff;
  min-height: 520px;
  padding-left: 48px;
  padding-right: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-card {
  padding: 22px 12px;
  background: transparent;
}

.title {
  color: #03318d;
  font-weight: 700;
}

/* inputs */
.form-control {
  font-size: 0.93rem;
  padding: 0.44rem 0.6rem;
  border-radius: 8px;
  border: 1px solid #e6e9ec;
}

/* primary button using brand blue */
.btn-primary {
  background: #03318d;
  border: none;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 14px;
  color: #fff;
}

/* spinner */
.spinner-border {
  width: 1rem;
  height: 1rem;
}

/* helper text */
.text-muted {
  color: #6b7280 !important;
}

/* message styles rely on messageClass (text-success / text-danger) */

/* responsive */
@media (max-width: 991.98px) {
  .card-shell {
    flex-direction: column-reverse;
  }

  .left-image-panel {
    display: none;
  }

  .right-card {
    padding-left: 20px;
    padding-right: 20px;
    min-height: 60vh;
  }

  .right-panel {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
