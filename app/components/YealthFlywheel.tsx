/**
 * YealthFlywheel — looping hero animation for yealth.mu.
 *
 * "3D greenhouse & wallet" artwork (promoted from animation-lab Variant D):
 *
 *  FARMS: small gabled glasshouses with a front gable face, one receding
 *  right side wall and roof plane (consistent upper-left light), chunky dark
 *  frame with thin gold edge accents; visible through the mint-tinted front
 *  glass: two aquaponics raft rows of 3D lettuce heads (overlapping mint
 *  circles with darker base + lighter crown) on pale boards over a dark
 *  water strip. The lettuce heads carry the 8s grow/harvest animation.
 *
 *  WALLET: rounded charcoal bifold with visible fold depth, gold strap band
 *  with clasp plate + circular button, soft top highlight.
 *
 *  Coins are gradient-lit discs with edge thickness; outbound coins scale up
 *  mid-flight (closer to the viewer) with a travelling ground shadow that
 *  shrinks in sync.
 *
 * 32s master loop: 3 story cycles (24s) + an 8s closing hold so the final
 * phrase "Thank you for contributing to Food Security in Africa" stays on
 * screen ~7s to be read, then the whole animation resets and loops.
 *
 * Narration: own a farm → grows lettuce → harvest pays you → Repeat: More
 * Farms, More Income → own more farms → all farms grow → all harvests pay →
 * ... → thank you. Farms labelled Farm 1/2/3; income stack grows +1, +2, +3.
 * During the closing hold the plants keep growing so the farms feel alive.
 *
 * Pure SVG + CSS keyframes: no "use client", no framer-motion, zero JS at
 * runtime, no blur filters. CSS/ids are namespaced yfd* (inherited from the
 * lab variant; self-contained, nothing else references them).
 *
 * Fonts: expects Quicksand + Nunito already loaded via next/font.
 * Reduced motion: static 3-farm end state with a static label.
 */

