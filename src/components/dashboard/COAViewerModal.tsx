import { useState } from 'react';
import { Modal, List, Button, Typography, Empty } from 'antd';
import { FileText, FileDown, ExternalLink } from 'lucide-react';

const { Text } = Typography;

interface COAViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Vite's import.meta.glob to load all PDFs from the public/coa directory dynamically.
// This works perfectly in Vite. The `?url` query ensures we get the served URL.
const pdfModules = import.meta.glob('/public/coa/*.{pdf,PDF}', { eager: true, query: '?url', import: 'default' });

const pdfFiles = Object.keys(pdfModules).map((path, index) => {
    // Extract filename from the path (e.g., "/public/coa/My Document.pdf" -> "My Document.pdf")
    const fileName = path.split('/').pop() || `Document ${index + 1}`;
    // Decode URI component to handle spaces (%20)
    const decodedName = decodeURIComponent(fileName);

    return {
        id: String(index),
        name: decodedName, // The filename is exactly what the user pasted
        url: pdfModules[path] as string,
        date: 'Uploaded Document',
    };
}).sort((a, b) => a.name.localeCompare(b.name));

const COAViewerModal = ({ isOpen, onClose }: COAViewerModalProps) => {
    const [selectedPdf, setSelectedPdf] = useState(pdfFiles.length > 0 ? pdfFiles[0] : null);

    return (
        <Modal
            title={
                <div className="flex flex-row items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    <span>Certificate of Analysis (COA) Viewer</span>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            width={1000}
            footer={null}
            centered
            className="coa-modal"
            classNames={{
                body: 'p-0',
            }}
        >
            <div className="flex h-[70vh] min-h-[500px] border-t border-border mt-4">
                {/* Sidebar */}
                <div className="w-1/3 border-r border-border bg-secondary/10 flex flex-col">
                    <div className="p-4 border-b border-border bg-card">
                        <h4 className="font-semibold text-foreground">Available Documents</h4>
                        <p className="text-xs text-muted-foreground mt-1">Select a document to view</p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <List
                            dataSource={pdfFiles}
                            renderItem={(file) => (
                                <List.Item
                                    onClick={() => setSelectedPdf(file)}
                                    className={`cursor-pointer px-4 py-3 hover:bg-accent/5 transition-colors ${selectedPdf.id === file.id ? 'bg-accent/10 border-l-4 border-accent' : 'border-l-4 border-transparent'
                                        }`}
                                >
                                    <List.Item.Meta
                                        avatar={<FileText className={`w-8 h-8 ${selectedPdf.id === file.id ? 'text-accent' : 'text-muted-foreground'}`} />}
                                        title={<span className={`font-medium ${selectedPdf.id === file.id ? 'text-accent' : 'text-foreground'}`}>{file.name}</span>}
                                        description={<span className="text-xs text-muted-foreground">{file.date}</span>}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                </div>

                {/* Main Viewer */}
                <div className="w-2/3 bg-card flex flex-col relative">
                    {selectedPdf ? (
                        <>
                            <div className="p-3 border-b border-border bg-card flex justify-between items-center shadow-sm z-10">
                                <Text strong className="text-foreground">{selectedPdf.name}</Text>
                                <div className="flex gap-2">
                                    <Button
                                        type="text"
                                        icon={<ExternalLink className="w-4 h-4" />}
                                        onClick={() => window.open(selectedPdf.url, '_blank')}
                                        title="Open in new tab"
                                    />
                                    <Button
                                        type="primary"
                                        icon={<FileDown className="w-4 h-4" />}
                                        className="bg-accent hover:bg-accent/90"
                                        href={selectedPdf.url}
                                        download
                                    >
                                        Download
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 bg-secondary/5 p-4 rounded-b-lg overflow-hidden flex flex-col">
                                <iframe
                                    src={`${selectedPdf.url}#toolbar=0&navpanes=0`}
                                    title={selectedPdf.name}
                                    className="w-full flex-1 rounded-md shadow-sm border border-border bg-white"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                            <Empty
                                image={<FileText className="w-16 h-16 text-muted-foreground/30 mx-auto" />}
                                description="No PDF selected"
                            />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default COAViewerModal;
