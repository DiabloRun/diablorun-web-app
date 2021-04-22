import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import Character from '@/views/Character.vue';
import Vuetify from 'vuetify';
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(Vuex)

jest.mock('@/components/Icon.vue', () => {
  return { props: { name: String }, template: `<icon>{{name}}</icon>` }
})

describe('Character.vue', () => {
  let actions
  let store
  let state
  let vuetify

  let $route

  let mocks

  const stubs = ['router-link']

  beforeEach(() => {
    actions = {
      'ws/subscribeToCharacter': jest.fn(),
    }

    state = {
      auth: {
        user: null,
      },
      app: {
        windowStyle: 'window'
      },
      ws: {
        character: {},
        items: [],
      },
    }
    vuetify = new Vuetify();

    store = new Vuex.Store({
      state,
      actions,
    })

    // some route because watcher is called every time the component
    // is mounted. if we dont mock a $route, there would be an error
    // in each test
    $route = {
      path: '/some/path',
      params: { user_name: 'PeTeR', character_slug: 'pan401-x129' }
    }
    mocks = { $route }
  });

  // no matter if there is a character or not, route watch handler
  // is always expected to be called
  it('calls route watch handler', async () => {
    const wrapper = shallowMount(Character, { store, vuetify, localVue, mocks });

    // flush once for watcher
    await flushPromises();

    // flush twice for dispatch
    await flushPromises();

    // route watch handler should always be called.
    // it does:
    // take user_name and character_slug from route
    // lowercases user_name
    // strips non-numbers from beginning of character_slug
    // dispatches 'ws/subscribeToCharacter' with those values
    expect(actions['ws/subscribeToCharacter']).toHaveBeenCalledTimes(1)
    expect(actions['ws/subscribeToCharacter']).toHaveBeenNthCalledWith(
      1,
      expect.anything(), // store
      { name: 'peter', id: '401-x129' }
    )
  });

  describe('without character', () => {
    it('shows nothing', async () => {
      const wrapper = shallowMount(Character, { store, vuetify, localVue, mocks });
      expect(wrapper.text()).toBe('');
    });
  })

  describe('with character', () => {
    beforeEach(() => {
      state.ws.character = {
        name: 'ABCD',
        user_name: 'CHAR_USERNAME',
        id: 'CHAR_ID',
        hero: 'CHAR_HERO',
        hc: true,
      }
    })

    it('shows something', async () => {
      const wrapper = shallowMount(Character, { store, vuetify, localVue, stubs, mocks });
      expect(wrapper.text()).not.toBe('');
    })

    it('has hero icon', async () => {
      const wrapper = shallowMount(Character, { store, vuetify, localVue, stubs, mocks });
      const heroIcon = wrapper.find('v-col-stub router-link-stub v-avatar-stub icon-stub')
      expect(heroIcon.attributes().name).toBe('big-CHAR_HERO')
    })

    it('has char name as title', async () => {
      const wrapper = shallowMount(Character, { store, vuetify, localVue, stubs, mocks });
      const title = wrapper.find('h2 router-link-stub')
      expect(title.text()).toBe('ABCD')
    })

    test.each`
      hero     | hc        | expected
      ${'ama'} | ${true}  | ${'Hardcore Amazon by CHAR_USERNAME'}
      ${'sor'} | ${true}  | ${'Hardcore Sorceress by CHAR_USERNAME'}
      ${'nec'} | ${true}  | ${'Hardcore Necromancer by CHAR_USERNAME'}
      ${'pal'} | ${true}  | ${'Hardcore Paladin by CHAR_USERNAME'}
      ${'bar'} | ${true}  | ${'Hardcore Barbarian by CHAR_USERNAME'}
      ${'dru'} | ${true}  | ${'Hardcore Druid by CHAR_USERNAME'}
      ${'asn'} | ${true}  | ${'Hardcore Assassin by CHAR_USERNAME'}
      ${'ama'} | ${false} | ${'Amazon by CHAR_USERNAME'}
      ${'sor'} | ${false} | ${'Sorceress by CHAR_USERNAME'}
      ${'nec'} | ${false} | ${'Necromancer by CHAR_USERNAME'}
      ${'pal'} | ${false} | ${'Paladin by CHAR_USERNAME'}
      ${'bar'} | ${false} | ${'Barbarian by CHAR_USERNAME'}
      ${'dru'} | ${false} | ${'Druid by CHAR_USERNAME'}
      ${'asn'} | ${false} | ${'Assassin by CHAR_USERNAME'}
      ${'XXX'} | ${true}  | ${'Hardcore by CHAR_USERNAME'}
      ${'XXX'} | ${false} | ${'by CHAR_USERNAME'}
    `('shows correct subtitle', ({hero, hc, expected}) => {
      state.ws.character.hc = hc
      state.ws.character.hero = hero
      store = new Vuex.Store({ state, actions })
      const wrapper = shallowMount(Character, { store, vuetify, localVue, stubs, mocks });
      const subtitle = wrapper.find('h2.subtitle')
      expect(subtitle.text().replace(/\s+/g, ' ')).toBe(expected)
    });

    it('shows twitch correctly', async () => {
      const wrapper = shallowMount(Character, { store, vuetify, localVue, stubs, mocks });

      // no twitch embed
      expect(wrapper.findAll('twitchembed-stub')).toHaveLength(0)

      // click button to toggle twitch embed
      const btn = wrapper.get('v-btn-stub')
      btn.vm.$emit('click') // stub, so need to use vm.$emit instead of trigger
      await flushPromises()
      expect(wrapper.findAll('twitchembed-stub')).toHaveLength(1)
      expect(wrapper.get('twitchembed-stub').attributes().username).toBe('CHAR_USERNAME')

      // click button to toggle twitch embed
      btn.vm.$emit('click') // stub, so need to use vm.$emit instead of trigger
      await flushPromises()
      expect(wrapper.findAll('twitchembed-stub')).toHaveLength(0)
    });

    // TODO: test all the tabs with actual character information
  })
});
