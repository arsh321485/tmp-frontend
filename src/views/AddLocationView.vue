<template>
  <main class="locations-teams-page min-vh-100 d-flex align-items-start justify-content-center py-5">
    <div class="container" style="max-width:1100px;">
      <!-- header -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div class="d-flex align-items-center gap-3">
          <div class="logo-placeholder" aria-hidden="true"></div>
          <div>
            <h3 class="mb-0 " style=" color: #03318d; ">TMP</h3>
            <small class="text-muted">Manage locations & teams</small>
          </div>
        </div>

        <!-- sketch preview uses uploaded file path -->

      </div>

      <div class="card shadow-sm rounded-3">
        <div class="card-body p-4">
          <!-- Add Locations -->
          <section class="mb-4">
            <h5 class="section-title mb-3">Add Locations</h5>

            <div class="row g-3 align-items-center mb-2">
              <div class="col-12 col-md-5">
                <select v-model="preset" class="form-select form-select-sm" aria-label="Preset locations">
                  <option value="">Choose a Loaction</option>
                  <option value="New York">New York</option>
                  <option value="London">London</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Sydney">Sydney</option>
                </select>
              </div>

              <div class="col-12 col-md-5">
                <input v-model.trim="customLocation" type="text" class="form-control form-control-sm"
                  placeholder="Or type  location" aria-label="Custom location" />
              </div>

              <div class="col-12 col-md-2 d-grid">
                <button class="btn btn-primary btn-sm" @click="addLocation" :disabled="adding">
                  <span v-if="adding" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                  Add
                </button>
              </div>
            </div>

            <!-- <small class="text-muted d-block mb-2">Added locations appear below and are available for team assignment
              (table rows can be removed).</small> -->

            <div v-if="locations.length" class="mb-3">
              <div class="chips">
                <template v-for="(loc, idx) in locations" :key="loc">
                  <span class="chip">
                    {{ loc }}
                    <button class="chip-remove" @click="removeLocation(idx)" :aria-label="`Remove ${loc}`">×</button>
                  </span>
                </template>
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-end mb-1">
              <button class="btn btn-outline-secondary btn-sm" @click="loadDefaults">Defaults</button>
              <button class="btn btn-success btn-sm" @click="saveLocations" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                Save locations
              </button>
            </div>

            <p v-if="locMessage" :class="['small mt-2', locMessageType === 'success' ? 'text-success' : 'text-danger']">
              {{ locMessage }}
            </p>
          </section>

          <hr class="my-3" />

          <!-- Tabs -->
          <nav class="d-flex gap-2 mb-3" role="tablist" aria-label="Teams">
            <button v-for="(t, i) in teamTabs" :key="t.key" class="tab-btn" :class="{ active: activeTab === i }"
              @click="activeTab = i" role="tab" :aria-selected="activeTab === i">
              {{ t.label }}
            </button>
          </nav>

          <!-- Team panel -->
          <section class="team-panel">
            <h5 class="mb-3">{{ currentTab.label }}</h5>

            <div class="table-responsive">
              <table class="table table-borderless align-middle custom-table">
                <thead>
                  <tr>
                    <th class="col-role">Role</th>
                    <th class="col-member">Assign Member</th>
                    <th class="col-backup">Backup Member</th>
                    <th class="col-location">Location</th>
                    <th class="col-actions"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rIdx) in currentTeam.rows" :key="row.id">
                    <td>
                      <div class="cell-text">{{ row.role }}</div>
                    </td>
                    <td>
                      <div class="cell-text">{{ row.member }}</div>
                      <div v-if="row.email" class="cell-sub">{{ row.email }}</div>
                    </td>
                    <td>
                      <div class="cell-text">{{ row.backup }}</div>
                    </td>
                    <td>
                      <div class="cell-text">{{ row.location }}</div>
                    </td>
                    <td class="text-end">
                      <!-- REMOVE button (keeps the table read-only otherwise) -->
                      <button class="btn btn-sm btn-danger" @click="removeTeamRow(activeTab, rIdx)"
                        aria-label="Remove row">×</button>
                    </td>
                  </tr>

                  <tr v-if="!currentTeam.rows.length">
                    <td colspan="5" class="text-muted text-center py-4">No members configured for this team.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p v-if="teamMessage"
              :class="['small mt-3', teamMessageType === 'success' ? 'text-success' : 'text-danger']">
              {{ teamMessage }}
            </p>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";

