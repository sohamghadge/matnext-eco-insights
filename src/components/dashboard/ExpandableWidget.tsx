import React, { useState, ReactNode } from 'react';
import { Modal, Button } from 'antd';
import { Maximize2, X } from 'lucide-react';

interface ExpandableWidgetProps {
    title: string;
    children: ReactNode;
    expandedContent?: ReactNode;
    className?: string;
}

const ExpandableWidget: React.FC<ExpandableWidgetProps> = ({ title, children, expandedContent, className = '' }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <div className={`relative group ${className}`}>
                {/* Expand button - shows on hover */}
                <Button
                    type="text"
                    size="small"
                    onClick={() => setIsExpanded(true)}
                    className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white shadow-sm"
                    icon={<Maximize2 className="w-4 h-4" />}
                    title="Expand View"
                />
                {children}
            </div>

            {/* Fullscreen Modal */}
            <Modal
                title={<span className="text-xl font-bold">{title}</span>}
                open={isExpanded}
                onCancel={() => setIsExpanded(false)}
                footer={null}
                width="95vw"
                style={{ top: 20 }}
                styles={{ body: { height: '85vh', overflow: 'auto', padding: '24px' } }}
                closeIcon={<X className="w-6 h-6 hover:text-red-500 transition-colors" />}
                centered
            >
                <div className="h-full">
                    {expandedContent || children}
                </div>
            </Modal>
        </>
    );
};

export default ExpandableWidget;