const css = `
  .yfd-wrap{margin-top:8px}
  .yfd{width:100%;height:auto;display:block}

  .yfd .caption{
    font-family:'Quicksand',sans-serif;font-weight:500;font-size:13px;
    fill:#A0A0A0;text-anchor:middle;letter-spacing:1px;
  }

  .yfd .guide{
    fill:none;stroke:#F5C842;opacity:.12;stroke-width:2;
    stroke-dasharray:3 9;
    animation:yfdDash 3s linear infinite;
  }

  .yfd .farm-inner{
    transform-box:fill-box;transform-origin:center bottom;opacity:0;
  }
  .yfd .f1i{animation:yfdFarm1 32s linear infinite}
  .yfd .f2i{animation:yfdFarm2 32s linear infinite}
  .yfd .f3i{animation:yfdFarm3 32s linear infinite}

  /* lettuce heads grow + get harvested every 8s cycle */
  .yfd .plant .head{
    transform-box:fill-box;transform-origin:center bottom;
    animation:yfdGrow 8s linear infinite;
  }

  .yfd .coin-out{opacity:0;offset-rotate:0deg}
  .yfd .co1{animation:yfdCoinOut1 32s linear infinite}
  .yfd .co2{animation:yfdCoinOut2 32s linear infinite}
  .yfd .co3{animation:yfdCoinOut3 32s linear infinite}

  .yfd .cf,.yfd .csh{transform-box:fill-box;transform-origin:center}
  .yfd .cf1{animation:yfdCF1 32s linear infinite}
  .yfd .cf2{animation:yfdCF2 32s linear infinite}
  .yfd .cf3{animation:yfdCF3 32s linear infinite}
  .yfd .csh1{animation:yfdSH1 32s linear infinite}
  .yfd .csh2{animation:yfdSH2 32s linear infinite}
  .yfd .csh3{animation:yfdSH3 32s linear infinite}

  .yfd .ret{opacity:0;offset-rotate:0deg}
  .yfd .ret1{animation:yfdRet1 32s linear infinite}
  .yfd .ret2{animation:yfdRet2 32s linear infinite}
  .yfd .ret3{animation:yfdRet3 32s linear infinite}
  .yfd .retleaf{animation:yfdLeafFade 8s linear infinite}
  .yfd .retcoin{opacity:0;animation:yfdCoinFade 8s linear infinite}

  .yfd .wallet-inner{
    transform-box:fill-box;transform-origin:center;
    animation:yfdPulse 32s ease-in-out infinite;
  }

  .yfd .stack ellipse{fill:url(#yfdStackGrad);stroke:#0A0A0A;stroke-width:1;opacity:0;transform-box:fill-box}
  .yfd .s1{animation:yfdStack1 32s linear infinite}
  .yfd .s2{animation:yfdStack2 32s linear infinite}
  .yfd .s3{animation:yfdStack3 32s linear infinite}
  .yfd .s4{animation:yfdStack4 32s linear infinite}
  .yfd .s5{animation:yfdStack5 32s linear infinite}
  .yfd .s6{animation:yfdStack6 32s linear infinite}

  .yfd .lbl{
    font-family:'Quicksand',sans-serif;font-weight:600;font-size:21px;
    fill:#F7F7F7;text-anchor:middle;opacity:0;transform-box:fill-box;
  }
  .yfd .lbl .g{fill:#F5C842}
  .yfd .lbl1{animation:yfdLbl1 32s linear infinite}
  .yfd .lbl2{animation:yfdLbl2 32s linear infinite}
  .yfd .lbl3{animation:yfdLbl3 32s linear infinite}
  .yfd .lbl4{animation:yfdLbl4 32s linear infinite}
  .yfd .lbl5{animation:yfdLbl5 32s linear infinite}
  .yfd .lbl6{animation:yfdLbl6 32s linear infinite}
  .yfd .lbl7{animation:yfdLbl7 32s linear infinite}
  .yfd .lbl8{animation:yfdLbl8 32s linear infinite}
  .yfd .lbl9{animation:yfdLbl9 32s linear infinite}
  .yfd .lbl10{animation:yfdLbl10 32s linear infinite}
  .yfd .lbl11{animation:yfdLbl11 32s linear infinite}
  .yfd .lbl12{animation:yfdLbl12 32s linear infinite}
  .yfd .lbl-static{opacity:0}

  @keyframes yfdDash{to{stroke-dashoffset:-60}}

  @keyframes yfdFarm1{
    0%,3.75%{opacity:0;transform:translateY(10px) scale(.65)}
    6%{opacity:1;transform:none}
    96%{opacity:1;transform:none}
    100%{opacity:0;transform:none}
  }
  @keyframes yfdFarm2{
    0%,28.75%{opacity:0;transform:translateY(10px) scale(.65)}
    31%{opacity:1;transform:none}
    96%{opacity:1;transform:none}
    100%{opacity:0;transform:none}
  }
  @keyframes yfdFarm3{
    0%,53.75%{opacity:0;transform:translateY(10px) scale(.65)}
    56%{opacity:1;transform:none}
    96%{opacity:1;transform:none}
    100%{opacity:0;transform:none}
  }

  @keyframes yfdGrow{
    0%,22%{transform:scaleY(.3);opacity:.55}
    40%{transform:scaleY(1);opacity:1}
    46%{transform:scaleY(1);opacity:1}
    56%,100%{transform:scaleY(.3);opacity:.55}
  }

  @keyframes yfdCoinOut1{
    0%{offset-distance:0%;opacity:0}
    1.1%{opacity:1}
    3.75%{opacity:1}
    4.5%{offset-distance:100%;opacity:0}
    100%{offset-distance:100%;opacity:0}
  }
  @keyframes yfdCoinOut2{
    0%,25%{offset-distance:0%;opacity:0}
    26.1%{opacity:1}
    28.7%{opacity:1}
    29.5%{offset-distance:100%;opacity:0}
    100%{offset-distance:100%;opacity:0}
  }
  @keyframes yfdCoinOut3{
    0%,50%{offset-distance:0%;opacity:0}
    51.1%{opacity:1}
    53.8%{opacity:1}
    54.5%{offset-distance:100%;opacity:0}
    100%{offset-distance:100%;opacity:0}
  }

  @keyframes yfdCF1{
    0%{transform:scale(1)}
    2.2%{transform:scale(1.22)}
    4.5%,100%{transform:scale(1)}
  }
  @keyframes yfdCF2{
    0%,25%{transform:scale(1)}
    27.3%{transform:scale(1.22)}
    29.5%,100%{transform:scale(1)}
  }
  @keyframes yfdCF3{
    0%,50%{transform:scale(1)}
    52.2%{transform:scale(1.22)}
    54.5%,100%{transform:scale(1)}
  }
  @keyframes yfdSH1{
    0%{transform:scale(1)}
    2.2%{transform:scale(.6)}
    4.5%,100%{transform:scale(1)}
  }
  @keyframes yfdSH2{
    0%,25%{transform:scale(1)}
    27.3%{transform:scale(.6)}
    29.5%,100%{transform:scale(1)}
  }
  @keyframes yfdSH3{
    0%,50%{transform:scale(1)}
    52.2%{transform:scale(.6)}
    54.5%,100%{transform:scale(1)}
  }

  @keyframes yfdRet1{
    0%,9.75%{offset-distance:0%;opacity:0}
    11%{offset-distance:4%;opacity:1}
    16.5%{offset-distance:100%;opacity:1}
    17.75%{offset-distance:100%;opacity:0}
    18%,34.75%{offset-distance:0%;opacity:0}
    36%{offset-distance:4%;opacity:1}
    41.5%{offset-distance:100%;opacity:1}
    42.75%{offset-distance:100%;opacity:0}
    43%,59.75%{offset-distance:0%;opacity:0}
    61%{offset-distance:4%;opacity:1}
    66.5%{offset-distance:100%;opacity:1}
    67.75%{offset-distance:100%;opacity:0}
    68%,100%{offset-distance:0%;opacity:0}
  }
  @keyframes yfdRet2{
    0%,34.75%{offset-distance:0%;opacity:0}
    36%{offset-distance:4%;opacity:1}
    41.5%{offset-distance:100%;opacity:1}
    42.75%{offset-distance:100%;opacity:0}
    43%,59.75%{offset-distance:0%;opacity:0}
    61%{offset-distance:4%;opacity:1}
    66.5%{offset-distance:100%;opacity:1}
    67.75%{offset-distance:100%;opacity:0}
    68%,100%{offset-distance:0%;opacity:0}
  }
  @keyframes yfdRet3{
    0%,59.75%{offset-distance:0%;opacity:0}
    61%{offset-distance:4%;opacity:1}
    66.5%{offset-distance:100%;opacity:1}
    67.75%{offset-distance:100%;opacity:0}
    68%,100%{offset-distance:0%;opacity:0}
  }

  @keyframes yfdLeafFade{0%,52%{opacity:1}58%,100%{opacity:0}}
  @keyframes yfdCoinFade{0%,52%{opacity:0}58%,100%{opacity:1}}

  @keyframes yfdPulse{
    0%,15.5%{transform:scale(1)}
    16.75%{transform:scale(1.07)}
    18.25%,40.5%{transform:scale(1)}
    41.75%{transform:scale(1.07)}
    43.25%,65.5%{transform:scale(1)}
    66.75%{transform:scale(1.07)}
    68.25%,100%{transform:scale(1)}
  }

  @keyframes yfdStack1{
    0%,15.75%{opacity:0;transform:translateY(8px)}
    17.25%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfdStack2{
    0%,40.7%{opacity:0;transform:translateY(8px)}
    42.2%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfdStack3{
    0%,41.6%{opacity:0;transform:translateY(8px)}
    43.1%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfdStack4{
    0%,65.8%{opacity:0;transform:translateY(8px)}
    67.3%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfdStack5{
    0%,66.7%{opacity:0;transform:translateY(8px)}
    68.2%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfdStack6{
    0%,67.6%{opacity:0;transform:translateY(8px)}
    69.1%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }

  @keyframes yfdLbl1{
    0%{opacity:0;transform:translateY(6px)}
    0.75%{opacity:1;transform:none}
    5%{opacity:1}
    6%,100%{opacity:0}
  }
  @keyframes yfdLbl2{
    0%,6%{opacity:0;transform:translateY(6px)}
    6.75%{opacity:1;transform:none}
    10.5%{opacity:1}
    11.5%,100%{opacity:0}
  }
  @keyframes yfdLbl3{
    0%,11.5%{opacity:0;transform:translateY(6px)}
    12.25%{opacity:1;transform:none}
    16.5%{opacity:1}
    17.5%,100%{opacity:0}
  }
  @keyframes yfdLbl4{
    0%,17.5%{opacity:0;transform:translateY(6px)}
    18.25%{opacity:1;transform:none}
    23.25%{opacity:1}
    24.25%,100%{opacity:0}
  }
  @keyframes yfdLbl5{
    0%,25%{opacity:0;transform:translateY(6px)}
    25.75%{opacity:1;transform:none}
    30%{opacity:1}
    31%,100%{opacity:0}
  }
  @keyframes yfdLbl6{
    0%,31%{opacity:0;transform:translateY(6px)}
    31.75%{opacity:1;transform:none}
    35.5%{opacity:1}
    36.5%,100%{opacity:0}
  }
  @keyframes yfdLbl7{
    0%,36.5%{opacity:0;transform:translateY(6px)}
    37.25%{opacity:1;transform:none}
    41.5%{opacity:1}
    42.5%,100%{opacity:0}
  }
  @keyframes yfdLbl8{
    0%,42.5%{opacity:0;transform:translateY(6px)}
    43.25%{opacity:1;transform:none}
    48.25%{opacity:1}
    49.25%,100%{opacity:0}
  }
  @keyframes yfdLbl9{
    0%,50%{opacity:0;transform:translateY(6px)}
    50.75%{opacity:1;transform:none}
    55%{opacity:1}
    56%,100%{opacity:0}
  }
  @keyframes yfdLbl10{
    0%,56%{opacity:0;transform:translateY(6px)}
    56.75%{opacity:1;transform:none}
    60.5%{opacity:1}
    61.5%,100%{opacity:0}
  }
  @keyframes yfdLbl11{
    0%,61.5%{opacity:0;transform:translateY(6px)}
    62.25%{opacity:1;transform:none}
    66.5%{opacity:1}
    67.5%,100%{opacity:0}
  }
  @keyframes yfdLbl12{
    0%,67.5%{opacity:0;transform:translateY(6px)}
    68.25%{opacity:1;transform:none}
    91%{opacity:1}
    95%,100%{opacity:0}
  }

  @media (prefers-reduced-motion: reduce){
    .yfd *{animation:none !important}
    .yfd .farm-inner{opacity:1 !important;transform:none !important}
    .yfd .plant .head{transform:none !important;opacity:1 !important}
    .yfd .stack ellipse{opacity:1 !important;transform:none !important}
    .yfd .ret,.yfd .coin-out,.yfd .lbl{opacity:0 !important}
    .yfd .lbl-static{opacity:1 !important}
    .yfd .guide{animation:none !important}
  }
`;

