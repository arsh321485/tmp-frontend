<template>
  <main class="add-location-page min-vh-100 d-flex align-items-center justify-content-center">
    <!-- top-left logo -->
    <div class="logo-top">
      <div class="logo-placeholder" aria-hidden="true"></div>
      <span class="logo-text">TMP</span>
    </div>

    <!-- central card -->
    <div class="container px-3">
      <div class="card-wrap mx-auto">
        <div class="location-card rounded-3 shadow-sm text-center p-4">
          <h1 class="page-title mb-2">Add your Location</h1>
          <p class="lead text-muted mb-4">Select the primary location for your organization</p>

          <!-- framed select box (matches your sketch) -->
          <div class="select-frame mb-4" role="group" aria-label="Location select">
            <label class="form-label small mb-2 w-100 text-start">Location</label>

            <div class="select-inner d-flex align-items-center justify-content-between">
              <select v-model="location" class="form-select" aria-label="Select location">
                <option value="" disabled>Select location</option>
                <option value="new-york">New York</option>
                <option value="london">London</option>
                <option value="bengaluru">Bengaluru</option>
                <option value="sydney">Sydney</option>
                <option value="other">Other</option>
              </select>

              <svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 9l6 6 6-6" stroke="#6b7280" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </div>
          </div>

          <!-- small sketch preview (uses your uploaded file) -->
          <div class="sketch-preview mb-3" aria-hidden="true">
            <img :src="sketchUrl" alt="sketch preview" />
          </div>

          <div class="d-flex justify-content-center">
            <button class="btn btn-primary btn-lg" @click="save" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Save
            </button>
          </div>

          <p v-if="saved" class="mt-3 text-success">Location saved successfully.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
export default {
  name: "AddLocationPage",
  data() {
    return {
      location: "",
      saving: false,
      saved: false,
      // your uploaded sketch file (local path provided) — tooling will transform this to a URL
      sketchUrl: "/mnt/data/e6ee10fe-3a83-45ee-b3a8-4a04b938dd67.png"
    };
  },
  methods: {
    save() {
      if (!this.location) {
        window.alert("Please select a location.");
        return;
      }
      this.saving = true;
      this.saved = false;
      setTimeout(() => {
        this.saving = false;
        this.saved = true;
      }, 800);
    }
  }
};
</script>

<style scoped>
.add-location-page {
  background: #f7f9fb;
  padding: 36px 12px;
  position: relative;
  box-sizing: border-box;
}

/* top-left logo */
.logo-top {
  position: absolute;
  top: 18px;
  left: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-placeholder {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background: linear-gradient(135deg, #fff, #e6eef7);
  box-shadow: 0 6px 16px rgba(2, 6, 23, 0.06);
}

.logo-text {
  font-weight: 700;
  color: #0b1220;
}

/* card */
.card-wrap {
  max-width: 640px;
}

.location-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(11, 17, 32, 0.04);
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.06);
}

/* heading */
.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #0b1220;
}

/* framed select to match sketch */
.select-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.select-inner {
  width: 320px;
  max-width: 90%;
  border: 2px solid rgba(15, 23, 42, 0.06);
  border-radius: 8px;
  padding: 8px 12px;
  background: #fbfdff;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.form-select {
  border: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: transparent;
  padding: 6px 4px;
  font-size: 15px;
  color: #0b1220;
  width: 100%;
  outline: none;
}

.chev {
  opacity: 0.9;
}

/* sketch preview */
.sketch-preview img {
  max-width: 160px;
  max-height: 100px;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 8px 20px rgba(2, 6, 23, 0.04);
  border: 1px solid rgba(11, 17, 32, 0.03);
}

/* button */
.btn-primary {
  background: linear-gradient(180deg, #2d8cff, #1463d6);
  border: none;
  padding: 10px 22px;
  font-weight: 700;
  border-radius: 8px;
}

/* responsive */
@media (max-width: 575.98px) {
  .select-inner {
    width: 100%;
  }

  .sketch-preview img {
    max-width: 120px;
  }

  .logo-placeholder {
    width: 36px;
    height: 36px;
  }
}
</style>
