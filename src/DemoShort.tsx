import React from 'react';
import {SceneSequence, SceneSpec, totalDuration} from './SceneSequence';

/**
 * ~28s Shorts/Reels demo (1080×1920): the S-corp story, cut for vertical.
 * Same scene library and JSON format as the 16:9 Demo; scenes adapt to the frame.
 */
export const demoShortScenes: SceneSpec[] = [
  {
    type: 'HookCard',
    durationInFrames: 75,
    props: {sticker: 'Tax tip #14', text: 'Your LLC could be costing you *$7,775* a year.'},
    transition: {style: 'wipe', durationInFrames: 24},
  },
  {
    type: 'BarChart',
    durationInFrames: 210,
    props: {
      kicker: 'The payroll-tax gap',
      title: 'Same profit, *very* different bills',
      subtitle: 'On $120,000 of net profit',
      bars: [
        {label: 'LLC', caption: 'SE tax on 92.35% of profit', value: 16955, tone: 'cost'},
        {label: 'S-Corp', caption: 'FICA on a $60k salary', value: 9180, tone: 'saving'},
      ],
      difference: {label: 'You keep'},
    },
    transition: {style: 'iris', durationInFrames: 24},
  },
  {
    type: 'NumberCallout',
    durationInFrames: 135,
    props: {kicker: 'Before S-corp costs', value: 7775},
    overlays: [
      {
        type: 'CaptionTrack',
        from: 0,
        durationInFrames: 135,
        props: {
          cues: [
            {text: "That's money you *keep*", from: 48, to: 88},
            {text: 'every single year.', from: 88, to: 128},
          ],
        },
      },
    ],
    transition: {style: 'fade', durationInFrames: 20},
  },
  {
    type: 'KineticType',
    durationInFrames: 90,
    props: {lines: ['The catch?', 'A *reasonable salary.*']},
    transition: {style: 'wipe', durationInFrames: 24},
  },
  {
    type: 'BulletBuild',
    durationInFrames: 210,
    props: {
      kicker: 'Before you switch',
      title: 'Do these *first*',
      items: [
        {text: 'Pay yourself a fair salary', detail: 'Market rate for the work you do'},
        {text: 'Run real payroll', detail: 'Withholding and quarterly filings'},
        {text: 'File Form 2553', detail: 'Elects S-corp tax status'},
        {text: 'Budget for the extras', detail: '~$3,000/yr for payroll and filings'},
      ],
    },
    transition: {style: 'fade', durationInFrames: 20},
  },
  {
    type: 'ShortCTA',
    durationInFrames: 120,
    props: {fullVideoTitle: 'S-Corp vs. LLC: Which One Actually Saves You More?'},
  },
];

export const DEMO_SHORT_DURATION = totalDuration(demoShortScenes);

export const DemoShort: React.FC = () => <SceneSequence scenes={demoShortScenes} />;
