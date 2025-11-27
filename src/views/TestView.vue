<template>
  <div class="page-wrap p-4">
    <!-- LOCATIONS -->
    <section class="mb-5 card p-4">
      <h3 class="mb-2">Locations</h3>
      <p class="text-muted small mb-3">Add locations to assign to team members. Select one or more.</p>

      <div class="d-flex align-items-center gap-3">
        <!-- DROPDOWN WRAPPER -->
        <div class="dropdown" ref="dropdownRef">
          <!-- toggle button (stop propagation so doc click doesn't immediately close) -->
          <button class="btn btn-light dropdown-toggle" @click.stop="toggleDropdown" :aria-expanded="open">
            {{ selectedLocations.length ? selectedLocations.join(', ') : 'Choose locations' }}
          </button>

          <!-- dropdown menu -->
          <div v-if="open" class="dropdown-menu p-3 shadow-sm" @click.stop>
            <div class="preset-list mb-2">
              <label v-for="loc in availableLocations" :key="loc" class="form-check mb-2">
                <input class="form-check-input" type="checkbox" :id="'chk-' + loc" :value="loc"
                  v-model="selectedPresets" />
                <span class="form-check-label">{{ loc }}</span>
              </label>
            </div>

            <div class="d-flex gap-2 mt-2">
              <input class="input form-control" v-model.trim="dropdownCustom" placeholder="Add custom (comma-separated)"
                @keydown.enter.prevent="addFromDropdown" />
              <button class="btn btn-success" @click="addFromDropdown" :disabled="adding">
                <span v-if="adding" class="spinner-border spinner-border-sm me-1" role="status"
                  aria-hidden="true"></span>
                Add
              </button>
            </div>

            <div class="d-flex justify-content-between mt-3">
              <button class="btn btn-outline-secondary btn-sm" @click="clearSelection">Clear</button>
              <div>
                <button class="btn btn-light btn-sm me-2" @click="closeDropdown">Done</button>
                <button class="btn btn-primary btn-sm" @click="applySelection">Apply</button>
              </div>
            </div>
          </div>
        </div>

        <div class="small text-muted">Select multiple presets or type customs in dropdown</div>

        <div class="ms-auto">
          <button class="btn btn-primary" @click="saveLocations" :disabled="!selectedLocations.length">Save</button>
        </div>
      </div>

      <!-- chips -->
      <div v-if="selectedLocations.length" class="chips mt-3">
        <template v-for="(loc, idx) in selectedLocations" :key="loc">
          <span class="chip">
            {{ loc }}
            <button class="chip-remove" @click="removeLocation(idx)" :aria-label="'Remove ' + loc">×</button>
          </span>
        </template>
      </div>
    </section>

    <!-- CONFIGURE TEAMS (kept minimal for demo) -->
    <section class="card p-4" :class="{ 'disabled-section': !teamsEnabled }">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h4 class="mb-1">Configure Your Teams</h4>
          <small class="text-muted">Add members to the team</small>
        </div>
        <div>
          <button class="btn btn-danger btn-sm" @click="addTeamRow" :disabled="!teamsEnabled">+</button>
        </div>
      </div>

      <div class="tabs mb-3">
        <button v-for="(t, i) in tabs" :key="t" class="btn btn-sm me-2"
          :class="i === activeTab ? 'btn-outline-primary' : 'btn-light'" @click="activeTab = i"
          :disabled="!teamsEnabled">
          {{ t }}
        </button>
      </div>

      <div class="team-name mb-2">
        <h5 class="mb-0">Team {{ activeTab + 1 }}</h5>
        <div class="small text-muted">Members: {{ teamRows.length }}</div>
      </div>

      <!-- simplified rows -->
      <div class="row fw-bold py-2 border-bottom">
        <div class="col-3">ROLE</div>
        <div class="col-4">ASSIGN MEMBER</div>
        <div class="col-3">BACKUP MEMBER</div>
        <div class="col-2">LOCATION</div>
      </div>

      <div v-for="(row, idx) in teamRows" :key="row.id" class="row align-items-center py-3 border-bottom">
        <div class="col-3">
          <div class="fw-semibold">{{ row.role }}</div>
        </div>
        <div class="col-4">
          <select class="form-select form-select-sm" v-model="row.assign" :disabled="!teamsEnabled">
            <option value="">Select</option>
            <option v-for="u in users" :key="u.email" :value="u.name">{{ u.name }}</option>
          </select>
        </div>
        <div class="col-3">
          <select class="form-select form-select-sm" v-model="row.backup" :disabled="!teamsEnabled">
            <option value="">Select</option>
            <option v-for="u in users" :key="u.email + 'b' + idx" :value="u.name">{{ u.name }}</option>
          </select>
        </div>
        <div class="col-2 text-end">
          <select class="form-select form-select-sm" v-model="row.location" :disabled="!teamsEnabled">
            <option value="">Select</option>
            <option v-for="loc in selectedLocations" :key="loc" :value="loc">{{ loc }}</option>
          </select>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <div class="small text-muted">Tip: add locations first.</div>
        <div>
          <button class="btn btn-secondary btn-sm me-2" @click="resetAll" :disabled="!teamsEnabled">Reset</button>
          <button class="btn btn-primary" @click="saveTeams" :disabled="!teamsEnabled">Save</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick, onMounted, onBeforeUnmount } from "vue";

type TeamRow = { id: number; role: string; assign: string; backup: string; location: string };

