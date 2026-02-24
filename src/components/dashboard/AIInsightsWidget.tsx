import React, { useState, useMemo } from 'react';
import { Lightbulb, ThumbsUp, ThumbsDown, TrendingUp, TrendingDown } from 'lucide-react';
import { Tag, Tooltip } from 'antd';
import { AIInsight } from '@/data/dashboardData';

interface AIInsightsWidgetProps {
    insights: AIInsight[];
    title?: string;
    className?: string;
}

interface VoteState {
    upVotes: number;
    downVotes: number;
    userVote: 'up' | 'down' | null;
}

const AIInsightsWidget: React.FC<AIInsightsWidgetProps> = ({
    insights,
    title = "AI Insights",
    className = ""
}) => {
    // Initialize mock vote counts for each insight
    const [votes, setVotes] = useState<Record<number, VoteState>>(() => {
        const initial: Record<number, VoteState> = {};
        insights.forEach(insight => {
            // Generate realistic mock starting votes
            const base = insight.impact === 'high' ? 12 : insight.impact === 'medium' ? 8 : 4;
            initial[insight.id] = {
                upVotes: base + Math.floor(Math.random() * 5),
                downVotes: Math.floor(Math.random() * 4) + 1,
                userVote: null,
            };
        });
        return initial;
    });

    const handleVote = (insightId: number, type: 'up' | 'down') => {
        setVotes(prev => {
            const current = prev[insightId];
            if (!current) return prev;

            const wasUp = current.userVote === 'up';
            const wasDown = current.userVote === 'down';
            const isSameVote = current.userVote === type;

            let newUp = current.upVotes;
            let newDown = current.downVotes;

            // Remove previous vote if any
            if (wasUp) newUp--;
            if (wasDown) newDown--;

            // Toggle: if same vote clicked again, just remove it; otherwise apply new vote
            const newUserVote = isSameVote ? null : type;
            if (newUserVote === 'up') newUp++;
            if (newUserVote === 'down') newDown++;

            return {
                ...prev,
                [insightId]: { upVotes: newUp, downVotes: newDown, userVote: newUserVote },
            };
        });
    };

    // Sort insights by net votes (most positive first)
    const sortedInsights = useMemo(() => {
        return [...insights].sort((a, b) => {
            const aVote = votes[a.id];
            const bVote = votes[b.id];
            const aNet = (aVote?.upVotes ?? 0) - (aVote?.downVotes ?? 0);
            const bNet = (bVote?.upVotes ?? 0) - (bVote?.downVotes ?? 0);
            return bNet - aNet;
        });
    }, [insights, votes]);

    const getPositivePercentage = (v: VoteState) => {
        const total = v.upVotes + v.downVotes;
        if (total === 0) return 0;
        return Math.round((v.upVotes / total) * 100);
    };

    return (
        <div className={`bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-5 shadow-card border border-indigo-200 ${className}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">AI-driven actionable intelligence — ranked by community votes</p>
                </div>
            </div>

            <div className="space-y-3">
                {sortedInsights.map((insight, idx) => {
                    const v = votes[insight.id];
                    if (!v) return null;
                    const pct = getPositivePercentage(v);
                    const total = v.upVotes + v.downVotes;

                    return (
                        <div
                            key={insight.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 hover:shadow-sm ${insight.impact === 'high'
                                ? 'bg-green-50 border-green-200'
                                : insight.impact === 'medium'
                                    ? 'bg-yellow-50 border-yellow-200'
                                    : 'bg-white border-gray-200'
                                }`}
                        >
                            {/* Rank Badge */}
                            <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 shadow-sm border border-indigo-100">
                                {idx + 1}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <p className="text-sm text-foreground font-medium leading-relaxed">{insight.suggestion}</p>

                                {/* Reasoning and Source */}
                                <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-100">
                                    <p className="text-gray-600 mb-1">
                                        <span className="font-semibold text-gray-700">Reasoning: </span>
                                        {insight.reasoning}
                                    </p>
                                    <p className="text-gray-500 italic flex items-center gap-1">
                                        <span className="font-semibold not-italic text-gray-400">Source:</span> {insight.source}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <Tag
                                        color={insight.impact === 'high' ? 'green' : insight.impact === 'medium' ? 'gold' : 'default'}
                                        className="text-[10px] uppercase font-bold border-0"
                                    >
                                        {insight.impact} priority
                                    </Tag>
                                    <Tag color="geekblue" className="text-[10px] uppercase font-bold border-0">{insight.category}</Tag>
                                </div>
                            </div>

                            {/* Voting Section */}
                            <div className="flex flex-col items-center gap-1 flex-shrink-0 self-start mt-1 min-w-[70px]">
                                {/* Up vote */}
                                <button
                                    onClick={() => handleVote(insight.id, 'up')}
                                    className={`p-1.5 rounded-full transition-colors ${v.userVote === 'up'
                                        ? 'bg-green-100 text-green-600 shadow-inner'
                                        : 'text-gray-400 hover:bg-green-50 hover:text-green-500'
                                        }`}
                                    title="Helpful"
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                </button>

                                {/* Vote counts */}
                                <div className="flex items-center gap-1 text-xs">
                                    <span className="text-green-600 font-semibold">{v.upVotes}</span>
                                    <span className="text-gray-300">/</span>
                                    <span className="text-red-500 font-semibold">{v.downVotes}</span>
                                </div>

                                {/* Down vote */}
                                <button
                                    onClick={() => handleVote(insight.id, 'down')}
                                    className={`p-1.5 rounded-full transition-colors ${v.userVote === 'down'
                                        ? 'bg-red-100 text-red-600 shadow-inner'
                                        : 'text-gray-400 hover:bg-red-50 hover:text-red-500'
                                        }`}
                                    title="Not helpful"
                                >
                                    <ThumbsDown className="w-4 h-4" />
                                </button>

                                {/* Positive percentage */}
                                <Tooltip title={`${v.upVotes} up / ${v.downVotes} down (${total} total votes)`}>
                                    <div className={`flex items-center gap-0.5 mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${pct >= 70 ? 'bg-green-100 text-green-700' : pct >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {pct >= 50 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {pct}%
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AIInsightsWidget;
