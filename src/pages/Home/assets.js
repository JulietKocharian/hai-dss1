export const AINetworkSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c92d2" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        {/* Network nodes */}
        {[...Array(12)].map((_, i) => (
            <circle
                key={i}
                cx={50 + (i % 4) * 80}
                cy={50 + Math.floor(i / 4) * 80}
                r="8"
                fill="url(#aiGradient)"
                filter="url(#glow)"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
            />
        ))}
        {/* Connecting lines */}
        {[...Array(8)].map((_, i) => (
            <line
                key={i}
                x1={50 + (i % 4) * 80}
                y1={50 + Math.floor(i / 4) * 80}
                x2={130 + (i % 3) * 80}
                y2={130 + Math.floor(i / 3) * 80}
                stroke="url(#aiGradient)"
                strokeWidth="2"
                opacity="0.6"
            />
        ))}
    </svg>
);
export const ManagerDecisionSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="managerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c92d2" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Central Manager (Brain/Head) */}
        <circle
            cx="200"
            cy="150"
            r="25"
            fill="url(#managerGradient)"
            filter="url(#glow)"
            className="animate-pulse"
        />

        {/* Manager Icon (simplified head) */}
        <circle cx="200" cy="140" r="8" fill="white" opacity="0.9" />
        <path d="M185 160 Q200 170 215 160" fill="white" opacity="0.9" />

        {/* Decision Options (surrounding circles) */}
        {[
            { x: 120, y: 80, delay: '0s' },   // Top left
            { x: 280, y: 80, delay: '0.3s' }, // Top right
            { x: 320, y: 150, delay: '0.6s' }, // Right
            { x: 280, y: 220, delay: '0.9s' }, // Bottom right
            { x: 120, y: 220, delay: '1.2s' }, // Bottom left
            { x: 80, y: 150, delay: '1.5s' }   // Left
        ].map((option, i) => (
            <g key={i}>
                <circle
                    cx={option.x}
                    cy={option.y}
                    r="15"
                    fill="url(#managerGradient)"
                    opacity="0.7"
                    className="animate-pulse"
                    style={{ animationDelay: option.delay }}
                />
                {/* Option indicators */}
                <text
                    x={option.x}
                    y={option.y + 3}
                    textAnchor="middle"
                    className="text-xs font-bold fill-white"
                >
                    {i + 1}
                </text>
            </g>
        ))}

        {/* Decision Lines from manager to options */}
        {[
            { x: 120, y: 80 },
            { x: 280, y: 80 },
            { x: 320, y: 150 },
            { x: 280, y: 220 },
            { x: 120, y: 220 },
            { x: 80, y: 150 }
        ].map((option, i) => (
            <line
                key={i}
                x1="200"
                y1="150"
                x2={option.x}
                y2={option.y}
                stroke="url(#managerGradient)"
                strokeWidth="2"
                opacity="0.5"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
            />
        ))}

        {/* Decision Flow Arrows */}
        {[
            { startX: 160, startY: 120, endX: 140, endY: 100 },
            { startX: 240, startY: 120, endX: 260, endY: 100 }
        ].map((arrow, i) => (
            <g key={i}>
                <line
                    x1={arrow.startX}
                    y1={arrow.startY}
                    x2={arrow.endX}
                    y2={arrow.endY}
                    stroke="url(#managerGradient)"
                    strokeWidth="3"
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.5}s` }}
                />
                {/* Arrow head */}
                <polygon
                    points={`${arrow.endX},${arrow.endY} ${arrow.endX - 5},${arrow.endY + 8} ${arrow.endX + 5},${arrow.endY + 8}`}
                    fill="url(#managerGradient)"
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.5}s` }}
                />
            </g>
        ))}

        {/* Data Input streams */}
        {[
            { x: 50, y: 50 },
            { x: 350, y: 50 },
            { x: 50, y: 250 },
            { x: 350, y: 250 }
        ].map((stream, i) => (
            <g key={i}>
                <circle
                    cx={stream.x}
                    cy={stream.y}
                    r="6"
                    fill="url(#managerGradient)"
                    opacity="0.6"
                    className="animate-ping"
                    style={{ animationDelay: `${i * 0.3}s` }}
                />
                <line
                    x1={stream.x}
                    y1={stream.y}
                    x2={stream.x < 200 ? stream.x + 30 : stream.x - 30}
                    y2={stream.y < 150 ? stream.y + 30 : stream.y - 30}
                    stroke="url(#managerGradient)"
                    strokeWidth="1"
                    opacity="0.4"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                />
            </g>
        ))}
    </svg>
);

