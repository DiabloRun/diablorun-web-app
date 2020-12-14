<template>
  <BlogPost>
    <h1 class="title is-2">World record history from oldest to newest</h1>
    <div class="columns">
      <div class="column is-7">
        <table class="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Time</th>
              <th class="is-narrow">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="https://www.twitch.tv/videos/300169923" target="_blank"
                  >01:11:19</a
                >
                by Indrek
              </td>
              <td class="is-narrow">August 21, 2018</td>
            </tr>
            <tr>
              <td>
                <a href="https://youtu.be/pGxqpzONKu8" target="_blank"
                  >01:06:03</a
                >
                by Indrek
              </td>
              <td class="is-narrow">June 11, 2019</td>
            </tr>
            <tr>
              <td>
                <a href="https://www.twitch.tv/videos/451383921" target="_blank"
                  >01:05:05</a
                >
                by Indrek
              </td>
              <td class="is-narrow">July 11, 2019</td>
            </tr>
            <tr>
              <td>
                <a href="https://www.twitch.tv/videos/451463929" target="_blank"
                  >01:03:03</a
                >
                by MrLlamaSC
              </td>
              <td class="is-narrow">April 5, 2020</td>
            </tr>
            <tr>
              <td>
                <a href="https://www.twitch.tv/videos/451683332" target="_blank"
                  >01:01:30</a
                >
                by Indrek
              </td>
              <td class="is-narrow">July 12, 2019</td>
            </tr>
            <tr class="has-text-centered has-text-grey is-size-7">
              <td colspan="3">
                Timing method changed from real time to in-game time in May 30,
                2020
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://www.twitch.tv/videos/788769545" target="_blank"
                  >00:58:38</a
                >
                by 327
              </td>
              <td class="is-narrow">November 1, 2020</td>
            </tr>
            <tr>
              <td>
                <a href="https://youtu.be/4ALvmN6gyVs" target="_blank"
                  >00:52:52</a
                >
                by Indrek
              </td>
              <td class="is-narrow">November 21, 2020</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column">
        <div class="box">
          <h1 class="blog subtitle">World record is 52:52 by Indrek</h1>
          <iframe
            width="100%"
            height="240"
            src="https://www.youtube.com/embed/4ALvmN6gyVs"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div class="box">
          <h1 class="blog subtitle">Any% Softcore Sorceress Players X Rules</h1>
          <h1 class="subtitle is-6 mb-2">Requirements</h1>
          <div class="tags">
            <span class="tag is-light">Real Time Timer</span>
            <span class="tag is-light">In-Game Timer</span>
            <span class="tag is-light">Sorceress</span>
            <span class="tag is-light">Softcore</span>
            <span class="tag is-light">Patch 1.14+</span>
            <span class="tag is-light">Audible Game Sound</span>
            <span class="tag is-light">-sndkbkg</span>
            <span class="tag is-light">-w</span>
          </div>
          <h1 class="subtitle is-6 mb-2">Allowed</h1>
          <div class="tags">
            <span class="tag is-light">Changing players setting</span>
            <span class="tag is-light">Starting in Classic</span>
            <span class="tag is-light">Glide video mode</span>
            <span class="tag is-light">TCP/IP Host</span>
            <span class="tag is-light">Macro for resets</span>
          </div>
          <h1 class="subtitle is-6 mb-2">Banned</h1>
          <div class="tags">
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

export default {
  components: { BlogPost }
};
</script>
