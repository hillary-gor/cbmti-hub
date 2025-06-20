'use client';

import React from 'react';
import type { FC } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';

interface QRCodeDisplayProps {
  qrValue: string;
  size?: number;
}

export const QRCodeDisplay: FC<QRCodeDisplayProps> = ({
  qrValue,
  size = 256,
}) => {
  if (!qrValue) {
    return (
      <div className="...">
        <p>Generating QR code...</p>
      </div>
    );
  }

  return (
    <div className="...">
      <QRCode value={qrValue} size={size} level="H" includeMargin={false} />
    </div>
  );
};
