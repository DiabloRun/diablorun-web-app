<template>
  <div class="race-editor" v-if="!loading">
    <fieldset :disabled="start_time || !canEdit">
      <!-- Title -->
      <section class="hero is-dark is-bold">
        <div class="hero-body">
          <div class="container">
            <h1 class="title is-1">Race Editor</h1>
          </div>
        </div>
      </section>
      <!-- Can not edit message -->
      <section class="section" v-if="!canEdit">
        <div class="container">
          <div class="box">
            <p>
              The race editor is only available for diablo.run supporters on
              Patreon. Please
              <a href="https://www.patreon.com/diablorun">become a Patreon</a>
              and
              <router-link :to="{ name: 'Patreon' }"
                >link your Patreon account</router-link
              >
              to create and run races.
            </p>
          </div>
        </div>
      </section>
      <!-- Save -->
      <section class="section pb-0" v-if="canEdit">
        <div class="container">
          <div class="columns is-vcentered is-mobile">
            <div class="column">
              <button
                v-if="dirty"
                class="button is-small is-primary"
                :class="{ 'is-loading': saving }"
                @click="save()"
              >
                Save changes
              </button>
              <button v-if="!dirty" class="button is-small is-primary">
                No changes since saving
              </button>
            </div>
            <div class="column is-narrow">
              <p v-if="token && !start_time">
                <RaceCountdown
                  ref="countdown"
                  :start="start_time"
                  :finish="finish_time"
                />
              </p>
            </div>
            <div v-if="token && !start_time" class="column is-narrow">
              <button
                v-if="canHost"
                class="button is-small is-primary"
                @click="startCountdown()"
              >
                Start race countdown from 10s
              </button>
              <button v-if="!canHost" class="button is-small is-primary">
                Only Patreons can host races
              </button>
            </div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="box">
            <div class="columns">
              <div class="column">
                <div class="field">
                  <h1 class="subtitle mb-3">Name</h1>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="How would you like to call your race?"
                      v-model="form.name"
                    />
                  </div>
                </div>
                <div class="field">
                  <h1 class="subtitle mb-3 pt-3">Description</h1>
                  <div class="control">
                    <textarea
                      class="textarea"
                      placeholder="Describe the race"
                      v-model="form.description"
                    ></textarea>
                  </div>
                </div>
                <div class="field" v-if="canHost">
                  <h1 class="subtitle mb-3 pt-3">
                    Estimated start time
                  </h1>
                  <div class="control">
                    <DateTimeInput v-model="form.estimated_start_time" />
                  </div>
                </div>
                <div class="field">
                  <h1 class="subtitle mb-3 pt-3">
                    Allowed Players Setting
                  </h1>
                  <div class="control">
                    <div class="select">
                      <select v-model="form.entry_players">
                        <option value="p1">Players 1</option>
                        <option value="px">Players X</option>
                        <option value="p8">Players 8</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <h1 class="subtitle mb-3 pt-3">Token</h1>
                      <input
                        v-if="token"
                        readonly
                        class="input"
                        type="text"
                        placeholder="Token"
                        :value="'RACE_TOKEN=' + token"
                      />
                      <input
                        v-if="!token"
                        readonly
                        class="input"
                        type="text"
                        placeholder="Race token is generated after saving"
                      />
                    </div>
                  </div>
                  <div class="column">
                    <div class="field">
                      <h1 class="subtitle mb-3 pt-3">Race Page</h1>
                      <input
                        v-if="leaderboard_url"
                        readonly
                        class="input"
                        type="text"
                        placeholder="Token"
                        :value="leaderboard_url"
                      />
                      <input
                        v-if="!leaderboard_url"
                        readonly
                        class="input"
                        type="text"
                        placeholder="Race page link is generated after saving"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="column is-narrow">
                <h1 class="subtitle mb-3">Entry Conditions</h1>
                <div class="field">
                  <label class="checkbox">
                    <input type="checkbox" v-model="form.entry_new_character" />
                    Must make new character
                  </label>
                </div>
                <div class="field">
                  <label class="checkbox">
                    <input type="checkbox" v-model="form.entry_classic" />
                    Classic only
                  </label>
                </div>
                <div class="field">
                  <label class="checkbox">
                    <input type="checkbox" v-model="form.entry_hc" />
                    Hardcore only
                  </label>
                </div>
                <div class="field">
                  <h1 class="subtitle mb-3 pt-3">
                    Allowed Classes
                  </h1>
                  <p class="mb-3">Hold control to select multiple</p>
                  <div class="select is-multiple">
                    <select
                      multiple
                      :size="heroes.length"
                      v-model="form.entry_hero"
                    >
                      <option
                        v-for="hero of heroes"
                        :key="hero.id"
                        :value="hero.id"
                      >
                        {{ hero.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section pt-0">
        <div class="container">
          <!-- Points -->
          <div class="box">
            <h1 class="subtitle mb-3">Points</h1>
            <div
              class="field has-addons"
              v-for="(point, index) of form.points"
              :key="index"
            >
              <p class="control">
                <input
                  class="input is-small"
                  type="number"
                  v-model="point.amount"
                />
              </p>
              <p class="control">
                <span class="select is-small">
                  <select v-model="point.type">
                    <option value="quest">for completing</option>
                    <option value="per">per</option>
                    <option value="for">for reaching</option>
                  </select>
                </span>
              </p>
              <p
                class="control"
                v-if="point.type === 'per' || point.type === 'for'"
              >
                <input
                  class="input is-small"
                  type="number"
                  v-model="point.counter"
                />
              </p>
              <p
                class="control"
                v-if="point.type === 'per' || point.type === 'for'"
              >
                <span class="select is-small">
                  <select v-model="point.stat">
                    <option
                      v-for="stat of stats"
                      :key="stat.id"
                      :value="stat.id"
                    >
                      {{ stat.name }}
                    </option>
                  </select>
                </span>
              </p>
              <p class="control" v-if="point.type === 'quest'">
                <span class="select is-small">
                  <select v-model="point.difficulty">
                    <option
                      v-for="difficulty of difficulties"
                      :key="difficulty.id"
                      :value="difficulty.id"
                    >
                      {{ difficulty.name }}
                    </option>
                  </select>
                </span>
              </p>
              <p class="control" v-if="point.type === 'quest'">
                <span class="select is-small">
                  <select v-model="point.quest_id">
                    <optgroup
                      v-for="act of acts"
                      :key="act.id"
                      :label="act.name"
                    >
                      <option
                        v-for="quest of act.quests"
                        :key="quest.id"
                        :value="quest.id"
                      >
                        {{ quest.short_name }}
                      </option>
                    </optgroup>
                  </select>
                </span>
              </p>
              <p class="control">
                <span class="select is-small">
                  <select v-model="point.time_type">
                    <option value="state">by latest state</option>
                    <option value="max" :disabled="point.type !== 'per'">
                      by max value
                    </option>
                    <option value="in_under" :disabled="point.type === 'per'">
                      in under
                    </option>
                    <option value="first" :disabled="point.type === 'per'">
                      for first claimed
                    </option>
                  </select>
                </span>
              </p>
              <p class="control" v-if="point.time_type === 'in_under'">
                <input
                  class="input is-small"
                  type="text"
                  placeholder="eg: 1d 2h 30m 50s"
                  v-model="point.time"
                />
              </p>
              <p class="control">
                <a
                  class="button is-small is-static"
                  @click="removePoint(index)"
                >
                  <span class="delete has-background-danger"></span>
                </a>
              </p>
            </div>
            <button class="button is-small is-primary" @click="addPoint()">
              Add
            </button>
          </div>
          <!--Finish-->
          <div class="box">
            <h1 class="subtitle mb-3">Finish conditions</h1>
            <div
              v-for="(condition, index) of form.finish_conditions"
              :key="index"
              class="field has-addons"
            >
              <p class="control">
                <span class="select is-small">
                  <select v-model="condition.type">
                    <option value="quest">Complete</option>
                    <option value="time">After</option>
                    <option value="stat">Reach</option>
                  </select>
                </span>
              </p>
              <p class="control" v-if="condition.type === 'time'">
                <input
                  class="input is-small"
                  type="text"
                  placeholder="eg: 1d 2h 30m 50s"
                  v-model="condition.time"
                />
              </p>
              <p class="control" v-if="condition.type === 'time'">
                <span class="select is-small">
                  <select v-model="condition.time_type">
                    <option value="race">from race start</option>
                    <option value="character">from character creation</option>
                  </select>
                </span>
              </p>
              <p class="control" v-if="condition.type === 'stat'">
                <input
                  class="input is-small"
                  type="number"
                  v-model="condition.counter"
                />
              </p>
              <p class="control" v-if="condition.type === 'stat'">
                <span class="select is-small">
                  <select v-model="condition.stat">
                    <option
                      v-for="stat of stats"
                      :key="stat.id"
                      :value="stat.id"
                    >
                      {{ stat.name }}
                    </option>
                  </select>
                </span>
              </p>
              <p class="control" v-if="condition.type === 'quest'">
                <span class="select is-small">
                  <select v-model="condition.difficulty">
                    <option
                      v-for="difficulty of difficulties"
                      :key="difficulty.id"
                      :value="difficulty.id"
                    >
                      {{ difficulty.name }}
                    </option>
                  </select>
                </span>
              </p>
              <p class="control" v-if="condition.type === 'quest'">
                <span class="select is-small">
                  <select v-model="condition.quest_id">
                    <optgroup
                      v-for="act of acts"
                      :key="act.id"
                      :label="act.name"
                    >
                      <option
                        v-for="quest of act.quests"
                        :key="quest.id"
                        :value="quest.id"
                      >
                        {{ quest.short_name }}
                      </option>
                    </optgroup>
                  </select>
                </span>
              </p>
              <p class="control">
                <a
                  class="button is-small is-static"
                  @click="removeFinishCondition(index)"
                >
                  <span class="delete has-background-danger"></span>
                </a>
              </p>
            </div>
            <div class="field">
              <button
                class="button is-small is-primary"
                @click="addFinishCondition()"
              >
                Add
              </button>
            </div>
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
        </div>
      </section>
      <section class="section pt-0" v-if="canEdit">
        <div class="container">
          <button
            v-if="dirty"
            class="button is-small is-primary"
            :class="{ 'is-loading': saving }"
            @click="save()"
          >
            Save changes
          </button>
          <button v-if="!dirty" class="button is-small is-primary">
            No changes since saving
          </button>
        </div>
      </section>
    </fieldset>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import RaceCountdown from '@/components/RaceCountdown.vue';
import DateTimeInput from '@/components/DateTimeInput.vue';
import { heroes, quests, stats } from '@diablorun/diablorun-data';

export default {
  name: 'RaceEditor',
  components: {
    RaceCountdown,
    DateTimeInput
  },
  data() {
    const statsList = Object.keys(stats).map(id => ({
      id,
      name: stats[id]
    }));

    const questsList = Object.keys(quests).map(id => ({
      id,
      ...quests[id]
    }));

    const acts = [
      { name: 'Act I', quests: questsList.filter(quest => quest.act === 1) },
      { name: 'Act II', quests: questsList.filter(quest => quest.act === 2) },
      {
        name: 'Act III',
        quests: questsList.filter(quest => quest.act === 3)
      },
      { name: 'Act IV', quests: questsList.filter(quest => quest.act === 4) },
      { name: 'Act V', quests: questsList.filter(quest => quest.act === 5) },
      { name: 'Other', quests: questsList.filter(quest => quest.act === 0) }
    ];

    for (const act of acts) {
      act.quests.sort((a, b) => a.order - b.order);
    }

    return {
      // Static data
      heroes,
      acts,
      stats: statsList,
      difficulties: [
        { id: 'normal', name: 'Normal' },
        { id: 'nightmare', name: 'Nightmare' },
        { id: 'hell', name: 'Hell' }
      ],
      // Form
      form: {
        name: '',
        slug: '',
        description: '',
        entry_new_character: true,
        entry_hero: heroes.map(hero => hero.id),
        entry_classic: false,
        entry_hc: false,
        entry_players: 'p1',
        finish_conditions_global: false,
        points: [],
        finish_conditions: [
          {
            context: 'finish_conditions',
            type: 'quest',
            difficulty: 'normal',
            quest_id: 80,
            since: 'race',
            stat: '',
            time_type: 'race',
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
      name: race.name,
      slug: race.slug,
      description: race.description,
      entry_new_character: race.entry_new_character,
      entry_hero: race.entry_hero.split(','),
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
            entry_hero: this.form.entry_hero.join(','),
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

        if (this.editor_token !== body.editor_token) {
          this.token = body.token;
          this.editor_token = body.editor_token;
          this.leaderboard_url = `${process.env.VUE_APP_WEB_URL}/race/${body.slug}${body.id}`;

          this.$router.push({
            name: 'RaceEditor',
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
