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
              flex-wrap: wrap;
              gap: 16px;
              width: 100%;
            }
            
            .print-column {
              flex: 0 0 calc(33.333% - 11px);
              min-width: 0;
              background: #fdfdfe;
              border: 1px solid #f1f5f9;
              border-radius: 10px;
              padding: 12px;
              break-inside: avoid;
              margin-bottom: 16px;
              box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            }
            
            @media (max-width: 800px) {
              .print-column {
                flex: 0 0 calc(50% - 8px);
              }
            }
            
            @media (max-width: 500px) {
              .print-column {
                flex: 0 0 100%;
              }
            }

            .print-column-header {
              font-size: 13px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 2px solid #f1f5f9;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-family: 'Space Grotesk', system-ui, sans-serif;
            }
            
            .print-column-count {
              font-size: 10px;
              background: #f1f5f9;
              padding: 2px 8px;
              border-radius: 12px;
              color: #64748b;
            }
            
            .print-cards {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            
            .print-card {
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 10px 12px;
              break-inside: avoid;
            }
            
            .print-card-title {
              font-size: 11px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 6px;
              line-height: 1.4;
            }
            
            .print-card-description {
              font-size: 10px;
              color: #475569;
              margin-bottom: 8px;
              line-height: 1.5;
            }
            
            .print-card-tags {
              display: flex;
              gap: 6px;
              flex-wrap: wrap;
              margin-top: 4px;
            }
            
            .print-tag {
              font-size: 9px;
              padding: 1px 6px;
              border-radius: 6px;
              font-weight: 600;
              text-transform: capitalize;
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
