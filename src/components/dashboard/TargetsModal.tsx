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

interface SetTargetsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (target: { material: string; fy: string; unit: string; target: number }) => void;
}

export const SetTargetsModal = ({ open, onClose, onSave }: SetTargetsModalProps) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave(values);
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          <span>Set Targets</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Save Target"
      okButtonProps={{ className: 'bg-[#5a7a32] hover:bg-[#4b6a28]' }}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
      >
        <Form.Item
          name="material"
          label="Select Material"
          rules={[{ required: true, message: 'Please select a material' }]}
        >
          <Select
            placeholder="Select material..."
            options={targetMaterials.map(m => ({ value: m, label: m }))}
          />
        </Form.Item>

        <Form.Item
          name="fy"
          label="Select FY"
          rules={[{ required: true, message: 'Please select a financial year' }]}
        >
          <Select
            placeholder="Select financial year..."
            options={fyOptions.map(fy => ({ value: fy, label: `FY ${fy}` }))}
          />
        </Form.Item>

        <Form.Item
          name="unit"
          label="Select Unit"
          rules={[{ required: true, message: 'Please select a unit' }]}
        >
          <Select
            placeholder="Select unit..."
            options={unitOptions.map(u => ({ value: u, label: u }))}
          />
        </Form.Item>

        <Form.Item
          name="target"
          label="Target"
          rules={[{ required: true, message: 'Please enter a target value' }]}
        >
          <InputNumber
            placeholder="Enter target value..."
            min={0}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

interface ViewTargetsModalProps {
  open: boolean;
  onClose: () => void;
  customTargets?: { material: string; fy: string; unit: string; target: number }[];
}

export const ViewTargetsModal = ({ open, onClose, customTargets = [] }: ViewTargetsModalProps) => {
  const columns = [
    {
      title: 'EPR Target Year',
      dataIndex: 'eprTargetYear',
      key: 'eprTargetYear',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Reference Year',
      dataIndex: 'referenceYear',
      key: 'referenceYear',
    },
    {
      title: 'Cars Sold',
      dataIndex: 'carsSold',
      key: 'carsSold',
      render: (value: number) => value.toLocaleString('en-IN'),
    },
    {
      title: 'Scope of EPR (10%)',
      dataIndex: 'scopeOfEPR',
      key: 'scopeOfEPR',
      render: (value: number) => value.toLocaleString('en-IN', { minimumFractionDigits: 1 }),
    },
    {
      title: 'Scope of EPR Weight (tons)',
      dataIndex: 'scopeOfEPRWeight',
      key: 'scopeOfEPRWeight',
      render: (value: number) => value.toLocaleString('en-IN', { minimumFractionDigits: 1 }),
    },
  ];

  const customTargetColumns = [
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
    {
      title: 'Financial Year',
      dataIndex: 'fy',
      key: 'fy',
    },
    {
      title: 'Target',
      dataIndex: 'target',
      key: 'target',
      render: (value: number) => value.toLocaleString('en-IN'),
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 bg-[#5a7a32] text-white px-4 py-2 -mx-6 -mt-5 rounded-t-lg">
          <span className="text-lg font-semibold">Targets</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      className="targets-modal"
    >
      <div className="mt-4">
        <Table
          dataSource={eprTargetData}
          columns={columns}
          pagination={false}
          size="middle"
          className="targets-table"
          scroll={{ y: 400 }}
        />

        {customTargets.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-3 text-primary">Custom Material Targets</h4>
            <Table
              dataSource={customTargets.map((t, i) => ({ ...t, key: i }))}
              columns={customTargetColumns}
              pagination={false}
              size="small"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
