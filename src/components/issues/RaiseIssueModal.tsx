import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Button, message } from 'antd';
import { X, Upload as UploadIcon, PlusCircle } from 'lucide-react';
import { issueTypeOptions, priorityOptions, getPriorityColor } from '@/data/issueData';
import type { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Option } = Select;

interface RaiseIssueModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: RaiseIssueFormValues) => void;
}

export interface RaiseIssueFormValues {
    businessName: string;
    subject: string;
    issueDescription: string;
    issueType: string;
    priority: string;
    dueDate: string;
    attachments?: UploadFile[];
}

const RaiseIssueModal: React.FC<RaiseIssueModalProps> = ({
    open,
    onClose,
    onSubmit,
}) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                dueDate: values.dueDate?.format('MMM DD, YYYY'),
            };
            onSubmit(formattedValues);
            form.resetFields();
            message.success('Issue raised successfully!');
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            width={640}
            centered
            closeIcon={<X className="w-5 h-5" />}
            className="rounded-2xl overflow-hidden"
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
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <PlusCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-semibold">Raise an Issue</h3>
                        <p className="text-white/70 text-sm">Fill in the details to submit a new issue</p>
                    </div>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                requiredMark="optional"
                className="space-y-1"
            >
                {/* Business Name */}
                <Form.Item
                    name="businessName"
                    label={<span className="font-medium text-gray-700">Business Name</span>}
                    rules={[{ required: true, message: 'Please enter business name' }]}
                >
                    <Input
                        placeholder="Enter your business name"
                        size="large"
                        className="!rounded-lg"
                    />
                </Form.Item>

                {/* Subject */}
                <Form.Item
                    name="subject"
                    label={<span className="font-medium text-gray-700">Subject</span>}
                    rules={[{ required: true, message: 'Please enter subject' }]}
                >
                    <Input
                        placeholder="Brief summary of the issue"
                        size="large"
                        className="!rounded-lg"
                    />
                </Form.Item>

                {/* Issue Description */}
                <Form.Item
                    name="issueDescription"
                    label={<span className="font-medium text-gray-700">Issue Description</span>}
                    rules={[{ required: true, message: 'Please describe the issue' }]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Provide detailed description of the issue..."
                        className="!rounded-lg"
                    />
                </Form.Item>

                {/* Issue Type & Priority Row */}
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="issueType"
                        label={<span className="font-medium text-gray-700">Issue Type</span>}
                        rules={[{ required: true, message: 'Please select issue type' }]}
                    >
                        <Select
                            placeholder="Select type"
                            size="large"
                            className="!rounded-lg"
                        >
                            {issueTypeOptions.map(type => (
                                <Option key={type} value={type}>{type}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="priority"
                        label={<span className="font-medium text-gray-700">Priority</span>}
                        rules={[{ required: true, message: 'Please select priority' }]}
                    >
                        <Select
                            placeholder="Select priority"
                            size="large"
                            className="!rounded-lg"
                        >
                            {priorityOptions.map(priority => (
                                <Option key={priority} value={priority}>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: getPriorityColor(priority) }}
                                        />
                                        {priority}
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                {/* Due Date */}
                <Form.Item
                    name="dueDate"
                    label={<span className="font-medium text-gray-700">Due Date</span>}
                >
                    <DatePicker
                        size="large"
                        className="w-full !rounded-lg"
                        placeholder="Select due date"
                        format="MMM DD, YYYY"
                    />
                </Form.Item>

                {/* Attachment */}
                <Form.Item
                    name="attachments"
                    label={<span className="font-medium text-gray-700">Attachment</span>}
                >
                    <Upload.Dragger
                        multiple
                        maxCount={5}
                        beforeUpload={() => false}
                        className="!rounded-lg !border-dashed !border-gray-300 hover:!border-primary"
                    >
                        <div className="flex flex-col items-center py-4">
                            <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                                Click or drag files to upload
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Maximum 5 files (PDF, XLSX, PNG, JPG)
                            </p>
                        </div>
                    </Upload.Dragger>
                </Form.Item>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button onClick={handleClose} size="large">
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        size="large"
                        className="!bg-[#4b6043] hover:!bg-[#5a7350]"
                        icon={<PlusCircle className="w-4 h-4" />}
                    >
                        Submit Issue
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default RaiseIssueModal;
