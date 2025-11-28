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

            <!-- MULTI-SELECT DROPDOWN -->
            <div class="row input-row" ref="multiWrapRef">
              <div class="multi-col">
                <button class="multi-trigger" @click="toggleDropdown" :aria-expanded="dropdownOpen"
                  ref="multiTriggerRef">
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

                <!-- TELEPORT: dropdown rendered into <body> to avoid clipping -->
                <teleport to="body">
                  <div v-if="dropdownOpen" class="multi-dropdown portal-dropdown" :style="dropdownStyle" @click.stop
                    role="dialog" aria-modal="false">
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
                    </div>
                  </div>
                </teleport>
                <!-- /TELEPORT -->
              </div>

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

          <!-- Configure Your Teams -->
          <section class="card   p-4" :class="{ 'disabled-section': !teamsEnabled }">
            <div class="section-head ">

              <div class="d-flex justify-content-between ">
                <h2>Configure Your Teams</h2>
                <button class="btn btn-add" @click="addEmptyRow" title="Add team row">
                  <svg viewBox="0 0 24 24" class="add-icon" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14M5 12h14" stroke="white" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </button>
              </div>
              <!-- <p class="muted">Add teams to assign to team members.</p> -->




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
                        <th>Reset</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="(row, rIdx) in safeCurrentTeam.rows" :key="row.id">
                        <td class="role">{{ row.role }}</td>

                        <!-- Assign member -->
                        <td class="member-col">
                          <div class="member-control">
                            <div class="avatar" v-if="row.member" :title="row.member" aria-hidden="false">
                              <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                                xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                                  fill="currentColor" opacity="0.9" />
                                <path d="M3 20c0-3.866 3.582-7 9-7s9 3.134 9 7v1H3v-1z" fill="currentColor"
                                  opacity="0.9" />
                              </svg>
                            </div>

                            <div class="member-inputs">
                              <select class="select" v-model="row.assign"
                                @change="onMemberInput(activeTab, rIdx, row.assign)" aria-label="Assign member">
                                <option value="" disabled>Select member</option>
                                <option v-for="m in membersStatic" :key="m.name" :value="m.name">
                                  {{ m.name }}
                                </option>
                              </select>

                              <div v-if="row.email" class="muted tiny">{{ row.email }}</div>
                            </div>
                          </div>
                        </td>

                        <!-- Backup -->
                        <td>
                          <select class="select" v-model="row.backup" aria-label="backup">
                            <option value="" disabled>Select location</option>
                            <option v-for="back in backup" :key="back" :value="back">{{ back }}</option>
                          </select>
                        </td>

                        <!-- Location select -->
                        <td>
                          <select class="select" v-model="row.location" aria-label="Location">
                            <option value="" disabled>Select location</option>
                            <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
                          </select>
                        </td>

                        <td class="">
                          <button class="btn btn-danger outline" @click="clearTeamRow(activeTab, rIdx)"
                            title="Clear row">
                            Clear
                          </button>
                        </td>
                      </tr>

                      <tr v-if="!safeCurrentTeam.rows.length">
                        <td colspan="5" class="empty">No members configured for this team.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p v-if="teamMessage" :class="['msg', teamMessageType === 'success' ? 'ok' : 'err']">{{ teamMessage }}
                </p>
              </div>
            </div>
            <div class="actions">
              <button class="btn btn-primary" @click="saveLocations" :disabled="saving" title="Save locations">
                <span v-if="saving" class="spinner" aria-hidden="true"></span>
                Save
              </button>

              <button v-if="showThreatCTA" class="btn btn-success" @click="goToThreatProfile"
                title="Go to Threat Profile">
                Go to Threat Profile
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, onBeforeUnmount, nextTick } from "vue";
import { useRouter } from "vue-router";
import type { Ref } from "vue";

