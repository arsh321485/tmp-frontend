<template>
  <main class="split-signup min-vh-100 d-flex align-items-center justify-content-center">
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
              <div class="right-card w-100">
                <div class="mb-3">
                  <h4 class="title mb-0">Sign up with Email</h4>
                  <small class="text-muted">Complete the details below to create your account</small>
                </div>

                <!-- ===== CTA Buttons: Slack / Teams / Asana ===== -->
                <div class="d-flex">
                  <button class="btn btn-outline-dark btn-sm me-2" type="button" @click="signup('slack')">
                    <span class="btn-text " style="font-size: smaller;">SignIn with Slack</span>
                  </button>
                  <button class="btn btn-outline-dark btn-sm me-2" type="button" @click="signup('teams')">
                    <span class="btn-text" style="font-size: smaller;">SignIn with Teams</span>
                  </button>
                  <button class="btn btn-outline-dark btn-sm" type="button" @click="signup('asana')">
                    <span class="btn-text" style="font-size: smaller;">SignIn with Asana</span>
                  </button>
                </div>
                <!-- ===== End CTA Buttons ===== -->

                <form @submit.prevent="onSubmit" novalidate :class="{ 'was-validated': tried }">

                  <!-- Email -->
                  <div class="mb-3">
                    <label class="form-label small fw-semibold  mb-1">Email address</label>
                    <input v-model.trim="form.email"
                      :class="['form-control', 'form-control-sm', { 'is-invalid': emailError }]" type="email"
                      placeholder="you@example.com" required />
                    <div class="invalid-feedback small">{{ emailError }}</div>
                  </div>

                  <!-- Password -->
                  <div class="mb-3">
                    <label class="form-label small fw-semibold  mb-1">Password</label>
                    <div class="input-group input-group-sm">
                      <input v-model="form.password"
                        :class="['form-control', 'form-control-sm', { 'is-invalid': passwordError }]"
                        :type="showPassword ? 'text' : 'password'" placeholder="Enter a password (min 8 characters)"
                        required />
                      <div class="invalid-feedback small">{{ passwordError }}</div>
                      <button class="btn btn-sm btn-icon input-addon" type="button" @click="toggleShowPassword"
                        :aria-pressed="showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'"
                        title="Toggle password visibility">
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                    <div class="invalid-feedback small">{{ passwordError }}</div>
                    <div class="form-text small text-muted">Use at least 8 characters.</div>
                  </div>

                  <!-- Submit -->
                  <div class="d-grid mb-3">
                    <button class="btn btn-dark btn-md" type="submit" :disabled="submitting">
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

      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface SignupForm {
  // you currently only use email and password in template — keep the other keys if you prefer but they won't block submit
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

/** Router-like shape used when calling router.push */
interface RouterLike {
  push(location: { path: string; query?: Record<string, string> } | string): Promise<void> | void;
}

/** $route minimal shape we read */
interface RouteLike {
  query?: Record<string, string | undefined>;
}

export default defineComponent({
  name: "SignUpEmailFormThemeA",
  data() {
    return {
      // only email & password are required here
      form: {
        email: "",
        password: ""
      } as SignupForm,
      tried: false as boolean,
      submitting: false as boolean,
      message: "" as string,
      messageClass: "" as string,
      emailError: "" as string,
      passwordError: "" as string,
      showPassword: false as boolean,
      // optional: if page was opened with provider query you'll still carry it
      selectedProvider: "" as string | null
    };
  },
  mounted() {
    // detect provider in URL (keep it so "Create account" can include provider)
    try {
      const route = (this as unknown as { $route?: RouteLike }).$route;
      const provider =
        (route?.query?.provider as string | undefined) ??
        (new URLSearchParams(window.location.search).get("provider") ?? undefined);

      if (provider && ["slack", "teams", "asana"].includes(provider)) {
        this.selectedProvider = provider;
      }
    } catch {
      // ignore
    }
  },
  methods: {
    toggleShowPassword(): void {
      this.showPassword = !this.showPassword;
    },

    /**
     * UPDATED validate(): only checks fields present in the template (email + password).
     * Previously you had name/confirmPassword checks which blocked the submit.
     */
    validate(): boolean {
      this.emailError = "";
      this.passwordError = "";
      let ok = true;

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

      return ok;
    },

    async onSubmit(): Promise<void> {
      this.tried = true;
      this.message = "";
      this.messageClass = "";

      if (!this.validate()) return;

      this.submitting = true;
      try {
        // navigate to /onboarding with ?email=... and include provider if present
        const emailToSend = this.form.email.trim();
        const query: Record<string, string> = {};
        if (emailToSend) query.email = emailToSend;
        if (this.selectedProvider) query.provider = this.selectedProvider;

        const maybeRouter = (this as unknown as { $router?: RouterLike }).$router;
        if (maybeRouter && typeof maybeRouter.push === "function") {
          await maybeRouter.push({ path: "/onboarding", query });
          return;
        }

        const url = new URL(window.location.origin + "/onboarding");
        Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
        window.location.href = url.toString();
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.message = err.message || "Unable to continue to onboarding. Try again.";
        } else {
          this.message = "Unable to continue to onboarding. Try again.";
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
        return;
      }
      window.location.href = "/login";
    },

    /**
     * signup(provider) — immediate navigation to onboarding?provider=...
     */
    signup(this: { $router?: RouterLike }, provider: string) {
      const router = (this as unknown as { $router?: RouterLike }).$router;
      const target = { path: "/onboarding", query: { provider } };

      if (router && typeof router.push === "function") {
        void router.push(target);
        return;
      }

      window.location.href = `/onboarding?provider=${encodeURIComponent(provider)}`;
    }
  }
});
</script>



<style scoped>
/* Match visual style & sizing from the providers page (unchanged UI) */

/* page background */
.split-signup {
  background: linear-gradient(180deg, #f6f9ff 0%, #eef5fb 100%);
  padding: 32px 12px;
  color: #06307a;
}

/* card shell styled like providers page */
.card-shell {
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.92));
  box-shadow: 0 8px 30px rgba(18, 38, 84, 0.06);
  border: 1px solid rgba(11, 42, 102, 0.06);
  min-height: 560px;
  max-width: 1000px;
  margin: auto;
}

