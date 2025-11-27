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

            <!-- RIGHT: sign-in form -->
            <section class="se-right d-flex align-items-center">
              <div class="w-100 se-right-inner">

                <!-- header: title on left, sign-up link on right (single row) -->
                <div class="d-flex justify-content-between align-items-start se-header-row">
                  <div>
                    <h4 class="se-title mb-1">Sign in to TestMyPlan</h4>
                    <small class="text-muted">Welcome back — please sign in to continue</small>
                  </div>

                  <a class="small text-muted tmp-signin-link align-self-start" href="#" @click.prevent="goToSignup">
                    Sign up →
                  </a>
                </div>

                <!-- sign-in form -->
                <form @submit.prevent="onLogin" class="se-signin-form" :class="{ 'was-validated': tried }" novalidate
                  autocomplete="on">
                  <div class="mb-3">
                    <label for="email" class="form-label small  fw-semibold mb-1">Email</label>
                    <input id="email" v-model.trim="email" required type="email" class="form-control form-control-sm"
                      :class="{ 'is-invalid': emailError }" placeholder="Enter your email" autocomplete="email" />
                    <div class="invalid-feedback small">{{ emailError }}</div>
                  </div>

                  <div class="mb-3">
                    <label for="password" class="form-label small  fw-semibold mb-1">Password</label>
                    <div class="input-group input-group-sm">
                      <input id="password" :type="show ? 'text' : 'password'" v-model="password" required
                        class="form-control form-control-sm" :class="{ 'is-invalid': passwordError }"
                        placeholder="Enter your password" autocomplete="current-password" />
                      <button type="button" class="btn btn-icon" @click="toggle" :aria-pressed="show"
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

                <!-- email sign-up link (desktop & mobile) -->
                <div class="text-center mt-3">
                  <router-link to="/signup-email" class="se-email-link">I don't have an account</router-link>
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
import { defineComponent } from "vue";
import type { Router } from "vue-router";

/** Minimal typed shape for router (avoids using `any`) */
interface RouterLike {
  push(location: { path: string; query?: Record<string, string> }): Promise<void> | void;
}

export default defineComponent({
  name: "SigninExact",
  data() {
    return {
      email: "" as string,
      password: "" as string,
      remember: false as boolean,
      show: false as boolean,
      tried: false as boolean,
      submitting: false as boolean,
      message: "" as string,
      messageClass: "" as string,
      emailError: "" as string,
      passwordError: "" as string,
    };
  },
  methods: {
    toggle(): void {
      this.show = !this.show;
    },

    validate(): boolean {
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
      } else if (this.password.length < 6) {
        // optional: encourage stronger passwords
        this.passwordError = "Password must be at least 6 characters";
        ok = false;
      }

      return ok;
    },

    async onLogin(): Promise<void> {
      this.tried = true;
      this.message = "";
      this.messageClass = "";

      if (!this.validate()) return;

      this.submitting = true;
      try {
        // simulate network call (demo)
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 700));

        // demo success
        this.message = "Signed in (demo)";
        this.messageClass = "text-success";

        // navigate to dashboard if router available
        const maybeRouter = (this as unknown as { $router?: RouterLike }).$router;
        if (maybeRouter && typeof maybeRouter.push === "function") {
          await maybeRouter.push({ path: "/dashboard" });
        } else {
          window.location.href = "/dashboard";
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.message = err.message || "Unable to sign in. Check credentials.";
        } else {
          this.message = "Unable to sign in. Check credentials.";
        }
        this.messageClass = "text-danger";
      } finally {
        this.submitting = false;
      }
    },

    // navigation helpers (typed)
    goToSignup(this: { $router?: Router }) {
      const router = this.$router;
      if (router) {
        router.push("/signup");
        return;
      }
      window.location.href = "/signup";
    },

    goToForgot(this: { $router?: Router }) {
      const router = this.$router;
      if (router) {
        router.push("/forgetpassword");
        return;
      }
      window.location.href = "/forgetpassword";
    },
  },
});
</script>

<style>
/* Page background */
.se-page {
  background: linear-gradient(180deg, #f6f9ff 0%, #eef5fb 100%);
  padding: 28px 12px;
  color: #06307a;
}

/* Card container spacing to match screenshot */
.se-card-col {
  padding: 36px 10px;
}

/* Card style — kept compact and centered */
.se-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(11, 42, 102, 0.06);
  box-shadow: 0 8px 30px rgba(18, 38, 84, 0.06);
  min-height: 520px;
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  align-items: stretch;
}

/* LEFT image panel */
.se-left {
  width: 54%;
  min-height: 520px;
  position: relative;
  padding: 0;
  overflow: hidden;
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
  margin-top: 56px;
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
  width: 46%;
  padding: 36px 48px;
  background: #fff;
  display: flex;
  align-items: center;
  /* center vertical */
  justify-content: center;
}

/* inner wrapper has constrained width so content centers and looks like the screenshot */
.se-right-inner {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* center form vertically inside right column */
}

/* header row increased gap so providers sit lower */
.se-header-row {
  margin-bottom: 20px;
  gap: 12px;
  align-items: flex-start;
}

/* sign-up link style */
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

/* form tweaks */
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

/* small invalid feedback */
.invalid-feedback.small {
  font-size: 0.82rem;
}

/* email link and terms */
.se-email-link {
  color: #6c6c6c;
  text-decoration: underline;
}

/* Responsive: hide left panel on md and below; reduce paddings so no big bottom gap */
@media (max-width: 991.98px) {
  .se-card {
    flex-direction: column;
    min-height: auto;
    max-width: 720px;
  }

  .se-left {
    display: none !important;
  }

  .se-right {
    width: 100%;
    padding: 28px 20px;
  }

  .se-card-col {
    padding: 20px 10px;
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

  .se-right-inner {
    max-width: 100%;
  }
}

/* Very large screens: cap width so card doesn't become extremely wide */
@media (min-width: 1600px) {
  .se-card {
    max-width: 1100px;
  }
}
</style>