/* Types */
type Member = { name: string; email?: string };
type TeamRowStatic = {
  id: string;
  role: string;
  member: string;
  assign: string;
  email: string;
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
    const router = useRouter();

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

    // Dropdown positioning (teleported)
    const dropdownStyle = ref<Record<string, string>>({});

    // Refs to measure the trigger
    const multiWrapRef: Ref<HTMLElement | null> = ref(null);
    const multiTriggerRef: Ref<HTMLElement | null> = ref(null);

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
          {
            id: uid("r-"),
            role: "Owner",
            member: "Amit Sharma",
            assign: "Amit Sharma",
            email: "amit@example.com",
            backup: "Sara Khan",
            location: "New York"
          },
          {
            id: uid("r-"),
            role: "Analyst",
            member: "Diego Lopez",
            assign: "Diego Lopez",
            email: "diego@example.com",
            backup: "Lina Park",
            location: "Bengaluru"
          }
        ]
      },
      {
        id: uid("t-2"),
        name: "Team 2",
        rows: [
          {
            id: uid("r-"),
            role: "Manager",
            member: "Sara Khan",
            assign: "Sara Khan",
            email: "sara@example.com",
            backup: "Amit Sharma",
            location: "London"
          },
          {
            id: uid("r-"),
            role: "Operator",
            member: "Lina Park",
            assign: "Lina Park",
            email: "lina@example.com",
            backup: "Diego Lopez",
            location: "Sydney"
          }
        ]
      },
      {
        id: uid("t-3"),
        name: "Team 3",
        rows: [
          {
            id: uid("r-"),
            role: "Admin",
            member: "Diego Lopez",
            assign: "Diego Lopez",
            email: "diego@example.com",
            backup: "Sara Khan",
            location: "New York"
          }
        ]
      }
    ]);

    const membersStatic = ref<Member[]>([
      { name: "Amit Sharma", email: "amit@example.com" },
      { name: "Diego Lopez", email: "diego@example.com" },
      { name: "Sara Khan", email: "sara@example.com" },
      { name: "Lina Park", email: "lina@example.com" }
    ]);

    const backup = computed(() => membersStatic.value.map((m) => m.name));

    // SAFE computed values
    const safeCurrentTab = computed(() => {
      return teamTabs.value[activeTab.value] ?? teamTabs.value[0] ?? { key: "team-fallback", label: "" };
    });

    const safeCurrentTeam = computed<TeamStatic>(() => {
      return teams.value[activeTab.value] ?? teams.value[0] ?? { id: "t-fallback", name: "Team", rows: [] };
    });

    const teamMessage = ref("");
    const teamMessageType = ref<"success" | "error">("success");

    // CTA flag shown after save
    const showThreatCTA = ref(false);

    // teamsEnabled computed (true when we have at least one location)
    const teamsEnabled = computed(() => locations.value.length > 0);

    // load locations
    function loadFromStorage() {
      try {
        const raw = localStorage.getItem("tmp_locations_v2");
        if (raw === null) {
          locations.value = [];
          return;
        }
        const parsed = JSON.parse(raw);
        locations.value = Array.isArray(parsed) ? parsed : [];
      } catch {
        locations.value = [];
      }
    }

    onMounted(() => {
      try {
        localStorage.removeItem("tmp_locations_v2");
      } catch { }
      loadFromStorage();
      document.addEventListener("click", handleDocClick, true); // capture phase to reliably detect outside clicks
      window.addEventListener("resize", repositionDropdown);
      window.addEventListener("scroll", repositionDropdown, true);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleDocClick, true);
      window.removeEventListener("resize", repositionDropdown);
      window.removeEventListener("scroll", repositionDropdown, true);
    });

    // click outside dropdown -> close (works with teleported dropdown)
    function handleDocClick(e: MouseEvent) {
      const target = e.target as Node;
      const wrap = multiWrapRef.value;
      if (wrap && wrap.contains(target)) return; // click inside original wrapper
      const portal = document.querySelector<HTMLElement>(".portal-dropdown");
      if (portal && portal.contains(target)) return; // click inside teleported dropdown
      // else clicked outside both: close
      dropdownOpen.value = false;
    }

    // reposition helper
    function repositionDropdown() {
      if (!dropdownOpen.value) return;
      // recompute coords
      computeDropdownPosition();
    }

    async function toggleDropdown() {
      dropdownOpen.value = !dropdownOpen.value;

      if (dropdownOpen.value) {
        await nextTick();
        computeDropdownPosition();
        // focus input inside teleported dropdown after it is rendered
        await nextTick();
        const portalInput = document.querySelector<HTMLInputElement>(".portal-dropdown .input");
        portalInput?.focus();
      } else {
        dropdownStyle.value = {};
      }
    }

    function closeDropdown() {
      dropdownOpen.value = false;
      dropdownStyle.value = {};
    }

    function computeDropdownPosition() {
      const trigger = multiTriggerRef.value ?? multiWrapRef.value?.querySelector<HTMLElement>(".multi-trigger");
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;

      // Default width for dropdown - you can tweak; keep it bounded to viewport
      const preferredWidth = 380;
      const maxWidth = Math.min(preferredWidth, document.documentElement.clientWidth - 24);

      // Position below the trigger. If there's not enough space at bottom, place above.
      const gap = 8;
      const dropdownHeightEstimate = 280; // rough estimate; OK for positioning
      const spaceBelow = window.innerHeight - rect.bottom;
      const placeAbove = spaceBelow < dropdownHeightEstimate && rect.top > dropdownHeightEstimate;

      const top = placeAbove ? rect.top + scrollY - dropdownHeightEstimate - gap : rect.bottom + scrollY + gap;

      // ensure the dropdown doesn't overflow to the right
      let left = rect.left + scrollX;
      if (left + maxWidth > window.innerWidth + scrollX - 12) {
        left = Math.max(12 + scrollX, window.innerWidth + scrollX - maxWidth - 12);
      }

      dropdownStyle.value = {
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        width: `${maxWidth}px`,
        zIndex: "200000",
      };
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

        // show the CTA button after successful save
        showThreatCTA.value = true;

        setTimeout(() => (locMessage.value = ""), 2000);
      }, 600);
    }

    function loadDefaults() {
      locations.value = ["New York", "London", "Bengaluru", "Sydney"];
      locMessageType.value = "success";
      locMessage.value = "Default locations loaded (not saved).";
      setTimeout(() => (locMessage.value = ""), 2000);
    }

    // clear row (reset fields but keep row)
    function clearTeamRow(teamIndex: number, rowIndex: number) {
      const team = teams.value[teamIndex];
      if (!team) return;
      const row = team.rows[rowIndex];
      if (!row) return;

      // Reset requested fields (keep role and id)
      row.member = "";
      row.assign = "";
      row.email = "";
      row.backup = "";
      row.location = "";

      // Optionally clear dropdown selection to avoid accidental reuse
      selectedPresets.value = [];
      dropdownCustom.value = "";
      dropdownOpen.value = false;

      teamMessageType.value = "success";
      teamMessage.value = `Row reset for ${teamTabs.value[teamIndex]?.label ?? "Team"}.`;
      setTimeout(() => (teamMessage.value = ""), 1600);
    }

    // team row handling
    function addEmptyRow() {
      const t = teams.value[activeTab.value];
      if (!t) return;
      t.rows.push({
        id: uid("r-"),
        role: "New role",
        member: "",
        assign: "",
        email: "",
        backup: "",
        location: locations.value[0] ?? ""
      });
    }

    // utilities for members (defensive)
    function membersListForRow(row: TeamRowStatic, opts?: { exclude?: string }): Member[] {
      const excludeName = opts?.exclude ?? "";
      const all: Member[] = [...membersStatic.value];

      if (row.member && !all.some((m) => m.name === row.member)) {
        all.push({ name: row.member, email: row.email });
      }
      if (row.backup && !all.some((m) => m.name === row.backup)) {
        all.push({ name: row.backup });
      }

      return all.filter((m) => m && m.name && m.name !== excludeName);
    }

    // when assign selection changes, keep member & email in sync (optional)
    function onMemberInput(teamIndex: number, rowIndex: number, value: string) {
      const team = teams.value[teamIndex];
      if (!team) return;
      const row = team.rows[rowIndex];
      if (!row) return;
      row.assign = value;
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

    // CTA navigation
    function goToThreatProfile() {
      router.push("/threat-profile").catch(() => { });
    }

    // helper for initials
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
      multiTriggerRef,
      addingSelected,
      dropdownStyle,
      // teams
      teamTabs,
      activeTab,
      teams,
      safeCurrentTab,
      safeCurrentTeam,
      clearTeamRow,
      addEmptyRow,
      teamMessage,
      teamMessageType,
      // members
      membersStatic,
      membersListForRow,
      onMemberInput,
      onBackupInput,
      initials,
      // backup array for template
      backup,
      // CTA
      showThreatCTA,
      goToThreatProfile,
      // teamsEnabled
      teamsEnabled
    };
  }
});
</script>

