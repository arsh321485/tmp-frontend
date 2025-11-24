<template>
  <main class="split-signup min-vh-100 d-flex align-items-stretch">
    <div class="container-fluid px-0">
      <div class="row gx-0 justify-content-center">

        <!-- CENTERED CARD -->
        <div class="col-12 col-xl-10">
          <div class="card-shell d-flex overflow-hidden rounded-4">

            <!-- LEFT: full-bleed image (Theme A) -->
            <aside class="col-12 col-lg-6 left-image-panel d-none d-lg-block">
              <div class="left-image-wrapper">
                <img src="../assets/img/main.jpg" alt="illustration" class="left-image" />
                <div class="left-gradient"></div>

                <div class="left-overlay-text">
                  <h1 class="overlay-title">Signup</h1>
                  <p class="overlay-sub">Join TestMyPlan — secure, private, and easy.</p>
                </div>
              </div>
            </aside>

            <!-- RIGHT: email signup form (Theme A panel) -->
            <section class="col-12 col-lg-6 right-panel d-flex align-items-center justify-content-center py-5">
              <!-- inner card area to control width & spacing -->
              <div class="right-card w-100" style="max-width: 520px; min-height:72vh;">
                <div class="mb-3">
                  <h4 class="title mb-0">Sign up with Email</h4>
                  <small class="text-muted">Complete the details below to create your account</small>
                </div>

                <form @submit.prevent="onSubmit" novalidate :class="{ 'was-validated': tried }">
                  <!-- Name -->
                  <div class="mb-3">
                    <label class="form-label small mb-1">Name</label>
                    <input v-model.trim="form.name"
                      :class="['form-control', 'form-control-sm', { 'is-invalid': nameError }]" type="text"
                      placeholder="Full name" required />
                    <div class="invalid-feedback small">{{ nameError }}</div>
                  </div>

                  <!-- Email -->
                  <div class="mb-3">
                    <label class="form-label small mb-1">Email address</label>
                    <input v-model.trim="form.email"
                      :class="['form-control', 'form-control-sm', { 'is-invalid': emailError }]" type="email"
                      placeholder="you@example.com" required />
                    <div class="invalid-feedback small">{{ emailError }}</div>
                  </div>

                  <!-- Password -->
                  <div class="mb-3">
                    <label class="form-label small mb-1">Password</label>
                    <div class="input-group input-group-sm">
                      <input v-model="form.password" :class="['form-control', { 'is-invalid': passwordError }]"
                        :type="showPassword ? 'text' : 'password'" placeholder="Enter a password (min 8 characters)"
                        required />
                      <button class="btn btn-outline-secondary btn-sm btn-icon" type="button"
                        @click="toggleShowPassword" :aria-pressed="showPassword"
                        :aria-label="showPassword ? 'Hide password' : 'Show password'"
                        title="Toggle password visibility">
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                    <div class="invalid-feedback small">{{ passwordError }}</div>
                    <div class="form-text small text-muted">Use at least 8 characters.</div>
                  </div>

                  <!-- Confirm Password -->
                  <div class="mb-3">
                    <label class="form-label small mb-1">Confirm Password</label>
                    <div class="input-group input-group-sm">
                      <input v-model="form.confirmPassword"
                        :class="['form-control', 'form-control-sm', { 'is-invalid': confirmError }]"
                        :type="showPassword ? 'text' : 'password'" placeholder="Re-enter password" required />
                      <button class="btn btn-outline-secondary btn-sm btn-icon" type="button"
                        @click="toggleShowPassword" :aria-pressed="showPassword"
                        :aria-label="showPassword ? 'Hide password' : 'Show password'"
                        title="Toggle password visibility">
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                    <div class="invalid-feedback small">{{ confirmError }}</div>
                  </div>

                  <!-- Submit -->
                  <div class="d-grid mb-3">
                    <button class="btn btn-dark btn-md" :disabled="submitting">
                      <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"
                        aria-hidden="true"></span>
                      <a href="/mattermost" class="text-white">Create account</a>
                    </button>
                  </div>

                  <div v-if="message" :class="['small', messageClass]" role="status">{{ message }}</div>

                  <div class="text-center mt-3 small">
                    <a href="#" @click.prevent="goToSignin">Already have an account? Sign in</a>
                  </div>
                </form>
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

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Minimal typed shape for router we use (avoid 'any') */
interface RouterLike {
  push(location: { path: string; query?: Record<string, string> }): Promise<void> | void;
}

