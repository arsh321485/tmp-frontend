<template>
  <main class="split-onboard min-vh-100 d-flex align-items-stretch">
    <div class="container-fluid px-0">
      <div class="row gx-0">
        <!-- LEFT: themed image -->
        <aside class="col-12 col-lg-6 left-image-panel d-none d-lg-block">
          <div class="left-image-wrapper">
            <img src="../assets/img/main2.jpg" alt="illustration" class="left-image" />
            <div class="left-overlay-text">
              <h1>Onboarding</h1>
              <p class="overlay-sub">Join TestMyPlan — secure, private, and easy.</p>
            </div>
          </div>
        </aside>

        <!-- RIGHT: compact form -->
        <section class="col-12 col-lg-6 right-panel d-flex align-items-center justify-content-center py-5">
          <div class="right-card w-100" style="max-width:420px;">
            <h4 class="mb-1">Organization details</h4>
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

            <div class="domains-grid mb-3">
              <label v-for="option in domainOptions" :key="option.value" class="domain-card"
                :class="{ selected: isSelected(option.value) }" tabindex="0"
                @keydown.enter.prevent="toggle(option.value)" @keydown.space.prevent="toggle(option.value)"
                @click="toggle(option.value)">
                <input type="checkbox" class="visually-hidden" :value="option.value" :checked="isSelected(option.value)"
                  @change="toggle(option.value)" :aria-checked="isSelected(option.value) ? 'true' : 'false'" />

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

            <div class="d-grid mb-3">
              <button class="btn btn-dark btn-md" @click="onFinish" :disabled="submitting">
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                Finish
              </button>
            </div>

            <!-- <div class="text-center small">
              <a href="#" @click.prevent="onSignin">Already have an account? Sign in</a>
            </div> -->
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DomainsOnboarding",
  data() {
    return {
      submitting: false,
      local: {
        organization: "",
        location: ""
      },
      // Only four domain options as requested
      domainOptions: [
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
      ],
      selectedDomains: [] as string[]
    };
  },
  methods: {
    isSelected(val: string) {
      return this.selectedDomains.includes(val);
    },
    toggle(val: string) {
      if (val === "all") {
        const hasAll = this.isSelected("all");
        if (hasAll) {
          this.selectedDomains = [];
        } else {
          // select all (except keep 'all' first)
          this.selectedDomains = this.domainOptions.map((o: any) => o.value);
        }
      } else {
        const idx = this.selectedDomains.indexOf(val);
        if (idx === -1) this.selectedDomains.push(val);
        else this.selectedDomains.splice(idx, 1);

        // keep 'all' in sync
        const nonAll = this.domainOptions.filter((o: any) => o.value !== "all").map((o: any) => o.value);
        const allSelected = nonAll.every((v) => this.selectedDomains.includes(v));
        if (allSelected && !this.selectedDomains.includes("all")) this.selectedDomains.push("all");
        if (!allSelected && this.selectedDomains.includes("all")) {
          const i = this.selectedDomains.indexOf("all");
          if (i !== -1) this.selectedDomains.splice(i, 1);
        }
      }
      this.$emit("update:value", [...this.selectedDomains]);
    },
    onFinish() {
      this.submitting = true;
      setTimeout(() => {
        this.submitting = false;
        this.$emit("submit", {
          organization: this.local.organization,
          location: this.local.location,
          domains: [...this.selectedDomains]
        });
      }, 700);
    },
    onSignin() {
      if ((this as any).$router) (this as any).$router.push({ path: "/signin" });
      else window.location.href = "/signin";
    }
  }
});
</script>

<style scoped>
/* Split layout */
.split-onboard {
  background: #fff;
}

/* left image */
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
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 70px;
  pointer-events: none;
}

.left-overlay-text h1 {
  color: #fff;
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}

.left-overlay-text .overlay-sub {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  margin: 0;
}

/* right panel */
.right-panel {
  background: #fff;
  min-height: 100vh;
  padding-left: 48px;
  padding-right: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-card {
  padding: 18px 8px;
}

/* grid: 2 columns on most screens, responsive */
.domains-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 6px;
}

@media (max-width: 991.98px) {
  .domains-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 575.98px) {
  .domains-grid {
    grid-template-columns: 1fr;
  }
}

/* domain card */
.domain-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #eef2f7;
  background: linear-gradient(180deg, #fff, #fbfdff);
  cursor: pointer;
  position: relative;
  transition: all 150ms ease;
  overflow: visible;
  /* allow check to sit visually above */
}

.domain-card:focus {
  outline: none;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.06);
  transform: translateY(-2px);
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

/* body - IMPORTANT: add right padding so text doesn't underlap the check */
.domain-body {
  flex: 1;
  padding-right: 40px;
  /* reserve space for the check */
}

.domain-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #0b1220;
}

.domain-sub {
  margin-top: 2px;
  font-size: 0.78rem;
  color: #6b7280;
}

/* improved check box (single authoritative block) */
.domain-check {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* default (unselected) look */
  background: #ffffff;
  border: 1px solid #e6eef7;
  color: transparent;
  /* svg uses currentColor */
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
  transition: background-color 160ms ease, border-color 160ms ease, transform 160ms ease, color 160ms ease;
  transform-origin: center;
  z-index: 5;
  /* make sure it sits above card content */
}

/* svg inside check should respond to currentColor (stroke or fill) */
.domain-check svg {
  width: 12px;
  height: 12px;
  display: block;
}

/* unselected svg color is subtle (transparent) so it doesn't show */
.domain-card:not(.selected) .domain-check svg path,
.domain-card:not(.selected) .domain-check svg circle,
.domain-card:not(.selected) .domain-check svg rect {
  stroke: rgba(11, 20, 40, 0.12);
  fill: none;
}

/* selected state: solid green box + white check */
.domain-card.selected {
  border-color: rgba(47, 133, 90, 0.18);
  box-shadow: 0 10px 30px rgba(47, 133, 90, 0.06);
  transform: translateY(-6px);
  background: linear-gradient(180deg, #fbfff8, #f7fff5);
}

.domain-card.selected .domain-check {
  background: #2f855a;
  border-color: #2f855a;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(47, 133, 90, 0.08);
  transform: scale(1.04);
}

/* selected svg (use stroke or fill as desired) */
.domain-card.selected .domain-check svg path,
.domain-card.selected .domain-check svg circle,
.domain-card.selected .domain-check svg rect {
  stroke: currentColor;
  fill: currentColor;
}

/* controls */
.form-control-sm,
.form-select-sm {
  font-size: 0.92rem;
  padding: 0.42rem 0.6rem;
}

/* buttons */
.btn-dark {
  background: #111827;
  color: #fff;
  border: none;
  padding: 10px 16px;
  font-weight: 600;
}

.spinner-border {
  width: 1rem;
  height: 1rem;
}

/* small link */
.text-center a {
  color: #2563eb;
  text-decoration: underline;
}
</style>