<style scoped>
/* ---------- Styles (kept polished) ---------- */
.locations-teams-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f6f9fc 0%, #eef6ff 100%);
  padding: 48px 20px;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: #081226;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* container */
.container.shell {
  max-width: 1180px;
  margin: 0 auto;
  position: relative;
}

/* topbar */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
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
  box-shadow: 0 8px 26px rgba(11, 59, 209, 0.12);
  font-family: Inter, sans-serif;
}

.brand-text h1 {
  margin: 0;
  font-size: 1.05rem;
  color: #06307a;
  font-weight: 800;
  letter-spacing: -0.2px;
}

.muted {
  color: #6b7280;
  font-size: 0.92rem;
}

/* outer card - neutral container */
.card {
  background: transparent;
  border-radius: 14px;
  box-shadow: none;
  border: none;
  padding: 0;
}

/* CARD-INNER: stacked layout - one column so boxes are up & down */
.card-inner {
  display: grid;
  grid-template-columns: 1fr;
  /* single column = stacked */
  gap: 20px;
  padding: 6px;
}

/* each box becomes a full-width card */
.card-inner>.section,
.card-inner>section.card.p-4 {
  background: linear-gradient(180deg, #ffffff, #fbfdff);
  border-radius: 14px;
  padding: 22px;
  border: 1px solid rgba(11, 17, 32, 0.06);
  box-shadow: 0 12px 40px rgba(9, 30, 66, 0.06);
  transition: transform 180ms ease, box-shadow 180ms ease;
}

/* subtle hover lift for desktop */
.card-inner>.section:hover,
.card-inner>section.card.p-4:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 60px rgba(9, 30, 66, 0.08);
}

