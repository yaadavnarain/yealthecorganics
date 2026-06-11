/**
 * YealthFlywheel — looping hero animation for yealth.mu
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
 * Pure SVG + CSS keyframes: no "use client", no framer-motion, zero JS at runtime.
 *
 * Hero placement on yealth.mu:
 *   <h1>Financial Freedom for the Youth, <span>Zero Efforts</span>.</h1>
 *   <p>Become Financially Stable. Retire Early. Retire Your Parents. Build Generational Wealth. Build Your Legacy.</p>
 *   <YealthFlywheel />
 *   <p>Become an agribusiness owner from just Rs 1,288/month.</p>
 *   <button>Secure My Spot</button>
 *
 * Fonts: expects Quicksand + Nunito already loaded via next/font.
 * Reduced motion: static 3-farm end state with a static label.
 */

const css = `
/* ===== flywheel animation ===== */
  .yf-wrap{margin-top:8px}
  .yf{width:100%;height:auto;display:block}

  .yf .shed{fill:#121212;stroke:#F5C842;stroke-width:2}
  .yf .shelf{stroke:rgba(245,200,66,.30);stroke-width:2}
  .yf .caption{
    font-family:'Quicksand',sans-serif;font-weight:500;font-size:13px;
    fill:#A0A0A0;text-anchor:middle;letter-spacing:1px;
  }

  .yf .guide{
    fill:none;stroke:#F5C842;opacity:.12;stroke-width:2;
    stroke-dasharray:3 9;
    animation:yfDash 3s linear infinite;
  }

  /* farms: build in on the 32s master timeline, persist, reset at end */
  .yf .farm-inner{
    transform-box:fill-box;transform-origin:center bottom;opacity:0;
  }
  .yf .f1i{animation:yfFarm1 32s linear infinite}
  .yf .f2i{animation:yfFarm2 32s linear infinite}
  .yf .f3i{animation:yfFarm3 32s linear infinite}

  /* plants: grow + get harvested every 8s cycle */
  .yf .plant rect{
    fill:#34D399;
    transform-box:fill-box;transform-origin:center bottom;
    animation:yfGrow 8s linear infinite;
  }

  /* outbound coins (one per cycle = one new farm) */
  .yf .coin-out{opacity:0;offset-rotate:0deg}
  .yf .co1{animation:yfCoinOut1 32s linear infinite}
  .yf .co2{animation:yfCoinOut2 32s linear infinite}
  .yf .co3{animation:yfCoinOut3 32s linear infinite}

  /* return groups: leaf leaves the farm, becomes a coin mid-flight */
  .yf .ret{opacity:0;offset-rotate:0deg}
  .yf .ret1{animation:yfRet1 32s linear infinite}
  .yf .ret2{animation:yfRet2 32s linear infinite}
  .yf .ret3{animation:yfRet3 32s linear infinite}
  .yf .retleaf{animation:yfLeafFade 8s linear infinite}
  .yf .retcoin{opacity:0;animation:yfCoinFade 8s linear infinite}

  /* wallet pulses when income arrives */
  .yf .wallet-inner{
    transform-box:fill-box;transform-origin:center;
    animation:yfPulse 32s ease-in-out infinite;
  }

  /* income stack grows by one coin per cycle */
  .yf .stack ellipse{fill:#F5C842;stroke:#0A0A0A;stroke-width:1;opacity:0;transform-box:fill-box}
  .yf .s1{animation:yfStack1 32s linear infinite}
  .yf .s2{animation:yfStack2 32s linear infinite}
  .yf .s3{animation:yfStack3 32s linear infinite}
  .yf .s4{animation:yfStack4 32s linear infinite}
  .yf .s5{animation:yfStack5 32s linear infinite}
  .yf .s6{animation:yfStack6 32s linear infinite}

  /* labels cycle every 8s */
  .yf .lbl{
    font-family:'Quicksand',sans-serif;font-weight:600;font-size:21px;
    fill:#F7F7F7;text-anchor:middle;opacity:0;transform-box:fill-box;
  }
  .yf .lbl .g{fill:#F5C842}
  .yf .lbl1{animation:yfLbl1 32s linear infinite}
  .yf .lbl2{animation:yfLbl2 32s linear infinite}
  .yf .lbl3{animation:yfLbl3 32s linear infinite}
  .yf .lbl4{animation:yfLbl4 32s linear infinite}
  .yf .lbl5{animation:yfLbl5 32s linear infinite}
  .yf .lbl6{animation:yfLbl6 32s linear infinite}
  .yf .lbl7{animation:yfLbl7 32s linear infinite}
  .yf .lbl8{animation:yfLbl8 32s linear infinite}
  .yf .lbl9{animation:yfLbl9 32s linear infinite}
  .yf .lbl10{animation:yfLbl10 32s linear infinite}
  .yf .lbl11{animation:yfLbl11 32s linear infinite}
  .yf .lbl12{animation:yfLbl12 32s linear infinite}
  .yf .lbl-static{opacity:0}

  /* ===== keyframes ===== */
  @keyframes yfDash{to{stroke-dashoffset:-60}}

  @keyframes yfFarm1{
    0%,3.75%{opacity:0;transform:translateY(10px) scale(.65)}
    6%{opacity:1;transform:none}
    96%{opacity:1;transform:none}
    100%{opacity:0;transform:none}
  }
  @keyframes yfFarm2{
    0%,28.75%{opacity:0;transform:translateY(10px) scale(.65)}
    31%{opacity:1;transform:none}
    96%{opacity:1;transform:none}
    100%{opacity:0;transform:none}
  }
  @keyframes yfFarm3{
    0%,53.75%{opacity:0;transform:translateY(10px) scale(.65)}
    56%{opacity:1;transform:none}
    96%{opacity:1;transform:none}
    100%{opacity:0;transform:none}
  }

  @keyframes yfGrow{
    0%,22%{transform:scaleY(.3);opacity:.55}
    40%{transform:scaleY(1);opacity:1}
    46%{transform:scaleY(1);opacity:1}
    56%,100%{transform:scaleY(.3);opacity:.55}
  }

  @keyframes yfCoinOut1{
    0%{offset-distance:0%;opacity:0}
    1.1%{opacity:1}
    3.75%{opacity:1}
    4.5%{offset-distance:100%;opacity:0}
    100%{offset-distance:100%;opacity:0}
  }
  @keyframes yfCoinOut2{
    0%,25%{offset-distance:0%;opacity:0}
    26.1%{opacity:1}
    28.7%{opacity:1}
    29.5%{offset-distance:100%;opacity:0}
    100%{offset-distance:100%;opacity:0}
  }
  @keyframes yfCoinOut3{
    0%,50%{offset-distance:0%;opacity:0}
    51.1%{opacity:1}
    53.8%{opacity:1}
    54.5%{offset-distance:100%;opacity:0}
    100%{offset-distance:100%;opacity:0}
  }

  @keyframes yfRet1{
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
  @keyframes yfRet2{
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
  @keyframes yfRet3{
    0%,59.75%{offset-distance:0%;opacity:0}
    61%{offset-distance:4%;opacity:1}
    66.5%{offset-distance:100%;opacity:1}
    67.75%{offset-distance:100%;opacity:0}
    68%,100%{offset-distance:0%;opacity:0}
  }

  @keyframes yfLeafFade{0%,52%{opacity:1}58%,100%{opacity:0}}
  @keyframes yfCoinFade{0%,52%{opacity:0}58%,100%{opacity:1}}

  @keyframes yfPulse{
    0%,15.5%{transform:scale(1)}
    16.75%{transform:scale(1.07)}
    18.25%,40.5%{transform:scale(1)}
    41.75%{transform:scale(1.07)}
    43.25%,65.5%{transform:scale(1)}
    66.75%{transform:scale(1.07)}
    68.25%,100%{transform:scale(1)}
  }

  @keyframes yfStack1{
    0%,15.75%{opacity:0;transform:translateY(8px)}
    17.25%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfStack2{
    0%,40.7%{opacity:0;transform:translateY(8px)}
    42.2%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfStack3{
    0%,41.6%{opacity:0;transform:translateY(8px)}
    43.1%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfStack4{
    0%,65.8%{opacity:0;transform:translateY(8px)}
    67.3%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfStack5{
    0%,66.7%{opacity:0;transform:translateY(8px)}
    68.2%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }
  @keyframes yfStack6{
    0%,67.6%{opacity:0;transform:translateY(8px)}
    69.1%{opacity:1;transform:none}
    96%{opacity:1}
    100%{opacity:0}
  }

  @keyframes yfLbl1{
    0%{opacity:0;transform:translateY(6px)}
    0.75%{opacity:1;transform:none}
    5%{opacity:1}
    6%,100%{opacity:0}
  }
  @keyframes yfLbl2{
    0%,6%{opacity:0;transform:translateY(6px)}
    6.75%{opacity:1;transform:none}
    10.5%{opacity:1}
    11.5%,100%{opacity:0}
  }
  @keyframes yfLbl3{
    0%,11.5%{opacity:0;transform:translateY(6px)}
    12.25%{opacity:1;transform:none}
    16.5%{opacity:1}
    17.5%,100%{opacity:0}
  }
  @keyframes yfLbl4{
    0%,17.5%{opacity:0;transform:translateY(6px)}
    18.25%{opacity:1;transform:none}
    23.25%{opacity:1}
    24.25%,100%{opacity:0}
  }
  @keyframes yfLbl5{
    0%,25%{opacity:0;transform:translateY(6px)}
    25.75%{opacity:1;transform:none}
    30%{opacity:1}
    31%,100%{opacity:0}
  }
  @keyframes yfLbl6{
    0%,31%{opacity:0;transform:translateY(6px)}
    31.75%{opacity:1;transform:none}
    35.5%{opacity:1}
    36.5%,100%{opacity:0}
  }
  @keyframes yfLbl7{
    0%,36.5%{opacity:0;transform:translateY(6px)}
    37.25%{opacity:1;transform:none}
    41.5%{opacity:1}
    42.5%,100%{opacity:0}
  }
  @keyframes yfLbl8{
    0%,42.5%{opacity:0;transform:translateY(6px)}
    43.25%{opacity:1;transform:none}
    48.25%{opacity:1}
    49.25%,100%{opacity:0}
  }
  @keyframes yfLbl9{
    0%,50%{opacity:0;transform:translateY(6px)}
    50.75%{opacity:1;transform:none}
    55%{opacity:1}
    56%,100%{opacity:0}
  }
  @keyframes yfLbl10{
    0%,56%{opacity:0;transform:translateY(6px)}
    56.75%{opacity:1;transform:none}
    60.5%{opacity:1}
    61.5%,100%{opacity:0}
  }
  @keyframes yfLbl11{
    0%,61.5%{opacity:0;transform:translateY(6px)}
    62.25%{opacity:1;transform:none}
    66.5%{opacity:1}
    67.5%,100%{opacity:0}
  }
  @keyframes yfLbl12{
    0%,67.5%{opacity:0;transform:translateY(6px)}
    68.25%{opacity:1;transform:none}
    91%{opacity:1}
    95%,100%{opacity:0}
  }

  /* accessibility: respect reduced motion, show the static end state */
  @media (prefers-reduced-motion: reduce){
    .yf *{animation:none !important}
    .yf .farm-inner{opacity:1 !important;transform:none !important}
    .yf .plant rect{transform:none !important;opacity:1 !important}
    .yf .stack ellipse{opacity:1 !important;transform:none !important}
    .yf .ret,.yf .coin-out,.yf .lbl{opacity:0 !important}
    .yf .lbl-static{opacity:1 !important}
    .yf .guide{animation:none !important}
  }
`;

