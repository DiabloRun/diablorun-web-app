<template>
  <v-form
    v-if="!loading"
    :disabled="start_time || !canEdit"
    class="race-editor"
  >
    <v-container class="mt-5">
      <v-row no-gutters class="mb-5">
        <v-col>
          <h2 v-if="!token">
            <v-icon left>mdi-flag-plus</v-icon>
            Build a new race
          </h2>
          <h2 v-if="token">
            <v-icon left>mdi-flag</v-icon>
            Edit race
          </h2>
          <!--
                <RaceCountdown
                  v-if="token && !start_time"
                  ref="countdown"
                  :start="start_time"
                  :finish="finish_time"
                />
                -->
        </v-col>
        <v-col cols="auto" class="my-auto">
          <!--
                <v-btn
                  v-if="token && !start_time && canHost"
                  @click="startCountdown()"
                >
                  <v-icon left color="primary">mdi-timer-10</v-icon>
                  Start the race
                </v-btn>
                -->
          <v-btn v-if="canEdit && dirty" @click="save()">
            <v-icon left>mdi-content-save-alert</v-icon>
            Save changes
          </v-btn>
          <v-btn v-if="canEdit && !dirty" @click="save()" disabled>
            <v-icon left>mdi-content-save-outline</v-icon>
            Race saved
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-row no-gutters>
              <v-col cols="12" md="6" lg="8" xl="9" class="px-3">
                <v-row no-gutters>
                  <v-col cols="12" class="mb-4">
                    <v-select
                      class="mt-4"
                      :menu-props="{ bottom: true, offsetY: true }"
                      dense
                      hide-details
                      v-model="form.type"
                      :items="raceTypes"
                      label="Race type"
                      outlined
                    />
                  </v-col>
                  <v-col cols="12" class="mb-4">
                    <v-text-field
                      v-model="form.name"
                      outlined
                      label="Name of the race"
                      required
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="mb-4">
                    <v-textarea
                      v-model="form.description"
                      outlined
                      label="Description"
                      required
                      hide-details
                      rows="3"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" class="mb-3">
                    <v-text-field
                      v-if="leaderboard_url"
                      :value="leaderboard_url"
                      outlined
                      label="Link"
                      required
                      hide-details
                      readonly
                    ></v-text-field>
                    <v-text-field
                      v-if="!leaderboard_url"
                      value="Generated after saving"
                      outlined
                      label="Link"
                      required
                      hide-details
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-divider vertical class="hidden-sm-and-down" />
              <v-col>
                <v-divider class="hidden-md-and-up" />
                <v-container>
                  <h5>Qualification</h5>
                  <!--
                  <v-checkbox
                    v-model="form.entry_new_character"
                    label="Must start with a new hero"
                    hide-details
                  ></v-checkbox>
                  -->
                  <v-checkbox
                    v-model="form.entry_classic"
                    label="Classic"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    v-model="form.entry_hc"
                    label="Hardcore"
                    color="error"
                    hide-details
                  ></v-checkbox>
                  <v-select
                    class="mt-4"
                    :menu-props="{ bottom: true, offsetY: true }"
                    dense
                    hide-details
                    v-model="form.entry_players"
                    :items="playersSettings"
                    label="Players set to"
                    outlined
                  >
                  </v-select>
                </v-container>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col md="auto">
                <v-divider class="hidden-md-and-up" />
                <v-container>
                  <h5>Allowed heroes</h5>
                  <v-checkbox
                    v-model="form[hero.input]"
                    hide-details
                    v-for="hero of heroes"
                    :key="hero.id"
                    :label="hero.name"
                  >
                  </v-checkbox>
                </v-container>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-container>
              <v-card-title class="pl-0 pt-0"> Point systems </v-card-title>
              <v-form v-for="(point, index) of form.points" :key="index">
                <v-card hover class="pa-1 mb-3">
                  <v-row no-gutters>
                    <!-- Remove -->
                    <v-col cols="auto" class="pr-1">
                      <v-btn icon @click="removePoint(index)">
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                    <!-- Amount of points -->
                    <v-col class="pr-1">
                      <v-text-field
                        v-model="point.amount"
                        label="Points"
                        dense
                        outlined
                        required
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <!-- Point type -->
                    <v-col class="pr-1">
                      <v-select
                        v-model="point.type"
                        :items="pointTypes"
                        :menu-props="{ bottom: true, offsetY: true }"
                        dense
                        outlined
                        required
                        hide-details
                        label="Type"
                      ></v-select>
                    </v-col>
                    <!-- Amount per/for stat counter -->
                    <v-col
                      v-if="point.type === 'per' || point.type === 'for'"
                      class="pr-1"
                    >
                      <v-text-field
                        v-model="point.counter"
                        dense
                        outlined
                        :label="point.type"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <!-- Stat -->
                    <v-col
                      v-if="point.type === 'per' || point.type === 'for'"
                      class="pr-1"
                    >
                      <v-select
                        v-model="point.stat"
                        :items="stats"
                        :menu-props="{ bottom: true, offsetY: true }"
                        item-text="name"
                        item-value="id"
                        dense
                        outlined
                        hide-details
                        label="Stat"
                      ></v-select>
                    </v-col>
                    <!-- Difficulty if quest type -->
                    <v-col v-if="point.type === 'quest'" class="pr-1">
                      <v-select
                        v-model="point.difficulty"
                        :items="difficulties"
                        :menu-props="{ bottom: true, offsetY: true }"
                        dense
                        outlined
                        hide-details
                        label="Difficulty"
                      />
                    </v-col>
                    <!-- Difficulty if quest type -->
                    <v-col v-if="point.type === 'quest'" class="pr-1">
                      <v-select
                        v-model="point.quest_id"
                        :items="questOptions"
                        :menu-props="{ bottom: true, offsetY: true }"
                        dense
                        outlined
                        hide-details
                        label="Quest"
                      />
                    </v-col>
                    <!-- Time type -->
                    <v-col class="pr-1">
                      <v-select
                        v-model="point.time_type"
                        :items="pointTimeTypes"
                        :menu-props="{ bottom: true, offsetY: true }"
                        dense
                        outlined
                        hide-details
                        label="Claiming"
                      ></v-select>
                    </v-col>
                    <!-- Set time for "in under" -->
                    <v-col v-if="point.time_type === 'in_under'">
                      <v-text-field
                        v-model="point.time"
                        dense
                        outlined
                        label="in under"
                        placeholder="eg: 1d 2h 30m 50s"
                        hide-details
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-form>
              <v-btn small @click="addPoint()">
                <v-icon left>mdi-plus</v-icon>
                Add
              </v-btn>
            </v-container>
            <v-divider></v-divider>
            <!-- Finish conditions -->
            <v-container>
              <v-card-title class="pl-0 pt-0"> Finish conditions </v-card-title>
              <v-form
                v-for="(condition, index) of form.finish_conditions"
                :key="index"
              >
                <v-card hover class="pa-1 mb-3">
                  <v-row no-gutters>
                    <!-- Remove -->
                    <v-col cols="auto" class="pr-1">
                      <v-btn icon @click="removeFinishCondition(index)">
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                    <!-- Condition type -->
                    <v-col class="pr-1">
                      <v-select
                        v-model="condition.type"
                        :items="finishConditionTypes"
                        :menu-props="{ bottom: true, offsetY: true }"
                        dense
                        outlined
                        required
                        hide-details
                        label="Type"
                      ></v-select>
                    </v-col>

                    <!-- Duration and counting start time if time type -->
                    <v-col class="pr-1" v-if="condition.type === 'time'">
                      <v-text-field
                        v-model="condition.time"
                        dense
                        outlined
                        label="duration"
                        placeholder="eg: 1d 2h 30m 50s"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="pr-1" v-if="condition.type === 'time'">
                      <v-select
                        v-model="condition.time_type"
                        :items="finishConditionTimeTypes"
                        :menu-props="{ bottom: true, offsetY: true }"
                        dense
                        outlined
                        hide-details
                        label="Counting time from"
                      ></v-select>
                    </v-col>

                    <!-- Amount and stat if stat type -->
                    <v-col v-if="condition.type === 'stat'" class="pr-1">
                      <v-text-field
                        v-model="condition.counter"
                        dense
                        outlined
                        label="Amount"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col v-if="condition.type === 'stat'" class="pr-1">
                      <v-select
                        v-model="condition.stat"
                        :items="stats"
                        :menu-props="{ bottom: true, offsetY: true }"
                        item-text="name"
                        item-value="id"
                        dense
                        outlined
                        hide-details
                        label="Stat"
                      ></v-select>
                    </v-col>

                    <!-- Difficulty and quest if quest type -->
                    <v-col v-if="condition.type === 'quest'" class="pr-1">
                      <v-select
                        v-model="condition.difficulty"
                        :items="difficulties"
                        :menu-props="{ bottom: true, offsetY: true }"
                        dense
                        outlined
                        hide-details
                        label="Difficulty"
                      />
                    </v-col>
                    <v-col v-if="condition.type === 'quest'">
                      <v-select
                        v-model="condition.quest_id"
                        :items="questOptions"
                        :menu-props="{ bottom: true, offsetY: true }"
                        dense
                        outlined
                        hide-details
                        label="Quest"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-form>

              <!--
              <div class="box">
                <div class="field">
                  <label class="checkbox">
                    <input
                      type="checkbox"
                      v-model="form.finish_conditions_global"
                    />
                    Finish conditions are global
                  </label>
                </div>
              </div>
              -->

              <v-btn small @click="addFinishCondition()">
                <v-icon left>mdi-plus</v-icon>
                Add
              </v-btn>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { mapState } from 'vuex';
