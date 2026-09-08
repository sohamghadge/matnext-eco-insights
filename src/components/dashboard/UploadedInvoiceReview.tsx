import { useRef, useState } from 'react';
import { Button, Descriptions, Form, Input, InputNumber, Modal, Tabs, Tag, message } from 'antd';
import { CheckCircleOutlined, EditOutlined, FileTextOutlined, SaveOutlined } from '@ant-design/icons';
import { updateInvoiceDetails, type InvoiceEditData } from '@/utils/api';
import { formatDateToDDMMYYYY } from '@/utils/dayjs';

export type ReviewInvoice = InvoiceEditData & { sourceFile: string };
export type ReviewField = { key: string; label: string };
const hiddenFields = new Set(['id', 'creationDate', 'modificationDate', 'ocrManagementId', 'scrapId', 'userId']);
const readonlyFields = new Set(['amount']);
const numericFields = new Set(['quantity', 'ratePerKg', 'amount', 'grossAmount', 'taxableValue', 'igstRateAmount', 'totalTaxAmount', 'totalValue']);
const lineFields = [
  { key: 'description', label: 'Description' },
  { key: 'hsnSac', label: 'HSN/SAC' }, { key: 'quantity', label: 'Quantity' },
  { key: 'unitOfMeasurement', label: 'Unit Of Measurement' },
  { key: 'ratePerKg', label: 'Rate Per Kg' }, { key: 'amount', label: 'Material Amount' },
];
const displayValue = (value: unknown, key: string): string => {
  if (value == null || value === '') return '—';
  if (key === 'creationDate' || key === 'modificationDate') return formatDateToDDMMYYYY(value as number) ?? '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

// OCR deployments return either invoice records directly or inside a list wrapper.
export const extractReviewInvoices = (response: unknown, sourceFile: string): ReviewInvoice[] => {
  if (Array.isArray(response)) return response.flatMap((item) => extractReviewInvoices(item, sourceFile));
  if (!response || typeof response !== 'object') return [];

  const record = response as Record<string, unknown>;
  for (const key of ['invoiceDetails', 'invoice_details', 'invoices', 'list', 'data']) {
    if (record[key] && typeof record[key] === 'object') {
      return extractReviewInvoices(record[key], sourceFile);
    }
  }

  const normalized = Object.fromEntries(Object.entries(record).map(([key, value]) => [
    key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase()),
    value,
  ]));
  if (!['invoiceNumber', 'invoiceDate', 'materialDescription', 'totalValue'].some((key) => key in normalized)) {
    return [];
  }

  const descriptions = normalized.materialDescription;
  const lines = Array.isArray(descriptions) ? descriptions : descriptions == null ? [] : [descriptions];
  normalized.materialDescription = lines.map((item) => {
    if (typeof item === 'object' && item !== null) {
      return Object.fromEntries(Object.entries(item).map(([key, value]) => [
        key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase()),
        value,
      ]));
    }

    return {
      description: String(item),
      ...Object.fromEntries(['hsnSac', 'quantity', 'unitOfMeasurement', 'ratePerKg', 'amount'].map((key) => [
        key,
        lines.length === 1 ? normalized[key] : null,
      ])),
    };
  });

  return [{ ...normalized, sourceFile } as ReviewInvoice];
};

