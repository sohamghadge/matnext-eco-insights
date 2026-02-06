import React, { useState, ReactNode } from 'react';
import { Modal, Button } from 'antd';
import { Maximize2, X } from 'lucide-react';

interface ExpandableWidgetProps {
    title: string;
    children: ReactNode;
    className?: string;
}

const ExpandableWidget: React.FC<ExpandableWidgetProps> = ({ title, children, className = '' }) => {
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
                    title="Expand"
                />
                {children}
            </div>

            {/* Fullscreen Modal */}
            <Modal
                title={<span className="text-lg font-semibold">{title}</span>}
                open={isExpanded}
                onCancel={() => setIsExpanded(false)}
                footer={null}
                width="90vw"
                style={{ top: 20 }}
                styles={{ body: { height: '80vh', overflow: 'auto' } }}
                closeIcon={<X className="w-5 h-5" />}
            >
                <div className="h-full">{children}</div>
            </Modal>
        </>
    );
};

export default ExpandableWidget;
