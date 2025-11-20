<template>
  <main class="split-onboard min-vh-100 d-flex align-items-stretch">
    <div class="container-fluid px-0">
      <div class="row gx-0 justify-content-center">

        <!-- CENTERED CARD -->
        <div class="col-12 col-xl-10">
          <div class="card-shell d-flex overflow-hidden rounded-4">

            <!-- LEFT: themed image -->
            <aside class="col-12 col-lg-6 left-image-panel d-none d-lg-block">
              <div class="left-image-wrapper">
                <img src="../assets/img/main.jpg" alt="illustration" class="left-image" />
                <div class="left-gradient"></div>

                <div class="left-overlay-text">
                  <h1 class="overlay-title ">Onboarding</h1>
                  <p class="overlay-sub">Join TestMyPlan — secure, private, and easy.</p>
                </div>
              </div>
            </aside>

            <!-- RIGHT: compact form -->
            <section class="col-12 col-lg-6 right-panel d-flex align-items-center justify-content-center py-5">
              <div class="right-card w-100" style="max-width:520px;">
                <h4 class="mb-1 title">Organization details</h4>
                <p class="small text-muted mb-3">Provide a few details to get started</p>

                <div class="mb-3">
                  <label class="form-label small mb-1">Organization Name</label>
                  <input v-model.trim="local.organization" type="text" class="form-control form-control-sm"
                    placeholder="Organization (optional)" />
                </div>

                <div class="mb-3">
                  <label class="form-label small mb-1">Location</label>
                  <select v-model="local.location" class="form-select form-select-sm">
                    <option value="" disabled>Select location</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>India</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>Other</option>
                  </select>
                </div>

                <div class="mb-2 d-flex justify-content-between align-items-center">
                  <label class="form-label small mb-0">Domains</label>
                  <small class="text-muted">Choose one or more</small>
                </div>

                <div class="domains-grid mb-4">
                  <label v-for="option in domainOptions" :key="option.value" class="domain-card"
                    :class="{ selected: isSelected(option.value) }" tabindex="0"
                    @keydown.enter.prevent="toggle(option.value)" @keydown.space.prevent="toggle(option.value)"
                    @click="toggle(option.value)">
                    <input type="checkbox" class="visually-hidden" :value="option.value"
                      :checked="isSelected(option.value)" @change="toggle(option.value)"
                      :aria-checked="isSelected(option.value) ? 'true' : 'false'" />

                    <div class="domain-icon" v-html="option.iconHtml"></div>

                    <div class="domain-body ">
                      <div class="domain-title">{{ option.label }}</div>
                      <div class="domain-sub small text-muted">{{ option.desc }}</div>
                    </div>

                    <div class="domain-check" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" />
                      </svg>
                    </div>
                  </label>
                </div>

                <div class="d-grid mb-0">
                  <button class="btn btn-primary btn-md" @click="onFinish" :disabled="submitting">
                    <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Finish
                  </button>
                </div>

                <div class="mt-3 small text-muted">
                  By continuing you agree to our <a href="#" class="text-decoration-underline">Terms</a>.
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

interface DomainOption {
  value: string;
  label: string;
  desc: string;
  iconHtml: string;
}

interface LocalState {
  organization: string;
  location: string;
}

export default defineComponent({
  name: "DomainsOnboardingThemeA",
  data() {
    const domainOptions: DomainOption[] = [
      {
        value: "cybersecurity",
        label: "Cybersecurity",
        desc: "Good for B2B businesses",
        iconHtml: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg"><path d="M12 2l7 3v4c0 5-3.6 9.7-7 11-3.4-1.3-7-6-7-11V5l7-3z" fill="#eef6ff"/>
          <path d="M12 8v5l3 2" stroke="#2f855a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
      },
      {
        value: "data-privacy",
        label: "Data Privacy",
        desc: "Good for B2B businesses",
        iconHtml: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="3" fill="#fff7ed"/>
          <path d="M7 12h10M7 8h10M7 16h6" stroke="#d97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
      },
      {
        value: "business-continuity",
        label: "Business Continuity",
        desc: "Good for B2B businesses",
        iconHtml: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="#ecfdf5"/>
          <path d="M12 8v5l3 2" stroke="#059669" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
      },
      {
        value: "all",
        label: "All",
        desc: "Select all domains",
        iconHtml: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#ebf8ff"/>
          <path d="M8 12h8M8 8h8M8 16h5" stroke="#0369a1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
      }
    ];

    return {
      submitting: false as boolean,
      local: {
        organization: "",
        location: ""
      } as LocalState,
      domainOptions,
      selectedDomains: [] as string[]
    };
  },
  methods: {
    isSelected(val: string): boolean {
      return this.selectedDomains.includes(val);
    },

    toggle(val: string): void {
      if (val === "all") {
        const hasAll = this.isSelected("all");
        if (hasAll) {
          this.selectedDomains = [];
        } else {
          // copy all values from domainOptions
          this.selectedDomains = this.domainOptions.map((o: DomainOption) => o.value);
        }
      } else {
        const idx = this.selectedDomains.indexOf(val);
        if (idx === -1) {
          this.selectedDomains.push(val);
        } else {
          this.selectedDomains.splice(idx, 1);
        }

        // maintain 'all' selection consistency
        const nonAll = this.domainOptions
          .filter((o: DomainOption) => o.value !== "all")
          .map((o: DomainOption) => o.value);

        const allSelected = nonAll.every((v: string) => this.selectedDomains.includes(v));

        if (allSelected && !this.selectedDomains.includes("all")) {
          this.selectedDomains.push("all");
        }

        if (!allSelected && this.selectedDomains.includes("all")) {
          const i = this.selectedDomains.indexOf("all");
          if (i !== -1) this.selectedDomains.splice(i, 1);
        }
      }

      // emit typed payload (Vue's emit is untyped in Options API; keep payload concrete)
      this.$emit("update:value", [...this.selectedDomains]);
    },

    onFinish(): void {
      if (!this.local.location) {
        // small UX fallback — prefer non-blocking UI in components
        window.alert("Please select a location.");
        return;
      }

      this.submitting = true;
      setTimeout(() => {
        this.submitting = false;
        this.$emit("submit", {
          organization: this.local.organization,
          location: this.local.location,
          domains: [...this.selectedDomains]
        });
      }, 700);
    }
  }
});
</script>

