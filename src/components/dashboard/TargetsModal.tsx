import { useState, useEffect } from 'react';
import { Modal, Select, InputNumber, Form, Table, Button, Tag } from 'antd';
import { Plus, Eye } from 'lucide-react';

// Materials for target configuration
const targetMaterials = [
  'Steel',
  'Aluminium',
  'Copper',
  'Plastic',
  'Glass',
  'Rubber',
  'E-Waste',
  'Battery',
  'Used Oil',
  'Lead',
  'Black Mass',
  'Zinc',
];

// Financial Year options
const fyOptions = [
  '2025-26',
  '2026-27',
  '2027-28',
  '2028-29',
  '2029-30',
  '2030-31',
  '2031-32',
  '2032-33',
  '2033-34',
  '2034-35',
];

// Unit options
const unitOptions = ['MT', 'KGs'];

export interface TargetEntry {
  key: string;
  eprTargetYear: string;
  referenceYear: string;
  carsSold: number;
  scopeOfEPR: number;
  scopeOfEPRWeight: number;
  material?: string;
  unit?: string;
}

// EPR target data matching the screenshot
const eprTargetData: TargetEntry[] = [
  { key: '1', eprTargetYear: '2025-26', referenceYear: '2005-06', carsSold: 522664, scopeOfEPR: 52266.4, scopeOfEPRWeight: 52266.4 },
  { key: '2', eprTargetYear: '2026-27', referenceYear: '2006-07', carsSold: 635629, scopeOfEPR: 63562.9, scopeOfEPRWeight: 63562.9 },
  { key: '3', eprTargetYear: '2027-28', referenceYear: '2007-08', carsSold: 711878, scopeOfEPR: 71187.8, scopeOfEPRWeight: 71187.8 },
  { key: '4', eprTargetYear: '2028-29', referenceYear: '2008-09', carsSold: 722144, scopeOfEPR: 72214.4, scopeOfEPRWeight: 72214.4 },
  { key: '5', eprTargetYear: '2029-30', referenceYear: '2009-10', carsSold: 870790, scopeOfEPR: 87079, scopeOfEPRWeight: 87079 },
  { key: '6', eprTargetYear: '2030-31', referenceYear: '2010-11', carsSold: 1132739, scopeOfEPR: 113273.9, scopeOfEPRWeight: 113273.9 },
  { key: '7', eprTargetYear: '2031-32', referenceYear: '2011-12', carsSold: 1006316, scopeOfEPR: 100631.6, scopeOfEPRWeight: 100631.6 },
  { key: '8', eprTargetYear: '2032-33', referenceYear: '2012-13', carsSold: 1057046, scopeOfEPR: 105704.6, scopeOfEPRWeight: 105704.6 },
  { key: '9', eprTargetYear: '2033-34', referenceYear: '2013-14', carsSold: 1053689, scopeOfEPR: 105368.9, scopeOfEPRWeight: 105368.9 },
  { key: '10', eprTargetYear: '2034-35', referenceYear: '2013-14', carsSold: 1120702, scopeOfEPR: 112070.2, scopeOfEPRWeight: 112070.2 },
];

// Target Types
export type TargetType = 'material' | 'recycler' | 'supplier' | 'rvsf';

interface SetTargetsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (target: any) => void;
  targetType?: TargetType;
}

