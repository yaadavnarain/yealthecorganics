/**
 * YealthFlywheelIso — VARIANT B "Isometric build" of the baseline YealthFlywheel.
 *
 * Everything from Variant A (gradient-lit coins with edge thickness, material
 * gradients, ground shadows, pure #0A0A0A background), plus:
 *  - farms redrawn with simple isometric depth: front + right-side + top
 *    faces, one consistent light direction (top-left: top face lightest,
 *    side face darkest)
 *  - outbound coins scale up slightly mid-flight (closer to the viewer) and
 *    back down on landing, with a travelling ground shadow that shrinks while
 *    the coin is "high" and grows back on landing, in sync
 *
 * Identical 32s master timeline, story beats, label text, and reduced-motion
 * fallback as the baseline. Namespaced yfb*. Pure SVG + CSS, zero runtime JS.
 */

const css = `
  .yfb-wrap{margin-top:8px}
  .yfb{width:100%;height:auto;display:block}

  .yfb .shed-front{fill:url(#yfbShedGrad);stroke:#F5C842;stroke-width:2}
  .yfb .shed-side{fill:#0C0C0C;stroke:rgba(245,200,66,.55);stroke-width:1}
  .yfb .shed-top{fill:#2A2A2A;stroke:rgba(245,200,66,.55);stroke-width:1}
  .yfb .shelf{stroke:rgba(245,200,66,.30);stroke-width:2}
  .yfb .caption{
    font-family:'Quicksand',sans-serif;font-weight:500;font-size:13px;
    fill:#A0A0A0;text-anchor:middle;letter-spacing:1px;
  }

  .yfb .guide{
    fill:none;stroke:#F5C842;opacity:.12;stroke-width:2;
    stroke-dasharray:3 9;
    animation:yfbDash 3s linear infinite;
  }

  .yfb .farm-inner{
    transform-box:fill-box;transform-origin:center bottom;opacity:0;
  }
  .yfb .f1i{animation:yfbFarm1 32s linear infinite}
  .yfb .f2i{animation:yfbFarm2 32s linear infinite}
  .yfb .f3i{animation:yfbFarm3 32s linear infinite}

  .yfb .plant rect{
    fill:#34D399;
    transform-box:fill-box;transform-origin:center bottom;
    animation:yfbGrow 8s linear infinite;
  }

  .yfb .coin-out{opacity:0;offset-rotate:0deg}
  .yfb .co1{animation:yfbCoinOut1 32s linear infinite}
  .yfb .co2{animation:yfbCoinOut2 32s linear infinite}
  .yfb .co3{animation:yfbCoinOut3 32s linear infinite}

  /* coin grows mid-flight (closer to viewer), shadow shrinks in sync */
  .yfb .cf,.yfb .csh{transform-box:fill-box;transform-origin:center}
  .yfb .cf1{animation:yfbCF1 32s linear infinite}
  .yfb .cf2{animation:yfbCF2 32s linear infinite}
  .yfb .cf3{animation:yfbCF3 32s linear infinite}
  .yfb .csh1{animation:yfbSH1 32s linear infinite}
  .yfb .csh2{animation:yfbSH2 32s linear infinite}
  .yfb .csh3{animation:yfbSH3 32s linear infinite}

  .yfb .ret{opacity:0;offset-rotate:0deg}
  .yfb .ret1{animation:yfbRet1 32s linear infinite}
  .yfb .ret2{animation:yfbRet2 32s linear infinite}
  .yfb .ret3{animation:yfbRet3 32s linear infinite}
  .yfb .retleaf{animation:yfbLeafFade 8s linear infinite}
  .yfb .retcoin{opacity:0;animation:yfbCoinFade 8s linear infinite}

  .yfb .wallet-inner{
    transform-box:fill-box;transform-origin:center;
    animation:yfbPulse 32s ease-in-out infinite;
  }

  .yfb .stack ellipse{fill:url(#yfbStackGrad);stroke:#0A0A0A;stroke-width:1;opacity:0;transform-box:fill-box}
  .yfb .s1{animation:yfbStack1 32s linear infinite}
  .yfb .s2{animation:yfbStack2 32s linear infinite}
  .yfb .s3{animation:yfbStack3 32s linear infinite}
  .yfb .s4{animation:yfbStack4 32s linear infinite}
  .yfb .s5{animation:yfbStack5 32s linear infinite}
  .yfb .s6{animation:yfbStack6 32s linear infinite}

  .yfb .lbl{
    font-family:'Quicksand',sans-serif;font-weight:600;font-size:21px;
    fill:#F7F7F7;text-anchor:middle;opacity:0;transform-box:fill-box;
  }
  .yfb .lbl .g{fill:#F5C842}
  .yfb .lbl1{animation:yfbLbl1 32s linear infinite}
  .yfb .lbl2{animation:yfbLbl2 32s linear infinite}
  .yfb .lbl3{animation:yfbLbl3 32s linear infinite}
  .yfb .lbl4{animation:yfbLbl4 32s linear infinite}
  .yfb .lbl5{animation:yfbLbl5 32s linear infinite}
  .yfb .lbl6{animation:yfbLbl6 32s linear infinite}
  .yfb .lbl7{animation:yfbLbl7 32s linear infinite}
  .yfb .lbl8{animation:yfbLbl8 32s linear infinite}
  .yfb .lbl9{animation:yfbLbl9 32s linear infinite}
  .yfb .lbl10{animation:yfbLbl10 32s linear infinite}
  .yfb .lbl11{animation:yfbLbl11 32s linear infinite}
  .yfb .lbl12{animation:yfbLbl12 32s linear infinite}
  .yfb .lbl-static{opacity:0}

  @keyframes yfbDash{to{stroke-dashoffset:-60}}

  @keyframes yfbFarm1{
    0%,3.75%{opacity:0;transform:translateY(10px) scale(.65)}
    6%{opacity:1;transform:none}
    96%{opacity:1;transform:none}
    100%{opacity:0;transform:none}
  }
  @keyframes yfbFarm2{
    0%,28.75%{opacity:0;transform:translateY(10px) scale(.65)}
    31%{opacity:1;transform:none}
    96%{opacity:1;transform:none}
    100%{opacity:0;transform:none}
  }
  @keyframes yfbFarm3{
    0%,53.75%{opacity:0;transform:translateY(10px) scale(.65)}
    56%{opacity:1;transform:none}
    96%{opacity:1;transform:none}
    100%{opacity:0;transform:none}
  }

  @keyframes yfbGrow{
    0%,22%{transform:scaleY(.3);opacity:.55}
    40%{transform:scaleY(1);opacity:1}
    46%{transform:scaleY(1);opacity:1}
    56%,100%{transform:scaleY(.3);opacity:.55}
  }

  @keyframes yfbCoinOut1{
    0%{offset-distance:0%;opacity:0}
    1.1%{opacity:1}
    3.75%{opacity:1}
    4.5%{offset-distance:100%;opacity:0}
    100%{offset-distance:100%;opacity:0}
  }
  @keyframes yfbCoinOut2{
    0%,25%{offset-distance:0%;opacity:0}
    26.1%{opacity:1}
    28.7%{opacity:1}
    29.5%{offset-distance:100%;opacity:0}
    100%{offset-distance:100%;opacity:0}
  }
  @keyframes yfbCoinOut3{
    0%,50%{offset-distance:0%;opacity:0}
    51.1%{opacity:1}
    53.8%{opacity:1}
    54.5%{offset-distance:100%;opacity:0}
    100%{offset-distance:100%;opacity:0}
  }

  /* coin closer to viewer mid-flight */
  @keyframes yfbCF1{
    0%{transform:scale(1)}
    2.2%{transform:scale(1.22)}
    4.5%,100%{transform:scale(1)}
  }
  @keyframes yfbCF2{
    0%,25%{transform:scale(1)}
    27.3%{transform:scale(1.22)}
    29.5%,100%{transform:scale(1)}
  }
  @keyframes yfbCF3{
    0%,50%{transform:scale(1)}
    52.2%{transform:scale(1.22)}
    54.5%,100%{transform:scale(1)}
  }
  /* travelling ground shadow shrinks while the coin is high */
  @keyframes yfbSH1{
    0%{transform:scale(1)}
    2.2%{transform:scale(.6)}
    4.5%,100%{transform:scale(1)}
  }
  @keyframes yfbSH2{
    0%,25%{transform:scale(1)}
    27.3%{transform:scale(.6)}
    29.5%,100%{transform:scale(1)}
  }
  @keyframes yfbSH3{
    0%,50%{transform:scale(1)}
    52.2%{transform:scale(.6)}
    54.5%,100%{transform:scale(1)}
  }

  @keyframes yfbRet1{
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
  @keyframes yfbRet2{
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
  @keyframes yfbRet3{
    0%,59.75%{offset-distance:0%;opacity:0}
    61%{offset-distance:4%;opacity:1}
    66.5%{offset-distance:100%;opacity:1}
    67.75%{offset-distance:100%;opacity:0}
    68%,100%{offset-distance:0%;opacity:0}
  }

  @keyframes yfbLeafFade{0%,52%{opacity:1}58%,100%{opacity:0}}
  @keyframes yfbCoinFade{0%,52%{opacity:0}58%,100%{opacity:1}}

  @keyframes yfbPulse{
    0%,15.5%{transform:scale(1)}
    16.75%{transform:scale(1.07)}
    18.25%,40.5%{transform:scale(1)}
    41.75%{transform:scale(1.07)}
    43.25%,65.5%{transform:scale(1)}
    66.75%{transform:scale(1.07)}
    68.25%,100%{transform:scale(1)}
  }

  @keyframes yfbStack1{
    0%,15.75%{opacity:0;transform:translateY(8px)}
    17.25%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfbStack2{
    0%,40.7%{opacity:0;transform:translateY(8px)}
    42.2%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfbStack3{
    0%,41.6%{opacity:0;transform:translateY(8px)}
    43.1%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfbStack4{
    0%,65.8%{opacity:0;transform:translateY(8px)}
    67.3%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfbStack5{
    0%,66.7%{opacity:0;transform:translateY(8px)}
    68.2%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfbStack6{
    0%,67.6%{opacity:0;transform:translateY(8px)}
    69.1%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }

  @keyframes yfbLbl1{
    0%{opacity:0;transform:translateY(6px)}
    0.75%{opacity:1;transform:none}
    5%{opacity:1}
    6%,100%{opacity:0}
  }
  @keyframes yfbLbl2{
    0%,6%{opacity:0;transform:translateY(6px)}
    6.75%{opacity:1;transform:none}
    10.5%{opacity:1}
    11.5%,100%{opacity:0}
  }
  @keyframes yfbLbl3{
    0%,11.5%{opacity:0;transform:translateY(6px)}
    12.25%{opacity:1;transform:none}
    16.5%{opacity:1}
    17.5%,100%{opacity:0}
  }
  @keyframes yfbLbl4{
    0%,17.5%{opacity:0;transform:translateY(6px)}
    18.25%{opacity:1;transform:none}
    23.25%{opacity:1}
    24.25%,100%{opacity:0}
  }
  @keyframes yfbLbl5{
    0%,25%{opacity:0;transform:translateY(6px)}
    25.75%{opacity:1;transform:none}
    30%{opacity:1}
    31%,100%{opacity:0}
  }
  @keyframes yfbLbl6{
    0%,31%{opacity:0;transform:translateY(6px)}
    31.75%{opacity:1;transform:none}
    35.5%{opacity:1}
    36.5%,100%{opacity:0}
  }
  @keyframes yfbLbl7{
    0%,36.5%{opacity:0;transform:translateY(6px)}
    37.25%{opacity:1;transform:none}
    41.5%{opacity:1}
    42.5%,100%{opacity:0}
  }
  @keyframes yfbLbl8{
    0%,42.5%{opacity:0;transform:translateY(6px)}
    43.25%{opacity:1;transform:none}
    48.25%{opacity:1}
    49.25%,100%{opacity:0}
  }
  @keyframes yfbLbl9{
    0%,50%{opacity:0;transform:translateY(6px)}
    50.75%{opacity:1;transform:none}
    55%{opacity:1}
    56%,100%{opacity:0}
  }
  @keyframes yfbLbl10{
    0%,56%{opacity:0;transform:translateY(6px)}
    56.75%{opacity:1;transform:none}
    60.5%{opacity:1}
    61.5%,100%{opacity:0}
  }
  @keyframes yfbLbl11{
    0%,61.5%{opacity:0;transform:translateY(6px)}
    62.25%{opacity:1;transform:none}
    66.5%{opacity:1}
    67.5%,100%{opacity:0}
  }
  @keyframes yfbLbl12{
    0%,67.5%{opacity:0;transform:translateY(6px)}
    68.25%{opacity:1;transform:none}
    91%{opacity:1}
    95%,100%{opacity:0}
  }

  @media (prefers-reduced-motion: reduce){
    .yfb *{animation:none !important}
    .yfb .farm-inner{opacity:1 !important;transform:none !important}
    .yfb .plant rect{transform:none !important;opacity:1 !important}
    .yfb .stack ellipse{opacity:1 !important;transform:none !important}
    .yfb .ret,.yfb .coin-out,.yfb .lbl{opacity:0 !important}
    .yfb .lbl-static{opacity:1 !important}
    .yfb .guide{animation:none !important}
  }
`;

