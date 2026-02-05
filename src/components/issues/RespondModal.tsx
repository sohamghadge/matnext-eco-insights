import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { X, Send, MessageSquare } from 'lucide-react';
import { Issue } from '@/data/issueData';

const { TextArea } = Input;

interface RespondModalProps {
    issue: Issue | null;
    open: boolean;
    onClose: () => void;
    onSubmit: (response: string) => void;
}

const RespondModal: React.FC<RespondModalProps> = ({
    issue,
    open,
    onClose,
    onSubmit,
}) => {
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    if (!issue) return null;

    const handleSubmit = async () => {
        if (!response.trim()) {
            message.warning('Please enter a response');
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            onSubmit(response);
            setResponse('');
            setLoading(false);
            message.success('Response sent successfully!');
        }, 500);
    };

    const handleClose = () => {
        setResponse('');
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            width={560}
            centered
            closeIcon={<X className="w-5 h-5" />}
            className="rounded-2xl overflow-hidden"
            style={{ padding: 0 }}
        >
            {/* Header */}
            <div
                className="px-6 py-5"
                style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    margin: '-24px -24px 24px -24px',
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-semibold">Respond to Issue</h3>
                        <p className="text-white/70 text-sm">Ticket #{issue.ticketNumber} - {issue.subject}</p>
                    </div>
                </div>
            </div>

            {/* Issue Context */}
            <div className="mb-5 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Raised by</span>
                    <span className="font-semibold text-gray-800">{issue.raisedBy}</span>
                </div>
                <div className="text-gray-600 text-sm">
                    <span className="text-gray-500">Description: </span>
                    {issue.issueDescription}
                </div>
            </div>

            {/* Response Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Response
                </label>
                <TextArea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={5}
                    placeholder="Type your response here..."
                    className="!rounded-lg"
                    style={{ resize: 'none' }}
                />
                <p className="text-xs text-gray-400 mt-2">
                    💡 Your response will be notified to {issue.raisedBy} and associated OEM
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-gray-100">
                <Button onClick={handleClose} size="large">
                    Cancel
                </Button>
                <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    size="large"
                    className="!bg-blue-600 hover:!bg-blue-700"
                    icon={<Send className="w-4 h-4" />}
                >
                    Send Response
                </Button>
            </div>
        </Modal>
    );
};

export default RespondModal;