export const ExpertAnalysisSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="expertGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c92d2" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <radialGradient id="expertRadial" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#1c92d2" />
            </radialGradient>
            <filter id="expertGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Central Analysis Hub - Different from manager's circular design */}
        <polygon
            points="200,120 230,140 220,170 180,170 170,140"
            fill="url(#expertRadial)"
            filter="url(#expertGlow)"
            className="animate-pulse"
        />

        {/* Expert Symbol Inside */}
        <circle cx="200" cy="150" r="8" fill="white" opacity="0.9" />
        <path d="M195 145 L205 145 M200 140 L200 160 M195 155 L205 155"
            stroke="white" strokeWidth="2" opacity="0.8" />

        {/* Analysis Method Hexagons - Unique geometric style */}
        {[
            { x: 100, y: 70, label: 'ԱՏ', method: 'Անորոշ տրամաբանություն' },
            { x: 300, y: 70, label: 'ԿԱ', method: 'Կլաստերացում' },
            { x: 320, y: 200, label: 'ՍՑ', method: 'Սցենարային մոդելավորում' },
            { x: 80, y: 200, label: 'ՎՏ', method: 'Վիճակագրական տվյալներ' }
        ].map((method, i) => (
            <g key={i}>
                {/* Hexagonal shape instead of circles */}
                <polygon
                    points={`${method.x},${method.y - 12} ${method.x + 10},${method.y - 6} ${method.x + 10},${method.y + 6} ${method.x},${method.y + 12} ${method.x - 10},${method.y + 6} ${method.x - 10},${method.y - 6}`}
                    fill="url(#expertGradient)"
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.4}s` }}
                />
                <text
                    x={method.x}
                    y={method.y + 3}
                    textAnchor="middle"
                    className="text-xs font-bold fill-white"
                >
                    {method.label}
                </text>
            </g>
        ))}

        {/* Expert Analysis Waves - Flowing connections */}
        {[
            { x: 100, y: 70 },
            { x: 300, y: 70 },
            { x: 320, y: 200 },
            { x: 80, y: 200 }
        ].map((point, i) => (
            <path
                key={i}
                d={`M200,150 Q${(200 + point.x) / 2},${(150 + point.y) / 2 - 20} ${point.x},${point.y}`}
                fill="none"
                stroke="url(#expertGradient)"
                strokeWidth="3"
                opacity="0.6"
                strokeDasharray="8,4"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
            />
        ))}

        {/* Data Processing Nodes - Triangle clusters */}
        {[
            { x: 120, y: 240, cluster: 'A' },
            { x: 180, y: 250, cluster: 'B' },
            { x: 240, y: 245, cluster: 'C' },
            { x: 300, y: 235, cluster: 'D' }
        ].map((node, i) => (
            <g key={i}>
                <polygon
                    points={`${node.x},${node.y - 8} ${node.x - 7},${node.y + 4} ${node.x + 7},${node.y + 4}`}
                    fill="url(#expertGradient)"
                    opacity="0.7"
                    className="animate-ping"
                    style={{ animationDelay: `${i * 0.3}s` }}
                />
                <text
                    x={node.x}
                    y={node.y + 2}
                    textAnchor="middle"
                    className="text-xs font-bold fill-white"
                >
                    {node.cluster}
                </text>
            </g>
        ))}

        {/* Expert Decision Flows - Curved arrows */}
        {[
            { startX: 180, startY: 130, endX: 60, endY: 40, label: 'Սցենար Ա' },
            { startX: 220, startY: 130, endX: 340, endY: 40, label: 'Սցենար Բ' },
            { startX: 200, startY: 170, endX: 200, endY: 280, label: 'Սցենար Գ' }
        ].map((flow, i) => (
            <g key={i}>
                <path
                    d={`M${flow.startX},${flow.startY} Q${(flow.startX + flow.endX) / 2},${flow.startY - 30} ${flow.endX},${flow.endY}`}
                    fill="none"
                    stroke="url(#expertGradient)"
                    strokeWidth="4"
                    opacity="0.9"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.7}s` }}
                />
                <circle
                    cx={flow.endX}
                    cy={flow.endY}
                    r="4"
                    fill="url(#expertGradient)"
                    opacity="0.9"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.7}s` }}
                />
            </g>
        ))}

        {/* Armenian Scenario Labels */}
        <text x="60" y="35" className="text-xs font-bold fill-blue-600" opacity="0.9">
            Սցենար Ա
        </text>
        <text x="310" y="35" className="text-xs font-bold fill-blue-600" opacity="0.9">
            Սցենար Բ
        </text>
        <text x="170" y="295" className="text-xs font-bold fill-blue-600" opacity="0.9">
            Սցենար Գ
        </text>

        {/* Analysis Indicators */}
        {[...Array(6)].map((_, i) => (
            <circle
                key={i}
                cx={50 + i * 60}
                cy={30}
                r="3"
                fill="url(#expertGradient)"
                opacity="0.5"
                className="animate-ping"
                style={{ animationDelay: `${i * 0.2}s` }}
            />
        ))}
    </svg>
);
export const DecisionMakingSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="decisionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c92d2" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <radialGradient id="decisionRadial" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="70%" stopColor="#1c92d2" />
                <stop offset="100%" stopColor="#0f4c75" />
            </radialGradient>
            <filter id="decisionGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Central Decision Hub */}
        <circle
            cx="200"
            cy="150"
            r="35"
            fill="url(#decisionRadial)"
            filter="url(#decisionGlow)"
            className="animate-pulse"
        />

        {/* Inner decision symbol */}
        <path
            d="M185,135 L200,120 L215,135 L200,165 Z"
            fill="white"
            opacity="0.9"
        />
        <circle cx="200" cy="150" r="8" fill="white" opacity="0.7" />

        {/* Decision Criteria Nodes */}
        {[
            { x: 100, y: 80, delay: '0s' },
            { x: 300, y: 80, delay: '0.2s' },
            { x: 350, y: 180, delay: '0.4s' },
            { x: 300, y: 250, delay: '0.6s' },
            { x: 100, y: 250, delay: '0.8s' },
            { x: 50, y: 180, delay: '1s' }
        ].map((node, i) => (
            <g key={i}>
                <circle
                    cx={node.x}
                    cy={node.y}
                    r="18"
                    fill="url(#decisionGradient)"
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: node.delay }}
                />
                {/* Inner pattern */}
                <circle
                    cx={node.x}
                    cy={node.y}
                    r="8"
                    fill="white"
                    opacity="0.9"
                />
                <rect
                    x={node.x - 4}
                    y={node.y - 4}
                    width="8"
                    height="8"
                    fill="url(#decisionGradient)"
                    opacity="0.7"
                />
            </g>
        ))}

        {/* Decision Flow Lines */}
        {[
            { x: 100, y: 80 },
            { x: 300, y: 80 },
            { x: 350, y: 180 },
            { x: 300, y: 250 },
            { x: 100, y: 250 },
            { x: 50, y: 180 }
        ].map((point, i) => (
            <path
                key={i}
                d={`M200,150 L${point.x},${point.y}`}
                stroke="url(#decisionGradient)"
                strokeWidth="3"
                opacity="0.6"
                strokeDasharray="8,4"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
            />
        ))}

        {/* Alternative Options */}
        {[
            { x: 120, y: 40 },
            { x: 200, y: 30 },
            { x: 280, y: 40 }
        ].map((alt, i) => (
            <rect
                key={i}
                x={alt.x - 20}
                y={alt.y - 10}
                width="40"
                height="20"
                fill="url(#decisionGradient)"
                opacity="0.7"
                rx="10"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.4}s` }}
            />
        ))}

        {/* Decision Matrix Visualization */}
        {[...Array(4)].map((_, row) =>
            [...Array(6)].map((_, col) => (
                <circle
                    key={`${row}-${col}`}
                    cx={80 + col * 40}
                    cy={200 + row * 15}
                    r="4"
                    fill="url(#decisionGradient)"
                    opacity={0.4 + (row + col) * 0.05}
                    className="animate-pulse"
                    style={{ animationDelay: `${(row + col) * 0.1}s` }}
                />
            ))
        )}

        {/* Risk Indicators */}
        {[
            { x: 70, y: 120, risk: 'low' },
            { x: 330, y: 120, risk: 'high' }
        ].map((indicator, i) => (
            <g key={i}>
                <polygon
                    points={`${indicator.x},${indicator.y - 10} ${indicator.x + 8},${indicator.y + 5} ${indicator.x - 8},${indicator.y + 5}`}
                    fill={indicator.risk === 'low' ? "#22c55e" : "#ef4444"}
                    opacity="0.8"
                    className="animate-ping"
                    style={{ animationDelay: `${i * 0.8}s` }}
                />
            </g>
        ))}

        {/* Decision Flow Arrow */}
        <g>
            <path
                d="M200,185 L200,220"
                stroke="url(#decisionGradient)"
                strokeWidth="6"
                opacity="0.9"
                className="animate-pulse"
                style={{ animationDelay: '1.2s' }}
            />
            <polygon
                points="200,225 190,215 210,215"
                fill="url(#decisionGradient)"
                opacity="0.9"
                className="animate-pulse"
                style={{ animationDelay: '1.2s' }}
            />
        </g>

        {/* Outcome Indicator */}
        <ellipse
            cx="200"
            cy="270"
            rx="50"
            ry="15"
            fill="url(#decisionGradient)"
            opacity="0.6"
            className="animate-pulse"
            style={{ animationDelay: '1.5s' }}
        />

        {/* Secondary Decision Points */}
        {[...Array(8)].map((_, i) => (
            <circle
                key={i}
                cx={60 + i * 35}
                cy={50}
                r="3"
                fill="url(#decisionGradient)"
                opacity="0.5"
                className="animate-ping"
                style={{ animationDelay: `${i * 0.2}s` }}
            />
        ))}
    </svg>
);

