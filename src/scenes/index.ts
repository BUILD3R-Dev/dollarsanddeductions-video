import type React from 'react';
import {BarChart} from './BarChart';
import {BulletBuild} from './BulletBuild';
import {CaptionTrack} from './CaptionTrack';
import {HookCard} from './HookCard';
import {KineticType} from './KineticType';
import {LineChart} from './LineChart';
import {LowerThird} from './LowerThird';
import {NumberCallout} from './NumberCallout';
import {OutroCard} from './OutroCard';
import {ShortCTA} from './ShortCTA';
import {TitleCard} from './TitleCard';
import {Transition} from './Transition';

export * from './BarChart';
export * from './BulletBuild';
export * from './CaptionTrack';
export * from './HookCard';
export * from './KineticType';
export * from './LineChart';
export * from './LowerThird';
export * from './NumberCallout';
export * from './OutroCard';
export * from './ShortCTA';
export * from './TitleCard';
export * from './Transition';

/**
 * The scene catalog. `SceneSequence` looks components up here by `type`, so a
 * video can be described as plain JSON. Add new scenes to this map.
 */
export const sceneRegistry = {
  TitleCard: {component: TitleCard, defaultDuration: 165, defaultTheme: 'dark', bug: false},
  KineticType: {component: KineticType, defaultDuration: 180, defaultTheme: 'dark', bug: true},
  BarChart: {component: BarChart, defaultDuration: 240, defaultTheme: 'dark', bug: true},
  LineChart: {component: LineChart, defaultDuration: 240, defaultTheme: 'dark', bug: true},
  NumberCallout: {component: NumberCallout, defaultDuration: 150, defaultTheme: 'dark', bug: true},
  BulletBuild: {component: BulletBuild, defaultDuration: 270, defaultTheme: 'light', bug: true},
  LowerThird: {component: LowerThird, defaultDuration: 120, defaultTheme: 'dark', bug: false},
  Transition: {component: Transition, defaultDuration: 30, defaultTheme: 'dark', bug: false},
  OutroCard: {component: OutroCard, defaultDuration: 240, defaultTheme: 'dark', bug: false},
  // Short-form (work in both formats, designed for 9:16)
  HookCard: {component: HookCard, defaultDuration: 75, defaultTheme: 'dark', bug: false},
  CaptionTrack: {component: CaptionTrack, defaultDuration: 150, defaultTheme: 'dark', bug: false},
  ShortCTA: {component: ShortCTA, defaultDuration: 120, defaultTheme: 'dark', bug: false},
} as const;
// `defaultTheme` must match the component's own `theme` default; `bug` = corner bug shown by default.

type Registry = typeof sceneRegistry;
export type SceneType = keyof Registry;

/** A scene's props minus `durationInFrames` (SceneSequence injects it). */
export type ScenePropsOf<K extends SceneType> = Omit<React.ComponentProps<Registry[K]['component']>, 'durationInFrames'>;
