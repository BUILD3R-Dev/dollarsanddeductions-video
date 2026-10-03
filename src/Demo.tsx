import React from 'react';
import {SceneSequence, SceneSpec, totalDuration} from './SceneSequence';

/**
 * 60-second sizzle reel: S-corp vs LLC. Every scene in the kit appears at
 * least once. Figures: $120k net profit, 2026 FICA rate 15.3%, SE tax on
 * 92.35% of profit, S-corp paying a $60k reasonable salary.
 */
export const demoScenes: SceneSpec[] = [
  {
    type: 'TitleCard',
    durationInFrames: 165,
    props: {
      kicker: 'Episode 14 · The S-Corp Series',
      title: 'S-Corp vs. LLC: Which One *Actually* Saves You More?',
      subtitle: 'The real numbers on $120,000 of small-business profit.',
    },
    transition: {style: 'wipe'},
  },
  {
    type: 'KineticType',
    durationInFrames: 180,
    props: {
      lines: ['You cleared $120,000 in profit.', 'Self-employment tax takes $16,955', 'before *income tax* even starts.'],
    },
    transition: {style: 'iris'},
  },
  {
    type: 'BarChart',
    durationInFrames: 240,
    props: {
      kicker: 'The payroll-tax gap',
      title: 'Same profit, two *very* different bills',
      subtitle: 'Federal self-employment vs. payroll tax on $120,000 of net profit',
      bars: [
        {label: 'Single-member LLC', caption: '15.3% on 92.35% of profit', value: 16955, tone: 'cost'},
        {label: 'S-Corp', caption: '15.3% FICA on a $60k salary', value: 9180, tone: 'saving'},
      ],
      difference: {label: 'You keep'},
    },
    transition: {style: 'fade', durationInFrames: 24},
  },
  {
    type: 'NumberCallout',
    durationInFrames: 150,
    props: {
      kicker: 'Annual payroll-tax savings',
      value: 7775,
      caption: 'back in your pocket every year — just by changing how you’re taxed.',
    },
    transition: {style: 'wipe', direction: 'left'},
  },
  {
    type: 'LineChart',
    durationInFrames: 240,
    props: {
      theme: 'light',
      kicker: 'Put the savings to work',
      title: 'Invest it, and it *compounds*',
      subtitle: '$7,775 a year at a 7% average annual return',
      points: [7775, 16094, 24996, 34521, 44712, 55617, 67285, 79770, 93129, 107423].map((value, i) => ({label: `Yr ${i + 1}`, value})),
      endLabel: 'after 10 years',
    },
    transition: {style: 'iris'},
  },
  {
    type: 'KineticType',
    durationInFrames: 180,
    props: {
      kicker: 'The catch',
      lines: ['The IRS expects you to pay yourself', 'a *reasonable salary.*'],
      offsetY: -88,
    },
    overlays: [
      {
        type: 'LowerThird',
        from: 64,
        durationInFrames: 112,
        props: {title: 'Reasonable Compensation', subtitle: 'Your salary must match fair market pay for the role'},
      },
    ],
    transition: {style: 'wipe'},
  },
  {
    type: 'BulletBuild',
    durationInFrames: 270,
    props: {
      kicker: 'Checklist',
      title: 'Deductions owners *still* miss',
      items: [
        {text: 'Home office', detail: '$5 per sq ft, up to 300 sq ft (simplified)'},
        {text: 'Health insurance premiums', detail: 'For you, your spouse and dependents'},
        {text: 'Solo 401(k) contributions', detail: 'Employee deferral + employer profit share'},
        {text: 'Business mileage', detail: 'Every client trip at the IRS standard rate'},
      ],
    },
    transition: {style: 'fade', durationInFrames: 24},
  },
  {
    type: 'NumberCallout',
    durationInFrames: 150,
    props: {
      theme: 'light',
      kicker: 'Section 199A · QBI deduction',
      value: 20,
      format: 'percent',
      doubleRule: false,
      caption: 'of qualified business income may be deductible for pass-through owners.',
    },
    transition: {style: 'wipe'},
  },
  {
    type: 'OutroCard',
    durationInFrames: 225,
    props: {nextTitle: 'The QBI Deduction, Explained in 8 Minutes'},
  },
];

export const DEMO_DURATION = totalDuration(demoScenes);

export const Demo: React.FC = () => <SceneSequence scenes={demoScenes} />;