export const AnalystWorkSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="analystGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c92d2" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <radialGradient id="analystRadial" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#1c92d2" />
            </radialGradient>
            <filter id="analystGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Central Data Crystal */}
        <polygon
            points="200,80 240,110 220,150 180,150 160,110"
            fill="url(#analystRadial)"
            filter="url(#analystGlow)"
            className="animate-pulse"
        />

        {/* Crystal Core */}
        <circle cx="200" cy="120" r="20" fill="white" opacity="0.8" />
        <circle cx="200" cy="120" r="12" fill="url(#analystGradient)" opacity="0.6" />
        <circle cx="200" cy="120" r="6" fill="white" opacity="0.9" />

        {/* Orbiting Data Particles */}
        {[...Array(12)].map((_, i) => {
            const angle = (i * 30) * Math.PI / 180;
            const radius = 60 + Math.sin(i * 0.5) * 10;
            const x = 200 + Math.cos(angle) * radius;
            const y = 120 + Math.sin(angle) * radius;

            return (
                <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="url(#analystGradient)"
                    opacity="0.7"
                    className="animate-pulse"
                    style={{
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: `${2 + Math.sin(i) * 0.5}s`
                    }}
                />
            );
        })}

        {/* Data Stream Spirals */}
        {[0, 1, 2].map((spiral) => (
            <path
                key={spiral}
                d={`M${50 + spiral * 20},${200 + spiral * 15} 
                    Q${100 + spiral * 30},${150 - spiral * 10} 
                    ${150 + spiral * 20},${120 + spiral * 5}
                    Q${180 + spiral * 10},${100 - spiral * 5}
                    ${200},${120}`}
                fill="none"
                stroke="url(#analystGradient)"
                strokeWidth="2"
                opacity="0.6"
                strokeDasharray="8,4"
                className="animate-pulse"
                style={{ animationDelay: `${spiral * 0.4}s` }}
            />
        ))}

        {/* Quality Indicators - Floating Gems */}
        {[
            { x: 320, y: 60, size: 8, quality: 95 },
            { x: 340, y: 120, size: 6, quality: 78 },
            { x: 320, y: 180, size: 10, quality: 89 },
            { x: 280, y: 200, size: 7, quality: 85 }
        ].map((gem, i) => (
            <g key={i}>
                <polygon
                    points={`${gem.x},${gem.y - gem.size} ${gem.x + gem.size * 0.6},${gem.y - gem.size * 0.3} ${gem.x + gem.size * 0.6},${gem.y + gem.size * 0.3} ${gem.x},${gem.y + gem.size} ${gem.x - gem.size * 0.6},${gem.y + gem.size * 0.3} ${gem.x - gem.size * 0.6},${gem.y - gem.size * 0.3}`}
                    fill="url(#analystGradient)"
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                />

                {/* Quality beam */}
                <line
                    x1="240"
                    y1="120"
                    x2={gem.x}
                    y2={gem.y}
                    stroke="url(#analystGradient)"
                    strokeWidth="1"
                    opacity="0.3"
                    strokeDasharray="3,3"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                />
            </g>
        ))}

        {/* Energy Waves */}
        {[...Array(6)].map((_, i) => (
            <circle
                key={i}
                cx="200"
                cy="120"
                r={30 + i * 15}
                fill="none"
                stroke="url(#analystGradient)"
                strokeWidth="1"
                opacity={0.4 - i * 0.06}
                className="animate-ping"
                style={{ animationDelay: `${i * 0.3}s` }}
            />
        ))}

        {/* Data Transformation Nodes */}
        {[
            { x: 80, y: 80, type: 'input' },
            { x: 60, y: 160, type: 'clean' },
            { x: 120, y: 240, type: 'filter' }
        ].map((node, i) => (
            <g key={i}>
                <circle
                    cx={node.x}
                    cy={node.y}
                    r="15"
                    fill="url(#analystGradient)"
                    opacity="0.7"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.5}s` }}
                />

                {/* Node pattern */}
                <circle cx={node.x} cy={node.y} r="8" fill="white" opacity="0.8" />
                <circle cx={node.x} cy={node.y} r="4" fill="url(#analystGradient)" opacity="0.9" />

                {/* Connection pulse */}
                <line
                    x1={node.x + 15}
                    y1={node.y}
                    x2="160"
                    y2="120"
                    stroke="url(#analystGradient)"
                    strokeWidth="2"
                    opacity="0.5"
                    strokeDasharray="6,6"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.4}s` }}
                />
            </g>
        ))}

        {/* Analytical Output Streams */}
        {[0, 1, 2].map((stream) => (
            <path
                key={stream}
                d={`M240,120 
                    Q${280 + stream * 15},${80 + stream * 20} 
                    ${320 + stream * 10},${120 + stream * 15}
                    Q${350 + stream * 5},${160 + stream * 10}
                    ${380},${200 + stream * 20}`}
                fill="none"
                stroke="url(#analystGradient)"
                strokeWidth="3"
                opacity="0.6"
                strokeDasharray="10,5"
                className="animate-pulse"
                style={{ animationDelay: `${1 + stream * 0.3}s` }}
            />
        ))}

        {/* Floating Data Bits */}
        {[...Array(15)].map((_, i) => (
            <rect
                key={i}
                x={50 + (i * 25) % 300}
                y={50 + Math.sin(i) * 20}
                width="3"
                height="3"
                fill="url(#analystGradient)"
                opacity="0.5"
                className="animate-ping"
                style={{ animationDelay: `${i * 0.15}s` }}
                transform={`rotate(${i * 30} ${50 + (i * 25) % 300} ${50 + Math.sin(i) * 20})`}
            />
        ))}

        {/* Progress Constellation */}
        {[...Array(8)].map((_, i) => (
            <circle
                key={i}
                cx={100 + i * 25}
                cy={280}
                r="2"
                fill="url(#analystGradient)"
                opacity={0.4 + i * 0.07}
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
            />
        ))}
    </svg>
);
export const ClusteringSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="clusterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c92d2" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <radialGradient id="clusterRadial1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#1c92d2" />
            </radialGradient>
            <radialGradient id="clusterRadial2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
            </radialGradient>
            <radialGradient id="clusterRadial3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
            </radialGradient>
            <filter id="clusterGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Cluster A - Blue Group */}
        <g>
            <circle cx="120" cy="80" r="25" fill="url(#clusterRadial1)" opacity="0.3" className="animate-pulse" />
            <circle cx="120" cy="80" r="8" fill="url(#clusterGradient)" filter="url(#clusterGlow)" className="animate-pulse" />

            {/* Cluster A Points */}
            {[
                { x: 100, y: 70 }, { x: 140, y: 65 }, { x: 110, y: 95 },
                { x: 135, y: 85 }, { x: 105, y: 85 }, { x: 125, y: 100 }
            ].map((point, i) => (
                <circle
                    key={`a-${i}`}
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill="url(#clusterGradient)"
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                />
            ))}
        </g>

        {/* Cluster B - Green Group */}
        <g>
            <circle cx="280" cy="100" r="30" fill="url(#clusterRadial2)" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
            <circle cx="280" cy="100" r="10" fill="#22c55e" filter="url(#clusterGlow)" className="animate-pulse" style={{ animationDelay: '0.5s' }} />

            {/* Cluster B Points */}
            {[
                { x: 260, y: 85 }, { x: 300, y: 80 }, { x: 270, y: 115 },
                { x: 295, y: 110 }, { x: 255, y: 105 }, { x: 285, y: 125 },
                { x: 265, y: 95 }, { x: 305, y: 95 }
            ].map((point, i) => (
                <circle
                    key={`b-${i}`}
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill="#22c55e"
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: `${0.5 + i * 0.15}s` }}
                />
            ))}
        </g>

        {/* Cluster C - Orange Group */}
        <g>
            <circle cx="200" cy="200" r="35" fill="url(#clusterRadial3)" opacity="0.3" className="animate-pulse" style={{ animationDelay: '1s' }} />
            <circle cx="200" cy="200" r="12" fill="#f59e0b" filter="url(#clusterGlow)" className="animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Cluster C Points */}
            {[
                { x: 175, y: 185 }, { x: 225, y: 180 }, { x: 185, y: 215 },
                { x: 220, y: 210 }, { x: 165, y: 200 }, { x: 235, y: 195 },
                { x: 190, y: 225 }, { x: 210, y: 175 }, { x: 180, y: 195 },
                { x: 215, y: 225 }
            ].map((point, i) => (
                <circle
                    key={`c-${i}`}
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill="#f59e0b"
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: `${1 + i * 0.1}s` }}
                />
            ))}
        </g>

        {/* K-Means Algorithm Visualization */}

        {/* Centroid Movement Lines */}
        <path
            d="M120,80 Q150,120 200,200"
            fill="none"
            stroke="url(#clusterGradient)"
            strokeWidth="2"
            opacity="0.4"
            strokeDasharray="5,5"
            className="animate-pulse"
            style={{ animationDelay: '1.5s' }}
        />

        <path
            d="M280,100 Q250,150 200,200"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            opacity="0.4"
            strokeDasharray="5,5"
            className="animate-pulse"
            style={{ animationDelay: '1.7s' }}
        />

        {/* Distance Measurement Lines */}
        {[
            { from: { x: 120, y: 80 }, to: { x: 280, y: 100 } },
            { from: { x: 120, y: 80 }, to: { x: 200, y: 200 } },
            { from: { x: 280, y: 100 }, to: { x: 200, y: 200 } }
        ].map((line, i) => (
            <line
                key={i}
                x1={line.from.x}
                y1={line.from.y}
                x2={line.to.x}
                y2={line.to.y}
                stroke="url(#clusterGradient)"
                strokeWidth="1"
                opacity="0.3"
                strokeDasharray="3,3"
                className="animate-pulse"
                style={{ animationDelay: `${2 + i * 0.2}s` }}
            />
        ))}

        {/* Data Flow from Processing */}
        <g>
            <rect
                x="50"
                y="20"
                width="60"
                height="20"
                fill="url(#clusterGradient)"
                opacity="0.6"
                rx="10"
                className="animate-pulse"
            />

            {/* Data stream arrows */}
            {[
                { target: { x: 120, y: 80 } },
                { target: { x: 280, y: 100 } },
                { target: { x: 200, y: 200 } }
            ].map((stream, i) => (
                <path
                    key={i}
                    d={`M80,40 Q${(80 + stream.target.x) / 2},${(40 + stream.target.y) / 2 - 20} ${stream.target.x},${stream.target.y}`}
                    fill="none"
                    stroke="url(#clusterGradient)"
                    strokeWidth="2"
                    opacity="0.5"
                    strokeDasharray="8,4"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                />
            ))}
        </g>

        {/* Hierarchical Clustering Tree */}
        <g transform="translate(320, 180)">
            {/* Tree branches */}
            <path
                d="M0,0 L0,20 M-15,20 L15,20 M-15,20 L-15,35 M15,20 L15,35"
                stroke="url(#clusterGradient)"
                strokeWidth="2"
                opacity="0.6"
                className="animate-pulse"
                style={{ animationDelay: '2.5s' }}
            />

            {/* Tree nodes */}
            <circle cx="-15" cy="35" r="3" fill="url(#clusterGradient)" />
            <circle cx="15" cy="35" r="3" fill="url(#clusterGradient)" />
            <circle cx="0" cy="0" r="4" fill="#22c55e" />
        </g>

        {/* DBSCAN Density Visualization */}
        {[...Array(15)].map((_, i) => (
            <circle
                key={i}
                cx={50 + (i % 5) * 15}
                cy={250 + Math.floor(i / 5) * 8}
                r="2"
                fill={i < 8 ? "url(#clusterGradient)" : i < 12 ? "#22c55e" : "#ef4444"}
                opacity="0.7"
                className="animate-ping"
                style={{ animationDelay: `${i * 0.1}s` }}
            />
        ))}

        {/* Quality Metrics Indicators */}
        <g transform="translate(340, 40)">
            {/* Quality bars */}
            {[85, 92, 78].map((quality, i) => (
                <rect
                    key={i}
                    x={i * 15}
                    y={30 - quality * 0.3}
                    width="10"
                    height={quality * 0.3}
                    fill={i === 0 ? "url(#clusterGradient)" : i === 1 ? "#22c55e" : "#f59e0b"}
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: `${3 + i * 0.2}s` }}
                />
            ))}
        </g>

        {/* Convergence Indicator */}
        <path
            d="M50,270 Q150,250 250,270 Q300,280 350,270"
            fill="none"
            stroke="url(#clusterGradient)"
            strokeWidth="3"
            opacity="0.6"
            className="animate-pulse"
            style={{ animationDelay: '3.5s' }}
        />

        {/* Iteration Counter */}
        {[...Array(6)].map((_, i) => (
            <circle
                key={i}
                cx={60 + i * 20}
                cy={280}
                r="2"
                fill="url(#clusterGradient)"
                opacity={0.3 + i * 0.1}
                className="animate-pulse"
                style={{ animationDelay: `${4 + i * 0.1}s` }}
            />
        ))}
    </svg>
);
export const SyntheticDataSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="syntheticGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c92d2" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="originalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="processGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <filter id="syntheticGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Original Data Source */}
        <g>
            <rect
                x="50"
                y="50"
                width="80"
                height="60"
                fill="url(#originalGradient)"
                opacity="0.8"
                rx="10"
                className="animate-pulse"
            />
            <rect
                x="55"
                y="55"
                width="70"
                height="50"
                fill="white"
                opacity="0.9"
                rx="5"
            />

            {/* Original data points */}
            {[...Array(12)].map((_, i) => (
                <circle
                    key={i}
                    cx={65 + (i % 4) * 15}
                    cy={65 + Math.floor(i / 4) * 12}
                    r="2"
                    fill="url(#originalGradient)"
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                />
            ))}
        </g>

        {/* AI Generation Engine */}
        <g transform="translate(200, 150)">
            {/* Main processor */}
            <circle
                cx="0"
                cy="0"
                r="40"
                fill="url(#syntheticGradient)"
                filter="url(#syntheticGlow)"
                className="animate-pulse"
            />

            {/* Inner processing rings */}
            {[15, 25, 35].map((radius, i) => (
                <circle
                    key={i}
                    cx="0"
                    cy="0"
                    r={radius}
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity={0.6 - i * 0.15}
                    className="animate-ping"
                    style={{ animationDelay: `${i * 0.3}s` }}
                />
            ))}

            {/* Central core */}
            <circle cx="0" cy="0" r="8" fill="white" opacity="0.9" />
            <circle cx="0" cy="0" r="4" fill="url(#syntheticGradient)" />
        </g>

        {/* Data Flow from Original to AI */}
        <path
            d="M130,80 Q165,115 160,150"
            fill="none"
            stroke="url(#originalGradient)"
            strokeWidth="4"
            opacity="0.7"
            strokeDasharray="10,5"
            className="animate-pulse"
            style={{ animationDelay: '0.5s' }}
        />

        {/* Flow particles */}
        {[...Array(6)].map((_, i) => (
            <circle
                key={i}
                cx={130 + i * 5}
                cy={80 + i * 12}
                r="2"
                fill="url(#originalGradient)"
                opacity="0.8"
                className="animate-ping"
                style={{ animationDelay: `${0.5 + i * 0.2}s` }}
            />
        ))}

        {/* Generation Methods */}
        {[
            { x: 160, y: 60, method: 'STAT', color: '#f59e0b' },
            { x: 240, y: 60, method: 'ML', color: '#ef4444' },
            { x: 160, y: 240, method: 'PAT', color: '#8b5cf6' },
            { x: 240, y: 240, method: 'INT', color: '#06b6d4' }
        ].map((method, i) => (
            <g key={i}>
                <polygon
                    points={`${method.x},${method.y - 8} ${method.x + 6},${method.y - 3} ${method.x + 6},${method.y + 3} ${method.x},${method.y + 8} ${method.x - 6},${method.y + 3} ${method.x - 6},${method.y - 3}`}
                    fill={method.color}
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: `${1 + i * 0.2}s` }}
                />

                {/* Connection to main processor */}
                <line
                    x1={method.x}
                    y1={method.y}
                    x2="200"
                    y2="150"
                    stroke={method.color}
                    strokeWidth="2"
                    opacity="0.4"
                    strokeDasharray="4,4"
                    className="animate-pulse"
                    style={{ animationDelay: `${1 + i * 0.2}s` }}
                />
            </g>
        ))}

        {/* Synthetic Data Output */}
        <g>
            <rect
                x="270"
                y="50"
                width="100"
                height="80"
                fill="url(#syntheticGradient)"
                opacity="0.8"
                rx="10"
                className="animate-pulse"
                style={{ animationDelay: '2s' }}
            />
            <rect
                x="275"
                y="55"
                width="90"
                height="70"
                fill="white"
                opacity="0.9"
                rx="5"
            />

            {/* Synthetic data points - more numerous */}
            {[...Array(24)].map((_, i) => (
                <circle
                    key={i}
                    cx={285 + (i % 6) * 12}
                    cy={65 + Math.floor(i / 6) * 12}
                    r="2"
                    fill="url(#syntheticGradient)"
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: `${2 + i * 0.05}s` }}
                />
            ))}
        </g>

        {/* Output Flow from AI to Synthetic */}
        <path
            d="M240,150 Q255,100 270,90"
            fill="none"
            stroke="url(#syntheticGradient)"
            strokeWidth="4"
            opacity="0.7"
            strokeDasharray="10,5"
            className="animate-pulse"
            style={{ animationDelay: '1.8s' }}
        />

        {/* Quality Indicators */}
        {[
            { x: 320, y: 150, quality: 95 },
            { x: 350, y: 170, quality: 88 },
            { x: 300, y: 180, quality: 92 }
        ].map((indicator, i) => (
            <g key={i}>
                <circle
                    cx={indicator.x}
                    cy={indicator.y}
                    r="8"
                    fill="url(#syntheticGradient)"
                    opacity="0.7"
                    className="animate-pulse"
                    style={{ animationDelay: `${2.5 + i * 0.2}s` }}
                />
                <circle
                    cx={indicator.x}
                    cy={indicator.y}
                    r="4"
                    fill="white"
                    opacity="0.9"
                />
            </g>
        ))}

        {/* Statistical Distribution Preservation */}
        <path
            d="M50,200 Q100,180 150,200 Q200,220 250,200 Q300,180 350,200"
            fill="none"
            stroke="url(#processGradient)"
            strokeWidth="3"
            opacity="0.6"
            strokeDasharray="6,3"
            className="animate-pulse"
            style={{ animationDelay: '1.5s' }}
        />

        {/* Noise Addition */}
        {[...Array(8)].map((_, i) => (
            <circle
                key={i}
                cx={80 + i * 35}
                cy={240 + Math.sin(i) * 10}
                r="1.5"
                fill="#ef4444"
                opacity="0.6"
                className="animate-ping"
                style={{ animationDelay: `${i * 0.3}s` }}
            />
        ))}

        {/* Progress Visualization */}
        <g transform="translate(50, 270)">
            {[...Array(10)].map((_, i) => (
                <rect
                    key={i}
                    x={i * 30}
                    y="0"
                    width="25"
                    height="8"
                    fill="url(#syntheticGradient)"
                    opacity={0.3 + i * 0.07}
                    rx="4"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                />
            ))}
        </g>

        {/* Data Augmentation Symbols */}
        {[
            { x: 70, y: 30, symbol: '+' },
            { x: 170, y: 30, symbol: '×' },
            { x: 230, y: 30, symbol: '∑' },
            { x: 330, y: 30, symbol: '≈' }
        ].map((sym, i) => (
            <text
                key={i}
                x={sym.x}
                y={sym.y}
                textAnchor="middle"
                className="text-sm font-bold fill-blue-600"
                opacity="0.8"
            >
                {sym.symbol}
            </text>
        ))}

        {/* Generation Stream */}
        <g>
            {[...Array(5)].map((_, i) => (
                <path
                    key={i}
                    d={`M${160 + i * 8},150 Q${180 + i * 8},${140 - i * 2} ${200 + i * 8},150`}
                    fill="none"
                    stroke="url(#syntheticGradient)"
                    strokeWidth="1"
                    opacity={0.5 - i * 0.08}
                    className="animate-pulse"
                    style={{ animationDelay: `${2 + i * 0.1}s` }}
                />
            ))}
        </g>
    </svg>
);
export const DataVisualizationSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c92d2" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
        </defs>
        {/* Chart bars */}
        {[40, 80, 60, 120, 90, 150, 110].map((height, i) => (
            <rect
                key={i}
                x={40 + i * 45}
                y={200 - height}
                width="30"
                height={height}
                fill="url(#chartGradient)"
                opacity="0.8"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
            />
        ))}
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
            <line
                key={i}
                x1="30"
                y1={50 + i * 40}
                x2="350"
                y2={50 + i * 40}
                stroke="#64748B"
                strokeWidth="1"
                opacity="0.3"
            />
        ))}
    </svg>
);

