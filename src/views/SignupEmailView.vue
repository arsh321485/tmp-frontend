<template>
  <main class="split-signup min-vh-100 d-flex align-items-stretch">
    <div class="container-fluid px-0">
      <div class="row gx-0">
        <!-- LEFT: full-bleed image (keeps theme) -->
        <aside class="col-12 col-lg-6 left-image-panel d-none d-lg-block">
          <div class="left-image-wrapper">
            <img src="../assets/img/main2.jpg" alt="illustration" class="left-image" />
            <div class="left-overlay-text">
              <h1>Create your account <p class="overlay-sub">Join TestMyPlan — secure, private, and easy.</p>
              </h1>
            </div>
          </div>
        </aside>

        <!-- RIGHT: email signup form -->
        <section class="col-12 col-lg-6 right-panel d-flex align-items-center justify-content-center py-5">
          <div class="right-inner w-100" style="max-width:520px; min-height:72vh;">
            <div class="mb-3">
              <h4 class="mb-0">Sign up with Email</h4>
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
                  <button class="btn btn-outline-secondary btn-sm btn-icon" type="button" @click="toggleShowPassword"
                    :aria-pressed="String(showPassword)" :aria-label="showPassword ? 'Hide password' : 'Show password'"
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
                  <!-- same eye icon here so either button toggles both fields -->
                  <button class="btn btn-outline-secondary btn-sm btn-icon" type="button" @click="toggleShowPassword"
                    :aria-pressed="String(showPassword)" :aria-label="showPassword ? 'Hide password' : 'Show password'"
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
                  Create account
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
  </main>
</template>

<script lang="ts">
// import axios from "axios"; // uncomment and configure your endpoint as needed

export default {
  name: "SignUpEmailForm",
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      tried: false,
      submitting: false,
      message: "",
      messageClass: "",
      nameError: "",
      emailError: "",
      passwordError: "",
      confirmError: "",
      showPassword: false
    };
  },
  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },

    validate() {
      // reset errors
      this.nameError = "";
      this.emailError = "";
      this.passwordError = "";
      this.confirmError = "";
      let ok = true;

      if (!this.form.name) {
        this.nameError = "Name is required";
        ok = false;
      }

      if (!this.form.email) {
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

    /**
     * onSubmit: validates, optionally calls your API, then navigates to /emailauth
     * passing the email as a query param so the next screen can use it.
     */
    async onSubmit() {
      this.tried = true;
      this.message = "";
      if (!this.validate()) return;

      this.submitting = true;
      try {
        const payload = {
          name: this.form.name,
          email: this.form.email,
          password: this.form.password
        };

        // ======= Your real signup call goes here =======
        // Example using axios:
        // const res = await axios.post('/api/auth/signup/email', payload);
        // if the server returns error, throw or handle it accordingly
        // ===============================================

        // demo delay to simulate network - remove for production
        await new Promise((r) => setTimeout(r, 800));

        // show message (optional)
        this.message = "Account created — check your email for verification.";
        this.messageClass = "text-success";

        // clear sensitive fields but keep email for navigation
        this.form.password = "";
        this.form.confirmPassword = "";
        this.tried = false;
        this.showPassword = false;

        // navigate to /emailauth with email in query so next page can prefill / show instructions
        const target = { path: "/emailauth", query: { email: this.form.email } };

        if ((this as any).$router) {
          (this as any).$router.push(target);
        } else {
          const url = `/emailauth?email=${encodeURIComponent(this.form.email)}`;
          window.location.href = url;
        }
      } catch (err: any) {
        // you can customize error extraction from your API response
        this.message = err?.response?.data?.message || "Unable to create account. Try again.";
        this.messageClass = "text-danger";
      } finally {
        this.submitting = false;
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
/* Add this in your index.html head if not already included:
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
*/

/* Reuse auth theme tokens from earlier pages */
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

/* smaller inputs */
.form-control {
  font-size: 0.92rem;
  padding: 0.42rem 0.6rem;
}

.form-select {
  font-size: 0.92rem;
  padding: 0.3rem 0.5rem;
}

/* primary button */
.btn-success {
  background: #2f855a;
  border: none;
}

/* helper text */
.text-muted {
  color: #6b7280 !important;
}

/* icon button to match small input group */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.5rem;
  min-width: 40px;
  line-height: 1;
}

/* slightly larger icon */
.btn-icon i {
  font-size: 1.05rem;
  vertical-align: middle;
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