// import RaceCountdown from '@/components/RaceCountdown.vue';
// import DateTimeInput from '@/components/DateTimeInput.vue';
import { heroes, quests, stats } from '@diablorun/diablorun-data';

export default {
  name: 'Race Editor',
  components: {
    // RaceCountdown
    // DateTimeInput
  },
  data() {
    const statsList = Object.keys(stats).map(id => ({
      id,
      name: stats[id]
    }));

    // Generate quest options with act dividers
    const questsList = Object.keys(quests).map(id => ({
      ...quests[id],
      value: Number(id),
      text: quests[id].short_name
    }));

    questsList.sort((a, b) => a.order - b.order);

    const questOptions = [
      { header: 'Act I', divider: true },
      ...questsList.filter(q => q.act === 1),
      { header: 'Act II', divider: true },
      ...questsList.filter(q => q.act === 2),
      { header: 'Act III', divider: true },
      ...questsList.filter(q => q.act === 3),
      { header: 'Act IV', divider: true },
      ...questsList.filter(q => q.act === 4),
      { header: 'Act V', divider: true },
      ...questsList.filter(q => q.act === 5)
    ];

    return {
      // Static data
      raceTypes: [
        {
          text: 'Speedrun (earliest to finish condition wins)',
          value: 'speedrun'
        },
        { text: 'Points chase (most points wins)', value: 'points_chase' }
      ],
      playersSettings: [
        { text: 'X', value: 'px' },
        { text: '1', value: 'p1' },
        { text: '8', value: 'p8' }
      ],
      pointTypes: [
        { text: 'For completing', value: 'quest' },
        { text: 'Per', value: 'per' },
        { text: 'For', value: 'for' }
      ],
      pointTimeTypes: [
        { text: 'by latest state', value: 'state' },
        { text: 'by max value', value: 'max' },
        { text: 'in under', value: 'in_under' },
        { text: 'for first claimed', value: 'first' }
      ],
      finishConditionTypes: [
        { text: 'After quest', value: 'quest' },
        { text: 'When stat reached', value: 'stat' },
        { text: 'After time', value: 'time' }
      ],
      finishConditionTimeTypes: [
        { text: 'from race start', value: 'race' },
        { text: 'from character creation', value: 'character' }
      ],
      heroes: heroes.map(hero => ({ ...hero, input: `entry_${hero.id}` })),
      questOptions,
      stats: statsList,
      difficulties: [
        { value: 'normal', text: 'Normal' },
        { value: 'nightmare', text: 'Nightmare' },
        { value: 'hell', text: 'Hell' }
      ],
      // Form
      form: {
        type: 'speedrun',
        name: '',
        slug: '',
        description: '',
        entry_new_character: true,
        entry_ama: true,
        entry_sor: true,
        entry_nec: true,
        entry_pal: true,
        entry_bar: true,
        entry_dru: true,
        entry_asn: true,
        entry_classic: false,
        entry_hc: false,
        entry_players: 'px',
        finish_conditions_global: false,
        points: [],
        finish_conditions: [
          {
            context: 'finish_conditions',
            type: 'quest',
            difficulty: 'normal',
            quest_id: 80,
            stat: '',
            time_type: 'character',
            time: ''
          }
        ],
        estimated_start_time: 0
      },
      dirty: false,
      loading: true,
      saving: false,
      // Generated values
      token: '',
      leaderboard_url: '',
      editor_token: '',
      // Countdown
      start_time: null,
      finish_time: null
    };
  },
  computed: {
    ...mapState({
      canEdit: state => {
        return !!state.auth.user && state.auth.user.patreon_amount_cents > 0;
      },
      canHost: state => {
        return (
          !!state.auth.user && state.auth.user.patreon_amount_cents >= 1000
        );
      }
    })
  },
  async mounted() {
    const { editor_token } = this.$route.params;

    if (editor_token === 'new') {
      this.dirty = true;
      this.loading = false;
      return;
    }

    const res = await fetch(
      `${process.env.VUE_APP_API_URL}/races/editor?editor_token=${editor_token}`
    );
    const { race, rules } = await res.json();

    this.form = {
      type: race.type,
      name: race.name,
      slug: race.slug,
      description: race.description,
      entry_new_character: race.entry_new_character,
      entry_ama: race.entry_ama,
      entry_sor: race.entry_sor,
      entry_nec: race.entry_nec,
      entry_pal: race.entry_pal,
      entry_bar: race.entry_bar,
      entry_dru: race.entry_dru,
      entry_asn: race.entry_asn,
      entry_classic: race.entry_classic,
      entry_hc: race.entry_hc,
      entry_players: race.entry_players,
      finish_conditions_global: race.finish_conditions_global,
      points: rules.filter(rule => rule.context === 'points'),
      finish_conditions: rules.filter(
        rule => rule.context === 'finish_conditions'
      ),
      estimated_start_time: race.estimated_start_time
    };

    this.token = race.token;
    this.editor_token = editor_token;
    this.leaderboard_url = `${process.env.VUE_APP_WEB_URL}/race/${race.slug}${race.id}`;
    this.start_time = race.start_time;
    this.finish_time = race.finish_time;

    setTimeout(() => {
      this.dirty = false;
      this.loading = false;
    });
  },
  methods: {
    addPoint() {
      this.form.points.push({
        context: 'points',
        type: 'quest',
        stat: '',
        difficulty: 'normal',
        quest_id: '',
        time_type: 'state',
        time: ''
      });
    },

    removePoint(index) {
      this.form.points.splice(index, 1);
    },

    addFinishCondition() {
      this.form.finish_conditions.push({
        context: 'finish_conditions',
        type: 'quest',
        stat: '',
        difficulty: 'normal',
        quest_id: '',
        time_type: 'race',
        time: ''
      });
    },

    removeFinishCondition(index) {
      this.form.finish_conditions.splice(index, 1);
    },

    async save(update_rules = true) {
      this.saving = true;

      try {
        const rules = this.getRules();

        const res = await fetch(`${process.env.VUE_APP_API_URL}/races`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...this.form,
            update_rules,
            rules,
            editor_token: this.editor_token,
            start_time: this.start_time,
            finish_time: this.finish_time,
            start_in: this.start_time
              ? this.start_time - Math.floor(new Date() / 1000)
              : undefined
          })
        });

        const body = await res.json();

        console.log(body);

        if (this.editor_token !== body.editor_token) {
          this.token = body.token;
          this.editor_token = body.editor_token;
          this.leaderboard_url = `${process.env.VUE_APP_WEB_URL}/race/${body.slug}${body.id}`;

          this.$router.push({
            name: 'Race Editor',
            params: {
              editor_token: body.editor_token
            }
          });
        }
      } catch (err) {
        alert(err);
      }

      this.dirty = false;
      this.saving = false;
    },

    async startCountdown() {
      this.start_time = Math.floor(new Date() / 1000) + 10;

      const raceTimeConditions = this.form.finish_conditions.filter(
        ({ type, time_type }) => type === 'time' && time_type === 'race'
      );

      if (!raceTimeConditions.length) {
        this.finish_time = null;
      } else {
        this.finish_time =
          this.start_time +
          Math.min(
            ...raceTimeConditions.map(({ time_seconds }) => time_seconds)
          );
      }

      await this.save(false);
    },

    getRules() {
      const rules = [...this.form.points, ...this.form.finish_conditions];

      for (const rule of rules) {
        if (rule.type === 'time' || rule.time_type === 'in_under') {
          const match = rule.time
            .trim()
            .match(/^((\d+)d)?\s*((\d+)h)?\s*((\d+)m)?\s*((\d+)s)?$/);

          if (!match) {
            throw `Unable to parse time "${rule.time}"`;
          }

          rule.time_seconds = 0;

          if (match[2]) {
            rule.time_seconds += 86400 * parseInt(match[2]);
          }

          if (match[4]) {
            rule.time_seconds += 3600 * parseInt(match[4]);
          }

          if (match[6]) {
            rule.time_seconds += 60 * parseInt(match[6]);
          }

          if (match[8]) {
            rule.time_seconds += parseInt(match[8]);
          }
        }
      }

      return rules;
    }
  },
  watch: {
    form: {
      handler() {
        this.dirty = true;
      },
      deep: true
    }
  }
};
</script>
