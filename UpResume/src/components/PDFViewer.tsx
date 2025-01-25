import React from 'react';

interface PDFViewerProps {
    url: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
    return (
        <div className="w-full h-full">
            <iframe
                src={url}
                className="w-full h-full"
                style={{
                    border: 'none',
                    margin: '-44px -16px',
                    padding: 0,
                    width: 'calc(100% + 32px)',
                    height: 'calc(100% + 88px)',
                    background: 'white'
                }}
            />
        </div>
    );
};

export default PDFViewer;
