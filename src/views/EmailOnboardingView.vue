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
                  <h4 class="mb-0 logo-text se-main">TMP</h4>
                </div>

                <!-- welcome centered -->
                <div class="text-center se-labels mb-4">
                  <h2 class="se-main">Welcome to Test My Plan</h2>
                  <p class="se-sub">Before we fix your information assets...</p>
                </div>

                <!-- provider selection row (CENTERED) -->
                <div class="providers-row row gx-3 mb-4 justify-content-center">
                  <div class="col-12 col-md-10">
                    <div
                      class="provider-row-inner d-flex gap-3 flex-column flex-md-row align-items-center justify-content-center">
                      <!-- Communication providers -->
                      <div class="provider-group text-center">
                        <h6 class="group-title ">Choose your communication platform</h6>
                        <div class="tiles d-flex flex-wrap justify-content-center gap-2">
                          <button v-for="p in commProviders" :key="p.value" type="button" class="provider-tile"
                            :class="{ active: selectedComm === p.value }" @click="selectedComm = p.value"
                            :aria-pressed="selectedComm === p.value">
                            <div class="tile-icon" v-html="p.icon"></div>
                            <div class="tile-label">{{ p.label }}</div>
                          </button>
                        </div>
                      </div>

                      <!-- Vertical divider (hidden on small screens) -->
                      <div class="divider d-none d-md-block"></div>

                      <!-- PM providers -->
                      <div class="provider-group text-center">
                        <h6 class="group-title">Choose your Project Management platform</h6>
                        <div class="tiles d-flex flex-wrap justify-content-center gap-2">
                          <button v-for="p in pmProviders" :key="p.value" type="button" class="provider-tile"
                            :class="{ active: selectedPM === p.value }" @click="selectedPM = p.value"
                            :aria-pressed="selectedPM === p.value">
                            <div class="tile-icon" v-html="p.icon"></div>
                            <div class="tile-label">{{ p.label }}</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Add organization heading -->
                <div class="text-center mb-3">
                  <h5 class="org-heading " style=" color: #03318d;">Add Organization Details</h5>
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
                  <div class="col-12 col-md-8">
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
                    <label class="form-label h5 text-center   mb-0" style=" color: #03318d;">Domains</label>
                    <small class="text-muted">Choose one or more</small>
                  </div>

                  <div class="domains-grid">
                    <label v-for="opt in domainOptions" :key="opt.value" class="domain-card"
                      :class="{ selected: isSelected(opt.value) }" @click="toggleDomain(opt.value)" tabindex="0"
                      @keydown.enter.prevent="toggleDomain(opt.value)">
                      <div class="domain-icon" v-html="opt.iconHtml"></div>
                      <div class="domain-body">
                        <div class="domain-title " style=" color: #03318d;">{{ opt.label }}</div>
                        <div class="domain-sub small text-muted">{{ opt.desc }}</div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- finish button aligned right corner -->
                <div class="d-flex justify-content-end">
                  <button class="btn finish-btn" @click="onFinish" :disabled="submitting" aria-busy="submitting">
                    <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"
                      aria-hidden="true"></span>
                    Connect to Mattermost
                  </button>
                </div>

              </div>
            </aside>

            <!-- RIGHT: mattermost/status panel (hidden until showMattermost) -->
            <!-- <section v-show="showMattermost" class="se-right mattermost-panel">
              <div class="se-right-inner">
                <h4 class="mb-1 se-title">I'm your reporting manager</h4>
                <p class="text-muted mb-3">Let's set up your reporting time</p>

                <p class="mattermost-text mb-3">Please setup your email with Mattermost to continue...</p>

                <div class="mb-3 d-flex gap-2">
                  <button class="btn btn-primary" :disabled="mm.connecting" @click="connectToMattermost">
                    <span v-if="mm.connecting" class="spinner-border spinner-border-sm me-2" role="status"
                      aria-hidden="true"></span>
                    Connect to Mattermost
                  </button>
                  <button class="btn btn-outline-secondary" @click="closeMattermost">Back</button>
                </div>

                <div class="status-box mt-3">
                  <div v-if="mm.status === 'pending'" class="loading-icon">
                    <div class="blue-circle mx-auto">
                      <div class="dots"><span></span><span></span><span></span></div>
                    </div>
                  </div>

                  <div v-else class="success-icon">
                    <div class="green-circle mx-auto">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" stroke="#28a745" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <p class="text-center status-text mb-0" :class="mm.status === 'connected' ? 'status-success' : ''">
                    Status: {{ mm.status === 'pending' ? 'Pending' : 'Connected' }}
                  </p>

                </div>
              </div>
            </section> -->

          </div> <!-- se-card -->
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "OnboardingPage",
  data() {
    const domainOptions = [
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
    ];

    // inline SVG icons for provider tiles
    const commProviders = [
      {
        value: "teams",
        label: "Teams",
        icon:
          '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<rect x="2.5" y="4.5" width="7" height="7" rx="1.4" fill="#005A9C"/>' +
          '<rect x="8.5" y="7.5" width="13" height="11" rx="2" fill="#2B88D8" opacity="0.95"/>' +
          '<circle cx="6" cy="9.5" r="1.1" fill="#FFF" opacity="0.95"/>' +
          '<path d="M9.5 8.75h7" stroke="#D6F0FF" stroke-width="0.9" stroke-linecap="round"/>' +
          "</svg>"
      },
      {
        value: "slack",
        label: "Slack",
        icon:
          '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<rect x="4" y="2" width="4.5" height="10" rx="2.2" fill="#36C5F0"/>' +
          '<rect x="15.5" y="2" width="4.5" height="10" rx="2.2" transform="rotate(90 15.5 2)" fill="#2EB67D"/>' +
          '<rect x="4" y="12" width="4.5" height="10" rx="2.2" transform="rotate(90 4 12)" fill="#ECB22E"/>' +
          '<rect x="15.5" y="12" width="4.5" height="10" rx="2.2" fill="#E01E5A"/>' +
          "</svg>"
      },
      {
        value: "none",
        label: "None",
        icon:
          '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<rect width="24" height="24" rx="4" fill="#F3F4F6"/>' +
          '<path d="M7 12h10" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round"/>' +
          "</svg>"
      }
    ];

    const pmProviders = [
      {
        value: "jira",
        label: "Jira",
        icon:
          '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<rect width="24" height="24" rx="4" fill="#E6F6FF"/>' +
          '<path d="M6 16l4-10 6 8-3 4-7-2z" fill="#0052CC"/>' +
          '<path d="M16 14l2-2" stroke="#2684FF" stroke-width="0.8" stroke-linecap="round"/>' +
          "</svg>"
      },
      {
        value: "asana",
        label: "Asana",
        icon:
          '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<rect width="24" height="24" rx="4" fill="#FFFBF7"/>' +
          '<circle cx="9.2" cy="9.2" r="2.1" fill="#EC6A6A"/>' +
          '<circle cx="14.8" cy="9.2" r="2.1" fill="#FFB56B"/>' +
          '<circle cx="12" cy="14.5" r="2.1" fill="#7C5CFF"/>' +
          "</svg>"
      },
      {
        value: "none",
        label: "None",
        icon:
          '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<rect width="24" height="24" rx="4" fill="#F3F4F6"/>' +
          '<path d="M7 12h10" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round"/>' +
          "</svg>"
      }
    ];

    return {
      local: {
        organization: "",
        location: "",
        industry: ""
      },
      domainOptions,
      selectedDomains: [],
      commProviders,
      pmProviders,
      selectedComm: "",
      selectedPM: "",
      submitting: false,
      showMattermost: false,
      mm: { connecting: false, status: "pending" }
    };
  },
  methods: {
    isSelected(val) {
      return this.selectedDomains.includes(val);
    },
    toggleDomain(val) {
      if (val === "all") {
        const hasAll = this.selectedDomains.includes("all");
        if (hasAll) this.selectedDomains = [];
        else this.selectedDomains = this.domainOptions.map((o) => o.value);
        return;
      }
      const idx = this.selectedDomains.indexOf(val);
      if (idx === -1) this.selectedDomains.push(val);
      else this.selectedDomains.splice(idx, 1);

      // keep "all" in sync
      const nonAll = this.domainOptions.filter((o) => o.value !== "all").map((o) => o.value);
      const allSelected = nonAll.every((v) => this.selectedDomains.includes(v));
      if (allSelected && !this.selectedDomains.includes("all")) this.selectedDomains.push("all");
      if (!allSelected && this.selectedDomains.includes("all")) {
        const i = this.selectedDomains.indexOf("all");
        if (i !== -1) this.selectedDomains.splice(i, 1);
      }
    },
    onFinish() {
      if (!this.local.location) {
        window.alert("Please select a country.");
        return;
      }
      if (!this.local.industry) {
        window.alert("Please select an industry.");
        return;
      }
      this.submitting = true;
      setTimeout(() => {
        this.submitting = false;
        // show Mattermost panel and split card
        this.showMattermost = true;
        this.mm.status = "pending";
      }, 700);
    },
    resetForm() {
      this.local.organization = "";
      this.local.location = "";
      this.local.industry = "";
      this.selectedDomains = [];
      this.selectedComm = "";
      this.selectedPM = "";
    },
    connectToMattermost() {
      if (this.mm.connecting) return;
      this.mm.connecting = true;
      setTimeout(() => {
        this.mm.connecting = false;
        this.mm.status = "connected";
      }, 1200);
    },
    closeMattermost() {
      this.showMattermost = false;
    }
  }
};
</script>

