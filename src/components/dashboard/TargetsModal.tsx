import { useState, useEffect, useCallback } from 'react';
import { Modal, Select, InputNumber, Form, Table, Button, Tag, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Leaf, Plus, PencilIcon, TrashIcon } from 'lucide-react';
import {
  deleteMaterialTargetApi,
  getMaterialTarget,
  updateMaterialTargetApi,
  type MaterialFiscalYearTarget,
  type MaterialFiscalYearTargetPayload,
  type MaterialTargetListData,
  type TagItem,
} from '@/services/dashboardApi';
import { useAuthStore } from '@/stores/authStore';
import { en } from '@/utils/languageTranslation';

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
const unitOptions = ['MT', 'KGS', 'L'];

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
  onSave: (target: MaterialFiscalYearTargetPayload) => void;
  targetType?: TargetType;
  materialOptions?: TagItem[];
  initialValues?: Partial<MaterialFiscalYearTargetPayload>;
}

export const SetTargetsModal = ({
  open,
  onClose,
  onSave,
  targetType = 'material',
  materialOptions = [],
  initialValues,
}: SetTargetsModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;

    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [form, initialValues, open]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave({ ...initialValues, ...values, type: targetType });
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
            <Form.Item name="materialTypeId" label="Select Material" rules={[{ required: true }]}>
              <Select placeholder="Select material..." options={materialOptions.map(m => ({ value: m.id, label: m.name }))} disabled={!!initialValues} />
            </Form.Item>
            <Form.Item name="fiscalYear" label="Select FY" rules={[{ required: true }]}>
              <Select placeholder="Select FY..." options={fyOptions.map(fy => ({ value: fy?.split('-')?.[0], label: `FY ${fy}` }))} />
            </Form.Item>
            <Form.Item name="unit" label="Select Unit" rules={[{ required: true }]}>
              <Select placeholder="Select unit..." options={unitOptions.map(u => ({ value: u, label: u }))} />
            </Form.Item>
            <Form.Item name="target" label="Target" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} precision={2} placeholder="Enter target value..." />
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
  customTargets?: TargetEntry[];
  targetType?: TargetType;
  materialOptions?: TagItem[];
  onTargetUpdated?: () => void;
}

