/**
 * YealthFlywheelDepth — VARIANT A "Depth & light" of the baseline YealthFlywheel.
 *
 * Identical 32s master timeline, story beats, label text, and reduced-motion
 * fallback as the baseline. Only the visual rendering is enhanced:
 *  - coins: radial-gradient specular highlight (light top-left) + a visible
 *    edge disc underneath so they read as thick discs, not flat circles
 *  - farms/shed: vertical linear-gradient faces (lighter top, darker base)
 *  - wallet: soft material gradient
 *  - soft elliptical ground shadows (radial-gradient ellipses, no blur
 *    filters) under farms, wallet, and the income stack
 *  - the baseline's ambient background glow is removed: pure #0A0A0A
 *
 * Everything namespaced yfa* so it can render beside the baseline.
 * Pure SVG + CSS keyframes: no "use client", zero JS at runtime.
 */

const css = `
  .yfa-wrap{margin-top:8px}
  .yfa{width:100%;height:auto;display:block}

  .yfa .shed{fill:url(#yfaShedGrad);stroke:#F5C842;stroke-width:2}
  .yfa .shelf{stroke:rgba(245,200,66,.30);stroke-width:2}
  .yfa .caption{
    font-family:'Quicksand',sans-serif;font-weight:500;font-size:13px;
    fill:#A0A0A0;text-anchor:middle;letter-spacing:1px;
  }

  .yfa .guide{
    fill:none;stroke:#F5C842;opacity:.12;stroke-width:2;
    stroke-dasharray:3 9;
    animation:yfaDash 3s linear infinite;
  }

  .yfa .farm-inner{
    transform-box:fill-box;transform-origin:center bottom;opacity:0;
  }
  .yfa .f1i{animation:yfaFarm1 32s linear infinite}
  .yfa .f2i{animation:yfaFarm2 32s linear infinite}
  .yfa .f3i{animation:yfaFarm3 32s linear infinite}

  .yfa .plant rect{
    fill:#34D399;
    transform-box:fill-box;transform-origin:center bottom;
    animation:yfaGrow 8s linear infinite;
  }

  .yfa .coin-out{opacity:0;offset-rotate:0deg}
  .yfa .co1{animation:yfaCoinOut1 32s linear infinite}
  .yfa .co2{animation:yfaCoinOut2 32s linear infinite}
  .yfa .co3{animation:yfaCoinOut3 32s linear infinite}

  .yfa .ret{opacity:0;offset-rotate:0deg}
  .yfa .ret1{animation:yfaRet1 32s linear infinite}
  .yfa .ret2{animation:yfaRet2 32s linear infinite}
  .yfa .ret3{animation:yfaRet3 32s linear infinite}
  .yfa .retleaf{animation:yfaLeafFade 8s linear infinite}
  .yfa .retcoin{opacity:0;animation:yfaCoinFade 8s linear infinite}

  .yfa .wallet-inner{
    transform-box:fill-box;transform-origin:center;
    animation:yfaPulse 32s ease-in-out infinite;
  }

  .yfa .stack ellipse{fill:url(#yfaStackGrad);stroke:#0A0A0A;stroke-width:1;opacity:0;transform-box:fill-box}
  .yfa .s1{animation:yfaStack1 32s linear infinite}
  .yfa .s2{animation:yfaStack2 32s linear infinite}
  .yfa .s3{animation:yfaStack3 32s linear infinite}
  .yfa .s4{animation:yfaStack4 32s linear infinite}
  .yfa .s5{animation:yfaStack5 32s linear infinite}
  .yfa .s6{animation:yfaStack6 32s linear infinite}

  .yfa .lbl{
    font-family:'Quicksand',sans-serif;font-weight:600;font-size:21px;
    fill:#F7F7F7;text-anchor:middle;opacity:0;transform-box:fill-box;
  }
  .yfa .lbl .g{fill:#F5C842}
  .yfa .lbl1{animation:yfaLbl1 32s linear infinite}
  .yfa .lbl2{animation:yfaLbl2 32s linear infinite}
  .yfa .lbl3{animation:yfaLbl3 32s linear infinite}
  .yfa .lbl4{animation:yfaLbl4 32s linear infinite}
  .yfa .lbl5{animation:yfaLbl5 32s linear infinite}
  .yfa .lbl6{animation:yfaLbl6 32s linear infinite}
  .yfa .lbl7{animation:yfaLbl7 32s linear infinite}
  .yfa .lbl8{animation:yfaLbl8 32s linear infinite}
  .yfa .lbl9{animation:yfaLbl9 32s linear infinite}
  .yfa .lbl10{animation:yfaLbl10 32s linear infinite}
  .yfa .lbl11{animation:yfaLbl11 32s linear infinite}
  .yfa .lbl12{animation:yfaLbl12 32s linear infinite}
  .yfa .lbl-static{opacity:0}

  @keyframes yfaDash{to{stroke-dashoffset:-60}}

  @keyframes yfaFarm1{
    0%,3.75%{opacity:0;transform:translateY(10px) scale(.65)}
    6%{opacity:1;transform:none}
    96%{opacity:1;transform:none}
    100%{opacity:0;transform:none}
  }
  @keyframes yfaFarm2{
    0%,28.75%{opacity:0;transform:translateY(10px) scale(.65)}
    31%{opacity:1;transform:none}
    96%{opacity:1;transform:none}
    100%{opacity:0;transform:none}
  }
  @keyframes yfaFarm3{
    0%,53.75%{opacity:0;transform:translateY(10px) scale(.65)}
    56%{opacity:1;transform:none}
    96%{opacity:1;transform:none}
    100%{opacity:0;transform:none}
  }

  @keyframes yfaGrow{
    0%,22%{transform:scaleY(.3);opacity:.55}
    40%{transform:scaleY(1);opacity:1}
    46%{transform:scaleY(1);opacity:1}
    56%,100%{transform:scaleY(.3);opacity:.55}
  }

  @keyframes yfaCoinOut1{
    0%{offset-distance:0%;opacity:0}
    1.1%{opacity:1}
    3.75%{opacity:1}
    4.5%{offset-distance:100%;opacity:0}
    100%{offset-distance:100%;opacity:0}
  }
  @keyframes yfaCoinOut2{
    0%,25%{offset-distance:0%;opacity:0}
    26.1%{opacity:1}
    28.7%{opacity:1}
    29.5%{offset-distance:100%;opacity:0}
    100%{offset-distance:100%;opacity:0}
  }
  @keyframes yfaCoinOut3{
    0%,50%{offset-distance:0%;opacity:0}
    51.1%{opacity:1}
    53.8%{opacity:1}
    54.5%{offset-distance:100%;opacity:0}
    100%{offset-distance:100%;opacity:0}
  }

  @keyframes yfaRet1{
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
  @keyframes yfaRet2{
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
  @keyframes yfaRet3{
    0%,59.75%{offset-distance:0%;opacity:0}
    61%{offset-distance:4%;opacity:1}
    66.5%{offset-distance:100%;opacity:1}
    67.75%{offset-distance:100%;opacity:0}
    68%,100%{offset-distance:0%;opacity:0}
  }

  @keyframes yfaLeafFade{0%,52%{opacity:1}58%,100%{opacity:0}}
  @keyframes yfaCoinFade{0%,52%{opacity:0}58%,100%{opacity:1}}

  @keyframes yfaPulse{
    0%,15.5%{transform:scale(1)}
    16.75%{transform:scale(1.07)}
    18.25%,40.5%{transform:scale(1)}
    41.75%{transform:scale(1.07)}
    43.25%,65.5%{transform:scale(1)}
    66.75%{transform:scale(1.07)}
    68.25%,100%{transform:scale(1)}
  }

  @keyframes yfaStack1{
    0%,15.75%{opacity:0;transform:translateY(8px)}
    17.25%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfaStack2{
    0%,40.7%{opacity:0;transform:translateY(8px)}
    42.2%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfaStack3{
    0%,41.6%{opacity:0;transform:translateY(8px)}
    43.1%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfaStack4{
    0%,65.8%{opacity:0;transform:translateY(8px)}
    67.3%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfaStack5{
    0%,66.7%{opacity:0;transform:translateY(8px)}
    68.2%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfaStack6{
    0%,67.6%{opacity:0;transform:translateY(8px)}
    69.1%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }

  @keyframes yfaLbl1{
    0%{opacity:0;transform:translateY(6px)}
    0.75%{opacity:1;transform:none}
    5%{opacity:1}
    6%,100%{opacity:0}
  }
  @keyframes yfaLbl2{
    0%,6%{opacity:0;transform:translateY(6px)}
    6.75%{opacity:1;transform:none}
    10.5%{opacity:1}
    11.5%,100%{opacity:0}
  }
  @keyframes yfaLbl3{
    0%,11.5%{opacity:0;transform:translateY(6px)}
    12.25%{opacity:1;transform:none}
    16.5%{opacity:1}
    17.5%,100%{opacity:0}
  }
  @keyframes yfaLbl4{
    0%,17.5%{opacity:0;transform:translateY(6px)}
    18.25%{opacity:1;transform:none}
    23.25%{opacity:1}
    24.25%,100%{opacity:0}
  }
  @keyframes yfaLbl5{
    0%,25%{opacity:0;transform:translateY(6px)}
    25.75%{opacity:1;transform:none}
    30%{opacity:1}
    31%,100%{opacity:0}
  }
  @keyframes yfaLbl6{
    0%,31%{opacity:0;transform:translateY(6px)}
    31.75%{opacity:1;transform:none}
    35.5%{opacity:1}
    36.5%,100%{opacity:0}
  }
  @keyframes yfaLbl7{
    0%,36.5%{opacity:0;transform:translateY(6px)}
    37.25%{opacity:1;transform:none}
    41.5%{opacity:1}
    42.5%,100%{opacity:0}
  }
  @keyframes yfaLbl8{
    0%,42.5%{opacity:0;transform:translateY(6px)}
    43.25%{opacity:1;transform:none}
    48.25%{opacity:1}
    49.25%,100%{opacity:0}
  }
  @keyframes yfaLbl9{
    0%,50%{opacity:0;transform:translateY(6px)}
    50.75%{opacity:1;transform:none}
    55%{opacity:1}
    56%,100%{opacity:0}
  }
  @keyframes yfaLbl10{
    0%,56%{opacity:0;transform:translateY(6px)}
    56.75%{opacity:1;transform:none}
    60.5%{opacity:1}
    61.5%,100%{opacity:0}
  }
  @keyframes yfaLbl11{
    0%,61.5%{opacity:0;transform:translateY(6px)}
    62.25%{opacity:1;transform:none}
    66.5%{opacity:1}
    67.5%,100%{opacity:0}
  }
  @keyframes yfaLbl12{
    0%,67.5%{opacity:0;transform:translateY(6px)}
    68.25%{opacity:1;transform:none}
    91%{opacity:1}
    95%,100%{opacity:0}
  }

  @media (prefers-reduced-motion: reduce){
    .yfa *{animation:none !important}
    .yfa .farm-inner{opacity:1 !important;transform:none !important}
    .yfa .plant rect{transform:none !important;opacity:1 !important}
    .yfa .stack ellipse{opacity:1 !important;transform:none !important}
    .yfa .ret,.yfa .coin-out,.yfa .lbl{opacity:0 !important}
    .yfa .lbl-static{opacity:1 !important}
    .yfa .guide{animation:none !important}
  }
`;