export const SecuritySVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="shieldGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1c92d2" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
        </defs>
        {/* Shield shape */}
        <path
            d="M200 50 L250 80 L250 180 L200 220 L150 180 L150 80 Z"
            fill="url(#shieldGradient)"
            opacity="0.8"
            className="animate-pulse"
        />
        {/* Security rings */}
        {[0, 1, 2].map((i) => (
            <circle
                key={i}
                cx="200"
                cy="135"
                r={60 + i * 30}
                fill="none"
                stroke="#1c92d2"
                strokeWidth="2"
                opacity={0.6 - i * 0.2}
                className="animate-ping"
                style={{ animationDelay: `${i * 1}s` }}
            />
        ))}
        {/* Lock icon */}
        <rect x="185" y="120" width="30" height="20" fill="white" rx="3" />
        <path d="M190 120 L190 110 Q190 105 195 105 L205 105 Q210 105 210 110 L210 120"
            fill="none" stroke="white" strokeWidth="3" />
    </svg>
);

export const TargetingSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="targetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c92d2" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
        </defs>
        {/* Target circles */}
        {[30, 50, 70, 90].map((r, i) => (
            <circle
                key={i}
                cx="200"
                cy="150"
                r={r}
                fill="none"
                stroke="url(#targetGradient)"
                strokeWidth="3"
                opacity={1 - i * 0.2}
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
            />
        ))}
        {/* Center dot */}
        <circle cx="200" cy="150" r="8" fill="url(#targetGradient)" className="animate-ping" />
        {/* Crosshairs */}
        <line x1="120" y1="150" x2="280" y2="150" stroke="url(#targetGradient)" strokeWidth="2" opacity="0.7" />
        <line x1="200" y1="70" x2="200" y2="230" stroke="url(#targetGradient)" strokeWidth="2" opacity="0.7" />
    </svg>
);

