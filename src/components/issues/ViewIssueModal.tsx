import React from 'react';
import { Modal, Tag, Divider, Typography, Space, Button, Timeline } from 'antd';
import {
    Calendar,
    User,
    FileText,
    AlertTriangle,
    Paperclip,
    Clock,
    MessageSquare,
    X
} from 'lucide-react';
import { Issue, getPriorityColor, getStatusColor, getStatusBgColor } from '@/data/issueData';

const { Text, Paragraph, Title } = Typography;

interface ViewIssueModalProps {
    issue: Issue | null;
    open: boolean;
    onClose: () => void;
    onRespond: () => void;
    onResolve: () => void;
}

const ViewIssueModal: React.FC<ViewIssueModalProps> = ({
    issue,
    open,
    onClose,
    onRespond,
    onResolve,
}) => {
    if (!issue) return null;

    const canRespond = issue.status !== 'Closed' && issue.status !== 'Resolved';
    const canResolve = issue.status !== 'Closed' && issue.status !== 'Resolved';

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={720}
            centered
            closeIcon={<X className="w-5 h-5" />}
            className="issue-modal rounded-2xl overflow-hidden"
            style={{ padding: 0 }}
        >
            {/* Header */}
            <div
                className="px-6 py-5"
                style={{
                    background: 'linear-gradient(135deg, #4b6043 0%, #5a7350 100%)',
                    margin: '-24px -24px 24px -24px',
                }}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <Text className="text-white/80 text-sm font-medium">
                            Ticket #{issue.ticketNumber}
                        </Text>
                        <Title level={4} className="!text-white !mb-0 !mt-1">
                            {issue.subject}
                        </Title>
                    </div>
                    <Tag
                        style={{
                            backgroundColor: getStatusBgColor(issue.status),
                            color: getStatusColor(issue.status),
                            border: 'none',
                            fontWeight: 600,
                            padding: '4px 12px',
                            borderRadius: '20px',
                        }}
                    >
                        {issue.status}
                    </Tag>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-5">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <Text className="text-gray-500 text-xs font-medium">Business Name</Text>
                            <Text className="block font-semibold text-gray-800">{issue.raisedBy}</Text>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <Text className="text-gray-500 text-xs font-medium">Issue Type</Text>
                            <Text className="block font-semibold text-gray-800">{issue.issueType}</Text>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${getPriorityColor(issue.priority)}20` }}
                        >
                            <AlertTriangle
                                className="w-5 h-5"
                                style={{ color: getPriorityColor(issue.priority) }}
                            />
                        </div>
                        <div>
                            <Text className="text-gray-500 text-xs font-medium">Priority</Text>
                            <Tag
                                style={{
                                    backgroundColor: `${getPriorityColor(issue.priority)}15`,
                                    color: getPriorityColor(issue.priority),
                                    border: `1px solid ${getPriorityColor(issue.priority)}40`,
                                    fontWeight: 600,
                                    margin: 0,
                                }}
                            >
                                {issue.priority}
                            </Tag>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <Text className="text-gray-500 text-xs font-medium">Due Date</Text>
                            <Text className="block font-semibold text-gray-800">
                                {issue.dueDate || 'Not set'}
                            </Text>
                        </div>
                    </div>
                </div>

                <Divider className="!my-4" />

                {/* Description */}
                <div>
                    <Text className="text-gray-500 text-sm font-medium mb-2 block">
                        Issue Description
                    </Text>
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <Paragraph className="!mb-0 text-gray-700">
                            {issue.issueDescription}
                        </Paragraph>
                    </div>
                </div>

                {/* Attachments */}
                {issue.attachments && issue.attachments.length > 0 && (
                    <div>
                        <Text className="text-gray-500 text-sm font-medium mb-2 block">
                            <Paperclip className="w-4 h-4 inline mr-1" />
                            Attachments
                        </Text>
                        <div className="flex flex-wrap gap-2">
                            {issue.attachments.map((file, idx) => (
                                <Tag
                                    key={idx}
                                    className="!px-3 !py-1.5 !rounded-lg !bg-blue-50 !text-blue-700 !border-blue-200 cursor-pointer hover:!bg-blue-100 transition-colors"
                                >
                                    <Paperclip className="w-3 h-3 inline mr-1" />
                                    {file}
                                </Tag>
                            ))}
                        </div>
                    </div>
                )}

                {/* Response History */}
                {issue.responses && issue.responses.length > 0 && (
                    <div>
                        <Text className="text-gray-500 text-sm font-medium mb-3 block">
                            <MessageSquare className="w-4 h-4 inline mr-1" />
                            Response History
                        </Text>
                        <Timeline
                            items={issue.responses.map(resp => ({
                                color: 'green',
                                children: (
                                    <div className="bg-green-50 p-3 rounded-lg -mt-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Text className="font-semibold text-gray-800">{resp.responder}</Text>
                                            <Text className="text-gray-400 text-xs flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {resp.timestamp}
                                            </Text>
                                        </div>
                                        <Text className="text-gray-600">{resp.message}</Text>
                                    </div>
                                ),
                            }))}
                        />
                    </div>
                )}

                <Divider className="!my-4" />

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <Button onClick={onClose} size="large">
                        Close
                    </Button>
                    {canRespond && (
                        <Button
                            type="primary"
                            onClick={onRespond}
                            size="large"
                            className="!bg-blue-600 hover:!bg-blue-700"
                            icon={<MessageSquare className="w-4 h-4" />}
                        >
                            Respond
                        </Button>
                    )}
                    {canResolve && (
                        <Button
                            type="primary"
                            onClick={onResolve}
                            size="large"
                            className="!bg-green-600 hover:!bg-green-700"
                        >
                            Mark as Resolved
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ViewIssueModal;