/** One 3D lettuce head: overlapping mint circles, darker base, lighter crown. */
function Lettuce({ x, y }: { x: number; y: number }) {
  return (
    <g className="plant" transform={`translate(${x},${y})`}>
      <g className="head">
        <circle cx="-3.6" cy="-3.2" r="4.6" fill="#2BB587" />
        <circle cx="3.6" cy="-3.2" r="4.6" fill="#2BB587" />
        <circle cx="0" cy="-6" r="4.8" fill="#34D399" />
        <circle cx="-1.8" cy="-7.8" r="2.8" fill="#7FEEC2" />
      </g>
    </g>
  );
}

/**
 * Gabled glasshouse: front gable face plus a receding right side wall and
 * roof plane (light from upper-left), chunky dark frame with gold edge
 * accents, translucent mint glass, and an aquaponics interior (raft rows of
 * lettuce over a dark water strip).
 */
function Greenhouse({ cls, label }: { cls: string; label: string }) {
  return (
    <g className={`farm-inner ${cls}`}>
      {/* ground shadow */}
      <ellipse cx="4" cy="4" rx="54" ry="7" fill="url(#yfdShadow)" />

      {/* receding right side wall (away from light — darkest) */}
      <path d="M 22 0 L 46 -7 L 46 -55 L 22 -48 Z" fill="url(#yfdGlassSide)" stroke="#1C2A23" strokeWidth="3" strokeLinejoin="round" />
      {/* receding roof plane (facing the light — lightest glass) */}
      <path d="M -8 -72 L 16 -79 L 46 -55 L 22 -48 Z" fill="url(#yfdGlassRoof)" stroke="#1C2A23" strokeWidth="3" strokeLinejoin="round" />

      {/* front gable: dark interior backdrop */}
      <path d="M -38 0 L -38 -48 L -8 -72 L 22 -48 L 22 0 Z" fill="#0D1411" />

      {/* aquaponics interior, visible through the front glass */}
      {/* lower raft row: dark water strip, pale board, lettuce */}
      <rect x="-34" y="-7" width="52" height="7" fill="#071009" />
      <rect x="-34" y="-11" width="52" height="4" rx="1.5" fill="url(#yfdRaft)" />
      <Lettuce x={-24} y={-11} />
      <Lettuce x={-8} y={-11} />
      <Lettuce x={8} y={-11} />
      {/* upper raft row */}
      <rect x="-34" y="-29" width="52" height="5" fill="#071009" />
      <rect x="-34" y="-33" width="52" height="4" rx="1.5" fill="url(#yfdRaft)" />
      <Lettuce x={-24} y={-33} />
      <Lettuce x={-8} y={-33} />
      <Lettuce x={8} y={-33} />

      {/* glass tint over the interior (subtle transparency) + highlight streak */}
      <path d="M -38 0 L -38 -48 L -8 -72 L 22 -48 L 22 0 Z" fill="url(#yfdGlassFront)" />
      <path d="M -30 -54 L -16 -65 L -10 -61 L -24 -50 Z" fill="#FFFFFF" opacity=".05" />

      {/* mullions */}
      <line x1="-23" y1="-54" x2="-23" y2="0" stroke="#1C2A23" strokeWidth="2" />
      <line x1="7" y1="-54" x2="7" y2="0" stroke="#1C2A23" strokeWidth="2" />
      <line x1="-38" y1="-48" x2="22" y2="-48" stroke="#1C2A23" strokeWidth="2.5" />
      <line x1="-38" y1="-24" x2="22" y2="-24" stroke="#1C2A23" strokeWidth="2" />
      <line x1="34" y1="-3.5" x2="34" y2="-51.5" stroke="#1C2A23" strokeWidth="2" />

      {/* chunky frame: dark members, rounded joins */}
      <path d="M -38 0 L -38 -48 L -8 -72 L 22 -48 L 22 0 Z" fill="none" stroke="#1C2A23" strokeWidth="4" strokeLinejoin="round" />
      {/* gold edge accents on the outer silhouette */}
      <path d="M -38 0 L -38 -48 L -8 -72 L 22 -48 L 22 0" fill="none" stroke="#F5C842" strokeWidth="1.2" opacity=".7" strokeLinejoin="round" />
      <path d="M -8 -72 L 16 -79 L 46 -55 L 46 -7 L 22 0" fill="none" stroke="#F5C842" strokeWidth="1" opacity=".45" strokeLinejoin="round" />

      <text className="caption" y="20">{label}</text>
    </g>
  );
}

