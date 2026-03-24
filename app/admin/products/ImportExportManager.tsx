"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Upload, Download, Loader2, X, Check, AlertCircle } from "lucide-react";
import { processImportBatch, exportProductsCsv } from "./importActions";

export default function ImportExportManager() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [logs, setLogs] = useState<{ type: 'success' | 'error', message: string }[]>([]);

  const handleExport = async () => {
    try {
      const csvStr = await exportProductsCsv();
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `shopify_products_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      alert("Failed to export products.");
    }
  };

  const parseCsvAndGroup = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as any[];
          const grouped: Record<string, any> = {};

          rows.forEach((row, idx) => {
            const handle = row["Handle"];
            if (!handle) return;

            if (!grouped[handle]) {
              // Primary record initialization
              grouped[handle] = {
                handle,
                title: row["Title"] || "",
                description: row["Body (HTML)"] || "",
                vendor: row["Vendor"] || "",
                price: parseFloat(row["Variant Price"]) || 0,
                // Shopify uses Tags for varied metadata. Example: "Burn Time: 60 hrs, Wax: Soy, Fragrance: Oud, 100% Pure Soy"
                tags: row["Tags"] ? row["Tags"].split(",").map((t: string) => t.trim()) : [],
                images: [],
              };
            }

            // Append image if present
            if (row["Image Src"]) {
              const pos = parseInt(row["Image Position"] || "1", 10);
              grouped[handle].images.push({ url: row["Image Src"], position: pos });
            }
          });

          // Final processing per grouped product
          const productsToImport = Object.values(grouped).map(p => {
             // sort images by position
             p.images.sort((a: any, b: any) => a.position - b.position);
             const imageUrls = p.images.map((img: any) => img.url).slice(0, 10); // max 10

             // Parse Specs & Badges from tags
             const specs: any = {};
             const badges: string[] = [];
             
             p.tags.forEach((tag: string) => {
                const lowerTag = tag.toLowerCase();
                // Extremely robust auto-mapping
                if (lowerTag.includes("burn time")) specs["Burn Time"] = tag.split(":")[1]?.trim() || tag;
                else if (lowerTag.includes("wax") || lowerTag.includes("soy")) specs["Wax Material"] = tag.split(":")[1]?.trim() || tag;
                else if (lowerTag.includes("fragrance") || lowerTag.includes("scent")) specs["Fragrance Notes"] = tag.split(":")[1]?.trim() || tag;
                else if (lowerTag.includes("weight") || lowerTag.includes("gm")) specs["Net Weight"] = tag.split(":")[1]?.trim() || tag;
                else if (lowerTag.includes("jar") || lowerTag.includes("dimension")) specs["Jar Material & Dimensions"] = tag.split(":")[1]?.trim() || tag;
                else {
                    // if it doesn't match predefined spec keys, assume it's a badge
                    badges.push(tag);
                }
             });

             return {
                title: p.title,
                slug: p.handle,
                description: p.description,
                price: p.price,
                specifications: Object.keys(specs).length > 0 ? specs : null,
                badges: badges,
                imageUrls: imageUrls
             };
          });

          resolve(productsToImport);
        },
        error: (err) => reject(err)
      });
    });
  };

  const handleImport = async () => {
    if (!file) {
      alert("Please select a valid CSV file first.");
      return;
    }

    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      alert("Invalid file format. Please upload a .csv file.");
      return;
    }

    try {
      setIsProcessing(true);
      setLogs([{ type: 'success', message: `MAPPING: Parsing Shopify CSV format...` }]);
      const productsList = await parseCsvAndGroup(file);
      
      setTotalProducts(productsList.length);
      setLogs(prev => [...prev, { type: 'success', message: `Parsed ${productsList.length} unique products grouped by Handle.` }]);
      
      const BATCH_SIZE = 5;
      let successCount = 0;
      let failedCount = 0;

      for (let i = 0; i < productsList.length; i += BATCH_SIZE) {
        const batch = productsList.slice(i, i + BATCH_SIZE);
        
        try {
           const result = await processImportBatch(batch);
           successCount += result.success;
           
           if (result.errors && result.errors.length > 0) {
              result.errors.forEach((err: any) => {
                 setLogs(prev => [...prev, { type: 'error', message: `Failed to import '${err.slug}': ${err.reason}` }]);
                 failedCount++;
              });
           }
        } catch (err: any) {
           setLogs(prev => [...prev, { type: 'error', message: `Batch ${i/BATCH_SIZE + 1} fatal error: ${err.message}` }]);
           failedCount += batch.length;
        }

        setProgress(Math.round(((i + batch.length) / productsList.length) * 100));
      }

      setLogs(prev => [...prev, { type: 'success', message: `✅ Import completed. ${successCount} successful, ${failedCount} failed.` }]);
      
    } catch (e: any) {
      setLogs(prev => [...prev, { type: 'error', message: `CSV Parsing Exception: ${e.message}` }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <button 
          onClick={handleExport}
          className="bg-white border text-gray-700 hover:bg-gray-50 border-gray-200 px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-all"
        >
          <Download className="w-5 h-5 text-gray-500" /> Export CSV
        </button>
        <button 
          onClick={() => { setIsImportModalOpen(true); setFile(null); setLogs([]); setProgress(0); }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-all shadow-green-600/20"
        >
          <Upload className="w-5 h-5" /> Bulk Import
        </button>
      </div>

      {isImportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
               <div>
                 <h2 className="text-2xl font-bold text-gray-900">Shopify CSV Import</h2>
                 <p className="text-gray-500 text-sm">Upload standard Shopify products_export.csv format.</p>
               </div>
               <button disabled={isProcessing} onClick={() => setIsImportModalOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                 <X className="w-5 h-5" />
               </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {/* File Uploader */}
              {!isProcessing && progress === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 p-8 text-center mb-6 relative hover:border-green-500/50 hover:bg-green-50/30 transition-all">
                   <input 
                     type="file" 
                     accept=".csv"
                     onChange={(e) => setFile(e.target.files?.[0] || null)}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                   />
                   <Upload className="w-12 h-12 text-green-600 mx-auto mb-3" />
                   {file ? (
                     <p className="text-base text-gray-900 font-semibold mb-1">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
                   ) : (
                     <>
                      <p className="text-base text-gray-700 font-semibold mb-1">Select or drop CSV file</p>
                      <p className="text-sm text-gray-500">Group by Handle, Maps Tags to Requirements, Merges Images Array</p>
                     </>
                   )}
                </div>
              )}

              {/* Progress UI */}
              {(isProcessing || progress > 0) && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-gray-700">Import Progress ({progress}%)</span>
                    <span className="text-green-600 font-bold">{isProcessing ? 'Processing batches...' : 'Done'}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300 relative overflow-hidden" 
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_1s_infinite]" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)' , backgroundSize: '1rem 1rem'}}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Logs UI */}
              {logs.length > 0 && (
                <div className="bg-gray-900 rounded-xl p-4 h-64 overflow-y-auto font-mono text-sm space-y-2">
                  {logs.map((log, i) => (
                    <div key={i} className={`flex items-start gap-2 ${log.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                      <span className="mt-0.5">{log.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}</span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsImportModalOpen(false)}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Close
              </button>
              {progress < 100 && (
                <button 
                  onClick={handleImport}
                  disabled={isProcessing || !file}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Import"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
