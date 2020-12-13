<template>
  <BlogPost>
    <div class="columns">
      <div class="column is-7">
        <div class="box">
          <h1 class="subtitle">What's a classic character?</h1>
          <p>
            Classic characters can be created when deselecting "expansion
            character" during character creation.
          </p>
          <p class="pt-3">
            Classic character can be converted to an expansion character by
            using the "Covert to Expansion" button on character selection
            screen. It's possible to still enter hell difficulty after
            converting if you complete Duriel quest in hell. This means you can
            skip normal and nightmare act 5.
          </p>
        </div>
        <div class="box">
          <h1 class="subtitle">Classic compared to expansion character</h1>
          <p>
            Classic mercenaries are limited. They can't wear equipment or
            potions. They can only be used in the same act that you hired them.
            They disappear as you swap acts.
          </p>
          <p class="pt-3">
            Classic classes are to amazon, necromancer, barbarian, paladin and
            sorceress. Expansion added assassin and druid.
          </p>
        </div>
        <div class="box">
          <h1 class="subtitle">
            Speedrunning categories that have used the classic strategy
          </h1>
          <table class="table is-fullwidth is-striped is-hoverable mt-4">
            <thead>
              <tr>
                <th class="is-narrow">Category</th>
                <th>Notes</th>
                <th class="is-narrow">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="is-narrow">Pacifist</td>
                <td colspan="2">Chipped skulls are easier to find</td>
              </tr>
              <tr>
                <td class="is-narrow">Hell Barbarian</td>
                <td>Whirlwind is more powerful in classic</td>
                <td class="is-narrow">
                  <a href="https://youtu.be/iNTJMMKOVws" target="_blank"
                    >07:48:41</a
                  >
                  by Indrek
                </td>
              </tr>
              <tr>
                <td class="is-narrow">Sorceress</td>
                <td>Cast speed rings are more common</td>
                <td class="is-narrow">
                  <a href="https://youtu.be/KT-XsvL67KA" target="_blank"
                    >1:00:40</a
                  >
                  by Indrek
                </td>
              </tr>
              <tr>
                <td class="is-narrow">Players 8 Sorceress</td>
                <td>
                  Static field drops enemy life down to 1 life in nightmare and
                  hell
                </td>
                <td class="is-narrow">
                  <a href="https://youtu.be/Y5ZK4k_xqeM" target="_blank"
                    >06:17:51</a
                  >
                  by Indrek
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <h1 class="subtitle">Classic vs Expansion</h1>
          <table class="table is-fullwidth is-striped is-hoverable mt-4">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Classic</th>
                <th>Expansion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Stash</td>
                <td><span class="tag is-light">Small</span></td>
                <td>
                  <span class="tag is-light">Big</span>
                </td>
              </tr>
              <tr>
                <td>Uniques and sets</td>
                <td><span class="tag is-light">Normal</span></td>
                <td>
                  <div class="tags">
                    <span class="tag is-light">Normal</span>
                    <span class="tag is-light">Exceptional</span>
                    <span class="tag is-light">Elite</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Mercenaries</td>
                <td><span class="tag is-light">Limited</span></td>
                <td><span class="tag is-info">Yes</span></td>
              </tr>
              <tr>
                <td>Weapon swap</td>
                <td><span class="tag is-light">No</span></td>
                <td><span class="tag is-info">Yes</span></td>
              </tr>
              <tr>
                <td>Cube recipes</td>
                <td><span class="tag is-light">Limited</span></td>
                <td><span class="tag is-info">Yes</span></td>
              </tr>
              <tr>
                <td>Crafted items</td>
                <td><span class="tag is-light">No</span></td>
                <td><span class="tag is-info">Yes</span></td>
              </tr>
              <tr>
                <td>Runewords</td>
                <td><span class="tag is-light">No</span></td>
                <td><span class="tag is-info">Yes</span></td>
              </tr>
              <tr>
                <td>Gems</td>
                <td><span class="tag is-info">Yes</span></td>
                <td><span class="tag is-info">Yes</span></td>
              </tr>
              <tr>
                <td>Jewels</td>
                <td><span class="tag is-light">No</span></td>
                <td><span class="tag is-info">Yes</span></td>
              </tr>
              <tr>
                <td>Charms</td>
                <td><span class="tag is-light">No</span></td>
                <td><span class="tag is-info">Yes</span></td>
              </tr>
              <tr>
                <td>Act 5</td>
                <td><span class="tag is-light">No</span></td>
                <td><span class="tag is-info">Yes</span></td>
              </tr>
            </tbody>
          </table>
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