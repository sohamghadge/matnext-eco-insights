// Issue Management Data Types and Dummy Data

export type IssueType = 'Clarification' | 'Revert' | 'NG' | 'Technical' | 'Data Mismatch' | 'Compliance' | 'Operational';
export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type IssueStatus = 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';

export interface Assignee {
    name: string;
    initials: string;
}

export interface Issue {
    ticketNumber: string;
    raisedBy: string;
    issueDate: string;
    subject: string;
    issueType: IssueType;
    priority: Priority;
    issueDescription: string;
    status: IssueStatus;
    dueDate?: string;
    attachments?: string[];
    responses?: IssueResponse[];
    assignee: Assignee;
}

export interface IssueResponse {
    id: string;
    responder: string;
    message: string;
    timestamp: string;
}

export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
    issueId?: string;
    type: 'issue_raised' | 'issue_responded' | 'issue_resolved' | 'issue_closed';
}

// Assignees pool
export const assignees: Assignee[] = [
    { name: 'Ashish Busi', initials: 'AB' },
    { name: 'Soham Ghadge', initials: 'SG' },
    { name: 'Raviteja Macherla', initials: 'RM' },
    { name: 'Pulkit Kedia', initials: 'PK' },
];

// Dummy Issues Data with realistic dates (Jan-Feb 2026)
export const issuesData: Issue[] = [
    {
        ticketNumber: '8932',
        raisedBy: 'Peeco Sonipat',
        issueDate: 'Jan 25, 2026',
        subject: 'Invoice mismatch',
        issueType: 'Clarification',
        priority: 'High',
        issueDescription: 'The invoice number INV-2026-00453 does not match the material dispatch record for the steel scrap batch received on January 22nd. The dispatch note shows 2,450 kg but the invoice mentions 2,380 kg. This 70 kg variance needs to be reconciled before payment processing can proceed. Please verify with the logistics team and provide corrected documentation.',
        status: 'Pending',
        dueDate: 'Feb 05, 2026',
        attachments: ['invoice_8932.pdf'],
        responses: [],
        assignee: assignees[0], // Ashish Busi
    },
    {
        ticketNumber: '8931',
        raisedBy: 'Maruti Suzuki Toyotsu India',
        issueDate: 'Jan 18, 2026',
        subject: 'Recycled content discrepancy',
        issueType: 'Data Mismatch',
        priority: 'High',
        issueDescription: 'The reported recycled steel percentage of 78.5% in the compliance dashboard differs significantly from the EAF production batch certificate which shows 72.3%. This 6.2% variance affects our quarterly EPR compliance reporting. The discrepancy appears to be related to batch MSTI-B2026-0412. Urgent clarification needed as the compliance deadline is approaching.',
        status: 'In Progress',
        dueDate: 'Jan 28, 2026',
        attachments: ['batch_report_8931.xlsx'],
        responses: [
            {
                id: 'resp-1',
                responder: 'Raviteja Macherla',
                message: 'We are investigating the discrepancy with the EAF production team. Initial findings suggest there may have been a calculation error in the batch aggregation formula. Will update within 24 hours.',
                timestamp: 'Jan 19, 2026 10:30 AM',
            },
        ],
        assignee: assignees[2], // Raviteja Macherla
    },
    {
        ticketNumber: '8927',
        raisedBy: 'Vardhaman Special Steels Limited',
        issueDate: 'Jan 10, 2026',
        subject: 'Upload failure',
        issueType: 'Technical',
        priority: 'Medium',
        issueDescription: 'Unable to upload carbon emission data for the rolling process module. The system throws a timeout error after 45 seconds when attempting to upload the Excel file (size: 2.8 MB). We have tried multiple browsers (Chrome, Edge, Firefox) and different network connections. The file format has been verified as per the template. This is blocking our monthly emissions reporting.',
        status: 'Open',
        dueDate: 'Jan 30, 2026',
        attachments: [],
        responses: [],
        assignee: assignees[1], // Soham Ghadge
    },
    {
        ticketNumber: '8923',
        raisedBy: 'Sona Comstar',
        issueDate: 'Jan 05, 2026',
        subject: 'Clarification on traceability',
        issueType: 'Clarification',
        priority: 'Medium',
        issueDescription: 'We need detailed clarification on how the traceability percentage is calculated for mixed scrap batches containing both ferrous and non-ferrous materials. Specifically, when scrap from 3 different ELVs is combined in a single melt, how are the individual traceability scores weighted? Our internal audit team requires this methodology for ISO 14064 compliance documentation.',
        status: 'Resolved',
        dueDate: 'Jan 15, 2026',
        attachments: ['traceability_guidelines.pdf'],
        responses: [
            {
                id: 'resp-2',
                responder: 'Pulkit Kedia',
                message: 'The traceability percentage for mixed batches is calculated using a weighted average based on the mass fraction of each source material. For example, if Batch A (50kg, 95% traceable) + Batch B (30kg, 80% traceable) + Batch C (20kg, 100% traceable) = Combined traceability of [(50×0.95)+(30×0.80)+(20×1.00)]/100 = 91.5%. Attached is the detailed methodology document.',
                timestamp: 'Jan 08, 2026 02:15 PM',
            },
        ],
        assignee: assignees[3], // Pulkit Kedia
    },
    {
        ticketNumber: '8919',
        raisedBy: 'Satelite Forgings',
        issueDate: 'Dec 29, 2025',
        subject: 'Certificate expiry alert',
        issueType: 'Compliance',
        priority: 'Low',
        issueDescription: 'The ISO 14001:2015 certificate expiry date is showing as March 2025 in the system, but our renewed certificate is valid until March 2028. We uploaded the new certificate on December 15th but the system still displays the old expiry date. Please update the certificate validity in the compliance module.',
        status: 'Closed',
        dueDate: 'Jan 10, 2026',
        attachments: ['iso_certificate.pdf'],
        responses: [
            {
                id: 'resp-3',
                responder: 'Ashish Busi',
                message: 'The certificate date has been updated in the system. The display was cached from the previous version. We have cleared the cache and the correct expiry date (March 2028) is now showing. Please refresh your dashboard to see the updated information.',
                timestamp: 'Jan 02, 2026 11:00 AM',
            },
        ],
        assignee: assignees[0], // Ashish Busi
    },
    {
        ticketNumber: '8914',
        raisedBy: 'Kingfa Sciences Pvt. Ltd.',
        issueDate: 'Jan 21, 2026',
        subject: 'Weight variance',
        issueType: 'Data Mismatch',
        priority: 'Urgent',
        issueDescription: 'Critical discrepancy detected: The input scrap weight recorded as 3,250 kg exceeds the ELV registered vehicle curb weight of 2,890 kg by 360 kg. This is physically impossible and suggests either a data entry error or potential compliance issue. The affected batch is KSP-2026-0089 processed on January 20th. This requires immediate investigation as it may trigger regulatory audit flags.',
        status: 'In Progress',
        dueDate: 'Jan 28, 2026',
        attachments: ['weight_variance_report.xlsx'],
        responses: [
            {
                id: 'resp-4',
                responder: 'Soham Ghadge',
                message: 'Urgent investigation initiated. Preliminary review shows the batch may have accidentally included materials from an adjacent ELV (registration MH12-AB-1234). Cross-referencing weighbridge logs and CCTV footage to verify. Will escalate to compliance team if fraud is suspected.',
                timestamp: 'Jan 23, 2026 09:45 AM',
            },
        ],
        assignee: assignees[1], // Soham Ghadge
    },
    {
        ticketNumber: '8908',
        raisedBy: 'MSIL',
        issueDate: 'Jan 15, 2026',
        subject: 'Missing data',
        issueType: 'Compliance',
        priority: 'Urgent',
        issueDescription: 'Scope 3 transport emissions data is completely missing for Q4 2025 (Oct-Dec). This includes emissions from 847 vehicle movements across 12 transport contractors. Without this data, our annual sustainability report cannot be finalized and submitted to the regulatory authority by the January 31st deadline. The transport contractor module shows "Data Pending" for all entries.',
        status: 'Open',
        dueDate: 'Jan 30, 2026',
        attachments: [],
        responses: [],
        assignee: assignees[2], // Raviteja Macherla
    },
    {
        ticketNumber: '8901',
        raisedBy: 'Peeco Sonipat',
        issueDate: 'Jan 08, 2026',
        subject: 'Part shipment delay',
        issueType: 'Operational',
        priority: 'Medium',
        issueDescription: 'There is a 5-day mismatch between the shipment dispatch date recorded in the supplier portal (January 3rd) and the OEM receiving date in the system (January 8th). The actual transit time was only 2 days but the system shows 5 days. This is affecting our on-time delivery KPIs. The affected shipment ID is PS-SHIP-2026-0012 containing 450 recycled PP components.',
        status: 'Resolved',
        dueDate: 'Jan 18, 2026',
        attachments: ['shipment_log.pdf'],
        responses: [
            {
                id: 'resp-5',
                responder: 'Pulkit Kedia',
                message: 'Investigation complete. The discrepancy was caused by a timezone configuration issue in the receiving warehouse scanner. The system was recording IST timestamps but displaying them as UTC. Records have been corrected and the actual transit time of 2 days is now reflected. OTD KPI recalculated.',
                timestamp: 'Jan 12, 2026 04:30 PM',
            },
        ],
        assignee: assignees[3], // Pulkit Kedia
    },
];