export default function UploadedInvoiceReview({ invoices, fields, onChange, onContinue, onSaved, onCancel }: {
  invoices: ReviewInvoice[];
  fields: ReviewField[];
  onChange: (invoices: ReviewInvoice[]) => void;
  onContinue: () => Promise<void>;
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [form] = Form.useForm<InvoiceEditData>();
  const invoice = invoices[activeIndex];
  const startEditing = () => {
    form.resetFields();
    form.setFieldsValue(invoice);
    setEditing(true);
  };
  const save = async (values: InvoiceEditData) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      await updateInvoiceDetails(values);
    } catch {
      message.error('Failed to save invoice. Please try again.');
      setSaving(false);
      savingRef.current = false;
      return;
    }
    onChange(invoices.map((item, index) => index === activeIndex ? { ...item, ...values } : item));
    setEditing(false);
    message.success('Invoice updated successfully');
    try { await onSaved(); } finally { setSaving(false); savingRef.current = false; }
  };

  return (
    <Modal open title={null} footer={null} width={1080} centered closable={false} maskClosable={!saving} keyboard={false}
      onCancel={() => { if (!savingRef.current) onCancel(); }}
      styles={{ container: { padding: 0, overflow: 'hidden', borderRadius: 16 } }}>
      <div className="flex items-center gap-4 border-b border-emerald-100 bg-emerald-50 px-7 py-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl text-emerald-600"><FileTextOutlined /></div>
        <div className="flex-1"><h2 className="text-xl font-semibold text-slate-900">{editing ? 'Edit invoice details' : 'Review uploaded invoices'}</h2>
          <p className="mt-1 text-sm text-slate-500">{editing ? 'Check the extracted details and save your changes.' : 'Review the extracted invoice information before continuing.'}</p></div>
        <Tag color="green" icon={<CheckCircleOutlined />}>{invoices.length} invoice{invoices.length === 1 ? '' : 's'}</Tag>
      </div>
      <div className="max-h-[65vh] overflow-y-auto px-7 pb-6">
        <Tabs activeKey={String(activeIndex)} onChange={key => setActiveIndex(Number(key))} items={invoices.map((item, index) => ({
          key: String(index), label: String(item.invoiceNumber || `Invoice ${index + 1}`), disabled: editing || saving,
        }))} />
        <p className="mb-4 break-all text-sm text-slate-500">{invoice.sourceFile}</p>
        {editing ? (
          <Form form={form} layout="vertical" onFinish={save} disabled={saving}>
            <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
              {fields.filter(field => field.key !== 'materialDescription' && !hiddenFields.has(field.key)).map(field => (
                <Form.Item key={field.key} name={field.key} label={field.label}
                  rules={field.key === 'invoiceNumber' ? [{ required: true, whitespace: true, message: 'Enter an invoice number' }] : []}>
                  {readonlyFields.has(field.key) ? <Input disabled /> : numericFields.has(field.key)
                    ? <InputNumber className="w-full" /> : ['shipTo', 'billTo'].includes(field.key)
                      ? <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} /> : <Input />}
                </Form.Item>
              ))}
            </div>
            <h3 className="mb-4 text-base font-semibold text-slate-800">Material Description</h3>
            <Form.List name="materialDescription">{(lineItems) => <div className="space-y-4">{lineItems.map(line => (
              <div key={line.key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <Form.Item name={[line.name, 'id']} hidden><Input /></Form.Item>
                <div className="mb-3 font-medium text-slate-600">Material {line.name + 1}</div>
                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">{lineFields.map(field => (
                  <Form.Item key={field.key} name={[line.name, field.key]} label={field.label}>
                    {numericFields.has(field.key) ? <InputNumber className="w-full" /> : <Input />}
                  </Form.Item>
                ))}</div>
              </div>
            ))}</div>}</Form.List>
          </Form>
        ) : (
          <>
            <Descriptions bordered size="small" column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
              styles={{ label: { color: '#64748b' }, content: { overflowWrap: 'anywhere' } }}
              items={fields.filter(field => field.key !== 'materialDescription' && !hiddenFields.has(field.key)).map(field => ({
                key: field.key, label: field.label, children: displayValue(invoice[field.key], field.key),
              }))} />
            <h3 className="mb-3 mt-6 text-base font-semibold text-slate-800">Material Description</h3>
            <div className="space-y-3">{invoice.materialDescription.length ? invoice.materialDescription.map((line, index) => (
              <Descriptions key={index} title={`Material ${index + 1}`} bordered size="small" column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
                styles={{ content: { overflowWrap: 'anywhere' } }}
                items={lineFields.map(field => ({ key: field.key, label: field.label, children: displayValue(line[field.key], field.key) }))} />
            )) : <p className="text-slate-400">—</p>}</div>
          </>
        )}
      </div>

      <div className="flex justify-center gap-3 border-t border-slate-100 bg-slate-50 px-7 py-4">
        {editing ? <><Button size="large" disabled={saving} onClick={onCancel}>Cancel</Button>
          <Button size="large" type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>Save</Button></>
          : <><Button size="large" icon={<EditOutlined />} disabled={saving} onClick={startEditing}>Edit</Button>
            <Button size="large" type="primary" disabled={saving} onClick={() => void onContinue()}>Continue</Button></>}
      </div>
    </Modal>
  );
}
