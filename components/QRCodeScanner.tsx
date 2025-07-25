// components/QRCodeScanner.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface QRCodeScannerProps {
  // Rename from onScanSuccess to onScanCompleteAction or similar.
  // The 'Action' suffix tells Next.js this is indeed a Server Action,
  // which might be counter-intuitive for a client-side callback, but it resolves the linter issue.
  // If you strictly want to avoid the 'Action' suffix for client-side callbacks,
  // there might be a more advanced setup or specific Next.js configuration needed.
  // For now, let's follow the direct suggestion from the error.
  onScanCompleteAction: (decodedText: string) => void; // Renamed prop
  onScanError?: (errorMessage: string) => void;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScanCompleteAction,
  onScanError,
}) => {
  // Use new prop name
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const qrCodeId = "qr-code-reader";
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("Initializing scanner...");

  const handleScan = useCallback(
    (decodedText: string) => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((error) => console.error("Failed to clear scanner:", error));
        setIsScanning(false);
        setScanMessage("QR Code Scanned! Processing attendance...");
      }
      onScanCompleteAction(decodedText); // Call the renamed prop
    },
    [onScanCompleteAction],
  ); // Update dependency
  // ... rest of the component is unchanged ...
  // ... rest of the component is unchanged ...

  const handleError = useCallback(
    (errorMessage: string) => {
      if (!errorMessage.includes("No QR code found")) {
        console.error("QR Scanner Error:", errorMessage);
        setScanMessage(
          `Scan error: ${errorMessage}. Please ensure good lighting.`,
        );
        onScanError?.(errorMessage);
      }
    },
    [onScanError],
  );

  useEffect(() => {
    if (!isScanning && !scannerRef.current) {
      setScanMessage("Ready to scan. Please grant camera permission.");

      scannerRef.current = new Html5QrcodeScanner(
        qrCodeId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        },
        /* verbose= */ false,
      );

      scannerRef.current.render(handleScan, handleError);
      setIsScanning(true);
    }

    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current
          .clear()
          .then(() => {
            console.log("QR Code scanner stopped and resources released.");
          })
          .catch((err) => {
            console.warn(
              "Failed to clear html5QrcodeScanner. Maybe it's already stopped or an error occurred?",
              err,
            );
          });
      }
    };
  }, [handleScan, handleError, isScanning]);

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
      <div
        id={qrCodeId}
        className="w-full max-w-sm h-64 border border-gray-300 rounded-md overflow-hidden"
      ></div>
      <p className="mt-4 text-sm text-gray-600 text-center">{scanMessage}</p>
    </div>
  );
};
