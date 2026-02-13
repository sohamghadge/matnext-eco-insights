import { RegulatoryData } from '@/data/regulatoryData';
import EPRComplianceSection from './EPRComplianceSection';
import CBAMReadinessSection from './CBAMReadinessSection';
import ComplianceOverview from './ComplianceOverview';

interface ComplianceSubTabProps {
    regulatoryData: RegulatoryData | null;
    isLoading: boolean;
}

const ComplianceSubTab = ({ regulatoryData, isLoading }: ComplianceSubTabProps) => {
    if (!regulatoryData) return null;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* 1. High-Level Compliance Overview (Fleet Stats & Regulations) */}
            <ComplianceOverview data={regulatoryData} />
        </div>
    );
};

export default ComplianceSubTab;