export const ViewTargetsModal = ({ open, onClose, customTargets = [], targetType = 'material', materialOptions = [], onTargetUpdated }: ViewTargetsModalProps) => {
  const [targetList, setTargetList] = useState<MaterialTargetListData>({ list: [] })
  const [deleteTargetId, setDeleteTargetId] = useState<string | number | null>(null);
  const [editingTarget, setEditingTarget] = useState<MaterialFiscalYearTarget | null>(null);
  const token = useAuthStore((state) => state.token);
  const userData = useAuthStore((state) => state.userData);
  const materialTargetRows = targetList.list.map((target, index) => ({ ...target, key: target.id ?? index + 1 }));
  const otherTargetRows: (TargetEntry & { key: React.Key })[] = customTargets.map((target, index) => ({
    ...target,
    key: target.key ?? String(index),
  }));
  const hasCustomTargets = targetType === 'material'
    ? materialTargetRows.length > 0
    : otherTargetRows.length > 0;

  const getTargetList = useCallback(() => {
    if (!token) {
      setTargetList({ list: [] });
      return;
    }

    getMaterialTarget({ params: { userId: userData?.id } }).then((response) => {
      if (response.data?.list) {
        setTargetList(response.data)
      } else {
        setTargetList({ list: [] })
      }
    })
  }, [token, userData?.id]);

  useEffect(() => {
    if (open) {
      getTargetList()
    }
  }, [open, getTargetList])

  const openDeleteConfirm = (id?: string | number) => {
    if (!id) return;
    setDeleteTargetId(id);
  };

  const openEditTarget = (target: MaterialFiscalYearTarget) => {
    setEditingTarget(target);
  };

  const materialColumns: ColumnsType<MaterialFiscalYearTarget & { key: React.Key }> = [
    { title: 'Material', dataIndex: 'materialTypeKey', key: 'material', render: (text: string) => <Tag color="green">{en?.[text]}</Tag> },
    { title: 'Financial Year', dataIndex: 'fiscalYear', key: 'fy' },
    { title: 'Target', dataIndex: 'target', key: 'target', render: (value: number) => value?.toLocaleString() },
    { title: 'Unit', dataIndex: 'unit', key: 'unit' },
    {
      title: 'Action', key: 'action',
      render: (_, rowData) => (
        <div className="flex items-center gap-2">
          <Button
            type="text"
            aria-label="Edit target"
            icon={<PencilIcon size={20} color="#6b7280" />}
            onClick={() => openEditTarget(rowData)}
          />
          <Button
            type="text"
            aria-label="Delete target"
            icon={<TrashIcon size={20} color="#6b7280" />}
            onClick={() => openDeleteConfirm(rowData.id)}
          />
        </div>
      )
    },
  ];

  const otherColumns: ColumnsType<TargetEntry & { key: React.Key }> = [
    { title: 'Metric', dataIndex: 'metric', key: 'metric', render: (text: string) => <Tag color="blue">{text}</Tag> },
    { title: 'Financial Year', dataIndex: 'fy', key: 'fy' },
    { title: 'Target Value', dataIndex: 'target', key: 'target', render: (value: number) => value?.toLocaleString() },
  ];

  const updateTargetFn = (values: MaterialFiscalYearTargetPayload) => {
    updateMaterialTargetApi({
      ...values,
      id: editingTarget?.id,
    }).then((response) => {
      if (response?.data) {
        setEditingTarget(null);
        getTargetList();
        onTargetUpdated?.();
        notification.success({
          message: 'Target updated Successfully',
          placement: 'topRight',
          className: '!bg-emerald-50 !border-emerald-200',
          style: { border: '1px solid #a7f3d0', borderRadius: '12px' },
          icon: <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center -ml-2"><Leaf className="w-4 h-4 text-emerald-600" /></div>,
          duration: 4,
        });
      } else {
        notification.error({
          message: 'Target not updated',
          placement: 'topRight',
          duration: 4,
        });
      }
    }).catch(() => {
      notification.error({
        message: 'Target not updated',
        placement: 'topRight',
        duration: 4,
      });
    });
  }

  const deleteTargetFn = (id: string | number) => {
    if (!id) return
    deleteMaterialTargetApi({ params: { id } }).then(response => {
      if (response?.data) {
        setDeleteTargetId(null);
        getTargetList()
        onTargetUpdated?.();
        notification.success({
          message: 'Target removed Successfully',
          placement: 'topRight',
          className: '!bg-emerald-50 !border-emerald-200',
          style: { border: '1px solid #a7f3d0', borderRadius: '12px' },
          icon: <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center -ml-2"><Leaf className="w-4 h-4 text-emerald-600" /></div>,
          duration: 4,
        });
      } else {
        notification.error({
          message: 'Target not removed',
          placement: 'topRight',
          duration: 4,
        });
      }
    }).catch(() => {
      notification.error({
        message: 'Target not removed',
        placement: 'topRight',
        duration: 4,
      });
    })
  }

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
        {/* {targetType === 'material' && (
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
        )} */}
        {hasCustomTargets ? (
          <div className="mt-6">
            {/* <h4 className="text-sm font-semibold mb-3 text-primary">Custom Targets</h4> */}
            {targetType === 'material' ? (
              <Table
                dataSource={materialTargetRows}
                columns={materialColumns}
                pagination={false}
                size="small"
              />
            ) : (
              <Table
                dataSource={otherTargetRows}
                columns={otherColumns}
                pagination={false}
                size="small"
              />
            )}
          </div>
        ) : (
          <div className="mt-6 text-center text-muted-foreground">No custom targets set yet.</div>
        )}
      </div>
      <Modal
        title="Are you sure want to remove this?"
        open={deleteTargetId !== null}
        onOk={() => deleteTargetId !== null && deleteTargetFn(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ className: 'bg-[#5a7a32] hover:bg-[#4b6a28]' }}
      />
      <SetTargetsModal
        open={editingTarget !== null}
        onClose={() => setEditingTarget(null)}
        onSave={updateTargetFn}
        targetType={targetType}
        materialOptions={materialOptions}
        initialValues={editingTarget ?? undefined}
      />
    </Modal>
  );
};
