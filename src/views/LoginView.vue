<!-- SplitLogin_LeftImage.vue -->
<template>
  <main class="split-signup min-vh-100 d-flex align-items-stretch">
    <div class="container-fluid px-0">
      <div class="row gx-0">
        <!-- LEFT: full-bleed image with centered H1 overlay -->
        <aside class="col-12 col-lg-6 left-image-panel">
          <div class="left-image-wrapper" aria-hidden="false">
            <img src="../assets/img/main2.jpg" alt="illustration" class="left-image" />
            <!-- centered text over the image -->
            <div class="left-overlay-text">
              <h1>SignIn to TestMyPlan
                <p class="overlay-sub">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </h1>

            </div>
          </div>
        </aside>

        <!-- RIGHT: login form (replaces signup buttons) -->
        <section class="col-12 col-lg-6 right-panel d-flex align-items-center justify-content-center py-5">
          <div class="right-inner w-100 d-flex flex-column" style="max-width:520px; min-height:72vh;">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 class="mb-0">SigIn in to TestMyPlan</h4>
                <small class="text-muted">Welcome back — please sign in to continue</small>
              </div>

              <a class="small text-muted" href="#" @click.prevent="goToSignup">Sign up →</a>
            </div>

            <!-- Login form -->
            <form @submit.prevent="onLogin" novalidate :class="{ 'was-validated': tried }">
              <div class="mb-3">
                <label class="form-label small mb-1">Email</label>
                <input v-model.trim="email" required type="email" class="form-control form-control-sm"
                  :class="{ 'is-invalid': emailError }" placeholder="Enter your email" />
                <div class="invalid-feedback small">{{ emailError }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label small mb-1">Password</label>
                <div class="input-group input-group-sm">
                  <input :type="show ? 'text' : 'password'" v-model="password" required
                    class="form-control form-control-sm" :class="{ 'is-invalid': passwordError }"
                    placeholder="Enter your password" />
                  <button type="button" class="btn btn-icon" @click="toggle" :aria-pressed="show"
                    :aria-label="show ? 'Hide password' : 'Show password'">
                    <i :class="show ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                  <div class="invalid-feedback small">{{ passwordError }}</div>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-3 small">
                <div class="d-flex align-items-center">
                  <input id="remember" type="checkbox" class="form-check-input me-1" v-model="remember" />
                  <label for="remember" class="form-check-label">Remember me</label>
                </div>
                <a class="small" href="#" @click.prevent="goToForgot">Forgot password?</a>
              </div>

              <div class="d-grid mb-3">
                <button type="submit" class="btn btn-dark btn-md" :disabled="submitting">
                  <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                  Sign in
                </button>
              </div>



              <p v-if="message" :class="['mt-2', messageClass, 'small']" role="alert">{{ message }}</p>
            </form>


          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
export default {
  name: "SplitLogin_LeftImage",
  data() {
    return {
      email: "",
      password: "",
      remember: false,
      show: false,
      tried: false,
      submitting: false,
      message: "",
      messageClass: "",
      emailError: "",
      passwordError: ""
    };
  },
  methods: {
    toggle() {
      this.show = !this.show;
    },
    validate() {
      this.emailError = "";
      this.passwordError = "";
      let ok = true;
      if (!this.email) {
        this.emailError = "Email is required";
        ok = false;
      } else if (!/^\S+@\S+\.\S+$/.test(this.email)) {
        this.emailError = "Enter a valid email";
        ok = false;
      }
      if (!this.password) {
        this.passwordError = "Password is required";
        ok = false;
      }
      return ok;
    },
    async onLogin() {
      this.tried = true;
      this.message = "";
      if (!this.validate()) return;
      this.submitting = true;
      try {
        // replace this demo delay with your real auth call
        await new Promise((r) => setTimeout(r, 800));
        this.message = "Signed in (demo)";
        this.messageClass = "text-success";
        // handle success (navigate, store token, etc.)
        console.log("LOGIN", { email: this.email, remember: this.remember });
      } catch (e) {
        this.message = "Something went wrong";
        this.messageClass = "text-danger";
      } finally {
        this.submitting = false;
      }
    },
    onGoogle() {
      // wire to your Google OAuth
      alert("Google sign-in (demo)");
    },
    goToForgot() {
      if (this.$router) {
        this.$router.push({ path: "/forgetpassword" });
        return;
      }
      window.location.href = "/forgetpassword";
    },
    goToSignup() {
      if (this.$router) {
        this.$router.push({ path: "/signup" });
        return;
      }
      window.location.href = "/signup";
    }
  }
};
</script>

<style scoped>
/* keep styling consistent with your theme */

/* reset container gaps */
.split-signup {
  background: #fff;
}

/* LEFT: full-bleed image panel */
.left-image-panel {
  position: relative;
  padding: 0;
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
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 0;
}

/* overlay centered text */
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
  color: #ffffff;
  font-size: 2.25rem;
  font-weight: 700;
  text-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  margin: 0;
  padding: 0 18px;
  line-height: 1.05;
}

.left-overlay-text .overlay-sub {
  margin-top: 10px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
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

/* form inputs scaled down slightly */
.form-control {
  font-size: 0.92rem;
  padding: 0.42rem 0.6rem;
}

/* btn-icon for eye toggle */
.btn-icon {
  border: 0;
  background: transparent;
  padding: 0.35rem 0.45rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 1rem;
}

.input-group .btn-icon {
  min-width: 40px;
}

.btn-icon:focus {
  outline: none;
  box-shadow: none;
}

/* provider button look small */
.btn-outline-secondary {
  background: #fff;
  border: 1px solid #e6e9ec;
  color: #111;
}

/* primary signin button */
.btn-success {
  background: #2f855a;
  border: none;
}

/* small helper text style */
.text-muted {
  color: #6b7280 !important;
}

/* compact pills (visual only) */
.compact-pills {
  gap: 18px;
  padding: 8px 0 8px;
}

.compact-pill {
  width: 48px;
  height: 8px;
  border-radius: 10px;
  background: #ececec;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.03);
}

.compact-pill.active {
  width: 40px;
  background: #080808;
  transform: translateY(-3px);
}

/* responsive */
@media (max-width: 991.98px) {
  .left-image-panel {
    min-height: 40vh;
  }

  .left-overlay-text h1 {
    font-size: 1.5rem;
  }

  .right-inner {
    min-height: 50vh;
    padding-left: 24px;
    padding-right: 24px;
  }
}
</style>
