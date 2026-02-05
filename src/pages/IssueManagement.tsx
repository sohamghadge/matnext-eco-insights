import React, { useState, useMemo } from 'react';
import { Table, Tag, Button, Input, Select, Space, Tooltip, Dropdown, message, Modal, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    Plus,
    Search,
    Filter,
    Eye,
    MessageSquare,
    CheckCircle,
    Edit,
    MoreHorizontal,
    AlertCircle,
    Calendar,
    RefreshCw,
    Download,
    SlidersHorizontal,
    ArrowUpDown
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import ViewIssueModal from '@/components/issues/ViewIssueModal';
import RaiseIssueModal, { RaiseIssueFormValues } from '@/components/issues/RaiseIssueModal';
import RespondModal from '@/components/issues/RespondModal';
import {
    Issue,
    issuesData,
    getPriorityColor,
    getPriorityRowBg,
    getPriorityRowShadow,
    getStatusColor,
    getStatusBgColor,
    Priority,
    IssueStatus,
    IssueType,
    issueTypeOptions,
    priorityOptions,
    statusOptions,
    assignees,
    Assignee
} from '@/data/issueData';

const { Option } = Select;

const IssueManagement: React.FC = () => {
    // State
    const [issues, setIssues] = useState<Issue[]>(issuesData);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState<IssueType | 'All'>('All');
    const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All');
    const [filterStatus, setFilterStatus] = useState<IssueStatus | 'All'>('All');
    const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

    // Modal states
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [raiseModalOpen, setRaiseModalOpen] = useState(false);
    const [respondModalOpen, setRespondModalOpen] = useState(false);

    // Filter and sort issues
    const filteredIssues = useMemo(() => {
        let result = [...issues];

        // Search filter
        if (searchText) {
            const lower = searchText.toLowerCase();
            result = result.filter(issue =>
                issue.ticketNumber.toLowerCase().includes(lower) ||
                issue.raisedBy.toLowerCase().includes(lower) ||
                issue.subject.toLowerCase().includes(lower) ||
                issue.issueDescription.toLowerCase().includes(lower)
            );
        }

        // Type filter
        if (filterType !== 'All') {
            result = result.filter(issue => issue.issueType === filterType);
        }

        // Priority filter
        if (filterPriority !== 'All') {
            result = result.filter(issue => issue.priority === filterPriority);
        }

        // Status filter
        if (filterStatus !== 'All') {
            result = result.filter(issue => issue.status === filterStatus);
        }

        // Sort
        if (sortBy === 'priority') {
            const priorityOrder: Record<Priority, number> = { 'Urgent': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
            result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else {
            // Sort by date (newest first)
            result.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
        }

        return result;
    }, [issues, searchText, filterType, filterPriority, filterStatus, sortBy]);

    // Handlers
    const handleViewIssue = (issue: Issue) => {
        setSelectedIssue(issue);
        setViewModalOpen(true);
    };

    const handleRespond = (issue: Issue) => {
        setSelectedIssue(issue);
        setRespondModalOpen(true);
    };

    const handleResolve = (issue: Issue) => {
        Modal.confirm({
            title: 'Resolve Issue',
            content: `Are you sure you want to mark issue #${issue.ticketNumber} as resolved?`,
            okText: 'Yes, Resolve',
            okButtonProps: { className: '!bg-green-600 hover:!bg-green-700' },
            onOk: () => {
                setIssues(prev => prev.map(i =>
                    i.ticketNumber === issue.ticketNumber
                        ? { ...i, status: 'Resolved' as IssueStatus }
                        : i
                ));
                message.success(`Issue #${issue.ticketNumber} has been resolved!`);
                setViewModalOpen(false);
            },
        });
    };

    const handleRaiseIssue = (values: RaiseIssueFormValues) => {
        const newIssue: Issue = {
            ticketNumber: String(9000 + issues.length),
            raisedBy: values.businessName,
            issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            subject: values.subject,
            issueType: values.issueType as IssueType,
            priority: values.priority as Priority,
            issueDescription: values.issueDescription,
            status: 'Open',
            dueDate: values.dueDate,
            attachments: [],
            responses: [],
            assignee: assignees[Math.floor(Math.random() * assignees.length)], // Random assignee
        };

        setIssues(prev => [newIssue, ...prev]);
        setRaiseModalOpen(false);
    };

    const handleSubmitResponse = (response: string) => {
        if (selectedIssue) {
            const newResponse = {
                id: `resp-${Date.now()}`,
                responder: 'You',
                message: response,
                timestamp: new Date().toLocaleString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
            };

            setIssues(prev => prev.map(i =>
                i.ticketNumber === selectedIssue.ticketNumber
                    ? {
                        ...i,
                        status: i.status === 'Open' ? 'In Progress' as IssueStatus : i.status,
                        responses: [...(i.responses || []), newResponse]
                    }
                    : i
            ));

            setRespondModalOpen(false);
        }
    };

    const clearFilters = () => {
        setSearchText('');
        setFilterType('All');
        setFilterPriority('All');
        setFilterStatus('All');
    };

    const handleExport = () => {
        const headers = ['Ticket Number', 'Raised By', 'Issue Date', 'Subject', 'Type', 'Priority', 'Assignee', 'Status', 'Description'];
        const csvContent = [
            headers.join(','),
            ...filteredIssues.map(issue => [
                issue.ticketNumber,
                `"${issue.raisedBy}"`,
                `"${issue.issueDate}"`,
                `"${issue.subject.replace(/"/g, '""')}"`,
                issue.issueType,
                issue.priority,
                `"${issue.assignee?.name || ''}"`,
                issue.status,
                `"${issue.issueDescription.replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `issues_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Table columns
    const columns: ColumnsType<Issue> = [
        {
            title: 'Ticket #',
            dataIndex: 'ticketNumber',
            key: 'ticketNumber',
            width: 100,
            render: (text: string) => (
                <span className="font-mono font-semibold text-primary">#{text}</span>
            ),
        },
        {
            title: 'Raised By',
            dataIndex: 'raisedBy',
            key: 'raisedBy',
            width: 180,
            render: (text: string) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {text.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <span className="font-medium text-gray-700">{text}</span>
                </div>
            ),
        },
        {
            title: 'Issue Date',
            dataIndex: 'issueDate',
            key: 'issueDate',
            width: 120,
            render: (text: string) => (
                <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-sm">{text}</span>
                </div>
            ),
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            width: 200,
            render: (text: string) => (
                <span className="font-medium">{text}</span>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'issueType',
            key: 'issueType',
            width: 130,
            render: (type: IssueType) => (
                <Tag className="!rounded-lg !px-2.5 !py-0.5 !border-0 !bg-purple-50 !text-purple-700">
                    {type}
                </Tag>
            ),
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            width: 100,
            sorter: (a, b) => {
                const order: Record<Priority, number> = { 'Urgent': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
                return order[a.priority] - order[b.priority];
            },
            render: (priority: Priority) => (
                <Tag
                    style={{
                        backgroundColor: `${getPriorityColor(priority)}15`,
                        color: getPriorityColor(priority),
                        border: `1px solid ${getPriorityColor(priority)}30`,
                        borderRadius: '20px',
                        fontWeight: 600,
                        padding: '2px 12px',
                    }}
                >
                    {priority}
                </Tag>
            ),
        },
        {
            title: 'Assignee',
            dataIndex: 'assignee',
            key: 'assignee',
            width: 150,
            render: (assignee: Assignee) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {assignee.initials}
                    </div>
                    <span className="font-medium text-gray-700 text-sm">{assignee.name}</span>
                </div>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'issueDescription',
            key: 'issueDescription',
            width: 220,
            ellipsis: true,
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="text-gray-600 text-sm">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            filters: statusOptions.map(s => ({ text: s, value: s })),
            onFilter: (value, record) => record.status === value,
            render: (status: IssueStatus) => (
                <Tag
                    style={{
                        backgroundColor: getStatusBgColor(status),
                        color: getStatusColor(status),
                        border: 'none',
                        borderRadius: '20px',
                        fontWeight: 600,
                        padding: '4px 12px',
                    }}
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 160,
            fixed: 'right',
            render: (_, record: Issue) => {
                const canEdit = record.status === 'Open' || record.status === 'Pending';
                const canRespond = record.status !== 'Closed' && record.status !== 'Resolved';
                const canResolve = record.status !== 'Closed' && record.status !== 'Resolved';

                const menuItems = [
                    canEdit && {
                        key: 'edit',
                        label: 'Edit',
                        icon: <Edit className="w-4 h-4" />,
                    },
                    canRespond && {
                        key: 'respond',
                        label: 'Respond',
                        icon: <MessageSquare className="w-4 h-4" />,
                        onClick: () => handleRespond(record),
                    },
                    canResolve && {
                        key: 'resolve',
                        label: 'Resolve',
                        icon: <CheckCircle className="w-4 h-4" />,
                        onClick: () => handleResolve(record),
                    },
                ].filter(Boolean);

                return (
                    <Space size="small">
                        <Tooltip title="View Details">
                            <Button
                                type="text"
                                icon={<Eye className="w-4 h-4 text-blue-600" />}
                                onClick={() => handleViewIssue(record)}
                                className="hover:!bg-blue-50"
                            />
                        </Tooltip>
                        {menuItems.length > 0 && (
                            <Dropdown
                                menu={{ items: menuItems as any }}
                                trigger={['click']}
                            >
                                <Button
                                    type="text"
                                    icon={<MoreHorizontal className="w-4 h-4 text-gray-600" />}
                                    className="hover:!bg-gray-100"
                                />
                            </Dropdown>
                        )}
                    </Space>
                );
            },
        },
    ];

    // Stats
    const stats = useMemo(() => ({
        total: issues.length,
        open: issues.filter(i => i.status === 'Open').length,
        inProgress: issues.filter(i => i.status === 'In Progress').length + 2,
        resolved: issues.filter(i => i.status === 'Resolved').length,
    }), [issues]);

    return (
        <AppLayout title="Issue Management">
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <AlertCircle className="w-7 h-7 text-primary" />
                            Issue Management
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Track, manage, and resolve issues efficiently
                        </p>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        icon={<Plus className="w-5 h-5" />}
                        onClick={() => setRaiseModalOpen(true)}
                        className="!bg-[#4b6043] hover:!bg-[#5a7350] !h-12 !px-6 !rounded-xl !font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        Raise an Issue
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                <p className="text-sm text-gray-500">Total Issues</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
                                <p className="text-sm text-gray-500">Open</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <RefreshCw className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                                <p className="text-sm text-gray-500">In Progress</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                                <p className="text-sm text-gray-500">Resolved</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search Bar */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <Input
                                placeholder="Search by ticket #, business name, subject..."
                                prefix={<Search className="w-4 h-4 text-gray-400" />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                size="large"
                                className="!rounded-lg"
                                allowClear
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Select
                                value={filterType}
                                onChange={setFilterType}
                                style={{ width: 150 }}
                                size="large"
                                className="!rounded-lg"
                                placeholder="Issue Type"
                                suffixIcon={<Filter className="w-4 h-4" />}
                            >
                                <Option value="All">All Types</Option>
                                {issueTypeOptions.map(type => (
                                    <Option key={type} value={type}>{type}</Option>
                                ))}
                            </Select>

                            <Select
                                value={filterPriority}
                                onChange={setFilterPriority}
                                style={{ width: 140 }}
                                size="large"
                                className="!rounded-lg"
                                placeholder="Priority"
                            >
                                <Option value="All">All Priority</Option>
                                {priorityOptions.map(p => (
                                    <Option key={p} value={p}>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: getPriorityColor(p) }}
                                            />
                                            {p}
                                        </div>
                                    </Option>
                                ))}
                            </Select>

                            <Select
                                value={filterStatus}
                                onChange={setFilterStatus}
                                style={{ width: 140 }}
                                size="large"
                                className="!rounded-lg"
                                placeholder="Status"
                            >
                                <Option value="All">All Status</Option>
                                {statusOptions.map(s => (
                                    <Option key={s} value={s}>{s}</Option>
                                ))}
                            </Select>

                            <Tooltip title="Sort by">
                                <Button
                                    icon={<ArrowUpDown className="w-4 h-4" />}
                                    size="large"
                                    onClick={() => setSortBy(sortBy === 'date' ? 'priority' : 'date')}
                                    className={sortBy === 'priority' ? '!border-primary !text-primary' : ''}
                                >
                                    {sortBy === 'date' ? 'Date' : 'Priority'}
                                </Button>
                            </Tooltip>

                            {(searchText || filterType !== 'All' || filterPriority !== 'All' || filterStatus !== 'All') && (
                                <Button
                                    type="text"
                                    onClick={clearFilters}
                                    className="!text-gray-500"
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Issues Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <SlidersHorizontal className="w-5 h-5 text-primary" />
                            View Issues
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                                Showing {filteredIssues.length} of {issues.length} issues
                            </span>
                            <Button
                                type="text"
                                icon={<Download className="w-4 h-4" />}
                                className="!text-gray-500"
                                onClick={handleExport}
                            >
                                Export
                            </Button>
                        </div>
                    </div>

                    {filteredIssues.length === 0 ? (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span className="text-gray-500">
                                    No issues found matching your criteria
                                </span>
                            }
                            className="py-16"
                        >
                            <Button type="primary" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </Empty>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={filteredIssues.map((item, i) => ({ ...item, key: i }))}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Total ${total} issues`,
                                className: '!px-4 !py-3'
                            }}
                            scroll={{ x: 1500 }}
                            className="issue-table"
                            onRow={(record) => ({
                                style: {
                                    background: getPriorityRowBg(record.priority),
                                    boxShadow: getPriorityRowShadow(record.priority),
                                },
                            })}
                        />
                    )}
                </div>

                {/* Modals */}
                <ViewIssueModal
                    issue={selectedIssue}
                    open={viewModalOpen}
                    onClose={() => setViewModalOpen(false)}
                    onRespond={() => {
                        setViewModalOpen(false);
                        setRespondModalOpen(true);
                    }}
                    onResolve={() => selectedIssue && handleResolve(selectedIssue)}
                />

                <RaiseIssueModal
                    open={raiseModalOpen}
                    onClose={() => setRaiseModalOpen(false)}
                    onSubmit={handleRaiseIssue}
                />

                <RespondModal
                    issue={selectedIssue}
                    open={respondModalOpen}
                    onClose={() => setRespondModalOpen(false)}
                    onSubmit={handleSubmitResponse}
                />
            </div>
        </AppLayout>
    );
};

export default IssueManagement;
