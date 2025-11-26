<template>
  <main class="se-page min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container-fluid px-0">
      <div class="row gx-0 justify-content-center w-100">
        <div class="col-12 col-sm-11 col-md-10 col-lg-10 col-xl-10 col-xxl-9 mx-auto">
          <!-- card; will "split" when showMattermost is true -->
          <div
            :class="['se-card', 'd-flex', 'overflow-hidden', 'rounded-3', 'shadow-sm', 'mx-auto', { split: showMattermost }]">

            <!-- LEFT: form panel (centered or left depending on showMattermost) -->
            <aside :class="['on-se-left', showMattermost ? 'on-left-split' : 'on-left-full']">
              <div class="left-inner">

                <!-- top row: logo and TMP in left corner -->
                <div class="d-flex align-items-center se-labels gap-2 mb-3">
                  <div class="logo-placeholder " aria-hidden="true"></div>
                  <div class="brand-mark">TMP</div>
                  <div class="brand-text">
                    <h1>TestMyPlan</h1>
                  </div>
                </div>

                <!-- welcome centered -->
                <div class="text-center se-labels mb-4">
                  <h2 class="se-main">Welcome to Test My Plan</h2>
                  <p class="se-sub">Get started with your incident preparedness...</p>
                </div>

                <!-- Add organization heading -->
                <div class="text-center mb-3">
                  <h5 class="org-heading" style="color: #03318d;">Add Organization Details</h5>
                </div>

                <!-- organization inputs (two side-by-side) -->
                <div class="row gx-3 mb-3">
                  <div class="col-12 col-md-6 mb-2">
                    <label class="form-label small mb-1">Organization</label>
                    <input v-model.trim="local.organization" type="text" class="form-control form-control-sm"
                      placeholder="Organization name" />
                  </div>
                  <div class="col-12 col-md-6 mb-2">
                    <label class="form-label small mb-1">Industry</label>
                    <select v-model="local.industry" class="form-select form-select-sm">
                      <option value="" disabled>Select industry</option>
                      <option value="a">a</option>
                      <option value="b">b</option>
                      <option value="c">c</option>
                    </select>
                  </div>
                </div>

                <!-- country -->
                <div class="row gx-3 mb-4">
                  <div class="col-12 col-md-6">
                    <label class="form-label small mb-1">Country</label>
                    <select v-model="local.location" class="form-select form-select-sm">
                      <option value="" disabled>Select country</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>India</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <!-- domains grid -->
                <div class="domains-section mb-4">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="form-label h5 text-center mb-0" style="color: #03318d;">Domains <small
                        class="text-muted ms-4">Choose one or more</small></label>
                  </div>

                  <div class="domains-grid">
                    <label v-for="opt in domainOptions" :key="opt.value" class="domain-card"
                      :class="{ selected: isSelected(opt.value) }" @click="toggleDomain(opt.value)" tabindex="0"
                      @keydown.enter.prevent="toggleDomain(opt.value)" role="checkbox"
                      :aria-checked="isSelected(opt.value)">
                      <!-- domain icon + body -->
                      <div class="domain-icon" v-html="opt.iconHtml"></div>
                      <div class="domain-body">
                        <div class="domain-title" style="color: #03318d;">{{ opt.label }}</div>
                        <div class="domain-sub small text-muted">{{ opt.desc }}</div>
                      </div>

                      <!-- CHECK BADGE: appears when selected -->
                      <span class="domain-check" v-if="isSelected(opt.value)" aria-hidden="false" title="Selected">
                        <!-- compact check SVG -->
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true">
                          <circle cx="12" cy="12" r="12" fill="#10B981" />
                          <path d="M7.5 12.5l2.5 2.5L16.5 9" stroke="white" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                        </svg>
                      </span>
                    </label>
                  </div>
                </div>

                <!-- finish button aligned right corner -->
                <div class="d-flex justify-content-end">
                  <button class="btn finish-btn" @click="onFinish" :disabled="submitting" :aria-busy="submitting">
                    <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"
                      aria-hidden="true"></span>
                    Finish
                  </button>
                </div>
              </div>
            </aside>
          </div> <!-- se-card -->
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";