export default defineComponent({
  name: "LocationsAndTeams",
  setup() {
    // presets
    const availableLocations = ref<string[]>(["Sydney", "New York", "London", "Tokyo"]);

    // final chosen locations used by teams
    const selectedLocations = ref<string[]>([]);

    // checkbox state inside dropdown and custom input
    const selectedPresets = ref<string[]>([]);
    const dropdownCustom = ref("");
    const open = ref(false);
    const adding = ref(false);

    // dropdown wrapper ref for click-outside detection
    const dropdownRef = ref<HTMLElement | null>(null);

    // Toggle dropdown (stop propagation in template so this won't immediately be closed by doc click)
    function toggleDropdown() {
      open.value = !open.value;
      if (open.value) {
        nextTick(() => {
          // focus the custom input if present
          const el = dropdownRef.value?.querySelector<HTMLInputElement>(".input");
          el?.focus();
        });
      }
    }

    // Add selected presets + customs to selectedLocations then close
    function applySelection() {
      const customs = dropdownCustom.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const combined = [...selectedPresets.value, ...customs];

      const toAdd = combined.filter((c) => {
        const lc = c.trim().toLowerCase();
        return lc && !selectedLocations.value.some((s) => s.toLowerCase() === lc);
      });
      if (toAdd.length) selectedLocations.value.push(...toAdd);

      // reset dropdown selections and close
      selectedPresets.value = [];
      dropdownCustom.value = "";
      open.value = false;
    }

    // immediate add (Add button) — similar to applySelection but keeps UX slightly different
    async function addFromDropdown() {
      adding.value = true;
      const customs = dropdownCustom.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const combined = [...selectedPresets.value, ...customs];

      const toAdd = combined.filter((c) => {
        const lc = c.trim().toLowerCase();
        return lc && !selectedLocations.value.some((s) => s.toLowerCase() === lc);
      });

      // small delay for UX
      await new Promise((r) => setTimeout(r, 150));

      if (toAdd.length) selectedLocations.value.push(...toAdd);

      selectedPresets.value = [];
      dropdownCustom.value = "";
      adding.value = false;

      // close shortly after
      setTimeout(() => (open.value = false), 120);
    }

    // Save (stub)
    function saveLocations() {
      alert(`Saved locations: ${selectedLocations.value.join(", ")}`);
    }

    function removeLocation(idx: number) {
      selectedLocations.value.splice(idx, 1);
    }

    function clearSelection() {
      selectedPresets.value = [];
      dropdownCustom.value = "";
    }

    // click outside => close dropdown
    function handleDocClick(e: MouseEvent) {
      const el = dropdownRef.value;
      if (!el) return;
      const target = e.target as Node;
      if (!el.contains(target)) {
        open.value = false;
      }
    }

    onMounted(() => document.addEventListener("click", handleDocClick));
    onBeforeUnmount(() => document.removeEventListener("click", handleDocClick));

    // TEAMS
    const teamsEnabled = computed(() => selectedLocations.value.length > 0);

    const users = ref([
      { name: "Amit Sharma", email: "amit@example.com" },
      { name: "Sara Khan", email: "sara@example.com" },
      { name: "Diego Lopez", email: "diego@example.com" },
      { name: "Lina Park", email: "lina@example.com" }
    ]);

    const tabs = ref(["Team 1", "Team 2", "Team 3"]);
    const activeTab = ref(0);

    const teamRows = ref<TeamRow[]>([
      { id: 1, role: "Owner", assign: "", backup: "", location: "" },
      { id: 2, role: "Analyst", assign: "", backup: "", location: "" }
    ]);

    function addTeamRow() {
      const nextId = teamRows.value.length ? Math.max(...teamRows.value.map((r) => r.id)) + 1 : 1;
      teamRows.value.push({ id: nextId, role: `Role ${nextId}`, assign: "", backup: "", location: "" });
    }

    function resetAll() {
      teamRows.value.forEach((r) => {
        r.assign = "";
        r.backup = "";
        r.location = "";
      });
    }

    function saveTeams() {
      const missing = teamRows.value.some((r) => !r.location);
      if (missing) {
        alert("Please assign a location to every team member before saving.");
        return;
      }
      alert("Teams saved — " + JSON.stringify(teamRows.value, null, 2));
    }

    return {
      availableLocations,
      selectedLocations,
      selectedPresets,
      dropdownCustom,
      open,
      adding,
      dropdownRef,
      toggleDropdown,
      applySelection,
      addFromDropdown,
      saveLocations,
      removeLocation,
      clearSelection,
      teamsEnabled,
      users,
      tabs,
      activeTab,
      teamRows,
      addTeamRow,
      resetAll,
      saveTeams
    };
  }
});
</script>

<style scoped>
.page-wrap {
  max-width: 1100px;
  margin: 0 auto;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

/* simple card */
.card {
  border-radius: 10px;
  border: 1px solid rgba(10, 30, 60, 0.06);
  background: white;
}

/* dropdown positioning */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  z-index: 60;
  min-width: 280px;
  top: calc(100% + 8px);
  left: 0;
  border-radius: 8px;
  box-shadow: 0 12px 32px rgba(11, 17, 32, 0.08);
  background: white;
}

/* basic styles */
.form-check {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input.form-control {
  min-width: 180px;
}

/* chips */
.chips {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.chip {
  background: #eef4ff;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.chip-remove {
  border: 0;
  background: transparent;
  cursor: pointer;
  font-weight: 800;
  color: #06307a;
}

/* teams disabled */
.disabled-section {
  opacity: 0.6;
  pointer-events: none;
}

/* small responsive */
@media (max-width: 700px) {
  .dropdown-menu {
    min-width: 220px;
  }
}
</style>