type TeamRowStatic = {
  id: string;
  role: string;
  member: string;
  email?: string;
  backup: string;
  location: string;
};
type TeamStatic = { id: string; name: string; rows: TeamRowStatic[] };

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export default defineComponent({
  name: "LocationsTeamsRemove",
  setup() {
    // local sketch image path (uploaded)
    const sketchUrl = ref<string>("/mnt/data/e6ee10fe-3a83-45ee-b3a8-4a04b938dd67.png");

    // Locations
    const locations = ref<string[]>([]);
    const preset = ref<string>("");
    const customLocation = ref<string>("");
    const adding = ref<boolean>(false);
    const saving = ref<boolean>(false);
    const locMessage = ref<string>("");
    const locMessageType = ref<"success" | "error">("success");

    // Team tabs
    const teamTabs = ref([
      { key: "team1", label: "Team 1" },
      { key: "team2", label: "Team 2" },
      { key: "team3", label: "Team 3" }
    ]);
    const activeTab = ref<number>(0);

    // Static sample teams with rows (can remove rows)
    const teams = ref<TeamStatic[]>([
      {
        id: uid("t-1"),
        name: "Team 1",
        rows: [
          { id: uid("r-"), role: "Owner", member: "Amit Sharma", email: "amit@example.com", backup: "Sara Khan", location: "New York" },
          { id: uid("r-"), role: "Analyst", member: "Diego Lopez", email: "diego@example.com", backup: "Lina Park", location: "Bengaluru" }
        ]
      },
      {
        id: uid("t-2"),
        name: "Team 2",
        rows: [
          { id: uid("r-"), role: "Manager", member: "Sara Khan", email: "sara@example.com", backup: "Amit Sharma", location: "London" },
          { id: uid("r-"), role: "Operator", member: "Lina Park", email: "lina@example.com", backup: "Diego Lopez", location: "Sydney" }
        ]
      },
      {
        id: uid("t-3"),
        name: "Team 3",
        rows: [
          { id: uid("r-"), role: "Admin", member: "Diego Lopez", email: "diego@example.com", backup: "Sara Khan", location: "New York" }
        ]
      }
    ]);

    // Computed safe accessors (avoid 'possibly undefined' errors)
    const currentTab = computed(() => {
      // return a guaranteed object (fallback to first tab shape)
      return teamTabs.value[activeTab.value] ?? teamTabs.value[0] ?? { key: "team1", label: "Team 1" };
    });

    const currentTeam = computed<TeamStatic>(() => {
      return teams.value[activeTab.value] ?? teams.value[0] ?? { id: "t-fallback", name: "Team 1", rows: [] };
    });

    const teamMessage = ref<string>("");
    const teamMessageType = ref<"success" | "error">("success");

    function loadFromStorage() {
      try {
        const raw = localStorage.getItem("tmp_locations_v2");
        const parsed = raw ? JSON.parse(raw) : null;
        if (Array.isArray(parsed) && parsed.length) locations.value = parsed;
        else locations.value = ["New York", "London", "Bengaluru", "Sydney"];
      } catch {
        locations.value = ["New York", "London", "Bengaluru", "Sydney"];
      }
    }

    onMounted(() => {
      loadFromStorage();
    });

    // Locations handlers (unchanged)...
    function addLocation() {
      locMessage.value = "";
      const value = (customLocation.value || preset.value || "").trim();
      if (!value) {
        locMessageType.value = "error";
        locMessage.value = "Enter a preset or a custom location.";
        return;
      }
      if (locations.value.some((l) => l.toLowerCase() === value.toLowerCase())) {
        locMessageType.value = "error";
        locMessage.value = "Location already added.";
        preset.value = "";
        customLocation.value = "";
        return;
      }
      adding.value = true;
      setTimeout(() => {
        locations.value.push(value);
        preset.value = "";
        customLocation.value = "";
        adding.value = false;
        locMessageType.value = "success";
        locMessage.value = "Location added. Click Save to persist.";
        setTimeout(() => (locMessage.value = ""), 2500);
      }, 300);
    }

    function removeLocation(index: number) {
      locations.value.splice(index, 1);
      locMessage.value = "";
    }

    function saveLocations() {
      saving.value = true;
      locMessage.value = "";
      setTimeout(() => {
        localStorage.setItem("tmp_locations_v2", JSON.stringify(locations.value));
        saving.value = false;
        locMessageType.value = "success";
        locMessage.value = "Locations saved.";
        setTimeout(() => (locMessage.value = ""), 2000);
      }, 600);
    }

    function loadDefaults() {
      locations.value = ["New York", "London", "Bengaluru", "Sydney"];
      locMessageType.value = "success";
      locMessage.value = "Default locations loaded (not saved).";
      setTimeout(() => (locMessage.value = ""), 2000);
    }

    // Remove row from team
    function removeTeamRow(teamIndex: number, rowIndex: number) {
      const team = teams.value[teamIndex];
      if (!team) return;
      team.rows.splice(rowIndex, 1);
      teamMessageType.value = "success";
      teamMessage.value = `Member removed from ${teamTabs.value[teamIndex]?.label ?? "Team"}.`;
      setTimeout(() => (teamMessage.value = ""), 1800);
    }

    return {
      sketchUrl,
      // locations
      locations,
      preset,
      customLocation,
      adding,
      saving,
      locMessage,
      locMessageType,
      addLocation,
      removeLocation,
      saveLocations,
      loadDefaults,
      // teams
      teamTabs,
      activeTab,
      teams,
      currentTab,
      currentTeam,
      removeTeamRow,
      teamMessage,
      teamMessageType
    };
  }
});
</script>


