import { JourneyColumn, Persona } from '@/types/journey';
import { forwardRef } from 'react';

interface PrintableJourneyProps {
  columns: JourneyColumn[];
  persona: Persona | null;
  projectName: string;
}

const tagColors: Record<string, string> = {
  user: '#3b82f6',
  system: '#22c55e',
  admin: '#f97316',
  edge: '#a855f7',
};

export const PrintableJourney = forwardRef<HTMLDivElement, PrintableJourneyProps>(
  ({ columns, persona, projectName }, ref) => {
    return (
      <div ref={ref} className="print-content">
        <style>{`
          .print-content {
            display: none;
          }
          
          @media print {
            @page {
              size: landscape;
              margin: 0.5in;
            }
            
            body * {
              visibility: hidden;
            }
            
            .print-content,
            .print-content * {
              visibility: visible !important;
            }
            
            .print-content {
              display: block !important;
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              background: white;
              font-family: 'Inter', system-ui, sans-serif;
            }
            
            .print-header {
              margin-bottom: 16px;
              padding-bottom: 12px;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .print-title {
              font-size: 18px;
              font-weight: 700;
              color: #1f2937;
              font-family: 'Space Grotesk', system-ui, sans-serif;
            }
            
            .print-subtitle {
              font-size: 12px;
              color: #6b7280;
              margin-top: 2px;
            }
            
            .print-columns {
              display: flex;
              gap: 12px;
              width: 100%;
            }
            
            .print-column {
              flex: 1;
              min-width: 0;
              background: #f9fafb;
              border-radius: 8px;
              padding: 10px;
              break-inside: avoid;
            }
            
            .print-column-header {
              font-size: 11px;
              font-weight: 600;
              color: #374151;
              margin-bottom: 8px;
              padding-bottom: 6px;
              border-bottom: 1px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-family: 'Space Grotesk', system-ui, sans-serif;
            }
            
            .print-column-count {
              font-size: 9px;
              background: #e5e7eb;
              padding: 2px 6px;
              border-radius: 10px;
              color: #6b7280;
            }
            
            .print-cards {
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
            
            .print-card {
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              padding: 8px 10px;
              break-inside: avoid;
            }
            
            .print-card-title {
              font-size: 10px;
              color: #1f2937;
              margin-bottom: 4px;
            }
            
            .print-card-description {
              font-size: 9px;
              color: #6b7280;
              margin-bottom: 4px;
            }
            
            .print-card-tags {
              display: flex;
              gap: 4px;
              flex-wrap: wrap;
            }
            
            .print-tag {
              font-size: 8px;
              padding: 1px 5px;
              border-radius: 4px;
              font-weight: 500;
            }
          }
        `}</style>
        
        <div className="print-header">
          <div className="print-title">{projectName}</div>
          {persona && (
            <div className="print-subtitle">
              Persona: {persona.name}
            </div>
          )}
        </div>
        
        <div className="print-columns">
          {columns.map((column) => (
            <div key={column.id} className="print-column">
              <div className="print-column-header">
                <span>{column.title}</span>
                <span className="print-column-count">{column.cards.length}</span>
              </div>
              <div className="print-cards">
                {column.cards.map((card) => (
                  <div key={card.id} className="print-card">
                    <div className="print-card-title">{card.title}</div>
                    {card.description && (
                      <div className="print-card-description">{card.description}</div>
                    )}
                    <div className="print-card-tags">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="print-tag"
                          style={{
                            backgroundColor: `${tagColors[tag]}20`,
                            color: tagColors[tag],
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

PrintableJourney.displayName = 'PrintableJourney';
