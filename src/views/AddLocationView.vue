<template>
  <main class="locations-teams-page">
    <div class="container shell">
      <!-- header -->
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">TMP</div>
          <div class="brand-text">
            <h1>TestMyPlan</h1>
            <small class="muted">Manage locations & teams</small>
          </div>
        </div>

        <div class="actions">
          <button class="btn btn-ghost" @click="loadDefaults" title="Load default locations">
            Defaults
          </button>

          <button class="btn btn-primary" @click="saveLocations" :disabled="saving" title="Save locations">
            <span v-if="saving" class="spinner" aria-hidden="true"></span>
            Save
          </button>

          <!-- moved + add-row button here -->
          <button class="btn btn-add" @click="addEmptyRow" title="Add team row">
            <svg viewBox="0 0 24 24" class="add-icon" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="white" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <section class="card">
        <div class="card-inner">
          <!-- locations -->
          <div class="section">
            <div class="section-head">
              <h2>Locations</h2>
              <p class="muted">Add locations to assign to team members. Use the multi-select dropdown to add many at
                once.</p>
            </div>

            <!-- MULTI-SELECT DROPDOWN (single source for adding) -->
            <div class="row input-row" ref="multiWrapRef">
              <!-- Multi-select dropdown -->
              <div class="multi-col">
                <button class="multi-trigger" @click="toggleDropdown" :aria-expanded="dropdownOpen">
                  <template v-if="selectedPresets.length">
                    <span class="multi-count">{{ selectedPresets.length }}</span>
                    <span class="multi-label">selected</span>
                  </template>
                  <template v-else>
                    Choose locations
                  </template>
                  <svg class="caret" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>

                <div v-if="dropdownOpen" class="multi-dropdown" @click.stop>
                  <div class="multi-actions">
                    <input class="input" v-model.trim="dropdownCustom"
                      placeholder="Add custom (single or comma-separated)" @keydown.enter.prevent="addFromDropdown" />
                    <button class="btn btn-success small" @click="addFromDropdown" :disabled="addingSelected">
                      <span v-if="addingSelected" class="spinner small" aria-hidden="true"></span>
                      Add selected
                    </button>
                  </div>

                  <div class="preset-list" role="listbox">
                    <label class="preset-row" v-for="preset in presets" :key="preset">
                      <input type="checkbox" :value="preset" v-model="selectedPresets" />
                      <span class="preset-name">{{ preset }}</span>
                    </label>
                  </div>

                  <div class="dropdown-foot">
                    <button class="btn btn-ghost small" @click="clearSelection">Clear</button>
                    <button class="btn small" @click="closeDropdown">Done</button>
                  </div>
                </div>
              </div>

              <!-- info placeholder (keeps layout neat) -->
              <div class="info-col muted">Select multiple presets or type customs in dropdown</div>
            </div>

            <div v-if="locations.length" class="chips">
              <template v-for="(loc, idx) in locations" :key="loc">
                <span class="chip">
                  {{ loc }}
                  <button class="chip-remove" @click="removeLocation(idx)" :aria-label="`Remove ${loc}`">×</button>
                </span>
              </template>
            </div>

            <p v-if="locMessage" :class="['msg', locMessageType === 'success' ? 'ok' : 'err']">{{ locMessage }}</p>
          </div>

          <hr class="separator" />

          <!-- tabs -->
          <nav class="tabs" role="tablist" aria-label="Team tabs">
            <button v-for="(t, i) in teamTabs" :key="t.key" class="tab" :class="{ active: activeTab === i }"
              @click="activeTab = i" role="tab" :aria-selected="activeTab === i">
              {{ t.label }}
            </button>
          </nav>

          <!-- team table -->
          <div class="section">
            <div class="section-head spaced">
              <h2>{{ safeCurrentTab.label }}</h2>
              <div class="muted">Members: {{ safeCurrentTeam.rows.length }}</div>
            </div>

            <div class="table-wrap">
              <table class="modern">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Assign member</th>
                    <th>Backup member</th>
                    <th>Location</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(row, rIdx) in safeCurrentTeam.rows" :key="row.id">
                    <td class="role">{{ row.role }}</td>

                    <!-- Assign member -->
                    <td class="member-col">
                      <div class="member-control">
                        <!-- avatar now shows neutral user icon, not initials -->
                        <div class="avatar" v-if="row.member" :title="row.member" aria-hidden="false">
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true">
                            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                              fill="currentColor" opacity="0.9" />
                            <path d="M3 20c0-3.866 3.582-7 9-7s9 3.134 9 7v1H3v-1z" fill="currentColor" opacity="0.9" />
                          </svg>
                        </div>

                        <div class="member-inputs">
                          <!-- event target cast to HTMLInputElement to satisfy TS -->
                          <input :list="`members-datalist-${activeTab}-${rIdx}`" class="input" v-model="row.member"
                            @input="(e: Event) => onMemberInput(activeTab, rIdx, (e.target as HTMLInputElement).value)"
                            placeholder="Select or type member name" aria-label="Assign member" />
                          <datalist :id="`members-datalist-${activeTab}-${rIdx}`">
                            <option v-for="m in membersListForRow(row)" :key="m.name" :value="m.name">{{ m.email ?? ''
                            }}</option>
                          </datalist>

                          <div v-if="row.email" class="muted tiny">{{ row.email }}</div>
                        </div>
                      </div>
                    </td>

                    <!-- Backup -->
                    <td>
                      <input :list="`backup-datalist-${activeTab}-${rIdx}`" class="input" v-model="row.backup"
                        @input="(e: Event) => onBackupInput(activeTab, rIdx, (e.target as HTMLInputElement).value)"
                        placeholder="Select backup" aria-label="Backup member" />
                      <datalist :id="`backup-datalist-${activeTab}-${rIdx}`">
                        <option v-for="m in membersListForRow(row, { exclude: row.member })" :key="m.name"
                          :value="m.name">
                        </option>
                      </datalist>
                    </td>

                    <td class="loc">{{ row.location }}</td>

                    <td class="actions-col">
                      <button class="btn btn-danger outline" @click="removeTeamRow(activeTab, rIdx)" title="Remove row">
                        Remove
                      </button>
                    </td>
                  </tr>

                  <tr v-if="!safeCurrentTeam.rows.length">
                    <td colspan="5" class="empty">No members configured for this team.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p v-if="teamMessage" :class="['msg', teamMessageType === 'success' ? 'ok' : 'err']">{{ teamMessage }}</p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, onBeforeUnmount } from "vue";
