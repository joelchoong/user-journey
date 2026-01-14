import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { JourneyColumn, JourneyCard } from '@/types/journey';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ImportSpreadsheetProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (columns: JourneyColumn[]) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const parseCSV = (text: string): string[][] => {
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
};

export const ImportSpreadsheet = ({ isOpen, onClose, onImport }: ImportSpreadsheetProps) => {
  const [step, setStep] = useState<'upload' | 'configure'>('upload');
  const [data, setData] = useState<string[][]>([]);
  const [headerRow, setHeaderRow] = useState(0);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
    const isCSV = file.name.endsWith('.csv') || validTypes.includes(file.type);
    
    if (!isCSV) {
      toast.error('Please upload a CSV file');
      return;
    }

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length < 2) {
        toast.error('File must have at least 2 rows (header + data)');
        return;
      }
      setData(parsed);
      setHeaderRow(0);
      setStep('configure');
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    const headers = data[headerRow];
    const dataRows = data.slice(headerRow + 1);
    
    const columns: JourneyColumn[] = headers.map((header, colIndex) => {
      const cards: JourneyCard[] = dataRows
        .filter(row => row[colIndex]?.trim())
        .map(row => ({
          id: generateId(),
          title: row[colIndex]?.trim() || '',
          tags: ['user'] as const,
        }));
      
      return {
        id: generateId(),
        title: header || `Column ${colIndex + 1}`,
        cards,
      };
    });

    onImport(columns.filter(col => col.title.trim() || col.cards.length > 0));
    toast.success(`Imported ${columns.length} columns successfully!`);
    handleClose();
  };

  const handleClose = () => {
    setStep('upload');
    setData([]);
    setHeaderRow(0);
    setFileName('');
    onClose();
  };

  const maxColumns = Math.max(...data.map(row => row.length), 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Import from Spreadsheet
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Click to upload CSV file</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Each column will become a journey step
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'configure' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileSpreadsheet className="w-4 h-4" />
                {fileName}
              </div>
              <button
                onClick={() => setStep('upload')}
                className="text-sm text-primary hover:underline"
              >
                Change file
              </button>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium text-foreground mb-2">Select header row</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setHeaderRow(Math.max(0, headerRow - 1))}
                  disabled={headerRow === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-[80px] text-center">
                  Row {headerRow + 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setHeaderRow(Math.min(data.length - 2, headerRow + 1))}
                  disabled={headerRow >= data.length - 2}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden flex-1 min-h-0">
              <div className="overflow-auto max-h-[300px]">
                <table className="w-full text-sm">
                  <tbody>
                    {data.slice(0, 10).map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`border-b border-border last:border-0 ${
                          rowIndex === headerRow
                            ? 'bg-primary/10 font-semibold'
                            : rowIndex < headerRow
                            ? 'bg-muted/30 text-muted-foreground'
                            : ''
                        }`}
                      >
                        <td className="px-3 py-2 border-r border-border w-12 text-center text-muted-foreground">
                          {rowIndex === headerRow ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs">
                              H
                            </span>
                          ) : (
                            rowIndex + 1
                          )}
                        </td>
                        {Array.from({ length: maxColumns }).map((_, colIndex) => (
                          <td key={colIndex} className="px-3 py-2 border-r border-border last:border-0 max-w-[150px] truncate">
                            {row[colIndex] || ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length > 10 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground text-center bg-muted/30">
                    ... and {data.length - 10} more rows
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Preview:</span>{' '}
                {data[headerRow]?.length || 0} columns will be created with{' '}
                {data.length - headerRow - 1} cards each
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleClose}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleImport}>
                <Check className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};
