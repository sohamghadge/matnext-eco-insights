import React, { useState } from 'react';
import { Lightbulb, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Tag, message, notification } from 'antd';
import { AIInsight } from '@/data/dashboardData';

interface AIInsightsWidgetProps {
    insights: AIInsight[];
    title?: string;
    className?: string;
}

const AIInsightsWidget: React.FC<AIInsightsWidgetProps> = ({
    insights,
    title = "AI Insights",
    className = ""
}) => {
    const [feedbackState, setFeedbackState] = useState<Record<number, 'up' | 'down' | null>>({});
    const [dismissedIds, setDismissedIds] = useState<number[]>([]);
    const [animatingId, setAnimatingId] = useState<number | null>(null);
    const [replenishmentCount, setReplenishmentCount] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);

    const MAX_REPLENISHMENTS = 1;

    // Filter out dismissed insights and take the top N based on visibleCount
    const visibleInsights = insights
        .filter(insight => !dismissedIds.includes(insight.id))
        .slice(0, visibleCount);

    const handleFeedback = (insightId: number, type: 'up' | 'down') => {
        // Toggle logic
        const newType = feedbackState[insightId] === type ? null : type;

        setFeedbackState(prev => ({
            ...prev,
            [insightId]: newType,
        }));

        if (newType === 'up') {
            notification.success({
                message: 'Feedback Received',
                description: 'You will receive more of these types of insights.',
                placement: 'bottomRight',
                duration: 3,
                icon: <ThumbsUp className="text-green-500" />,
                style: { borderRadius: '12px', border: '1px solid #b7eb8f', backgroundColor: '#f6ffed' }
            });
        } else if (newType === 'down') {
            const canReplenish = replenishmentCount < MAX_REPLENISHMENTS;

            notification.info({
                message: canReplenish ? 'Feedback Received' : 'Insight Removed',
                description: canReplenish
                    ? 'We have replaced this insight with a new suggestion.'
                    : 'Thanks for your feedback. We have removed this insight.',
                placement: 'bottomRight',
                duration: 3,
                icon: <ThumbsDown className={canReplenish ? "text-orange-500" : "text-red-500"} />,
                style: {
                    borderRadius: '12px',
                    border: canReplenish ? '1px solid #ffd591' : '1px solid #ffa39e',
                    backgroundColor: canReplenish ? '#fff7e6' : '#fff1f0'
                }
            });

            setAnimatingId(insightId);

            // Wait for animation to finish before removing from list
            setTimeout(() => {
                setDismissedIds(prev => [...prev, insightId]);
                setAnimatingId(null);

                if (canReplenish) {
                    setReplenishmentCount(prev => prev + 1);
                    // visibleCount stays same, so next one fills in
                } else {
                    setVisibleCount(prev => Math.max(0, prev - 1));
                    // visibleCount decreases, so no new one fills in
                }
            }, 500); // 500ms to match transition
        }
    };

    return (
        <div className={`bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-5 shadow-card border border-indigo-200 ${className}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">AI-driven actionable intelligence</p>
                </div>
            </div>

            <div className="space-y-3">
                {visibleInsights.map((insight) => (
                    <div
                        key={insight.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-500 ease-in-out hover:shadow-sm ${insight.impact === 'high'
                            ? 'bg-green-50 border-green-200'
                            : insight.impact === 'medium'
                                ? 'bg-yellow-50 border-yellow-200'
                                : 'bg-white border-gray-200'
                            } ${animatingId === insight.id ? 'opacity-0 transform translate-x-10 scale-95 pointer-events-none' : 'opacity-100 transform translate-x-0 scale-100'}
                             ${!animatingId && !dismissedIds.includes(insight.id) ? 'animate-in fade-in slide-in-from-bottom-4 duration-500' : ''}
                            `}
                    >
                        <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 shadow-sm border border-indigo-100">
                            {insight.id}
                        </div>
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

                        {/* Feedback Buttons */}
                        <div className="flex items-center gap-1 flex-shrink-0 self-start mt-1">
                            <button
                                onClick={() => handleFeedback(insight.id, 'up')}
                                className={`p-1.5 rounded-full transition-colors ${feedbackState[insight.id] === 'up'
                                    ? 'bg-green-100 text-green-600 shadow-inner'
                                    : 'text-gray-400 hover:bg-green-50 hover:text-green-500'
                                    }`}
                                title="Helpful"
                            >
                                <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleFeedback(insight.id, 'down')}
                                className={`p-1.5 rounded-full transition-colors ${feedbackState[insight.id] === 'down'
                                    ? 'bg-red-100 text-red-600 shadow-inner'
                                    : 'text-gray-400 hover:bg-red-50 hover:text-red-500'
                                    }`}
                                title="Not helpful"
                            >
                                <ThumbsDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AIInsightsWidget;
