import { useState, useMemo, useCallback } from 'react';
import { Upload, Table, Button, Modal, Divider, Tag, message } from 'antd';
import { InboxOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { uploadFile, getOcrData } from '@/utils/api';

const { Dragger } = Upload;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface LineItem {
  key: string;
  scrapCategory: string;
  materialDescription: string;
  hsnSac: string;
  quantity: number;
  uom: string;
  ratePerKg: number;
  grossAmount: number;
}

interface Invoice {
  key: string;
  dmsId: string;
  fileName: string;
  uploadedAt: string;
  invoiceNumber: string;
  invoiceDate: string;
  deliveryNote: string;
  ewayBillNumber: string;
  buyersOrderNumber: string;
  consignee: string;
  buyer: string;
  dispatchedThrough: string;
  vehicleNumber: string;
  pan: string;
  gstNumber: string;
  lineItems: LineItem[];
  taxableValue: number;
  igstRate: number;
  igstAmount: number;
  totalTaxAmount: number;
  totalAmount: number;
}

const PIE_COLORS = ['#5a7a32', '#e4ae52', '#3b82f6', '#ec4899', '#22d3d3', '#8b5cf6'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapOcrToInvoice = (ocrData: any, dmsId: string, fileName: string): Invoice => {
  const invoiceDetails = ocrData?.invoiceDetails || {};
  const partyDetails = ocrData?.partyDetails || {};
  const transportDetails = ocrData?.transportDetails || {};
  const items = ocrData?.items || ocrData?.lineItems || [];
  const taxDetails = ocrData?.taxDetails || {};

  const lineItems: LineItem[] = (Array.isArray(items) ? items : [items]).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any, idx: number) => ({
      key: `${dmsId}-item-${idx}`,
      scrapCategory: item?.scrapCategory || item?.category || '',
      materialDescription: item?.materialDescription || item?.description || '',
      hsnSac: item?.hsnSac || item?.hsn || '',
      quantity: parseFloat(item?.quantity) || 0,
      uom: item?.uom || item?.unitOfMeasurement || 'Kg',
      ratePerKg: parseFloat(item?.ratePerKg || item?.rate) || 0,
      grossAmount: parseFloat(item?.grossAmount || item?.amount) || 0,
    }),
  );

  return {
    key: dmsId,
    dmsId,
    fileName,
    uploadedAt: new Date().toISOString(),
    invoiceNumber: invoiceDetails?.invoiceNumber || ocrData?.invoiceNumber || '',
    invoiceDate: invoiceDetails?.invoiceDate || ocrData?.invoiceDate || '',
    deliveryNote: invoiceDetails?.deliveryNote || ocrData?.deliveryNote || '',
    ewayBillNumber: invoiceDetails?.ewayBillNumber || ocrData?.ewayBillNumber || '',
    buyersOrderNumber: invoiceDetails?.buyersOrderNumber || ocrData?.buyersOrderNumber || '',
    consignee: partyDetails?.consignee || ocrData?.consignee || '',
    buyer: partyDetails?.buyer || ocrData?.buyer || '',
    dispatchedThrough: transportDetails?.dispatchedThrough || ocrData?.dispatchedThrough || '',
    vehicleNumber: transportDetails?.vehicleNumber || ocrData?.vehicleNumber || '',
    pan: ocrData?.pan || ocrData?.companyPan || '',
    gstNumber: ocrData?.gstNumber || ocrData?.gstin || '',
    lineItems,
    taxableValue: parseFloat(taxDetails?.taxableValue || ocrData?.taxableValue) || 0,
    igstRate: parseFloat(taxDetails?.igstRate || ocrData?.igstRate) || 0,
    igstAmount: parseFloat(taxDetails?.igstAmount || ocrData?.igstAmount) || 0,
    totalTaxAmount: parseFloat(taxDetails?.totalTaxAmount || ocrData?.totalTaxAmount) || 0,
    totalAmount: parseFloat(ocrData?.totalAmount || invoiceDetails?.totalAmount) || 0,
  };
};