/* LEFT image panel - same width as providers page */
.left-image-panel {
  width: 52%;
  min-height: 560px;
  position: relative;
  padding: 0;
}

.left-image-wrapper,
.left-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(1.05) contrast(0.98);
}

/* gradient overlay to improve readability of overlay text */
.left-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(1, 24, 39, 0.45) 0%, rgba(1, 24, 39, 0.12) 40%, rgba(1, 24, 39, 0.02) 100%);
  pointer-events: none;
}

/* overlay text centered */
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

/* RIGHT panel proportions and padding to match providers page */
.right-panel {
  width: 48%;
  padding: 40px 56px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* constrain the form area to be narrower like providers page */
.right-card {
  max-width: 420px;
  width: 100%;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 6px;
  padding-bottom: 18px;
}

/* CTA buttons style (kept visually same) */
.d-flex .btn {
  height: 36px;
  padding: 6px 10px;
}

/* form control appearance consistent with provider page */
.form-control {
  font-size: 0.93rem;
  padding: 0.44rem 0.6rem;
  border-radius: 8px;
  border: 1px solid #e6e9ec;
}

/* ensure input sits nicely next to the eye button */
.input-group .form-control {
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/* eye toggle button inside the input-group (visually part of control) */
.input-addon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border-left: 1px solid #e6e9ec;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  background: #fff;
  color: #6b7280;
  height: calc(1.5em + 1rem);
  line-height: 1;
}

.btn-dark {
  background: #03318d;
  border: none;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 14px;
}

.invalid-feedback.small {
  font-size: 0.82rem;
}

@media (max-width: 991.98px) {
  .card-shell {
    flex-direction: column;
    min-height: auto;
    margin: 28px auto;
    max-width: 92%;
  }

  .left-image-panel {
    display: none;
  }

  .right-panel {
    width: 100%;
    padding: 28px 20px;
  }

  .right-card {
    padding-left: 20px;
    padding-right: 20px;
    min-height: 60vh;
  }
}

@media (min-width: 1600px) {
  .card-shell {
    max-width: 1200px;
  }
}
</style>
