"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { Dialog } from "@headlessui/react";
import getCroppedImg from "@/lib/cropImage";

type Props = {
  file: File;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
};

const ImageCropperModal = ({ file, onClose, onCropComplete }: Props) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteCb = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    const imageDataUrl = await readFile(file);
    const blob = await getCroppedImg(imageDataUrl, croppedAreaPixels);
    onCropComplete(blob);
    onClose();
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <div className="bg-white p-4 rounded shadow-lg w-[90vw] max-w-md">
        <div className="relative w-full aspect-square bg-black">
          <Cropper
            image={URL.createObjectURL(file)}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteCb}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Crop & Save
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ImageCropperModal;

function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string));
    reader.readAsDataURL(file);
  });
}