type DomainOption = {
  value: string;
  label: string;
  desc: string;
  iconHtml: string;
};

export default defineComponent({
  name: "OnboardingPage",
  setup() {
    const router = useRouter();

    const domainOptions = ref<DomainOption[]>([
      {
        value: "cybersecurity",
        label: "Cybersecurity",
        desc: "Good for B2B businesses",
        iconHtml:
          '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#eef6ff"/><path d="M12 7v6l3 2" stroke="#0b6623" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      },
      {
        value: "data-privacy",
        label: "Data Privacy",
        desc: "Good for privacy teams",
        iconHtml:
          '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#fff7ed"/><path d="M7 12h10M7 8h10M7 16h6" stroke="#d97706" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      },
      {
        value: "business-continuity",
        label: "Business Continuity",
        desc: "Planning & resilience",
        iconHtml:
          '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#ecfdf5"/><path d="M12 8v5l3 2" stroke="#059669" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      },
      {
        value: "all",
        label: "All",
        desc: "Select all domains",
        iconHtml:
          '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#ebf8ff"/><path d="M8 12h8M8 8h8M8 16h5" stroke="#0369a1" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      }
    ]);

    const local = reactive({
      organization: "",
      location: "",
      industry: ""
    });

    const selectedDomains = ref<string[]>([]);
    const submitting = ref(false);
    const showMattermost = ref(false);
    const mm = reactive({ connecting: false, status: "pending" as "pending" | "connected" });

    // include the uploaded sketch path (local file path provided)
    const sketchUrl = ref<string>("/mnt/data/e6ee10fe-3a83-45ee-b3a8-4a04b938dd67.png");

    function isSelected(val: string) {
      return selectedDomains.value.includes(val);
    }

    function toggleDomain(val: string) {
      if (val === "all") {
        const hasAll = selectedDomains.value.includes("all");
        if (hasAll) {
          selectedDomains.value = [];
        } else {
          selectedDomains.value = domainOptions.value.map((o) => o.value);
        }
        return;
      }
      const idx = selectedDomains.value.indexOf(val);
      if (idx === -1) selectedDomains.value.push(val);
      else selectedDomains.value.splice(idx, 1);

      // keep "all" in sync
      const nonAll = domainOptions.value.filter((o) => o.value !== "all").map((o) => o.value);
      const allSelected = nonAll.every((v) => selectedDomains.value.includes(v));
      if (allSelected && !selectedDomains.value.includes("all")) selectedDomains.value.push("all");
      if (!allSelected && selectedDomains.value.includes("all")) {
        const i = selectedDomains.value.indexOf("all");
        if (i !== -1) selectedDomains.value.splice(i, 1);
      }
    }

    function onFinish() {
      if (!local.location) {
        window.alert("Please select a country.");
        return;
      }
      if (!local.industry) {
        window.alert("Please select an industry.");
        return;
      }
      submitting.value = true;

      // simulate submission then navigate to /add-location
      setTimeout(() => {
        submitting.value = false;
        router.push("/add-location").catch(() => { });
      }, 700);
    }

    function resetForm() {
      local.organization = "";
      local.location = "";
      local.industry = "";
      selectedDomains.value = [];
    }

    function connectToMattermost() {
      if (mm.connecting) return;
      mm.connecting = true;
      setTimeout(() => {
        mm.connecting = false;
        mm.status = "connected";
      }, 1200);
    }

    function closeMattermost() {
      showMattermost.value = false;
    }

    return {
      domainOptions,
      local,
      selectedDomains,
      submitting,
      showMattermost,
      mm,
      sketchUrl,
      isSelected,
      toggleDomain,
      onFinish,
      resetForm,
      connectToMattermost,
      closeMattermost
    };
  }
});
</script>

<style scoped>
/* Keep these scoped rules minimal. Your global main.css already contains many se- classes; this file adds only what's necessary here. */
.brand-mark {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(180deg, #0b59d1, #054cb3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  box-shadow: 0 10px 30px rgba(11, 59, 209, 0.12);
  font-family: Inter, sans-serif;
}

.brand-text h1 {
  margin: 0;
  font-size: 1rem;
  color: #06307a;
  font-weight: 800;
}

/* card (base styles are in your main css) */
.se-card {
  transition: all 360ms cubic-bezier(.2, .9, .2, 1);
  align-items: stretch;
  max-width: 1100px;
}

/* left panel styles */
.on-se-left {
  min-height: 540px;
  box-sizing: border-box;
}

/* when no mattermost: form uses full width */
.on-left-full {
  width: 100%;
  color: #03318d;
  padding: 28px 32px;
}

/* when mattermost visible, left becomes narrower */
.on-left-split {
  width: 48%;
  color: #03318d;
  padding: 28px 32px;
}

/* small logo placeholder */
.logo-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #fff, #e6eef7);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

/* heading */
.welcome-title {
  font-size: 22px;
  margin: 0;
  color: #03318d;
  font-weight: 700;
}

.welcome-sub {
  margin: 6px 0 0;
  color: #03318d;
}

/* provider tiles - centered */
.provider-row-inner {
  width: 100%;
}

/* small visual divider between groups on wide screens */
.divider {
  width: 1px;
  height: 58px;
  background: rgba(15, 23, 42, 0.06);
  margin: 0 18px;
}

/* provider tiles */
.provider-group .group-title {
  color: #03318d;
  font-weight: 600;
  margin-bottom: 8px;
}

.tiles {
  gap: 10px;
}

.provider-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 10px;
  min-width: 120px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255, 255, 255, 0.02);
  color: #03318d;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
  text-align: center;
  flex: 0 0 auto;
}

.provider-tile .tile-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.provider-tile .tile-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #030303;
  white-space: nowrap;
}

.provider-tile.active {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.08);
  border-color: rgba(34, 197, 94, 0.16);
  background: rgba(249, 250, 251, 0.75);
}

/* domains */
.domains-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

/* domain card - made position:relative to allow check badge */
.domain-card {
  display: flex;
  align-items: center;
  width: 90%;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255, 255, 255, 0.02);
  color: #0b1220;
  cursor: pointer;
  transition: all 160ms ease;
  min-height: 72px;
  position: relative;
  padding: 12px;
  gap: 12px;
}