export const SetTargetsModal = ({ open, onClose, onSave, targetType = 'material' }: SetTargetsModalProps) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave({ ...values, type: targetType });
      form.resetFields();
      onClose();
    });
  };

  const getModalTitle = () => {
    switch (targetType) {
      case 'recycler': return 'Set Recycler Targets';
      case 'supplier': return 'Set Supplier Targets';
      case 'rvsf': return 'Set RVSF Targets';
      default: return 'Set Material Targets';
    }
  };

  const renderFormFields = () => {
    switch (targetType) {
      case 'recycler':
        return (
          <>
            <Form.Item name="metric" label="Select Metric" rules={[{ required: true }]}>
              <Select placeholder="Select metric..." options={[
                { value: 'Recycling Efficiency', label: 'Recycling Efficiency (%)' },
                { value: 'Output', label: 'Recycled Output (MT)' }
              ]} />
            </Form.Item>
            <Form.Item name="fy" label="Select FY" rules={[{ required: true }]}>
              <Select placeholder="Select FY..." options={fyOptions.map(fy => ({ value: fy, label: `FY ${fy}` }))} />
            </Form.Item>
            <Form.Item name="target" label="Target Value" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} placeholder="Enter target..." />
            </Form.Item>
          </>
        );
      case 'supplier':
        return (
          <>
            <Form.Item name="metric" label="Select Metric" rules={[{ required: true }]}>
              <Select placeholder="Select metric..." options={[
                { value: 'Green Score', label: 'Green Score (0-5)' },
                { value: 'Recycled Content', label: 'Recycled Content (%)' }
              ]} />
            </Form.Item>
            <Form.Item name="fy" label="Select FY" rules={[{ required: true }]}>
              <Select placeholder="Select FY..." options={fyOptions.map(fy => ({ value: fy, label: `FY ${fy}` }))} />
            </Form.Item>
            <Form.Item name="target" label="Target Value" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} placeholder="Enter target..." />
            </Form.Item>
          </>
        );
      case 'rvsf':
        return (
          <>
            <Form.Item name="metric" label="Select Metric" rules={[{ required: true }]}>
              <Select placeholder="Select metric..." options={[
                { value: 'Vehicles Scrapped', label: 'Vehicles Scrapped (Units)' },
                { value: 'Recovery Rate', label: 'Recovery Rate (%)' }
              ]} />
            </Form.Item>
            <Form.Item name="fy" label="Select FY" rules={[{ required: true }]}>
              <Select placeholder="Select FY..." options={fyOptions.map(fy => ({ value: fy, label: `FY ${fy}` }))} />
            </Form.Item>
            <Form.Item name="target" label="Target Value" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} placeholder="Enter target..." />
            </Form.Item>
          </>
        );
      default:
        // Original Material Form
        return (
          <>
            <Form.Item name="material" label="Select Material" rules={[{ required: true }]}>
              <Select placeholder="Select material..." options={targetMaterials.map(m => ({ value: m, label: m }))} />
            </Form.Item>
            <Form.Item name="fy" label="Select FY" rules={[{ required: true }]}>
              <Select placeholder="Select FY..." options={fyOptions.map(fy => ({ value: fy, label: `FY ${fy}` }))} />
            </Form.Item>
            <Form.Item name="unit" label="Select Unit" rules={[{ required: true }]}>
              <Select placeholder="Select unit..." options={unitOptions.map(u => ({ value: u, label: u }))} />
            </Form.Item>
            <Form.Item name="target" label="Target" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} placeholder="Enter target value..." />
            </Form.Item>
          </>
        );
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          <span>{getModalTitle()}</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Save Target"
      okButtonProps={{ className: 'bg-[#5a7a32] hover:bg-[#4b6a28]' }}
      width={500}
    >
      <Form form={form} layout="vertical" className="mt-4">
        {renderFormFields()}
      </Form>
    </Modal>
  );
};

interface ViewTargetsModalProps {
  open: boolean;
  onClose: () => void;
  customTargets?: any[];
  targetType?: TargetType;
}

export const ViewTargetsModal = ({ open, onClose, customTargets = [], targetType = 'material' }: ViewTargetsModalProps) => {
  const materialColumns = [
    { title: 'Material', dataIndex: 'material', key: 'material', render: (text: string) => <Tag color="green">{text}</Tag> },
    { title: 'Financial Year', dataIndex: 'fy', key: 'fy' },
    { title: 'Target', dataIndex: 'target', key: 'target', render: (value: number) => value?.toLocaleString() },
    { title: 'Unit', dataIndex: 'unit', key: 'unit' },
  ];

  const otherColumns = [
    { title: 'Metric', dataIndex: 'metric', key: 'metric', render: (text: string) => <Tag color="blue">{text}</Tag> },
    { title: 'Financial Year', dataIndex: 'fy', key: 'fy' },
    { title: 'Target Value', dataIndex: 'target', key: 'target', render: (value: number) => value?.toLocaleString() },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 bg-[#5a7a32] text-white px-4 py-2 -mx-6 -mt-5 rounded-t-lg">
          <span className="text-lg font-semibold">Targets Overview</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      className="targets-modal"
    >
      <div className="mt-4">
        {targetType === 'material' && (
          <Table
            dataSource={eprTargetData}
            columns={[
              { title: 'EPR Target Year', dataIndex: 'eprTargetYear', key: 'eprTargetYear' },
              { title: 'Reference Year', dataIndex: 'referenceYear', key: 'referenceYear' },
              { title: 'Cars Sold', dataIndex: 'carsSold', key: 'carsSold' },
              { title: 'Scope of EPR', dataIndex: 'scopeOfEPR', key: 'scopeOfEPR' },
            ]}
            pagination={false}
            size="middle"
            scroll={{ y: 300 }}
            title={() => <b>EPR Regulatory Targets</b>}
          />
        )}

        {customTargets.length > 0 ? (
          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-3 text-primary">Custom Targets</h4>
            <Table
              dataSource={customTargets.map((t, i) => ({ ...t, key: i }))}
              columns={targetType === 'material' ? materialColumns : otherColumns}
              pagination={false}
              size="small"
            />
          </div>
        ) : (
          <div className="mt-6 text-center text-muted-foreground">No custom targets set yet.</div>
        )}
      </div>
    </Modal>
  );
};