function FarmInner({ cls, label }: { cls: string; label: string }) {
  return (
    <g className={`farm-inner ${cls}`}>
      {/* ground shadow builds in with the farm */}
      <ellipse cx="0" cy="5" rx="50" ry="7" fill="url(#yfaShadow)" />
      <path className="shed" d="M -40 0 L -40 -75 A 40 40 0 0 1 40 -75 L 40 0 Z" />
      <line className="shelf" x1="-40" y1="-75" x2="40" y2="-75" />
      <line className="shelf" x1="-34" y1="-63" x2="34" y2="-63" />
      <line className="shelf" x1="-34" y1="-31" x2="34" y2="-31" />
      <g className="plant" transform="translate(-22,-3)"><rect x="-5" y="-15" width="10" height="15" rx="4" /></g>
      <g className="plant" transform="translate(0,-3)"><rect x="-5" y="-15" width="10" height="15" rx="4" /></g>
      <g className="plant" transform="translate(22,-3)"><rect x="-5" y="-15" width="10" height="15" rx="4" /></g>
      <g className="plant" transform="translate(-22,-34)"><rect x="-5" y="-15" width="10" height="15" rx="4" /></g>
      <g className="plant" transform="translate(0,-34)"><rect x="-5" y="-15" width="10" height="15" rx="4" /></g>
      <g className="plant" transform="translate(22,-34)"><rect x="-5" y="-15" width="10" height="15" rx="4" /></g>
      <g className="plant" transform="translate(-22,-66)"><rect x="-5" y="-15" width="10" height="15" rx="4" /></g>
      <g className="plant" transform="translate(0,-66)"><rect x="-5" y="-15" width="10" height="15" rx="4" /></g>
      <g className="plant" transform="translate(22,-66)"><rect x="-5" y="-15" width="10" height="15" rx="4" /></g>
      <text className="caption" y="20">{label}</text>
    </g>
  );
}

