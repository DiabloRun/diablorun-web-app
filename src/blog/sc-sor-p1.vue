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
      // old-school
      {
        label: 'Old-school era',
        runs: [
          {
            time: '01:51:23',
            link: 'https://www.twitch.tv/videos/42390070',
            runner: 'Nightfall',
            date: 'December 14, 2014',
            note: 'Oldest available recorded run'
          },
          {
            time: '01:41:58',
            link: 'https://www.twitch.tv/videos/42247167',
            runner: 'Nightfall',
            date: 'January 3, 2015'
          },
          {
            time: '01:30:53',
            link: 'https://www.twitch.tv/videos/14192656',
            runner: 'MrLlamaSC',
            username: 'MrLlamaSC',
            date: 'September 3, 2015'
          },
          {
            time: '01:29:22',
            link: 'https://www.twitch.tv/videos/14343261',
            runner: 'MrLlamaSC',
            username: 'MrLlamaSC',
            date: 'September 4, 2015'
          },
          {
            time: '01:25:33',
            link: 'https://www.twitch.tv/videos/16478781',
            runner: 'Teo1904',
            username: 'Teo1904',
            date: 'September 17, 2015'
          },
          {
            time: '01:25:27',
            link: 'https://www.twitch.tv/videos/16629398',
            runner: 'Teo1904',
            username: 'Teo1904',
            date: 'September 18, 2015'
          },
          {
            time: '01:24:27',
            link: 'https://youtu.be/S-aFlizZ25s',
            runner: 'Teo1904',
            username: 'Teo1904',
            date: 'September 21, 2015'
          },
          {
            time: '01:20:39',
            link: 'https://youtu.be/e0vqIRM_F-w',
            runner: 'Teo1904',
            username: 'Teo1904',
            date: 'September 23, 2015'
          },
          {
            time: '01:20:06',
            link: 'https://youtu.be/lp4d7GvNVvY',
            runner: 'Teo1904',
            username: 'Teo1904',
            date: 'September 28, 2015'
          },
          {
            time: '01:19:09',
            link: 'https://youtu.be/kF3GQZo9gtU',
            runner: 'Teo1904',
            username: 'Teo1904',
            date: 'January 11, 2016'
          },
          {
            time: '01:17:53',
            link: 'https://www.twitch.tv/videos/235356830',
            runner: 'MrLlamaSC',
            username: 'MrLlamaSC',
            date: 'March 4, 2018'
          },
          {
            time: '01:16:14',
            link: 'https://youtu.be/CW1EjhcGey0',
            runner: 'MrLlamaSC',
            username: 'MrLlamaSC',
            date: 'May 11, 2018'
          },
          {
            time: '01:12:39',
            link: 'https://youtu.be/F7X3I5rgv_g',
            runner: 'Slimo',
            date: 'May 15, 2018'
          }
        ]
      },
      // Beetleburst leveling era
      {
        label: 'Beetleburst leveling era',
        runs: [
          {
            time: '01:10:56',
            link: 'https://youtu.be/vwtf9yqn00k',
            runner: 'Laggzor',
            username: 'Laggzor',
            date: 'December 18, 2018'
          },
          {
            time: '01:10:31',
            link: 'https://www.twitch.tv/videos/390216252',
            runner: 'Indrek',
            username: 'Indrek',
            date: 'March 4, 2019'
          },
          {
            time: '01:10:10',
            link: 'https://youtu.be/i5CapjxE3uw',
            runner: 'MrLlamaSC',
            username: 'MrLlamaSC',
            date: 'March 15, 2019'
          },
          {
            time: '01:09:09',
            link: 'https://youtu.be/ANOj3C3DOo8',
            runner: 'Teo1904',
            username: 'Teo1904',
            date: 'March 15, 2019'
          },
          {
            time: '01:07:54',
            link: 'https://youtu.be/2OEw3mykHtM',
            runner: 'Indrek',
            username: 'Indrek',
            date: 'March 18, 2019'
          },
          {
            time: '01:06:38',
            link: 'https://youtu.be/cFLpveoZaZI',
            runner: 'Slimo',
            date: 'November 20, 2019'
          },
          {
            time: '01:04:44',
            link: 'https://youtu.be/nWVZKbhGXfQ',
            runner: 'Indrek',
            username: 'Indrek',
            date: 'November 25, 2019'
          }
        ]
      },
      // Jail era
      {
        label: 'Jail leveling era',
        runs: [
          {
            time: '01:02:57',
            link: 'https://youtu.be/7rrnC2TBUx4',
            runner: 'Indrek',
            username: 'Indrek',
            date: 'April 30, 2020'
          },
          {
            time: '01:00:40',
            link: 'https://youtu.be/zVhcVoOEv7o',
            runner: 'Indrek',
            username: 'Indrek',
            date: 'May 5, 2020'
          },
          {
            time: '00:59:29',
            link: 'https://youtu.be/FRXocsVUfWU',
            runner: 'Slimo',
            date: 'May 13, 2020',
            note: 'Used -ns which is now banned'
          }
        ]
      },
      // Timing Method
      {
        label:
          'Timing method changed from real time to in-game time in May 30, 2020',
        runs: [
          {
            time: '00:58:14',
            link: 'https://youtu.be/mQsWRgObOZg',
            runner: 'Indrek',
            username: 'Indrek',
            date: 'June 1, 2020'
          },
          {
            time: '00:57:45',
            link: 'https://youtu.be/QhHQw2hlUdg',
            runner: '327',
            username: '327__',
            date: 'November 19, 2020'
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
        pointFormatter: function () {
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