// Initial notifications
export const initialNotifications: Notification[] = [
    {
        id: 'notif-1',
        message: 'Issue #8932 has been raised by Peeco Sonipat',
        timestamp: 'Jan 25, 2026 09:00 AM',
        read: false,
        issueId: '8932',
        type: 'issue_raised',
    },
    {
        id: 'notif-2',
        message: 'Issue #8931 response received from Raviteja Macherla',
        timestamp: 'Jan 19, 2026 10:30 AM',
        read: true,
        issueId: '8931',
        type: 'issue_responded',
    },
    {
        id: 'notif-3',
        message: 'Issue #8923 has been resolved',
        timestamp: 'Jan 08, 2026 02:15 PM',
        read: true,
        issueId: '8923',
        type: 'issue_resolved',
    },
];

// Issue type options for dropdown
export const issueTypeOptions: IssueType[] = [
    'Clarification',
    'Revert',
    'NG',
    'Technical',
    'Data Mismatch',
    'Compliance',
    'Operational',
];

// Priority options for dropdown
export const priorityOptions: Priority[] = ['Urgent', 'High', 'Medium', 'Low'];

// Status options
export const statusOptions: IssueStatus[] = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];

// Helper functions for styling
export const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
        case 'Urgent': return '#dc2626'; // Red
        case 'High': return '#f97316';    // Orange
        case 'Medium': return '#eab308';  // Yellow
        case 'Low': return '#22c55e';     // Green
        default: return '#6b7280';
    }
};

