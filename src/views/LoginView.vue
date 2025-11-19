<template>
  <main class="split-signup min-vh-100 d-flex align-items-stretch">
    <div class="container-fluid px-0">
      <div class="row gx-0 justify-content-center">

        <!-- Centered card shell -->
        <div class="col-12 col-xl-10">
          <div class="card-shell d-flex overflow-hidden rounded-4">

            <!-- LEFT: full-bleed image with centered H1 overlay -->
            <aside class="col-12 col-lg-6 left-image-panel d-none d-lg-block">
              <div class="left-image-wrapper" aria-hidden="false">
                <img src="../assets/img/main.jpg" alt="illustration" class="left-image" />
                <div class="left-gradient"></div>

                <!-- overlay text -->
                <div class="left-overlay-text">
                  <h1 class="overlay-title">Sign in to TestMyPlan</h1>
                  <p class="overlay-sub">Secure access for teams — pick up where you left off.</p>
                </div>
              </div>
            </aside>

            <!-- RIGHT: login form -->
            <section class="col-12 col-lg-6 right-panel d-flex align-items-center justify-content-center py-5">
              <div class="right-inner w-100 d-flex flex-column" style="max-width:520px; min-height:72vh;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4 class="mb-0">Sign in to TestMyPlan</h4>
                    <small class="text-muted">Welcome back — please sign in to continue</small>
                  </div>

                  <a class="small text-muted" href="#" @click.prevent="goToSignup">Sign up →</a>
                </div>

                <!-- Login form -->
                <form @submit.prevent="onLogin" novalidate :class="{ 'was-validated': tried }" autocomplete="on">
                  <div class="mb-3">
                    <label class="form-label small mb-1" for="email">Email</label>
                    <input id="email" v-model.trim="email" required type="email" class="form-control form-control-sm"
                      :class="{ 'is-invalid': emailError }" placeholder="Enter your email" autocomplete="email" />
                    <div class="invalid-feedback small">{{ emailError }}</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label small mb-1" for="password">Password</label>

                    <div class="input-group input-group-sm">
                      <input id="password" :type="show ? 'text' : 'password'" v-model="password" required
                        class="form-control form-control-sm" :class="{ 'is-invalid': passwordError }"
                        placeholder="Enter your password" autocomplete="current-password" />
                      <button type="button" class="btn btn-icon" @click="toggle" :aria-pressed="String(show)"
                        :aria-label="show ? 'Hide password' : 'Show password'" title="Toggle password visibility">
                        <i :class="show ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>

                    <div class="invalid-feedback small mt-1">{{ passwordError }}</div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center mb-3 small">
                    <div class="d-flex align-items-center">
                      <input id="remember" type="checkbox" class="form-check-input me-2" v-model="remember" />
                      <label for="remember" class="form-check-label">Remember me</label>
                    </div>
                    <a class="small" href="#" @click.prevent="goToForgot">Forgot password?</a>
                  </div>

                  <div class="d-grid mb-3">
                    <button type="submit" class="btn btn-dark btn-md" :disabled="submitting">
                      <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"
                        aria-hidden="true"></span>
                      Sign in
                    </button>
                  </div>

                  <p v-if="message" :class="['mt-2', messageClass, 'small']" role="alert">{{ message }}</p>
                </form>

                <!-- optional small footer -->
                <div class="mt-auto pt-3">
                  <p class="small text-muted mb-0">By signing in you accept our <a href="#"
                      class="text-decoration-underline">Terms</a>.</p>
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
      passwordError: "",
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
        // PUT your real auth call here (axios/fetch)
        // Example (uncomment + configure):
        // const res = await axios.post('/api/auth/login', { email: this.email, password: this.password, remember: this.remember });

        // demo delay
        await new Promise((r) => setTimeout(r, 700));

        // Success behaviour (adjust to your flow)
        this.message = "Signed in (demo)";
        this.messageClass = "text-success";

        // navigate to dashboard or next route
        if (this.$router) {
          this.$router.push({ path: "/dashboard" });
        } else {
          window.location.href = "/dashboard";
        }
      } catch (err: any) {
        // handle API error extraction
        this.message = err?.response?.data?.message || "Unable to sign in. Check credentials.";
        this.messageClass = "text-danger";
      } finally {
        this.submitting = false;
      }
    },

    onGoogle() {
      // hook Google/OAuth if required
      // e.g. window.location.href = '/auth/google'
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
    },
  },
};
</script>

<style scoped>
/* THEME A — consistent card shell + left image + right panel */

/* page background (keeps subtle) */
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

/* LEFT IMAGE PANEL */
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

/* subtle gradient so white text pops */
.left-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(1, 24, 39, 0.45) 0%, rgba(1, 24, 39, 0.12) 40%, rgba(1, 24, 39, 0.02) 100%);
}

/* overlay text */
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
  color: rgba(255, 255, 255, 0.92);
}

/* RIGHT PANEL */
.right-panel {
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 40px;
  padding-right: 40px;
}

/* form container */
.right-inner {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* typography */
h4 {
  font-weight: 700;
  color: #03318d;
}

/* small tweaks to inputs and buttons */
.form-control {
  font-size: 0.93rem;
  padding: 0.44rem 0.6rem;
  border-radius: 8px;
  border: 1px solid #e6e9ec;
}

.input-group .form-control {
  border-right: 0;
}

/* eye toggle button */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.36rem 0.5rem;
  border-radius: 8px;
  background: transparent;
  border: 1px solid #e6e9ec;
  color: #6b7280;
}

.btn-icon:focus {
  outline: none;
  box-shadow: none;
}

/* dark primary button */
.btn-dark {
  background: #03318d;
  border: none;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 14px;
}

/* helper / muted text */
.text-muted {
  color: #6b7280 !important;
}

/* invalid feedback smaller */
.invalid-feedback.small {
  font-size: 0.82rem;
}

/* footer small note */
.right-inner>.mt-auto {
  margin-top: 18px;
}

/* responsive */
@media (max-width: 991.98px) {
  .card-shell {
    flex-direction: column-reverse;
  }

  .left-image-panel {
    display: none;
  }

  .right-inner {
    padding-left: 20px;
    padding-right: 20px;
    min-height: 60vh;
  }
}
</style>