export default function YealthFlywheelDepth() {
  return (
    <div className="yfa-wrap" style={{ width: "100%", maxWidth: 760, margin: "0 auto" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <svg className="yfa" viewBox="0 0 800 460" role="img"
        aria-label="You own a farm. Your farm grows lettuce. The harvest pays you. You own more farms and the cycle repeats. Income grows with every farm.">
        <defs>
          {/* specular coin face: light catches top-left, darker rim bottom-right */}
          <radialGradient id="yfaCoinGrad" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#FFE9A0" />
            <stop offset="40%" stopColor="#F5C842" />
            <stop offset="85%" stopColor="#D9A521" />
            <stop offset="100%" stopColor="#C2941C" />
          </radialGradient>
          <radialGradient id="yfaStackGrad" cx="40%" cy="35%" r="80%">
            <stop offset="0%" stopColor="#FFE08A" />
            <stop offset="55%" stopColor="#F5C842" />
            <stop offset="100%" stopColor="#D9A521" />
          </radialGradient>
          <linearGradient id="yfaShedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#222222" />
            <stop offset="100%" stopColor="#0F0F0F" />
          </linearGradient>
          <linearGradient id="yfaWalletGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#242424" />
            <stop offset="100%" stopColor="#0F0F0F" />
          </linearGradient>
          {/* soft elliptical ground shadow — gradient-based, no blur filters */}
          <radialGradient id="yfaShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity=".7" />
            <stop offset="60%" stopColor="#000000" stopOpacity=".3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <g id="yfaCoin">
            {/* edge thickness: darker gold disc peeking out bottom-right */}
            <circle r="12" cx="1" cy="2" fill="#8F6D12" />
            <circle r="12" fill="url(#yfaCoinGrad)" />
            <circle r="8.5" fill="none" stroke="#0A0A0A" strokeWidth="1.5" opacity=".35" />
            <text y="4.5" textAnchor="middle" fontFamily="Quicksand, sans-serif" fontWeight="700" fontSize="13" fill="#0A0A0A">y</text>
          </g>
          <g id="yfaLeaf">
            <path d="M0 -13 C7 -7 7 6 0 13 C-7 6 -7 -7 0 -13 Z" fill="#34D399" />
            <path d="M0 -9 L0 9" stroke="#0E7C55" strokeWidth="1.4" fill="none" />
          </g>
        </defs>

        {/* faint dashed loop guides (top: money out, bottom: income back) */}
        <path className="guide" d="M 178 218 C 300 90 470 100 560 200" />
        <path className="guide" d="M 560 200 C 480 360 300 370 178 240" />

        {/* wallet (you) — material gradient + ground shadow */}
        <ellipse cx="130" cy="264" rx="52" ry="8" fill="url(#yfaShadow)" />
        <g transform="translate(130,230)">
          <g className="wallet-inner">
            <rect x="-42" y="-28" width="84" height="56" rx="10" fill="url(#yfaWalletGrad)" stroke="#F5C842" strokeWidth="2" />
            <rect x="-42" y="-28" width="84" height="20" rx="10" fill="#F5C842" opacity=".12" />
            <circle cx="28" cy="-18" r="4" fill="#F5C842" />
            <text x="0" y="12" textAnchor="middle" fontFamily="Quicksand, sans-serif" fontWeight="600" fontSize="14" fill="#F5C842">Wallet</text>
          </g>
        </g>

        {/* income stack with its own soft ground shadow */}
        <ellipse cx="130" cy="316" rx="42" ry="6" fill="url(#yfaShadow)" opacity=".8" />
        <g className="stack" transform="translate(130,312)">
          <ellipse className="s1" cx="-18" cy="0" rx="14" ry="5.5" />
          <ellipse className="s2" cx="-18" cy="-8" rx="14" ry="5.5" />
          <ellipse className="s3" cx="18" cy="0" rx="14" ry="5.5" />
          <ellipse className="s4" cx="-18" cy="-16" rx="14" ry="5.5" />
          <ellipse className="s5" cx="18" cy="-8" rx="14" ry="5.5" />
          <ellipse className="s6" cx="18" cy="-16" rx="14" ry="5.5" />
        </g>
        <text className="caption" x="130" y="352">You</text>

        {/* farms */}
        <g transform="translate(560,320)"><FarmInner cls="f1i" label="Farm 1" /></g>
        <g transform="translate(665,320)"><FarmInner cls="f2i" label="Farm 2" /></g>
        <g transform="translate(455,320)"><FarmInner cls="f3i" label="Farm 3" /></g>

        {/* outbound coins */}
        <g className="coin-out co1" style={{ offsetPath: "path('M 178 218 C 300 90 470 100 560 200')" }}><use href="#yfaCoin" /></g>
        <g className="coin-out co2" style={{ offsetPath: "path('M 178 218 C 320 70 560 80 665 200')" }}><use href="#yfaCoin" /></g>
        <g className="coin-out co3" style={{ offsetPath: "path('M 178 218 C 280 110 400 110 455 200')" }}><use href="#yfaCoin" /></g>

        {/* returns: lettuce becomes money mid-flight */}
        <g className="ret ret1" style={{ offsetPath: "path('M 560 200 C 480 360 300 370 178 240')" }}>
          <use className="retleaf" href="#yfaLeaf" />
          <use className="retcoin" href="#yfaCoin" />
        </g>
        <g className="ret ret2" style={{ offsetPath: "path('M 665 200 C 560 380 300 380 178 242')" }}>
          <use className="retleaf" href="#yfaLeaf" />
          <use className="retcoin" href="#yfaCoin" />
        </g>
        <g className="ret ret3" style={{ offsetPath: "path('M 455 200 C 400 350 280 350 178 240')" }}>
          <use className="retleaf" href="#yfaLeaf" />
          <use className="retcoin" href="#yfaCoin" />
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