export const getPriorityRowBg = (priority: Priority): string => {
    switch (priority) {
        case 'Urgent': return 'rgba(220, 38, 38, 0.08)'; // Light red bg
        case 'High': return 'rgba(249, 115, 22, 0.06)';  // Light orange bg
        case 'Medium': return 'rgba(234, 179, 8, 0.05)'; // Light yellow bg
        case 'Low': return 'rgba(34, 197, 94, 0.04)';    // Light green bg
        default: return 'transparent';
    }
};

export const getPriorityRowShadow = (priority: Priority): string => {
    switch (priority) {
        case 'Urgent': return 'inset 4px 0 0 #dc2626'; // Red left border
        case 'High': return 'inset 4px 0 0 #f97316';   // Orange left border
        case 'Medium': return 'inset 4px 0 0 #eab308'; // Yellow left border
        case 'Low': return 'inset 4px 0 0 #22c55e';    // Green left border
        default: return 'none';
    }
};

export const getStatusColor = (status: IssueStatus): string => {
    switch (status) {
        case 'Open': return '#3b82f6';        // Blue
        case 'In Progress': return '#eab308'; // Yellow
        case 'Pending': return '#f97316';     // Orange
        case 'Resolved': return '#22c55e';    // Green
        case 'Closed': return '#6b7280';      // Gray
        default: return '#6b7280';
    }
};

export const getStatusBgColor = (status: IssueStatus): string => {
    switch (status) {
        case 'Open': return '#dbeafe';
        case 'In Progress': return '#fef3c7';
        case 'Pending': return '#ffedd5';
        case 'Resolved': return '#dcfce7';
        case 'Closed': return '#f3f4f6';
        default: return '#f3f4f6';
    }
};
