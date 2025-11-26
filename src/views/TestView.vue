<template>
  <main class="se-page min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container-fluid px-0">
      <div class="row gx-0 justify-content-center w-100">

        <!-- Card centered -->
        <div class="col-12 col-sm-11 col-md-10 col-lg-10 col-xl-10 col-xxl-9 mx-auto se-card-col">
          <div class="se-card d-flex overflow-hidden rounded-3 shadow-sm mx-auto">

            <!-- LEFT: organization form (replaces image panel) -->
            <aside class="se-left org-left p-4">
              <div class="org-left-inner" style="color:#fff;">
                <h2 class="se-left-title" style="color:#fff;">Organization</h2>
                <p class="se-left-sub" style="color:rgba(255,255,255,0.9);">Provide your organization info</p>

                <div style="margin-top:18px;">
                  <label class="form-label small mb-1" style="color:#dbe9ff">Organization Name</label>
                  <input v-model.trim="left.local.organization" type="text" class="form-control form-control-sm"
                    placeholder="Organization (optional)" />
                </div>

                <div class="mt-3">
                  <label class="form-label small mb-1" style="color:#dbe9ff">Location</label>
                  <select v-model="left.local.location" class="form-select form-select-sm">
                    <option value="" disabled>Select location</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>India</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>Other</option>
                  </select>
                </div>

                <div class="mt-3">
                  <label class="form-label small mb-1" style="color:#dbe9ff">Industry</label>
                  <select v-model="left.local.industry" class="form-select form-select-sm">
                    <option value="" disabled>Select industry</option>
                    <option value="a">a</option>
                    <option value="b">b</option>
                    <option value="c">c</option>
                  </select>
                </div>

                <div class="mt-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <label class="form-label small mb-0" style="color:#dbe9ff">Domains</label>
                    <small class="text-muted">Choose one or more</small>
                  </div>

                  <div class="domains-grid mt-2">
                    <label v-for="opt in left.domainOptions" :key="opt.value" class="domain-card"
                      :class="{ selected: left.selectedDomains.includes(opt.value) }" tabindex="0"
                      @click="leftToggle(opt.value)">
                      <div class="domain-icon" v-html="opt.iconHtml"></div>
                      <div class="domain-body">
                        <div class="domain-title">{{ opt.label }}</div>
                        <div class="domain-sub small text-muted">{{ opt.desc }}</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="mt-4 d-flex gap-2">
                  <button class="btn btn-primary" @click="onLeftFinish" :disabled="left.submitting">
                    <span v-if="left.submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Finish
                  </button>
                  <button class="btn btn-outline-secondary" @click="resetLeft"
                    :disabled="left.submitting">Reset</button>
                </div>

              </div>
            </aside>

            <!-- RIGHT: onboarding or mattermost, toggles -->
            <section class="se-right d-flex align-items-center">
              <div class="w-100 se-right-inner">

                <!-- If showMattermost = false show onboarding summary; else show mattermost connect UI -->
                <div v-if="!showMattermost">
                  <h4 class="mb-1 se-title">Onboarding summary</h4>
                  <p class="small text-muted mb-3">Review your choices and complete connection.</p>

                  <div class="white-card p-3 mb-3">
                    <div><strong>Organization:</strong> {{ left.local.organization || "-" }}</div>
                    <div><strong>Location:</strong> {{ left.local.location || "-" }}</div>
                    <div><strong>Industry:</strong> {{ left.local.industry || "-" }}</div>
                    <div><strong>Domains:</strong> <span>{{ left.selectedDomains.join(", ") || "-" }}</span></div>
                  </div>

                  <div class="d-grid mb-0">
                    <button class="btn btn-primary btn-md" @click="showMattermost = true">Proceed to Mattermost
                      setup</button>
                  </div>

                </div>

                <div v-else>
                  <!-- Mattermost connect UI -->
                  <h4 class="mb-1 se-title">I'm your reporting manager</h4>
                  <small class="text-muted">Let's set up your reporting time</small>

                  <hr style="margin:18px 0;border-color:rgba(11,42,102,0.06)" />

                  <p class="mb-3">Please setup your email with Mattermost to continue...</p>

                  <div class="mb-3">
                    <button class="btn btn-primary btn-md" :disabled="mm.connecting" @click="connectToMattermost"
                      style="padding:10px 28px;border-radius:8px;font-weight:700;">
                      <span v-if="mm.connecting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Connect to Mattermost
                    </button>
                    <button class="btn btn-outline-secondary ms-2" @click="showMattermost = false">Back</button>
                  </div>

                  <div class="status-card mx-auto"
                    :class="{ pending: mm.status === 'pending', connected: mm.status === 'connected' }">
                    <div class="status-icon">
                      <svg v-if="mm.status === 'pending'" width="36" height="36" viewBox="0 0 24 24" fill="none"
                        aria-hidden="true">
                        <circle cx="12" cy="12" r="10" fill="#e6f6ff" />
                        <circle cx="12" cy="12" r="4" fill="#cdeefe" />
                        <circle cx="12" cy="12" r="2" fill="#a0ddff" />
                      </svg>

                      <svg v-if="mm.status === 'connected'" width="36" height="36" viewBox="0 0 24 24" fill="none"
                        aria-hidden="true">
                        <circle cx="12" cy="12" r="12" fill="#e9fdf2" />
                        <path d="M7 12.5l2.5 2.5 7-7" stroke="#059669" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" />
                      </svg>
                    </div>

                    <div class="status-body">
                      <div class="status-title">Status: <span class="status-strong">{{ mm.status === 'pending' ?
                        'Pending' : 'Connected' }}</span></div>
                      <div class="status-sub small text-muted">
                        <template v-if="mm.status === 'pending'">
                          You haven't set up your email with Mattermost yet.
                        </template>
                        <template v-else>
                          Your account is connected — you will receive reports via Mattermost.
                        </template>
                      </div>
                    </div>
                  </div>
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
  desc?: string;
  iconHtml?: string;
}