/* make headings clearer inside each box */
.section-head h2 {
  margin: 0 0 6px;
  font-size: 1.05rem;
  color: #08204b;
  letter-spacing: -0.2px;
  font-weight: 700;
}

.section-head .muted {
  margin: 0;
  font-size: 0.9rem;
}

/* layout inside the boxes: keep spacing tidy */
.row.input-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  position: relative;
  flex-wrap: wrap;
}

/* Multi-select refined */
.multi-trigger {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(11, 17, 32, 0.06);
  background: linear-gradient(180deg, #fff, #fbfdff);
  cursor: pointer;
  font-weight: 800;
  min-width: 240px;
  justify-content: space-between;
  color: #053070;
  transition: box-shadow 160ms ease, transform 160ms ease;
  box-shadow: 0 6px 18px rgba(8, 24, 56, 0.04);
}

.multi-trigger:focus,
.multi-trigger:hover {
  box-shadow: 0 10px 28px rgba(8, 24, 56, 0.06);
  transform: translateY(-1px);
}

.multi-count {
  background: #eef4ff;
  padding: 5px 9px;
  border-radius: 999px;
  color: #0b3ba6;
  font-weight: 900;
  font-size: 0.9rem;
}

.caret {
  width: 14px;
  height: 14px;
  opacity: 0.8;
}

/* dropdown (teleported) */
.multi-dropdown {
  position: absolute;
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(11, 17, 32, 0.06);
  box-shadow: 0 22px 48px rgba(11, 17, 32, 0.12);
  padding: 12px;
  z-index: 200000;
  max-height: 400px;
  overflow: hidden;
}

/* small extra class that identifies teleported dropdown */
.portal-dropdown {
  overflow: auto;
}

/* animations */
@keyframes popIn {
  from {
    transform: translateY(-6px) scale(.995);
    opacity: 0;
  }

  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* internal dropdown layout */
.multi-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}

.multi-actions .input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(11, 17, 32, 0.06);
  background: linear-gradient(180deg, #fff, #fbfdff);
  font-weight: 700;
  transition: box-shadow .12s;
}

.multi-actions .input:focus {
  box-shadow: 0 8px 20px rgba(3, 19, 77, 0.06);
  outline: none;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(11, 17, 32, 0.04);
  cursor: pointer;
  font-weight: 800;
  font-size: 0.95rem;
}

/* small variant */
.btn.small {
  padding: 7px 10px;
  font-size: 0.87rem;
  border-radius: 9px;
}

/* success / primary */
.btn-success {
  background: linear-gradient(180deg, #00a86b, #008a56);
  color: white;
  border: none;
  box-shadow: 0 10px 28px rgba(0, 168, 107, 0.12);
}

.btn-primary {
  background: linear-gradient(180deg, #0b3ba6, #0554c9);
  color: white;
  border: none;
  box-shadow: 0 10px 28px rgba(6, 29, 99, 0.10);
}

.btn-ghost {
  background: transparent;
  color: #0b3ba6;
  border: 1px solid rgba(11, 17, 32, 0.04);
}

/* preset list */
.preset-list {
  max-height: 240px;
  overflow: auto;
  padding: 6px 2px;
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(240, 246, 255, 0.6), transparent);
}

.preset-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background .12s;
}

.preset-row:hover {
  background: rgba(8, 32, 80, 0.03);
}

/* chips */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.chip {
  padding: 8px 12px;
  background: linear-gradient(180deg, #f1f7ff, #fbfdff);
  border-radius: 999px;
  font-weight: 800;
  color: #06307a;
  box-shadow: 0 8px 20px rgba(3, 19, 77, 0.04);
  display: inline-flex;
  gap: 8px;
  align-items: center;
  border: 1px solid rgba(6, 48, 110, 0.04);
  transition: transform .12s;
}

.chip:hover {
  transform: translateY(-2px);
}

.chip-remove {
  background: rgba(6, 48, 110, 0.06);
  border: none;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 13px;
  color: #06307a;
  cursor: pointer;
}

/* info column */
.info-col {
  color: #6b7280;
  font-weight: 700;
  font-size: 0.9rem;
}

/* messages */
.msg {
  margin-top: 12px;
  font-weight: 800;
}

.msg.ok {
  color: #0a8b5f;
}

.msg.err {
  color: #d43f3f;
}

/* Tabs refined */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.tab {
  background: transparent;
  border-radius: 10px;
  padding: 8px 14px;
  border: 1px solid transparent;
  font-weight: 800;
  cursor: pointer;
  color: #334155;
  transition: background .12s, transform .12s;
}

.tab.active {
  background: linear-gradient(180deg, #ffffff, #eef6ff);
  border: 1px solid rgba(8, 48, 110, 0.08);
  box-shadow: 0 10px 30px rgba(3, 19, 77, 0.06);
  color: #0b3ba6;
  transform: translateY(-2px);
}

/* Table polish */
.table-wrap {
  overflow: auto;
  border-radius: 10px;
  margin-top: 10px;
}

table.modern {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
  background: transparent;
  font-weight: 700;
}

/* table header */
table.modern thead th {
  text-align: left;
  padding: 12px 14px;
  font-size: 0.9rem;
  color: #21324a;
  border-bottom: 1px solid rgba(8, 24, 64, 0.04);
  background: linear-gradient(180deg, rgba(250, 253, 255, 0.6), transparent);
}

/* rows */
table.modern tbody td {
  padding: 12px 14px;
  border-bottom: 1px dashed rgba(8, 24, 64, 0.03);
  vertical-align: middle;
  color: #0b1220;
  font-weight: 700;
}

/* role pill */
td.role {
  font-weight: 900;
  color: #0b3ba6;
}

/* member control */
.member-control {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: linear-gradient(180deg, #eef3ff, #e7f0ff);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0b3ba6;
  font-weight: 900;
  box-shadow: 0 8px 16px rgba(11, 59, 209, 0.06);
}

/* selects and inputs */
.input,
.select {
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(11, 17, 32, 0.06);
  background: linear-gradient(180deg, #fff, #fbfdff);
  font-weight: 700;
  color: #062046;
  min-width: 160px;
}

.select {
  max-width: 260px;
}

/* action buttons row */
.section .actions,
.card>.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

/* add button */
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
  box-shadow: 0 12px 30px rgba(232, 64, 64, 0.12);
  cursor: pointer;
}

/* disabled section dimming (teams disabled when no locations) */
.disabled-section {
  opacity: 0.55;
  pointer-events: none;
  user-select: none;
}

/* responsive tweaks */
@media (max-width: 900px) {
  table.modern {
    min-width: 640px;
  }
}

@media (max-width: 575px) {
  .card-inner {
    gap: 14px;
  }

  .multi-trigger {
    min-width: 180px;
  }

  .select {
    min-width: 120px;
  }
}

/* small helpers */
.empty {
  color: #6b7280;
  padding: 18px;
  font-weight: 700;
  text-align: center;
}

.spinner {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(90deg, #fff, #eef6ff);
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.06);
  display: inline-block;
}

.spinner.small {
  width: 10px;
  height: 10px;
}

/* subtle global transitions */
* {
  transition: color .12s ease, background .12s ease, box-shadow .12s ease;
}
</style>