import type { Ref } from "vue";

/* Types */
type Member = { name: string; email?: string };
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
  name: "LocationsTeamsMultiAddOnly",
  setup() {
    // Locations
    const locations = ref<string[]>([]);
    const saving = ref(false);
    const locMessage = ref("");
    const locMessageType = ref<"success" | "error">("success");

    // Multi-select dropdown state
    const presets = ref<string[]>(["New York", "London", "Bengaluru", "Sydney", "Mumbai", "Delhi", "San Francisco"]);
    const selectedPresets = ref<string[]>([]);
    const dropdownCustom = ref<string>("");
    const dropdownOpen = ref(false);
    const addingSelected = ref(false);

    // Tabs & teams
    const teamTabs = ref([
      { key: "team1", label: "Team 1" },
      { key: "team2", label: "Team 2" },
      { key: "team3", label: "Team 3" }
    ]);
    const activeTab = ref<number>(0);

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

    // members local list (replace with API/store)
    const membersStatic = ref<Member[]>([
      { name: "Amit Sharma", email: "amit@example.com" },
      { name: "Diego Lopez", email: "diego@example.com" },
      { name: "Sara Khan", email: "sara@example.com" },
      { name: "Lina Park", email: "lina@example.com" }
    ]);

    // SAFE computed values (never undefined) — fixes VLS warning
    const safeCurrentTab = computed(() => {
      return teamTabs.value[activeTab.value] ?? teamTabs.value[0] ?? { key: "team-fallback", label: "" };
    });

    const safeCurrentTeam = computed<TeamStatic>(() => {
      return teams.value[activeTab.value] ?? teams.value[0] ?? { id: "t-fallback", name: "Team", rows: [] };
    });

    const teamMessage = ref("");
    const teamMessageType = ref<"success" | "error">("success");

    // load locations
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
      document.addEventListener("click", handleDocClick);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleDocClick);
    });

    // click outside dropdown -> close
    const multiWrapRef: Ref<HTMLElement | null> = ref(null);
    function handleDocClick(e: MouseEvent) {
      const wrap = multiWrapRef.value;
      if (!wrap) return;
      const target = e.target as Node;
      if (wrap.contains(target)) return;
      dropdownOpen.value = false;
    }

    // toggle dropdown
    function toggleDropdown() {
      dropdownOpen.value = !dropdownOpen.value;
      if (dropdownOpen.value) {
        setTimeout(() => {
          const el = multiWrapRef.value?.querySelector<HTMLInputElement>(".multi-dropdown .input");
          el?.focus();
        }, 50);
      }
    }

    function closeDropdown() {
      dropdownOpen.value = false;
    }

    function clearSelection() {
      selectedPresets.value = [];
      dropdownCustom.value = "";
    }

    // Add selected from dropdown (multiple)
    async function addFromDropdown() {
      addingSelected.value = true;
      locMessage.value = "";
      const custom = dropdownCustom.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // combine selected presets and custom entries
      const combined = [...selectedPresets.value, ...custom];

      // dedupe and current lower-case check
      const toAdd = combined.filter((c) => {
        const lc = c.trim().toLowerCase();
        return lc && !locations.value.some((existing) => existing.toLowerCase() === lc);
      });

      // simulate small delay for UX
      await new Promise((r) => setTimeout(r, 250));

      if (toAdd.length) {
        locations.value.push(...toAdd);
        locMessageType.value = "success";
        locMessage.value = `${toAdd.length} location${toAdd.length > 1 ? "s" : ""} added. Click Save to persist.`;
      } else {
        locMessageType.value = "error";
        locMessage.value = "No new locations to add.";
      }

      // reset selection but keep dropdown open so user can continue
      selectedPresets.value = [];
      dropdownCustom.value = "";
      addingSelected.value = false;

      // auto close after a short delay
      setTimeout(() => (dropdownOpen.value = false), 350);
      setTimeout(() => (locMessage.value = ""), 2500);
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

    // team row handling
    function removeTeamRow(teamIndex: number, rowIndex: number) {
      const team = teams.value[teamIndex];
      if (!team) return;
      team.rows.splice(rowIndex, 1);
      teamMessageType.value = "success";
      teamMessage.value = `Member removed from ${teamTabs.value[teamIndex]?.label ?? "Team"}.`;
      setTimeout(() => (teamMessage.value = ""), 1600);
    }

    function addEmptyRow() {
      const t = teams.value[activeTab.value];
      if (!t) return;
      t.rows.push({ id: uid("r-"), role: "New role", member: "", email: "", backup: "", location: locations.value[0] ?? "" });
    }

    // utilities for members
    function membersListForRow(row: TeamRowStatic, opts?: { exclude?: string }): Member[] {
      const excludeName = opts?.exclude ?? "";
      const all: Member[] = [...membersStatic.value];

      if (row.member && !all.some((m) => m.name === row.member)) {
        all.push({ name: row.member, email: row.email });
      }
      if (row.backup && !all.some((m) => m.name === row.backup)) {
        all.push({ name: row.backup });
      }

      return all.filter((m) => m.name !== excludeName);
    }

    function onMemberInput(teamIndex: number, rowIndex: number, value: string) {
      const team = teams.value[teamIndex];
      if (!team) return;
      const row = team.rows[rowIndex];
      if (!row) return;
      row.member = value;
      const found = membersStatic.value.find((m) => m.name === value);
      row.email = found?.email ?? "";
      if (row.backup === row.member) row.backup = "";
    }

    function onBackupInput(teamIndex: number, rowIndex: number, value: string) {
      const team = teams.value[teamIndex];
      if (!team) return;
      const row = team.rows[rowIndex];
      if (!row) return;
      row.backup = value;
    }

    // helper for initials (still available if you want initials elsewhere)
    function initials(name?: string) {
      if (!name) return "";
      const parts = name.trim().split(/\s+/).slice(0, 2);
      return parts.map((p) => p.charAt(0).toUpperCase()).join("");
    }

    return {
      // refs exposed to template
      locations,
      saving,
      locMessage,
      locMessageType,
      removeLocation,
      saveLocations,
      loadDefaults,
      // multi select
      presets,
      selectedPresets,
      dropdownCustom,
      dropdownOpen,
      toggleDropdown,
      addFromDropdown,
      clearSelection,
      closeDropdown,
      multiWrapRef,
      addingSelected,
      // teams
      teamTabs,
      activeTab,
      teams,
      safeCurrentTab,
      safeCurrentTeam,
      removeTeamRow,
      addEmptyRow,
      teamMessage,
      teamMessageType,
      // members
      membersStatic,
      membersListForRow,
      onMemberInput,
      onBackupInput,
      initials
    };
  }
});
</script>

