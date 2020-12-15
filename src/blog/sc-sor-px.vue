<template>
  <BlogPost>
    <h1 class="title is-2">World record history from oldest to newest</h1>
    <div class="columns">
      <div class="column is-7">
        <table class="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Run</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody v-for="collection of collections" :key="collection.label">
            <tr>
              <td colspan="3">
                <h1 class="blog subtitle is-size-6 mb-0">
                  {{ collection.label }}
                </h1>
              </td>
            </tr>
            <tr v-for="run of collection.runs" :key="run.time">
              <td class="has-text-grey">
                {{ run.date }}
              </td>
              <td>
                <a :href="run.link" target="_blank">{{ run.time }}</a>
                <span class="has-text-grey"> by </span>
                <router-link
                  v-if="run.username"
                  :to="{
                    name: 'User',
                    params: { user_name: run.username }
                  }"
                  >{{ run.runner }}</router-link
                >
                <span v-if="!run.username">
                  {{ run.runner }}
                </span>
              </td>
              <td>
                {{ run.note }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column">
        <div class="box">
          <Chart :options="historyChart"></Chart>
        </div>
        <div class="box">
          <h1 class="blog subtitle">World record is 57:45 by 327</h1>
          <iframe
            width="100%"
            height="240"
            src="https://www.youtube.com/embed/QhHQw2hlUdg"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div class="box">
          <h1 class="blog subtitle">Any% Softcore Sorceress Players 1 Rules</h1>
          <h1 class="subtitle is-6 mb-2">Requirements</h1>
          <div class="tags">
            <span class="tag is-light">Real Time Timer</span>
            <span class="tag is-light">In-Game Timer</span>
            <span class="tag is-light">Sorceress</span>
            <span class="tag is-light">Players set to 1</span>
            <span class="tag is-light">Softcore</span>
            <span class="tag is-light">Patch 1.14+</span>
            <span class="tag is-light">Audible Game Sound</span>
            <span class="tag is-light">-sndkbkg</span>
            <span class="tag is-light">-w</span>
          </div>
          <h1 class="subtitle is-6 mb-2">Allowed</h1>
          <div class="tags">
            <span class="tag is-light"
              ><router-link
                :to="{
                  path: '/blog/classic'
                }"
                >Starting in Classic</router-link
              ></span
            >
            <span class="tag is-light">Glide video mode</span>
            <span class="tag is-light">TCP/IP Host</span>
            <span class="tag is-light">Macro for resets</span>
          </div>
          <h1 class="subtitle is-6 mb-2">Banned</h1>
          <div class="tags">
            <span class="tag is-light">Changing players setting</span>
            <span class="tag is-light">Hardcore</span>
            <span class="tag is-light">Hacks</span>
            <span class="tag is-light">Macros</span>
            <span class="tag is-light">Mods</span>
            <span class="tag is-light">TCP/IP Join</span>
            <span class="tag is-light">Open Battle.net</span>
            <span class="tag is-light">-ns</span>
            <span class="tag is-light">-seed</span>
            <span class="tag is-light">-direct</span>
            <span class="tag is-light">-txt</span>
            <span class="tag is-light">-act</span>
          </div>
        </div>
      </div>
    </div>
  </BlogPost>
</template>

<script>
import BlogPost from '@/components/BlogPost.vue';
import Chart from '@/components/Chart.vue';
import { DurationFilter } from '@/filters';

export default {
  components: { BlogPost, Chart },
  data() {
    const collections = [
      // Old-school era
      {
        label: 'Old-school era',
        runs: [
          {
            time: '01:11:19',
            link: 'https://www.twitch.tv/videos/300169923',
            runner: 'Indrek',
            username: 'Indrek',
            date: 'August 21, 2018'
          },
          {
            time: '01:06:03',
            link: 'https://youtu.be/pGxqpzONKu8',
            runner: 'Indrek',
            username: 'Indrek',
            date: 'June 11, 2019'
          },
          {
            time: '01:05:05',
            link: 'https://www.twitch.tv/videos/451383921',
            runner: 'Indrek',
            username: 'Indrek',
            date: 'July 11, 2019'
          },
          {
            time: '01:03:03',
            link: 'https://www.twitch.tv/videos/451463929',
            runner: 'MrLlamaSC',
            username: 'MrLlamaSC',
            date: 'July 16, 2019'
          },
          {
            time: '01:01:30',
            link: 'https://www.twitch.tv/videos/451683332',
            runner: 'Indrek',
            username: 'Indrek',
            date: 'July 18, 2019'
          }
        ]
      },
      // Timing Method
      {
        label:
          'Timing method changed from real time to in-game time in May 30, 2020',
        runs: [
          {
            time: '00:58:38',
            link: 'https://www.twitch.tv/videos/788769545',
            runner: '327',
            username: '327__',
            date: 'November 1, 2020',
            note: 'First sub 1h'
          },
          {
            time: '00:52:52',
            link: 'https://youtu.be/4ALvmN6gyVs',
            runner: 'Indrek',
            username: 'Indrek',
            date: 'November 21, 2020'
          }
        ]
      }
    ];

    const data = [];

    for (const collection of collections) {
      for (const run of collection.runs) {
        const splitTime = run.time.split(':');
        const runSeconds =
          +splitTime[0] * 60 * 60 + +splitTime[1] * 60 + +splitTime[2];

        const runDate = new Date(run.date).getTime();

        data.push({ name: run.runner, x: runDate, y: runSeconds * 1000 });
      }
    }

    const historyChart = {
      chart: {
        backgroundColor: 'rgba(0,0,0,0)',
        spacingBottom: 0,
        spacingTop: 0,
        spacingLeft: 0,
        spacingRight: 0
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          color: '#26A69A',
          allowPointSelect: true,
          marker: {
            enabled: true
          }
        }
      },
      xAxis: {
        type: 'datetime',
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            color: '#ccc'
          }
        }
      },
      yAxis: {
        type: 'datetime',
        title: false,
        gridLineColor: '#303030',
        labels: {
          style: {
            color: '#ccc'
          }
        }
      },
      tooltip: {
        pointFormatter: function() {
          return DurationFilter(this.y / 1000);
        }
      },
      title: {
        text: 'World record progression',
        style: {
          color: '#eee',
          size: '30px'
        }
      },
      series: [
        {
          showInLegend: false,
          data
        }
      ]
    };

    return {
      collections,
      historyChart
    };
  }
};
</script>