export default function YealthFlywheel() {
  return (
    <div className="yf-wrap" style={{ width: "100%", maxWidth: 760, margin: "0 auto" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <svg className="yf" viewBox="0 0 800 460" role="img"
            aria-label="You own a farm. Your farm grows lettuce. The harvest pays you. You own more farms and the cycle repeats. Income grows with every farm.">
            <defs>
              <g id="yfCoin">
                <circle r="12" fill="#F5C842"/>
                <circle r="8.5" fill="none" stroke="#0A0A0A" strokeWidth="1.5" opacity=".35"/>
                <text y="4.5" textAnchor="middle" fontFamily="Quicksand, sans-serif" fontWeight="700" fontSize="13" fill="#0A0A0A">y</text>
              </g>
              <g id="yfLeaf">
                <path d="M0 -13 C7 -7 7 6 0 13 C-7 6 -7 -7 0 -13 Z" fill="#34D399"/>
                <path d="M0 -9 L0 9" stroke="#0E7C55" strokeWidth="1.4" fill="none"/>
              </g>
              <radialGradient id="yfGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F5C842" stopOpacity=".07"/>
                <stop offset="100%" stopColor="#F5C842" stopOpacity="0"/>
              </radialGradient>
            </defs>

            {/* ambient glow */}
            <ellipse cx="420" cy="230" rx="380" ry="200" fill="url(#yfGlow)"/>

            {/* faint dashed loop guides (top: money out, bottom: income back) */}
            <path className="guide" d="M 178 218 C 300 90 470 100 560 200"/>
            <path className="guide" d="M 560 200 C 480 360 300 370 178 240"/>

            {/* wallet (you) */}
            <g transform="translate(130,230)">
              <g className="wallet-inner">
                <rect x="-42" y="-28" width="84" height="56" rx="10" fill="#121212" stroke="#F5C842" strokeWidth="2"/>
                <rect x="-42" y="-28" width="84" height="20" rx="10" fill="#F5C842" opacity=".12"/>
                <circle cx="28" cy="-18" r="4" fill="#F5C842"/>
                <text x="0" y="12" textAnchor="middle" fontFamily="Quicksand, sans-serif" fontWeight="600" fontSize="14" fill="#F5C842">Wallet</text>
              </g>
            </g>

            {/* income stack: one coin added per cycle */}
            <g className="stack" transform="translate(130,312)">
              <ellipse className="s1" cx="-18" cy="0" rx="14" ry="5.5"/>
              <ellipse className="s2" cx="-18" cy="-8" rx="14" ry="5.5"/>
              <ellipse className="s3" cx="18" cy="0" rx="14" ry="5.5"/>
              <ellipse className="s4" cx="-18" cy="-16" rx="14" ry="5.5"/>
              <ellipse className="s5" cx="18" cy="-8" rx="14" ry="5.5"/>
              <ellipse className="s6" cx="18" cy="-16" rx="14" ry="5.5"/>
            </g>
            <text className="caption" x="130" y="352">You</text>

            {/* farms (vertical farms with shelves) */}
            <g transform="translate(560,320)">
              <g className="farm-inner f1i">
                <path className="shed" d="M -40 0 L -40 -75 A 40 40 0 0 1 40 -75 L 40 0 Z"/>
                <line className="shelf" x1="-40" y1="-75" x2="40" y2="-75"/>
                <line className="shelf" x1="-34" y1="-63" x2="34" y2="-63"/>
                <line className="shelf" x1="-34" y1="-31" x2="34" y2="-31"/>
                <g className="plant" transform="translate(-22,-3)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(0,-3)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(22,-3)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(-22,-34)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(0,-34)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(22,-34)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(-22,-66)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(0,-66)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(22,-66)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <text className="caption" y="20">Farm 1</text>
              </g>
            </g>

            <g transform="translate(665,320)">
              <g className="farm-inner f2i">
                <path className="shed" d="M -40 0 L -40 -75 A 40 40 0 0 1 40 -75 L 40 0 Z"/>
                <line className="shelf" x1="-40" y1="-75" x2="40" y2="-75"/>
                <line className="shelf" x1="-34" y1="-63" x2="34" y2="-63"/>
                <line className="shelf" x1="-34" y1="-31" x2="34" y2="-31"/>
                <g className="plant" transform="translate(-22,-3)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(0,-3)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(22,-3)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(-22,-34)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(0,-34)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(22,-34)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(-22,-66)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(0,-66)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(22,-66)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <text className="caption" y="20">Farm 2</text>
              </g>
            </g>

            <g transform="translate(455,320)">
              <g className="farm-inner f3i">
                <path className="shed" d="M -40 0 L -40 -75 A 40 40 0 0 1 40 -75 L 40 0 Z"/>
                <line className="shelf" x1="-40" y1="-75" x2="40" y2="-75"/>
                <line className="shelf" x1="-34" y1="-63" x2="34" y2="-63"/>
                <line className="shelf" x1="-34" y1="-31" x2="34" y2="-31"/>
                <g className="plant" transform="translate(-22,-3)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(0,-3)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(22,-3)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(-22,-34)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(0,-34)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(22,-34)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(-22,-66)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(0,-66)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <g className="plant" transform="translate(22,-66)"><rect x="-5" y="-15" width="10" height="15" rx="4"/></g>
                <text className="caption" y="20">Farm 3</text>
              </g>
            </g>

            {/* outbound coins: wallet to each new farm, one per cycle */}
            <g className="coin-out co1" style={{ offsetPath: "path('M 178 218 C 300 90 470 100 560 200')" }}><use href="#yfCoin"/></g>
            <g className="coin-out co2" style={{ offsetPath: "path('M 178 218 C 320 70 560 80 665 200')" }}><use href="#yfCoin"/></g>
            <g className="coin-out co3" style={{ offsetPath: "path('M 178 218 C 280 110 400 110 455 200')" }}><use href="#yfCoin"/></g>

            {/* returns: lettuce leaves the farm and becomes money mid-flight */}
            <g className="ret ret1" style={{ offsetPath: "path('M 560 200 C 480 360 300 370 178 240')" }}>
              <use className="retleaf" href="#yfLeaf"/>
              <use className="retcoin" href="#yfCoin"/>
            </g>
            <g className="ret ret2" style={{ offsetPath: "path('M 665 200 C 560 380 300 380 178 242')" }}>
              <use className="retleaf" href="#yfLeaf"/>
              <use className="retcoin" href="#yfCoin"/>
            </g>
            <g className="ret ret3" style={{ offsetPath: "path('M 455 200 C 400 350 280 350 178 240')" }}>
              <use className="retleaf" href="#yfLeaf"/>
              <use className="retcoin" href="#yfCoin"/>
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