<style scoped>
/* full CSS styling (keeps the polished look) */
.locations-teams-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f6f8fb 0%, #eef5fb 100%);
  padding: 40px 18px;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: #0b1220;
}

.container.shell {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
}

/* topbar simplified */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

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

.muted {
  color: #6b7280;
  font-size: 0.9rem;
}

/* actions */
.actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(11, 17, 32, 0.04);
  background: white;
  cursor: pointer;
  font-weight: 700;
}

.btn-primary {
  background: linear-gradient(180deg, #0b3ba6, #0554c9);
  color: white;
  border: none;
  box-shadow: 0 8px 24px rgba(3, 19, 77, 0.08);
}

.btn-ghost {
  background: transparent;
  color: #0b3ba6;
  border: 1px solid rgba(11, 17, 32, 0.04);
}

.btn-success {
  background: linear-gradient(180deg, #00a86b, #008a56);
  color: white;
  border: none;
}

.btn.small {
  padding: 6px 10px;
  font-size: 0.9rem;
  border-radius: 8px;
}

/* add-button style */
.btn-add {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ff6b6b, #e84040);
  color: white;
  border: none;
  box-shadow: 0 10px 30px rgba(232, 64, 64, 0.12);
  cursor: pointer;
}

.add-icon {
  width: 18px;
  height: 18px;
}

/* card */
.card {
  background: white;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(11, 17, 32, 0.06);
  overflow: hidden;
  border: 1px solid rgba(11, 17, 32, 0.04);
}

.card-inner {
  padding: 22px;
}

/* layout for inputs */
.row.input-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
  position: relative;
}

.multi-col {
  position: relative;
}

/* multi trigger */
.multi-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(11, 17, 32, 0.06);
  background: linear-gradient(180deg, #fff, #fbfdff);
  cursor: pointer;
  font-weight: 700;
  min-width: 220px;
  justify-content: space-between;
}

.multi-count {
  background: #eef4ff;
  padding: 4px 8px;
  border-radius: 999px;
  color: #0b3ba6;
  font-weight: 800;
}

.caret {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

/* dropdown */
.multi-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 360px;
  max-width: calc(100vw - 48px);
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(11, 17, 32, 0.06);
  box-shadow: 0 18px 48px rgba(11, 17, 32, 0.12);
  padding: 12px;
  z-index: 30;
}

/* dropdown actions */
.multi-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.multi-actions .input {
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(11, 17, 32, 0.06);
}

/* preset list */
.preset-list {
  max-height: 180px;
  overflow: auto;
  padding: 6px 2px;
  border-radius: 8px;
}

.preset-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
}

