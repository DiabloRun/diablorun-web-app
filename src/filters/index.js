import moment from 'moment';
import 'moment-duration-format';
import { areas, stats, quests, heroes } from '@diablorun/diablorun-data';

export function DurationFilter(seconds) {
  return moment.duration(seconds, 'seconds').format('hh:mm:ss', 0, { trim: false });
}

export function TrimmedDurationFilter(seconds) {
  return moment.duration(seconds, 'seconds').format('hh:mm:ss');
}

export function FromNowFilter(time) {
  switch (typeof time) {
    case 'number':
      return moment(time*1000).fromNow();
    case 'string':
      return moment(time).fromNow();
  }
}

export function LocalTimeFilter(time) {
  return moment(time*1000).format('LLL');
}

export function AreaNameFilter(id) {
  return (id && id in areas) ? areas[id].name : '';
}

export function DifficultyFilter(id) {
  return id ? (id.charAt(0).toUpperCase() + id.slice(1)) : 'Normal';
}

export function QuestNameFilter(id) {
  return id in quests ? quests[id].name : 'a quest';
}

export function QuestShortNameFilter(id) {
  return id in quests ? quests[id].short_name : 'a quest';
}

export function StatNameFilter(id) {
  return stats[id];
}

export function HeroNameFilter(id) {
  return heroes.find(hero => hero.id === id)?.name;
}

export function PlayersCategoryNameFilter(id) {
  switch (id) {
    case 'p1': return 'Players 1';
    case 'px': return 'Players X';
    case 'p8': return 'Players 8';
  }
}

export function ParagraphsFilter(text) {
  return '<p>' + text.replace(/\n/g, '<br>').replace(/<br><br>/g, '</p><p>') + '</p>';
}