<style scoped>
/* THEME A: centered card shell + left image + right panel */
/* page background */
.split-onboard {
  background: linear-gradient(180deg, #f6f9ff 0%, #eef5fb 100%);
  padding: 32px 12px;
}

/* centered card */
.card-shell {
  display: flex;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.92));
  box-shadow: 0 12px 40px rgba(18, 38, 84, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(11, 42, 102, 0.06);
}

/* LEFT image */
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

/* overlay gradient to make white text pop */
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
  flex-direction: column;
  justify-content: center;
  align-items: flex-center;
  padding-left: 64px;
  pointer-events: none;
  z-index: 3;
}

.left-overlay-text h1 {
  color: #fff;
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}

.left-overlay-text .overlay-sub {
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.95rem;
  margin: 0;
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

/* right card inner spacing */
.right-card {
  padding: 22px 12px;
  background: transparent;
}

/* title color using brand blue */
.title {
  color: #03318d;
  font-weight: 700;
}

/* spacing for forms */
.mb-3 {
  margin-bottom: 16px;
}

/* domains grid spacing */
.domains-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 12px;
}

/* domain card styles (theme A) */
.domain-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #eef2f7;
  background: linear-gradient(180deg, #fff, #fbfdff);
  cursor: pointer;
  position: relative;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}

.domain-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.04);
}

.domain-card:focus {
  outline: none;
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.06);
  transform: translateY(-3px);
}

/* icon */
.domain-icon {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.02);
  flex-shrink: 0;
}

.domain-icon svg {
  width: 36px;
  height: 36px;
}

/* domain body reserves space for check */
.domain-body {
  flex: 1;
  padding-right: 52px;
}

/* title/sub */
.domain-title {
  font-weight: 600;
  font-size: 0.98rem;
  color: #0b1220;
}

.domain-sub {
  margin-top: 4px;
  font-size: 0.80rem;
  color: #6b7280;
}

/* check container centered vertically */
.domain-check {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #e6eef7;
  color: transparent;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
  transition: background-color 160ms ease, border-color 160ms ease, transform 160ms ease, color 160ms ease;
  z-index: 5;
}

.domain-card:not(.selected) .domain-check svg path {
  stroke: rgba(11, 20, 40, 0.12);
  fill: none;
}

/* selected state uses brand blue (#03318d) */
.domain-card.selected {
  border-color: rgba(3, 49, 141, 0.12);
  box-shadow: 0 12px 32px rgba(3, 49, 141, 0.06);
  transform: translateY(-6px);
  background: linear-gradient(180deg, #f6f9ff, #eef6ff);
}

.domain-card.selected .domain-check {
  background: #03318d;
  border-color: #03318d;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(3, 49, 141, 0.08);
  transform: translateY(-50%) scale(1.04);
}

.domain-card.selected .domain-check svg path,
.domain-card.selected .domain-check svg circle,
.domain-card.selected .domain-check svg rect {
  stroke: currentColor;
  fill: currentColor;
}

/* form inputs */
.form-control-sm,
.form-select-sm {
  font-size: 0.92rem;
  padding: 0.42rem 0.6rem;
  border-radius: 8px;
}

/* finish button uses brand blue */
.btn-primary {
  background: #03318d;
  border: none;
  padding: 10px 16px;
  font-weight: 600;
  border-radius: 8px;
  color: #fff;
}

/* spinner */
.spinner-border {
  width: 1rem;
  height: 1rem;
}

/* responsive adjustments */
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
