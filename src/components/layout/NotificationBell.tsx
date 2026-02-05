import React, { useState } from 'react';
import { Badge, Dropdown, Typography, Button, Empty } from 'antd';
import { Bell, CheckCheck, Clock, AlertCircle, MessageSquare, CheckCircle, X } from 'lucide-react';
import { Notification, initialNotifications } from '@/data/issueData';

const { Text } = Typography;

interface NotificationBellProps {
    onNotificationClick?: (notification: Notification) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onNotificationClick }) => {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [open, setOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'issue_raised':
                return <AlertCircle className="w-4 h-4 text-blue-500" />;
            case 'issue_responded':
                return <MessageSquare className="w-4 h-4 text-purple-500" />;
            case 'issue_resolved':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'issue_closed':
                return <X className="w-4 h-4 text-gray-500" />;
            default:
                return <Bell className="w-4 h-4 text-gray-500" />;
        }
    };

    const dropdownContent = (
        <div
            className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
            style={{ width: 360 }}
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-600" />
                    <Text className="font-semibold text-gray-800">Notifications</Text>
                    {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                            {unreadCount} new
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <Button
                        type="text"
                        size="small"
                        onClick={markAllAsRead}
                        className="text-xs !text-blue-600 hover:!text-blue-700"
                        icon={<CheckCheck className="w-3 h-3" />}
                    >
                        Mark all read
                    </Button>
                )}
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No notifications"
                        className="py-8"
                    />
                ) : (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`
                px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors
                hover:bg-gray-50
                ${!notification.read ? 'bg-blue-50/50' : ''}
              `}
                            onClick={() => {
                                markAsRead(notification.id);
                                onNotificationClick?.(notification);
                                setOpen(false);
                            }}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${notification.type === 'issue_raised' ? 'bg-blue-100' : ''}
                  ${notification.type === 'issue_responded' ? 'bg-purple-100' : ''}
                  ${notification.type === 'issue_resolved' ? 'bg-green-100' : ''}
                  ${notification.type === 'issue_closed' ? 'bg-gray-100' : ''}
                `}>
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Text
                                        className={`block text-sm ${!notification.read ? 'font-medium' : ''}`}
                                        style={{ color: !notification.read ? '#1f2937' : '#6b7280' }}
                                    >
                                        {notification.message}
                                    </Text>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        <Text className="text-xs text-gray-400">{notification.timestamp}</Text>
                                    </div>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                <Button
                    type="link"
                    block
                    className="!text-blue-600 hover:!text-blue-700 !text-sm"
                >
                    View all notifications
                </Button>
            </div>
        </div>
    );

    return (
        <Dropdown
            open={open}
            onOpenChange={setOpen}
            dropdownRender={() => dropdownContent}
            trigger={['click']}
            placement="bottomRight"
        >
            <div className="relative cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                    <Bell className="w-5 h-5 text-primary-foreground" />
                </Badge>
            </div>
        </Dropdown>
    );
};

export default NotificationBell;

// Export a function to add notifications programmatically
export const addNotification = (
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
    notification: Omit<Notification, 'id'>
) => {
    const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
    };
    setNotifications(prev => [newNotification, ...prev]);
};