.domain-icon {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 56px;
}

.domain-body {
  flex: 1 1 auto;
}

.domain-title {
  font-weight: 700;
  color: #0b1220;
  margin-bottom: 4px;
  font-size: 0.98rem;
}

.domain-sub {
  color: rgba(55, 65, 81, 0.7);
  font-size: 0.86rem;
  margin: 0;
}

.domain-card.selected {
  border-color: rgba(34, 197, 94, 0.22);
  background: linear-gradient(180deg, #f7fff9, #eef9f0);
  color: #0b1220;
}

.domain-card.selected .domain-icon {
  background: rgba(34, 197, 94, 0.08);
}

/* check badge (right-top) */
.domain-check {
  position: absolute;
  right: 12px;
  top: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.95);
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.18);
  transform-origin: center;
  animation: pop .12s ease;
}

.domain-check svg {
  display: block;
}

/* small pop animation when check appears */
@keyframes pop {
  from {
    transform: scale(0.85);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* finish button */
.finish-btn {
  background: #03318d;
  border: none;
  color: #fff;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* responsiveness - stack and tighten on small screens */
@media (max-width: 991.98px) {
  .se-card {
    flex-direction: column;
    gap: 12px;
  }

  .on-left-full,
  .on-left-split {
    width: 100%;
    padding: 20px;
  }

  .domains-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 575.98px) {
  .logo-placeholder {
    width: 40px;
    height: 40px;
  }

  .domain-icon {
    width: 48px;
    height: 48px;
    flex: 0 0 48px;
  }

  .domain-card {
    padding: 10px;
  }
}
</style>