export default function YealthFlywheel() {
  return (
    <div className="yfd-wrap" style={{ width: "100%", maxWidth: 760, margin: "0 auto" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <svg className="yfd" viewBox="0 0 800 460" role="img"
        aria-label="You own a farm. Your farm grows lettuce. The harvest pays you. You own more farms and the cycle repeats. Income grows with every farm.">
        <defs>
          <radialGradient id="yfdCoinGrad" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#FFE9A0" />
            <stop offset="40%" stopColor="#F5C842" />
            <stop offset="85%" stopColor="#D9A521" />
            <stop offset="100%" stopColor="#C2941C" />
          </radialGradient>
          <radialGradient id="yfdStackGrad" cx="40%" cy="35%" r="80%">
            <stop offset="0%" stopColor="#FFE08A" />
            <stop offset="55%" stopColor="#F5C842" />
            <stop offset="100%" stopColor="#D9A521" />
          </radialGradient>
          <radialGradient id="yfdShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity=".7" />
            <stop offset="60%" stopColor="#000000" stopOpacity=".3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* greenhouse glass: mint-tinted, lighter where the light hits */}
          <linearGradient id="yfdGlassFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" stopOpacity=".22" />
            <stop offset="55%" stopColor="#34D399" stopOpacity=".10" />
            <stop offset="100%" stopColor="#34D399" stopOpacity=".05" />
          </linearGradient>
          <linearGradient id="yfdGlassSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#13201A" />
            <stop offset="100%" stopColor="#0C1410" />
          </linearGradient>
          <linearGradient id="yfdGlassRoof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A4A3C" />
            <stop offset="100%" stopColor="#16291F" />
          </linearGradient>
          <linearGradient id="yfdRaft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D7E2DA" />
            <stop offset="100%" stopColor="#9FB3A7" />
          </linearGradient>

          {/* wallet materials */}
          <linearGradient id="yfdWalletBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#343434" />
            <stop offset="45%" stopColor="#222222" />
            <stop offset="100%" stopColor="#141414" />
          </linearGradient>
          <linearGradient id="yfdWalletBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#101010" />
            <stop offset="100%" stopColor="#060606" />
          </linearGradient>
          <linearGradient id="yfdStrap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD970" />
            <stop offset="50%" stopColor="#F5C842" />
            <stop offset="100%" stopColor="#C2941C" />
          </linearGradient>

          <g id="yfdCoin">
            <circle r="12" cx="1" cy="2" fill="#8F6D12" />
            <circle r="12" fill="url(#yfdCoinGrad)" />
            <circle r="8.5" fill="none" stroke="#0A0A0A" strokeWidth="1.5" opacity=".35" />
            <text y="4.5" textAnchor="middle" fontFamily="Quicksand, sans-serif" fontWeight="700" fontSize="13" fill="#0A0A0A">y</text>
          </g>
          <g id="yfdLeaf">
            <path d="M0 -13 C7 -7 7 6 0 13 C-7 6 -7 -7 0 -13 Z" fill="#34D399" />
            <path d="M0 -9 L0 9" stroke="#0E7C55" strokeWidth="1.4" fill="none" />
          </g>
        </defs>

        <path className="guide" d="M 178 218 C 300 90 470 100 560 200" />
        <path className="guide" d="M 560 200 C 480 360 300 370 178 240" />

        {/* wallet (you) — rounded charcoal bifold with gold strap + clasp */}
        <ellipse cx="130" cy="264" rx="52" ry="8" fill="url(#yfdShadow)" />
        <g transform="translate(130,230)">
          <g className="wallet-inner">
            {/* side depth: darker slab offset down-right (consistent light) */}
            <rect x="-35" y="-21" width="80" height="52" rx="11" fill="url(#yfdWalletBack)" />
            {/* front body */}
            <rect x="-40" y="-26" width="80" height="52" rx="11" fill="url(#yfdWalletBody)" stroke="#000000" strokeOpacity=".35" strokeWidth="1" />
            {/* leather edge seam */}
            <rect x="-37.5" y="-23.5" width="75" height="47" rx="9" fill="none" stroke="#FFFFFF" strokeOpacity=".06" strokeWidth="1.5" />
            {/* soft top highlight */}
            <rect x="-34" y="-23" width="58" height="9" rx="4.5" fill="#FFFFFF" opacity=".09" />
            {/* gold strap band wrapping body + depth slab */}
            <rect x="12" y="-28" width="18" height="59" rx="4" fill="url(#yfdStrap)" />
            <rect x="12" y="-28" width="18" height="6" rx="3" fill="#FFFFFF" opacity=".2" />
            {/* strap folding over the bottom edge, in shade */}
            <rect x="12" y="25" width="18" height="6" rx="3" fill="#A87C16" />
            {/* clasp plate + circular button */}
            <rect x="14.5" y="-9" width="13" height="18" rx="3.5" fill="#C2941C" />
            <rect x="15.5" y="-8" width="11" height="4" rx="2" fill="#FFE08A" opacity=".5" />
            <circle cx="21" cy="0" r="4" fill="#121212" />
            <circle cx="19.8" cy="-1.2" r="1.2" fill="#4A4A4A" />
            <text x="-9" y="6" textAnchor="middle" fontFamily="Quicksand, sans-serif" fontWeight="600" fontSize="13" fill="#F5C842">Wallet</text>
          </g>
        </g>

        {/* income stack */}
        <ellipse cx="130" cy="316" rx="42" ry="6" fill="url(#yfdShadow)" opacity=".8" />
        <g className="stack" transform="translate(130,312)">
          <ellipse className="s1" cx="-18" cy="0" rx="14" ry="5.5" />
          <ellipse className="s2" cx="-18" cy="-8" rx="14" ry="5.5" />
          <ellipse className="s3" cx="18" cy="0" rx="14" ry="5.5" />
          <ellipse className="s4" cx="-18" cy="-16" rx="14" ry="5.5" />
          <ellipse className="s5" cx="18" cy="-8" rx="14" ry="5.5" />
          <ellipse className="s6" cx="18" cy="-16" rx="14" ry="5.5" />
        </g>
        <text className="caption" x="130" y="352">You</text>

        {/* greenhouses */}
        <g transform="translate(560,320)"><Greenhouse cls="f1i" label="Farm 1" /></g>
        <g transform="translate(665,320)"><Greenhouse cls="f2i" label="Farm 2" /></g>
        <g transform="translate(455,320)"><Greenhouse cls="f3i" label="Farm 3" /></g>

        {/* outbound coins: scale up mid-flight, shadow shrinks in sync */}
        <g className="coin-out co1" style={{ offsetPath: "path('M 178 218 C 300 90 470 100 560 200')" }}>
          <ellipse className="csh csh1" cx="0" cy="18" rx="9" ry="2.6" fill="url(#yfdShadow)" />
          <g className="cf cf1"><use href="#yfdCoin" /></g>
        </g>
        <g className="coin-out co2" style={{ offsetPath: "path('M 178 218 C 320 70 560 80 665 200')" }}>
          <ellipse className="csh csh2" cx="0" cy="18" rx="9" ry="2.6" fill="url(#yfdShadow)" />
          <g className="cf cf2"><use href="#yfdCoin" /></g>
        </g>
        <g className="coin-out co3" style={{ offsetPath: "path('M 178 218 C 280 110 400 110 455 200')" }}>
          <ellipse className="csh csh3" cx="0" cy="18" rx="9" ry="2.6" fill="url(#yfdShadow)" />
          <g className="cf cf3"><use href="#yfdCoin" /></g>
        </g>

        {/* returns: lettuce leaves the farm and becomes money mid-flight */}
        <g className="ret ret1" style={{ offsetPath: "path('M 560 200 C 480 360 300 370 178 240')" }}>
          <use className="retleaf" href="#yfdLeaf" />
          <use className="retcoin" href="#yfdCoin" />
        </g>
        <g className="ret ret2" style={{ offsetPath: "path('M 665 200 C 560 380 300 380 178 242')" }}>
          <use className="retleaf" href="#yfdLeaf" />
          <use className="retcoin" href="#yfdCoin" />
        </g>
        <g className="ret ret3" style={{ offsetPath: "path('M 455 200 C 400 350 280 350 178 240')" }}>
          <use className="retleaf" href="#yfdLeaf" />
          <use className="retcoin" href="#yfdCoin" />
        </g>

        {/* cycling labels */}
        <text className="lbl lbl1" x="400" y="432">You <tspan className="g">own</tspan> a farm</text>
        <text className="lbl lbl2" x="400" y="432">Your farm <tspan className="g">grows</tspan> lettuce</text>
        <text className="lbl lbl3" x="400" y="432">The harvest <tspan className="g">pays you</tspan></text>
        <text className="lbl lbl4" x="400" y="432">Repeat: More Farms, <tspan className="g">More Income</tspan></text>
        <text className="lbl lbl5" x="400" y="432">You own <tspan className="g">more farms</tspan></text>
        <text className="lbl lbl6" x="400" y="432"><tspan className="g">All</tspan> your farms grow lettuce</text>
        <text className="lbl lbl7" x="400" y="432">All harvests <tspan className="g">pay you</tspan></text>
        <text className="lbl lbl8" x="400" y="432">Repeat: More Farms, <tspan className="g">More Income</tspan></text>
        <text className="lbl lbl9" x="400" y="432">You own <tspan className="g">more farms</tspan></text>
        <text className="lbl lbl10" x="400" y="432"><tspan className="g">All</tspan> your farms grow lettuce</text>
        <text className="lbl lbl11" x="400" y="432">All harvests <tspan className="g">pay you</tspan></text>
        <text className="lbl lbl12" x="400" y="432">Thank you for contributing to <tspan className="g">Food Security in Africa</tspan></text>
        <text className="lbl lbl-static" x="400" y="432">Own farms. <tspan className="g">Get paid</tspan>. Repeat.</text>
      </svg>
    </div>
  );
}