<style scoped>
/* Keep these scoped rules minimal. Your global main.css already contains many se- classes; this file adds only what's necessary here. */

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

.domain-card {
  display: flex;
  align-items: center;
  width: 90%;
  /* gap: 14px; */
  /* padding: 14px; */
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255, 255, 255, 0.02);
  color: #0b1220;
  cursor: pointer;
  transition: all 160ms ease;
  min-height: 72px;
}

.domain-icon {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  align-items: center;
  justify-content: center;
  /* flex: 0 0 56px; */
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

/* mattermost panel */
.mattermost-panel {
  width: 52%;
  padding: 32px;
  background: #fff;
  box-sizing: border-box;
}

/* status visuals */
.status-box {
  border: 1px solid #e6e6e9;
  border-radius: 10px;
  padding: 18px;
  max-width: 480px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(2, 6, 23, 0.04);
}

.blue-circle {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: #e1f6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
}

.dots {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #0096d6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 3px;
}

.dots span {
  width: 5px;
  height: 5px;
  background: #fff;
  border-radius: 50%;
  animation: dotBlink 1s infinite;
}

@keyframes dotBlink {

  0%,
  80%,
  100% {
    opacity: .25
  }

  40% {
    opacity: 1
  }
}

.green-circle {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: #e6f9ed;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
}

.status-text {
  font-weight: 600;
  font-size: 18px;
  text-align: center;
  margin-bottom: 6px;
  color: #111827;
}

.status-success {
  color: #16a34a;
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

  .mattermost-panel {
    width: 100%;
    padding: 18px;
    margin-top: 8px;
  }

  .domains-grid {
    grid-template-columns: 1fr;
  }

  .tiles {
    gap: 8px;
  }

  .provider-tile {
    min-width: 40%;
    padding: 10px;
  }

  .provider-row-inner {
    flex-direction: column;
    gap: 14px;
  }

  .divider {
    display: none;
  }
}

/* extra small screens - more compact */
@media (max-width: 575.98px) {
  .logo-placeholder {
    width: 40px;
    height: 40px;
  }

  .provider-tile {
    min-width: 48%;
  }

  .domain-icon {
    width: 48px;
    height: 48px;
    flex: 0 0 48px;
  }

  .domain-card {
    padding: 12px;
  }

  .finish-btn {
    padding: 8px 14px;
    font-size: 0.95rem;
  }
}
</style>