export default defineComponent({
  name: "SignUpEmailFormThemeA",
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      } as SignupForm,
      tried: false as boolean,
      submitting: false as boolean,
      message: "" as string,
      messageClass: "" as string,
      nameError: "" as string,
      emailError: "" as string,
      passwordError: "" as string,
      confirmError: "" as string,
      showPassword: false as boolean
    };
  },
  methods: {
    toggleShowPassword(): void {
      this.showPassword = !this.showPassword;
    },

    validate(): boolean {
      this.nameError = "";
      this.emailError = "";
      this.passwordError = "";
      this.confirmError = "";
      let ok = true;

      if (!this.form.name || !this.form.name.trim()) {
        this.nameError = "Name is required";
        ok = false;
      }

      if (!this.form.email || !this.form.email.trim()) {
        this.emailError = "Email is required";
        ok = false;
      } else if (!/^\S+@\S+\.\S+$/.test(this.form.email)) {
        this.emailError = "Enter a valid email";
        ok = false;
      }

      if (!this.form.password) {
        this.passwordError = "Password is required";
        ok = false;
      } else if (this.form.password.length < 8) {
        this.passwordError = "Password must be at least 8 characters";
        ok = false;
      }

      if (!this.form.confirmPassword) {
        this.confirmError = "Please confirm your password";
        ok = false;
      } else if (this.form.password !== this.form.confirmPassword) {
        this.confirmError = "Passwords do not match";
        ok = false;
      }

      return ok;
    },

    async onSubmit(): Promise<void> {
      this.tried = true;
      this.message = "";
      this.messageClass = "";

      if (!this.validate()) return;

      this.submitting = true;
      try {
        // NO API integration here — we'll wire this up later.
        // A short delay simulates network so UI shows loading state.
        await new Promise((r) => setTimeout(r, 800));

        this.message = "Account created — check your email for verification.";
        this.messageClass = "text-success";

        const emailToSend = this.form.email.trim();

        // clear sensitive fields
        this.form.password = "";
        this.form.confirmPassword = "";
        this.tried = false;
        this.showPassword = false;

        // navigate to next step (email verification/instructions)
        // Use a typed router guard to avoid 'any' casts.
        const target = { path: "/emailauth", query: { email: emailToSend } };

        // Cast through unknown to safely assert the shape without 'any'
        const maybeRouter = (this as unknown as { $router?: RouterLike }).$router;
        if (maybeRouter && typeof maybeRouter.push === "function") {
          // Router push might return a Promise or void based on router implementation
          await maybeRouter.push(target);
        } else {
          // Fallback to window navigation when no router is present
          window.location.href = `/emailauth?email=${encodeURIComponent(emailToSend)}`;
        }
      } catch (err: unknown) {
        // Generic safe error handling (no axios)
        if (err instanceof Error) {
          this.message = err.message || "Unable to create account. Try again.";
        } else {
          this.message = "Unable to create account. Try again.";
        }
        this.messageClass = "text-danger";
      } finally {
        this.submitting = false;
      }
    },

    goToSignin(): void {
      const maybeRouter = (this as unknown as { $router?: RouterLike }).$router;
      if (maybeRouter && typeof maybeRouter.push === "function") {
        void maybeRouter.push({ path: "/login" });
      } else {
        window.location.href = "/login";
      }
    }
  }
});
</script>



<style scoped>
/* THEME A: card shell + left image + right panel styles */

/* container background retained outside card if desired */
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

/* left image area */
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
  display: block;
  filter: saturate(1.04) contrast(0.98);
}

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
}

/* right panel */
.right-panel {
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 40px;
  padding-right: 40px;
}

/* inner card where form lives */
.right-card {
  padding-top: 6px;
  padding-bottom: 18px;
}

/* page title color */
.title {
  color: #03318d;
  font-weight: 700;
}

/* small form tweaks */
.form-control {
  font-size: 0.93rem;
  padding: 0.44rem 0.6rem;
  border-radius: 8px;
  border: 1px solid #e6e9ec;
}

.input-group .form-control {
  border-right: 0;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.36rem 0.5rem;
  border-radius: 8px;
}

/* primary dark button */
.btn-dark {
  background: #03318d;
  border: none;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 14px;
}

/* small helper text color */
.text-muted {
  color: #6b7280 !important;
}

/* invalid feedback smaller */
.invalid-feedback.small {
  font-size: 0.82rem;
}

/* responsive: stack on small screens */
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
}
</style>
