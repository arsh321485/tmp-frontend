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
                <div class="d-flex align-items-center gap-2 mb-3">
                  <div class="logo-placeholder se-labels" aria-hidden="true"></div>
                  <h3 class="mb-0 logo-text " style=" color: #03318d;;">TMP</h3>
                </div>

                <!-- welcome centered -->
                <div class="text-center mb-4 se-labels">
                  <h2 class="welcome-title se-main ">Welcome to Test My Plan</h2>
                  <p class="welcome-sub">Before we fix your information assets...</p>
                </div>

                <!-- Mattermost panel centered inside the left panel -->
                <section class="se-right mattermost-panel">
                  <div class="se-right-inner d-flex flex-column align-items-center">
                    <h4 class="mb-1 se-title">Connect to Mattermost</h4>

                    <p class="mattermost-text mb-3 text-center">Please setup your email with Mattermost to continue...
                    </p>

                    <div class="mb-3 d-flex gap-2">
                      <!-- clicking opens modal -->
                      <button class="btn btn-primary" :disabled="mm.connecting || mm.status === 'connected'"
                        @click="openModal">
                        <span v-if="mm.connecting" class="spinner-border spinner-border-sm me-2" role="status"
                          aria-hidden="true"></span>
                        {{ mm.status === 'connected' ? 'Connected' : 'Connect to Mattermost' }}
                      </button>
                      <button class="btn btn-outline-secondary" @click="closeMattermost">Back</button>
                    </div>

                    <div class="status-box mt-3 text-center">
                      <div v-if="mm.status === 'pending'" class="loading-icon">
                        <div class="blue-circle mx-auto">
                          <div class="dots"><span></span><span></span><span></span></div>
                        </div>
                        <p class="text-center status-text mb-0">Status: Pending</p>
                      </div>

                      <div v-else class="success-icon">
                        <div class="green-circle mx-auto">
                          <!-- optional svg check -->
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M20 6L9 17l-5-5" stroke="#28a745" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round" />
                          </svg>
                        </div>
                        <p class="text-center status-text mb-0 status-success">Status: Connected</p>
                      </div>
                    </div>
                  </div>
                </section>

                <!-- finish button aligned right corner -->
                <div class="d-flex justify-content-end mt-4">
                  <button class="btn finish-btn" @click="onFinish" :disabled="submitting" :aria-busy="submitting">
                    <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"
                      aria-hidden="true"></span>
                    Finish
                  </button>
                </div>


              </div>
            </aside>

            <!-- RIGHT: mattermost/status panel (hidden until showMattermost) -->

          </div> <!-- se-card -->
        </div>
      </div>
    </div>

    <!-- Modal: Update Email & Password -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-window rounded">
        <div class="modal-header d-flex align-items-center justify-content-between">
          <h5 class="mb-0">Update Email & Password</h5>
          <button class="btn-close" @click="closeModal" aria-label="Close">&times;</button>
        </div>

        <div class="modal-body">
          <label class="form-label small mb-1">Email Address</label>
          <input v-model.trim="form.email" type="email" class="form-control mb-3" placeholder="you@company.com" />

          <label class="form-label small mb-1">Set Your Password</label>
          <input v-model="form.password" type="password" class="form-control mb-3" placeholder="Enter password" />
        </div>

        <div class="modal-footer d-flex justify-content-end gap-2">
          <button class="btn btn-secondary" @click="closeModal" :disabled="saving">Cancel</button>
          <button class="btn btn-primary" @click="saveModal" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Save
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
export default {
  name: "OnboardingPage",
  setup() {
    const router = useRouter();
    return {
      router
    };
  },
  data() {
    return {
      // keep your original state
      submitting: false,
      showMattermost: false,

      // mattermost state
      mm: {
        connecting: false,
        status: "pending" // 'pending' | 'connected'
      },

      // modal state
      showModal: false,
      saving: false,
      form: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    openModal() {
      // open modal when user wants to connect
      this.showModal = true;
    },
    closeModal() {
      if (this.saving) return;
      this.showModal = false;
    },
    saveModal() {
      // basic validation
      if (!this.validEmail(this.form.email)) {
        window.alert("Please enter a valid email address.");
        return;
      }
      if (!this.form.password || this.form.password.length < 6) {
        window.alert("Please enter a password (at least 6 characters).");
        return;
      }

      // simulate save & connection -> update status to connected
      this.saving = true;
      setTimeout(() => {
        this.saving = false;
        this.showModal = false;
        this.mm.status = "connected";
        this.mm.connecting = false;
        // clear sensitive field
        this.form.password = "";
      }, 900);
    },
    validEmail(e: string) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    },
    connectToMattermost() {
      // fallback: open modal
      this.openModal();
    },
    closeMattermost() {
      // keep your original behavior
      this.showMattermost = false;
    },
    onFinish() {
      // keep your original finish (noop here)
      this.submitting = true;
      setTimeout(() => {
        this.submitting = false;
        this.router.push("/add-location").catch(() => {
          // ignore navigation errors
        });

        // any additional finish logic can go here
      }, 700);
    }


  }
};
</script>

<style scoped>
/* keep your existing styles and only add centering / modal rules */

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
  color: #050505;
  padding: 28px 32px;
}

/* when mattermost visible, left becomes narrower */
.on-left-split {
  width: 48%;
  color: #070707;
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
  color: #050505;
  font-weight: 700;
}

.welcome-sub {
  margin: 6px 0 0;
  color: rgba(17, 17, 17, 0.7);
}

/* mattermost panel centered content */
.mattermost-panel {
  width: 100%;
  padding: 32px 16px;
  background: transparent;
  box-sizing: border-box;
}

.se-right-inner {
  width: 100%;
  max-width: 640px;
  /* keeps the mattermost box centered and constrained */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}



/* status visuals */
.status-box {
  border: 1px solid #e6e6e9;
  border-radius: 10px;
  padding: 18px;
  width: 100%;
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

/* modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(8, 10, 20, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}

.modal-window {
  width: 420px;
  max-width: calc(100% - 32px);
  background: #fff;
  border-radius: 8px;
  padding: 18px;
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.12);
}

.modal-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding-bottom: 8px;
}

.modal-body {
  padding: 12px 0;
}

.modal-footer {
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
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

/* responsive */
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

  .se-right-inner {
    max-width: 92%;
  }

  .status-box {
    max-width: 100%;
  }
}

@media (max-width: 575.98px) {
  .logo-placeholder {
    width: 40px;
    height: 40px;
  }

  .modal-window {
    width: 94%;
  }

  .btn-primary {
    width: 100%;
    display: block;
    text-align: center;
  }
}
</style>
