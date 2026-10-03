import React from 'react';
import {Composition, Folder} from 'remotion';
import {AvatarAsset, LogoHorizontalAsset, LogoStackedAsset, LogoTaglineAsset, WatermarkAsset} from './brand/assets';
import {Banner, BANNER} from './brand/Banner';
import {LogoSheet} from './brand/LogoSheet';
import {Thumbnail, ThumbnailProps} from './brand/Thumbnail';
import {Demo, DEMO_DURATION, demoScenes} from './Demo';
import {DemoShort, DEMO_SHORT_DURATION, demoShortScenes} from './DemoShort';
import {prepareVideo, SceneSequence, sceneDuration, VideoSpec} from './SceneSequence';
import {sceneRegistry, SceneType} from './scenes';
import {VIDEO, VIDEO_VERTICAL} from './theme';

/** Preview props for scenes that the demo only uses as overlays/transitions. */
const extraPreviews: Partial<Record<SceneType, object>> = {
  LowerThird: {title: 'QBI Deduction', subtitle: '20% pass-through deduction under §199A'},
  Transition: {style: 'wipe'},
  CaptionTrack: {cues: [{text: "That's money you *keep*", from: 10, to: 70}, {text: 'every single year.', from: 70, to: 140}]},
};

const previewProps = (type: SceneType) =>
  demoScenes.find((s) => s.type === type)?.props ?? demoShortScenes.find((s) => s.type === type)?.props ?? extraPreviews[type] ?? {};

const scenePreviews = (suffix: string, dims: {width: number; height: number; fps: number}) =>
  (Object.keys(sceneRegistry) as SceneType[]).map((type) => {
    const durationInFrames = sceneDuration({type});
    const Comp = sceneRegistry[type].component as React.FC<Record<string, unknown>>;
    return (
      <Composition
        key={type + suffix}
        id={type + suffix}
        component={Comp}
        durationInFrames={durationInFrames}
        {...dims}
        defaultProps={{...previewProps(type), durationInFrames}}
      />
    );
  });

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Demo" component={Demo} durationInFrames={DEMO_DURATION} {...VIDEO} />

    {/* Render any JSON video spec: npx remotion render Episode out/ep.mp4 --props=episode.json */}
    <Composition
      id="Episode"
      component={SceneSequence}
      durationInFrames={DEMO_DURATION}
      {...VIDEO}
      defaultProps={{scenes: demoScenes} satisfies VideoSpec}
      calculateMetadata={({props}) => prepareVideo(props, VIDEO.fps)}
    />

    <Folder name="Brand">
      <Composition id="LogoSheet" component={LogoSheet} durationInFrames={1} {...VIDEO} />
      <Composition
        id="Thumbnail"
        component={Thumbnail}
        durationInFrames={1}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{topic: 'S Corp vs LLC', figure: '$15,000', label: 'tax gap', bars: [{label: 'LLC', tone: 'cost', height: 1}, {label: 'S corp', tone: 'saving', height: 0.41}]} satisfies ThumbnailProps}
      />
      <Composition id="Banner" component={Banner} durationInFrames={1} fps={30} width={BANNER.width} height={BANNER.height} defaultProps={{guides: false}} />
      <Composition id="LogoHorizontal" component={LogoHorizontalAsset} durationInFrames={1} fps={30} width={1440} height={320} defaultProps={{theme: 'dark' as const}} />
      <Composition id="LogoHorizontalLight" component={LogoHorizontalAsset} durationInFrames={1} fps={30} width={1440} height={320} defaultProps={{theme: 'light' as const}} />
      <Composition id="LogoTagline" component={LogoTaglineAsset} durationInFrames={1} fps={30} width={1440} height={320} defaultProps={{theme: 'dark' as const}} />
      <Composition id="LogoTaglineLight" component={LogoTaglineAsset} durationInFrames={1} fps={30} width={1440} height={320} defaultProps={{theme: 'light' as const}} />
      <Composition id="LogoStacked" component={LogoStackedAsset} durationInFrames={1} fps={30} width={800} height={800} />
      <Composition id="Avatar" component={AvatarAsset} durationInFrames={1} fps={30} width={800} height={800} />
      <Composition id="Watermark" component={WatermarkAsset} durationInFrames={1} fps={30} width={150} height={150} />
      {/* Logo draw-on animation, e.g. for intros: 2s */}
      <Composition id="LogoReveal" component={LogoStackedAsset} durationInFrames={60} fps={30} width={800} height={800} />
    </Folder>

    {/* 9:16 Shorts / Reels / TikTok */}
    <Composition id="DemoShort" component={DemoShort} durationInFrames={DEMO_SHORT_DURATION} {...VIDEO_VERTICAL} />
    {/* npx remotion render Short out/short.mp4 --props=short.json */}
    <Composition
      id="Short"
      component={SceneSequence}
      durationInFrames={DEMO_SHORT_DURATION}
      {...VIDEO_VERTICAL}
      defaultProps={{scenes: demoShortScenes} satisfies VideoSpec}
      calculateMetadata={({props}) => prepareVideo(props, VIDEO.fps)}
    />

    <Folder name="Scenes">{scenePreviews('', VIDEO)}</Folder>
    <Folder name="Scenes-Vertical">{scenePreviews('-Vertical', VIDEO_VERTICAL)}    </Folder>
  </>
);