<style scoped>
/* page basics */
.locations-teams-page {
  background: #f6f8fb;
  min-height: 100vh;
  padding-top: 28px;
  padding-bottom: 40px;
}

/* logo */
.logo-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fff, #e6eef7);
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
}

/* sketch preview */
.sketch-preview img {
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid rgba(11, 17, 32, 0.05);
}

/* section headings */
.section-title {
  font-weight: 700;
  color: #09307a;
}

/* chips */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: linear-gradient(180deg, #eef4ff, #f6fbff);
  color: #073063;
  font-weight: 600;
  box-shadow: 0 6px 12px rgba(11, 17, 32, 0.03);
}

.chip-remove {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  color: #073063;
}

/* tabs */
.tab-btn {
  background: transparent;
  border: 1px solid transparent;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  color: #334155;
  font-weight: 700;
  transition: all .12s ease;
}

.tab-btn:hover {
  transform: translateY(-2px);
  background: rgba(2, 6, 23, 0.03);
}

.tab-btn.active {
  background: linear-gradient(180deg, #ffffff, #eef6ff);
  border: 1px solid rgba(16, 77, 190, 0.08);
  box-shadow: 0 10px 24px rgba(3, 19, 77, 0.06);
  color: #05205f;
}

/* table tweaks */
.custom-table thead th {
  text-transform: uppercase;
  font-size: 12px;
  color: #475569;
  border-bottom: 1px solid rgba(2, 6, 23, 0.04);
  font-weight: 700;
}

.col-role {
  width: 18%;
}

.col-member {
  width: 30%;
}

.col-backup {
  width: 25%;
}

.col-location {
  width: 22%;
}

.col-actions {
  width: 5%;
}

/* static cell styling */
.cell-text {
  font-weight: 600;
  color: #0b1220;
}

.cell-sub {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

/* responsive */
@media (max-width: 991.98px) {

  .col-role,
  .col-member,
  .col-backup,
  .col-location {
    width: auto;
  }

  .sketch-preview {
    display: none;
  }
}

@media (max-width: 575.98px) {
  .card-body {
    padding: 18px;
  }

  .chips {
    gap: 6px;
  }

  .tab-btn {
    padding: 6px 10px;
    font-size: 0.95rem;
  }

  .custom-table thead {
    display: none;
  }

  .custom-table,
  .custom-table tbody,
  .custom-table tr,
  .custom-table td {
    display: block;
    width: 100%;
  }

  .custom-table tr {
    margin-bottom: 12px;
    border-bottom: 1px dashed rgba(2, 6, 23, 0.04);
    padding-bottom: 10px;
  }

  .custom-table td {
    text-align: right;
    padding-left: 45%;
    position: relative;
  }

  .custom-table td::before {
    position: absolute;
    left: 12px;
    width: 40%;
    text-align: left;
    font-weight: 700;
    color: #374151;
  }

  .custom-table td:nth-child(1)::before {
    content: "Role";
  }

  .custom-table td:nth-child(2)::before {
    content: "Member";
  }

  .custom-table td:nth-child(3)::before {
    content: "Backup";
  }

  .custom-table td:nth-child(4)::before {
    content: "Location";
  }

  .custom-table td:nth-child(5)::before {
    content: "";
  }
}
</style>