export const ActivitySVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="activityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c92d2" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
        </defs>
        {/* Activity line */}
        <path
            d="M50 150 L80 120 L110 180 L140 100 L170 160 L200 80 L230 140 L260 200 L290 120 L320 170 L350 130"
            fill="none"
            stroke="url(#activityGradient)"
            strokeWidth="4"
            className="animate-pulse"
        />
        {/* Data points */}
        {[80, 110, 140, 170, 200, 230, 260, 290, 320].map((x, i) => (
            <circle
                key={i}
                cx={x}
                cy={[120, 180, 100, 160, 80, 140, 200, 120, 170][i]}
                r="6"
                fill="url(#activityGradient)"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
            />
        ))}
    </svg>
);

export const TeamSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="teamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c92d2" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
        </defs>
        {/* Team members */}
        {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
                <circle
                    cx={120 + i * 40}
                    cy={120}
                    r="25"
                    fill="url(#teamGradient)"
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                />
                <circle
                    cx={120 + i * 40}
                    cy={110}
                    r="12"
                    fill="white"
                    opacity="0.9"
                />
                <path
                    d={`M${108 + i * 40} 130 Q${120 + i * 40} 140 ${132 + i * 40} 130`}
                    fill="white"
                    opacity="0.9"
                />
            </g>
        ))}
        {/* Connection lines */}
        {[0, 1, 2, 3].map((i) => (
            <line
                key={i}
                x1={145 + i * 40}
                y1="120"
                x2={175 + i * 40}
                y2="120"
                stroke="url(#teamGradient)"
                strokeWidth="3"
                opacity="0.6"
            />
        ))}
    </svg>
);

export const HeroBackgroundSVG = () => (
    <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
        <defs>
            <radialGradient id="heroGradient" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#1c92d2" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
            </radialGradient>
        </defs>
        {/* Floating geometric shapes */}
        {[...Array(20)].map((_, i) => (
            <g key={i}>
                <circle
                    cx={Math.random() * 1200}
                    cy={Math.random() * 800}
                    r={5 + Math.random() * 15}
                    fill="url(#heroGradient)"
                    className="animate-pulse"
                    style={{
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                    }}
                />
            </g>
        ))}
        {/* Neural network pattern */}
        <g opacity="0.2">
            {[...Array(50)].map((_, i) => (
                <line
                    key={i}
                    x1={Math.random() * 1200}
                    y1={Math.random() * 800}
                    x2={Math.random() * 1200}
                    y2={Math.random() * 800}
                    stroke="#1c92d2"
                    strokeWidth="1"
                />
            ))}
        </g>
    </svg>
);