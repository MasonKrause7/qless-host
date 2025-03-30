import QRCode from "qrcode";
import { uploadQrCode } from "./supabaseService";


/* 
Qr code flow,,,
manager creates a truck -> qr code is generated -> qr img file is stored in storage -> publicURL is returned.
*/

export const generateAndUploadQRCode = async (truck_id: number) => {
  const value = `${window.location.origin}/customer?truckId=${truck_id}`;

  try {
    // Generate QR Code as a Data URL (PNG format)
    const qrDataUrl = await QRCode.toDataURL(value, { type: "image/png" });

    // Convert Data URL to Blob
    const res = await fetch(qrDataUrl);
    const blob = await res.blob();

    // Define file path in Supabase Storage
    const publicUrl = await uploadQrCode(truck_id, blob);
    return publicUrl;
  } catch (err) {
    console.error("QR Code generation or upload failed:", err);
    return null; // Return null if any error occurs
  }
};