const ScrapSalesSummary = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleUpload = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      message.warning('File size must be less than 5MB');
      return false;
    }

    setUploading(true);
    try {
      const dmsId = await uploadFile(file);
      if (!dmsId) {
        message.error('File upload failed');
        return false;
      }

      const ocrData = await getOcrData({
        jobType: 'RECOVERY',
        source: 'SCRAP_INVOICE',
        dmsId,
      });

      const invoice = mapOcrToInvoice(ocrData || {}, dmsId, file.name);
      setInvoices(prev => [invoice, ...prev]);
      message.success('Invoice processed successfully');
    } catch {
      message.error('Failed to process invoice');
    } finally {
      setUploading(false);
    }
    return false;
  }, []);

  const handleDelete = useCallback((dmsId: string) => {
    setInvoices(prev => prev.filter(inv => inv.dmsId !== dmsId));
    if (selectedInvoice?.dmsId === dmsId) {
      setSelectedInvoice(null);
      setModalOpen(false);
    }
  }, [selectedInvoice]);

  // KPI calculations
  const kpi = useMemo(() => {
    if (!invoices.length) return null;

    let totalQty = 0;
    let totalVal = 0;
    const categoryMap: Record<string, number> = {};
    const buyerMap: Record<string, { qty: number; val: number }> = {};
    const monthMap: Record<string, { qty: number; val: number }> = {};

    invoices.forEach(inv => {
      const month = inv.invoiceDate?.substring(0, 7) || 'Unknown';
      const buyer = inv.buyer || 'Unknown';

      if (!buyerMap[buyer]) buyerMap[buyer] = { qty: 0, val: 0 };

      inv.lineItems.forEach(item => {
        totalQty += item.quantity;
        totalVal += item.grossAmount;
        const cat = item.scrapCategory || 'Others';
        categoryMap[cat] = (categoryMap[cat] || 0) + item.quantity;
        if (!monthMap[month]) monthMap[month] = { qty: 0, val: 0 };
        monthMap[month].qty += item.quantity;
        monthMap[month].val += item.grossAmount;
        buyerMap[buyer].qty += item.quantity;
        buyerMap[buyer].val += item.grossAmount;
      });
    });

    const monthCount = Math.max(Object.keys(monthMap).length, 1);

    return {
      avgRate: totalQty > 0 ? totalVal / totalQty : 0,
      avgMonthlyQty: totalQty / monthCount,
      totalValue: totalVal,
      categories: Object.entries(categoryMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      topBuyers: Object.entries(buyerMap)
        .map(([name, d]) => ({ name, quantity: d.qty, value: d.val }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10),
      monthlyTrend: Object.entries(monthMap)
        .map(([month, d]) => ({
          month,
          quantity: d.qty,
          value: d.val,
          rate: d.qty > 0 ? parseFloat((d.val / d.qty).toFixed(2)) : 0,
        }))
        .sort((a, b) => a.month.localeCompare(b.month)),
    };
  }, [invoices]);

  const invoiceColumns = [
    { title: 'File', dataIndex: 'fileName', key: 'fileName' },
    { title: 'Invoice No.', dataIndex: 'invoiceNumber', key: 'invoiceNumber', render: (t: string) => t || '-' },
    { title: 'Date', dataIndex: 'invoiceDate', key: 'invoiceDate', render: (t: string) => t || '-' },
    { title: 'Buyer', dataIndex: 'buyer', key: 'buyer', render: (t: string) => t || '-' },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (v: number) => v ? `₹ ${v.toLocaleString('en-IN')}` : '-',
    },
    {
      title: 'Uploaded',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      render: (t: string) => t ? new Date(t).toLocaleString() : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Invoice) => (
        <div className="flex gap-2">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => { setSelectedInvoice(record); setModalOpen(true); }}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.dmsId)}
          />
        </div>
      ),
    },
  ];

  const lineItemColumns = [
    { title: 'Category', dataIndex: 'scrapCategory', key: 'scrapCategory' },
    { title: 'Description', dataIndex: 'materialDescription', key: 'materialDescription' },
    { title: 'HSN/SAC', dataIndex: 'hsnSac', key: 'hsnSac' },
    { title: 'Qty', dataIndex: 'quantity', key: 'quantity' },
    { title: 'UOM', dataIndex: 'uom', key: 'uom' },
    { title: 'Rate/Kg', dataIndex: 'ratePerKg', key: 'ratePerKg', render: (v: number) => v ? `₹ ${v}` : '-' },
    { title: 'Amount', dataIndex: 'grossAmount', key: 'grossAmount', render: (v: number) => v ? `₹ ${v.toLocaleString('en-IN')}` : '-' },
  ];

  const buyerColumns = [
    { title: 'Buyer', dataIndex: 'name', key: 'name' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', render: (v: number) => v.toLocaleString('en-IN') },
    { title: 'Value', dataIndex: 'value', key: 'value', render: (v: number) => `₹ ${v.toLocaleString('en-IN')}` },
  ];

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Scrap Sales Summary - Invoice Upload</h3>
        <Dragger
          name="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          showUploadList={false}
          beforeUpload={handleUpload}
          disabled={uploading}
        >
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">
            {uploading ? 'Processing...' : 'Click or drag scrap sales invoices (PDF, JPG, PNG)'}
          </p>
        </Dragger>
      </div>

      {/* Invoice History */}
      {invoices.length > 0 && (
        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Invoice History</h3>
          <Table
            columns={invoiceColumns}
            dataSource={invoices}
            rowKey="dmsId"
            size="middle"
            bordered
          />
        </div>
      )}

      {/* KPI Section */}
      {kpi && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-800">Avg Scrap Sale Rate</p>
              <p className="text-2xl font-bold text-blue-700">₹ {kpi.avgRate.toFixed(2)} /Kg</p>
            </div>
            <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-4 text-center">
              <p className="text-sm text-amber-800">Avg Monthly Quantity</p>
              <p className="text-2xl font-bold text-amber-700">{kpi.avgMonthlyQty.toFixed(2)} Kg</p>
            </div>
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 text-center">
              <p className="text-sm text-emerald-800">Total Scrap Sales Value</p>
              <p className="text-2xl font-bold text-emerald-700">₹ {kpi.totalValue.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-purple-50 border-2 border-purple-500 rounded-xl p-4 text-center">
              <p className="text-sm text-purple-800">Total Invoices</p>
              <p className="text-2xl font-bold text-purple-700">{invoices.length}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <div className="bg-card rounded-xl p-5 shadow-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Scrap Sales Trend</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kpi.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <RechartsTooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="quantity" name="Quantity (Kg)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" dataKey="value" name="Value (₹)" stroke="#e4ae52" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rate/Kg Analysis */}
            <div className="bg-card rounded-xl p-5 shadow-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Rate/Kg Analysis</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kpi.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <RechartsTooltip formatter={(v: number) => [`₹ ${v}`, 'Rate/Kg']} />
                    <Line dataKey="rate" name="Rate/Kg" stroke="#5a7a32" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-card rounded-xl p-5 shadow-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Scrap Category Distribution</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={kpi.categories}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {kpi.categories.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Buyers */}
            <div className="bg-card rounded-xl p-5 shadow-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Top Buyers</h3>
              <Table
                columns={buyerColumns}
                dataSource={kpi.topBuyers}
                rowKey="name"
                size="small"
                pagination={false}
                bordered
              />
            </div>
          </div>
        </>
      )}

      {/* Invoice Detail Modal */}
      <Modal
        title={
          'Invoice: ' + (selectedInvoice?.invoiceNumber || '-')
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={900}
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div><strong>Date:</strong> {selectedInvoice.invoiceDate || '-'}</div>
              <div><strong>Delivery Note:</strong> {selectedInvoice.deliveryNote || '-'}</div>
              <div><strong>e-Way Bill:</strong> {selectedInvoice.ewayBillNumber || '-'}</div>
              <div><strong>Buyer's Order:</strong> {selectedInvoice.buyersOrderNumber || '-'}</div>
              <div><strong>Consignee:</strong> {selectedInvoice.consignee || '-'}</div>
              <div><strong>Buyer:</strong> {selectedInvoice.buyer || '-'}</div>
              <div><strong>Dispatched Via:</strong> {selectedInvoice.dispatchedThrough || '-'}</div>
              <div><strong>Vehicle No:</strong> {selectedInvoice.vehicleNumber || '-'}</div>
              <div><strong>PAN:</strong> {selectedInvoice.pan || '-'}</div>
              <div><strong>GST No:</strong> {selectedInvoice.gstNumber || '-'}</div>
            </div>

            <Divider />
            <h4 className="font-semibold">Line Items</h4>
            <Table
              columns={lineItemColumns}
              dataSource={selectedInvoice.lineItems}
              pagination={false}
              size="small"
              bordered
            />

            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div>
                <strong>Taxable Value:</strong>{' '}
                <Tag color="blue">₹ {selectedInvoice.taxableValue?.toLocaleString('en-IN')}</Tag>
              </div>
              <div>
                <strong>IGST:</strong>{' '}
                <Tag color="orange">
                  {selectedInvoice.igstRate
                    ? selectedInvoice.igstRate + '% - ₹ ' + selectedInvoice.igstAmount?.toLocaleString('en-IN')
                    : '-'}
                </Tag>
              </div>
              <div>
                <strong>Total Tax:</strong>{' '}
                <Tag color="red">₹ {selectedInvoice.totalTaxAmount?.toLocaleString('en-IN')}</Tag>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ScrapSalesSummary;