.preset-row:hover {
  background: rgba(2, 6, 23, 0.02);
}

.preset-row input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

/* dropdown footer */
.dropdown-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

/* inputs */
.input,
.select {
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(11, 17, 32, 0.06);
  background: linear-gradient(180deg, #fff, #fbfdff);
  font-weight: 600;
}

.select {
  max-width: 260px;
}

/* info column replacing removed add/input */
.info-col {
  color: #6b7280;
  font-weight: 600;
}

/* chips */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.chip {
  padding: 8px 12px;
  background: linear-gradient(180deg, #f1f7ff, #fbfdff);
  border-radius: 999px;
  font-weight: 700;
  color: #06307a;
  box-shadow: 0 8px 24px rgba(3, 19, 77, 0.04);
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.chip-remove {
  background: transparent;
  border: none;
  font-weight: 800;
  font-size: 14px;
  color: #06307a;
  cursor: pointer;
}

/* rest of beautiful styles retained (table, tabs, fab etc.) */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.tab {
  background: transparent;
  border-radius: 10px;
  padding: 8px 14px;
  border: 1px solid transparent;
  font-weight: 800;
  cursor: pointer;
  color: #334155;
}

.tab.active {
  background: linear-gradient(180deg, #fff, #eef6ff);
  border: 1px solid rgba(8, 48, 110, 0.08);
  box-shadow: 0 10px 30px rgba(3, 19, 77, 0.06);
  color: #0b3ba6;
}

.table-wrap {
  overflow: auto;
  border-radius: 10px;
}

table.modern {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

table.modern thead th {
  text-align: left;
  padding: 12px 14px;
  font-size: 12px;
  color: #475569;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(2, 6, 23, 0.04);
}

table.modern tbody td {
  padding: 12px 14px;
  vertical-align: middle;
  border-bottom: 1px dashed rgba(2, 6, 23, 0.03);
}

.role {
  font-weight: 800;
  color: #0b1220;
  width: 160px;
}

.member-col .member-control {
  display: flex;
  gap: 10px;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(180deg, #e6f0ff, #dbeeff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #063069;
  box-shadow: 0 8px 24px rgba(3, 19, 77, 0.04);
}

.member-inputs .input {
  padding: 8px 10px;
  min-width: 220px;
}

.loc {
  color: #0b1220;
  font-weight: 700;
  max-width: 160px;
}

.actions-col {
  text-align: right;
}

.empty {
  text-align: center;
  padding: 24px 0;
  color: #6b7280;
}

.msg {
  margin-top: 10px;
  font-weight: 700;
}

.msg.ok {
  color: #0b8a4a;
}

.msg.err {
  color: #b82a2a;
}

.tiny {
  font-size: 0.85rem;
  color: #6b7280;
}

.spinner {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: rgba(255, 255, 255, 0.9);
  animation: spin .9s linear infinite;
}

.small.spinner {
  border-color: rgba(255, 255, 255, 0.35);
  border-top-color: rgba(255, 255, 255, 0.9);
  width: 12px;
  height: 12px;
}

.btn-danger {
  background: transparent;
  color: #b82a2a;
  border: 1px solid rgba(184, 42, 42, 0.06);
  padding: 8px 12px;
  border-radius: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .table-wrap {
    overflow: visible;
  }

  table.modern {
    min-width: 640px;
  }
}

@media (max-width: 575px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .actions {
    width: 100%;
    justify-content: flex-end;
  }

  .input-row {
    flex-direction: column;
    align-items: stretch;
  }

  .select {
    max-width: 100%;
  }
}
</style>