function IsoFarm({ cls, label }: { cls: string; label: string }) {
  return (
    <g className={`farm-inner ${cls}`}>
      {/* ground shadow skewed toward the light direction */}
      <ellipse cx="6" cy="5" rx="56" ry="7" fill="url(#yfbShadow)" />
      {/* right side face — away from the top-left light, darkest */}
      <path className="shed-side" d="M 40 0 L 52 -7 L 52 -82 L 40 -75 Z" />
      {/* top face — facing the light, lightest */}
      <path className="shed-top" d="M -40 -75 L 40 -75 L 52 -82 L -28 -82 Z" />
      {/* front face */}
      <path className="shed-front" d="M -40 0 L -40 -75 L 40 -75 L 40 0 Z" />
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

export default function YealthFlywheelIso() {
  return (
    <div className="yfb-wrap" style={{ width: "100%", maxWidth: 760, margin: "0 auto" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <svg className="yfb" viewBox="0 0 800 460" role="img"
        aria-label="You own a farm. Your farm grows lettuce. The harvest pays you. You own more farms and the cycle repeats. Income grows with every farm.">
        <defs>
          <radialGradient id="yfbCoinGrad" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#FFE9A0" />
            <stop offset="40%" stopColor="#F5C842" />
            <stop offset="85%" stopColor="#D9A521" />
            <stop offset="100%" stopColor="#C2941C" />
          </radialGradient>
          <radialGradient id="yfbStackGrad" cx="40%" cy="35%" r="80%">
            <stop offset="0%" stopColor="#FFE08A" />
            <stop offset="55%" stopColor="#F5C842" />
            <stop offset="100%" stopColor="#D9A521" />
          </radialGradient>
          <linearGradient id="yfbShedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E1E1E" />
            <stop offset="100%" stopColor="#0F0F0F" />
          </linearGradient>
          <linearGradient id="yfbWalletGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#242424" />
            <stop offset="100%" stopColor="#0F0F0F" />
          </linearGradient>
          <radialGradient id="yfbShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity=".7" />
            <stop offset="60%" stopColor="#000000" stopOpacity=".3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <g id="yfbCoin">
            <circle r="12" cx="1" cy="2" fill="#8F6D12" />
            <circle r="12" fill="url(#yfbCoinGrad)" />
            <circle r="8.5" fill="none" stroke="#0A0A0A" strokeWidth="1.5" opacity=".35" />
            <text y="4.5" textAnchor="middle" fontFamily="Quicksand, sans-serif" fontWeight="700" fontSize="13" fill="#0A0A0A">y</text>
          </g>
          <g id="yfbLeaf">
            <path d="M0 -13 C7 -7 7 6 0 13 C-7 6 -7 -7 0 -13 Z" fill="#34D399" />
            <path d="M0 -9 L0 9" stroke="#0E7C55" strokeWidth="1.4" fill="none" />
          </g>
        </defs>

        <path className="guide" d="M 178 218 C 300 90 470 100 560 200" />
        <path className="guide" d="M 560 200 C 480 360 300 370 178 240" />

        {/* wallet (you) */}
        <ellipse cx="130" cy="264" rx="52" ry="8" fill="url(#yfbShadow)" />
        <g transform="translate(130,230)">
          <g className="wallet-inner">
            <rect x="-42" y="-28" width="84" height="56" rx="10" fill="url(#yfbWalletGrad)" stroke="#F5C842" strokeWidth="2" />
            <rect x="-42" y="-28" width="84" height="20" rx="10" fill="#F5C842" opacity=".12" />
            <circle cx="28" cy="-18" r="4" fill="#F5C842" />
            <text x="0" y="12" textAnchor="middle" fontFamily="Quicksand, sans-serif" fontWeight="600" fontSize="14" fill="#F5C842">Wallet</text>
          </g>
        </g>

        <ellipse cx="130" cy="316" rx="42" ry="6" fill="url(#yfbShadow)" opacity=".8" />
        <g className="stack" transform="translate(130,312)">
          <ellipse className="s1" cx="-18" cy="0" rx="14" ry="5.5" />
          <ellipse className="s2" cx="-18" cy="-8" rx="14" ry="5.5" />
          <ellipse className="s3" cx="18" cy="0" rx="14" ry="5.5" />
          <ellipse className="s4" cx="-18" cy="-16" rx="14" ry="5.5" />
          <ellipse className="s5" cx="18" cy="-8" rx="14" ry="5.5" />
          <ellipse className="s6" cx="18" cy="-16" rx="14" ry="5.5" />
        </g>
        <text className="caption" x="130" y="352">You</text>

        {/* isometric farms */}
        <g transform="translate(560,320)"><IsoFarm cls="f1i" label="Farm 1" /></g>
        <g transform="translate(665,320)"><IsoFarm cls="f2i" label="Farm 2" /></g>
        <g transform="translate(455,320)"><IsoFarm cls="f3i" label="Farm 3" /></g>

        {/* outbound coins: scale up mid-flight, shadow shrinks in sync */}
        <g className="coin-out co1" style={{ offsetPath: "path('M 178 218 C 300 90 470 100 560 200')" }}>
          <ellipse className="csh csh1" cx="0" cy="18" rx="9" ry="2.6" fill="url(#yfbShadow)" />
          <g className="cf cf1"><use href="#yfbCoin" /></g>
        </g>
        <g className="coin-out co2" style={{ offsetPath: "path('M 178 218 C 320 70 560 80 665 200')" }}>
          <ellipse className="csh csh2" cx="0" cy="18" rx="9" ry="2.6" fill="url(#yfbShadow)" />
          <g className="cf cf2"><use href="#yfbCoin" /></g>
        </g>
        <g className="coin-out co3" style={{ offsetPath: "path('M 178 218 C 280 110 400 110 455 200')" }}>
          <ellipse className="csh csh3" cx="0" cy="18" rx="9" ry="2.6" fill="url(#yfbShadow)" />
          <g className="cf cf3"><use href="#yfbCoin" /></g>
        </g>

        {/* returns */}
        <g className="ret ret1" style={{ offsetPath: "path('M 560 200 C 480 360 300 370 178 240')" }}>
          <use className="retleaf" href="#yfbLeaf" />
          <use className="retcoin" href="#yfbCoin" />
        </g>
        <g className="ret ret2" style={{ offsetPath: "path('M 665 200 C 560 380 300 380 178 242')" }}>
          <use className="retleaf" href="#yfbLeaf" />
          <use className="retcoin" href="#yfbCoin" />
        </g>
        <g className="ret ret3" style={{ offsetPath: "path('M 455 200 C 400 350 280 350 178 240')" }}>
          <use className="retleaf" href="#yfbLeaf" />
          <use className="retcoin" href="#yfbCoin" />
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