interface LocalState {
  organization: string;
  location: string;
  industry: string;
}

export default defineComponent({
  name: "OrgAndMattermost",
  data() {
    const domainOptions: DomainOption[] = [
      { value: "cybersecurity", label: "Cybersecurity", desc: "Good for B2B businesses", iconHtml: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 2l7 3v4c0 5-3.6 9.7-7 11-3.4-1.3-7-6-7-11V5l7-3z" fill="#eef6ff"/></svg>` },
      { value: "data-privacy", label: "Data Privacy", desc: "Good for B2B businesses", iconHtml: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" fill="#fff7ed"/></svg>` },
      { value: "business-continuity", label: "Business Continuity", desc: "Good for B2B businesses", iconHtml: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#ecfdf5"/></svg>` },
      { value: "all", label: "All", desc: "Select all domains", iconHtml: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" fill="#ebf8ff"/></svg>` }
    ];

    return {
      // left form state
      left: {
        submitting: false,
        local: {
          organization: "",
          location: "",
          industry: ""
        } as LocalState,
        domainOptions,
        selectedDomains: [] as string[]
      },

      // right state toggle and mattermost status
      showMattermost: false,
      mm: {
        connecting: false,
        status: "pending" as "pending" | "connected"
      }
    };
  },
  methods: {
    leftToggle(val: string) {
      // toggle selection behavior (maintain 'all' consistency)
      const sd = this.left.selectedDomains;
      if (val === "all") {
        const hasAll = sd.includes("all");
        if (hasAll) {
          this.left.selectedDomains = [];
        } else {
          this.left.selectedDomains = this.left.domainOptions.map((o: DomainOption) => o.value);
        }
        return;
      }

      const idx = sd.indexOf(val);
      if (idx === -1) sd.push(val); else sd.splice(idx, 1);

      const nonAll = this.left.domainOptions.filter(o => o.value !== "all").map(o => o.value);
      const allSelected = nonAll.every(v => sd.includes(v));
      const allIdx = sd.indexOf("all");
      if (allSelected && allIdx === -1) sd.push("all");
      if (!allSelected && allIdx !== -1) sd.splice(allIdx, 1);
    },

    onLeftFinish() {
      // minimal validation
      if (!this.left.local.location) {
        window.alert("Please select a location.");
        return;
      }
      if (!this.left.local.industry) {
        window.alert("Please select an industry.");
        return;
      }

      this.left.submitting = true;
      setTimeout(() => {
        this.left.submitting = false;
        // show Mattermost UI on the right
        this.showMattermost = true;
      }, 700);
    },

    resetLeft() {
      this.left.local.organization = "";
      this.left.local.location = "";
      this.left.local.industry = "";
      this.left.selectedDomains = [];
    },

    // mattermost simulated flow
    connectToMattermost() {
      if (this.mm.connecting) return;
      this.mm.connecting = true;
      // simulate async OAuth start; in real app redirect to backend oauth start
      setTimeout(() => {
        this.mm.connecting = false;
        this.mm.status = "connected";
      }, 1300);
    }
  }
});
</script>

<style scoped>
/* reuse your se-* CSS + small adjustments so left panel looks good as a form */

/* keep the existing .se-page, .se-card etc coming from your global stylesheet.
   Add minimal left-form styling here. */

.org-left {
  width: 48%;
  min-height: 560px;
  padding: 28px;
  background: linear-gradient(180deg, #061333, #082042);
  display: flex;
  align-items: flex-start;
  color: #fff;
}

.org-left .form-control,
.org-left .form-select {
  border-radius: 8px;
}

/* right panel unchanged from your theme */
.se-right {
  width: 52%;
  padding: 40px 56px;
  background: #fff;
  display: flex;
  align-items: center;
}

/* domain tiles reuse */
.domains-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 12px;
}

@media (min-width: 700px) {
  .domains-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.domain-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
}

.domain-card.selected {
  border-color: rgba(34, 197, 94, 0.25);
  background: linear-gradient(180deg, #f0fff4, #ecfdf5);
  transform: translateY(-4px);
  box-shadow: 0 8px 22px rgba(34, 197, 94, 0.06);
}

/* domain icon container (SVG inserted via v-html) */
.domain-icon svg {
  width: 36px;
  height: 36px;
}

/* Mattermost status card */
.status-card {
  width: 420px;
  margin-top: 12px;
  background: #fff;
  border: 1px solid rgba(11, 42, 102, 0.06);
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.04);
  display: flex;
  gap: 12px;
  align-items: center;
}

.status-card.connected {
  background: linear-gradient(180deg, #f2fff7, #eefdf6);
  border-color: rgba(5, 150, 105, 0.14);
}

/* status icon */
.status-icon {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6fbff;
  flex-shrink: 0;
}

/* minor text classes */
.status-title {
  font-weight: 600;
  color: #0b1220;
}

.status-sub {
  color: #6b7280;
  font-size: 0.9rem;
}

/* override .se-left-title when used in org-left for contrast */
.org-left .se-left-title {
  font-size: 22px;
  margin-bottom: 6px;
}

/* smaller responsive tweaks */
@media (max-width: 991.98px) {
  .se-card {
    flex-direction: column;
  }

  .org-left {
    width: 100%;
    display: block;
    min-height: auto;
    padding: 20px;
  }

  .se-right {
    width: 100%;
    padding: 24px;
  }
}
</style>
