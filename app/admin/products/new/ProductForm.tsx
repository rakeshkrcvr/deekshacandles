"use client";

import { useState } from "react";
import { 
  UploadCloud, X, Plus, Trash2, Check, ArrowLeft, Save, Loader2,
  Image as ImageIcon, HelpCircle, Tags, Truck, Layers, Star
} from "lucide-react";
import Link from "next/link";
import { saveProductAction } from "./actions";

export default function ProductForm({ categories, initialData }: { categories: any[], initialData?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [images, setImages] = useState<{ id: string, url: string, isMain: boolean, file?: File }[]>(
    initialData?.imageUrls?.map((url: string, i: number) => ({
      id: "img_" + i,
      url,
      isMain: i === 0
    })) || []
  );
  
  const [imageInput, setImageInput] = useState("");

  const [badges, setBadges] = useState<string[]>(initialData?.badges || []);
  const availableBadges = [
    "100% Pure Soy Wax",
    "Handmade in India",
    "Toxin-Free",
    "Cruelty-Free",
    "Long Lasting Burn",
    "Premium Fragrance"
  ];

  const [dynamicSections, setDynamicSections] = useState<{ id: string, title: string, content: string }[]>(
    initialData?.details?.length > 0 
      ? initialData.details.map((d: any) => ({ id: d.id || Date.now().toString() + Math.random().toString(), title: d.label, content: d.value }))
      : [{ id: "1", title: "Details", content: "" }]
  );

  const [toggles, setToggles] = useState({
    countdownTimer: initialData?.countdownExpiry ? true : false,
    cod: true, // simplified for demo
    freeReturns: true // simplified for demo
  });

  const parsedSpecs = initialData?.specifications ? (typeof initialData.specifications === 'string' ? JSON.parse(initialData.specifications) : initialData.specifications) : {};

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setImages(prev => {
      const updated = [...prev, { id: Date.now().toString(), url: imageInput, isMain: prev.length === 0 }];
      return updated.slice(0, 10);
    });
    setImageInput("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 10 - images.length);
    
    const newImages = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(),
      url: URL.createObjectURL(file), // create local preview URL
      isMain: false,
      file,
    }));

    setImages(prev => {
      const updated = [...prev, ...newImages].slice(0, 10);
      if (updated.length > 0 && !updated.find(img => img.isMain)) {
        updated[0].isMain = true;
      }
      return updated;
    });
    
    e.target.value = '';
  };

  const setMainImage = (id: string) => {
    setImages(prev => {
      const targetIndex = prev.findIndex(img => img.id === id);
      if (targetIndex === -1) return prev;
      
      const newArr = [...prev];
      const [target] = newArr.splice(targetIndex, 1);
      
      newArr.forEach(img => img.isMain = false);
      target.isMain = true;
      
      return [target, ...newArr];
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const toggleBadge = (badge: string) => {
    setBadges(prev => 
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };

  const addDynamicSection = () => {
    setDynamicSections(prev => [
      ...prev,
      { id: Date.now().toString(), title: "New Section", content: "" }
    ]);
  };

  const removeDynamicSection = (id: string) => {
    setDynamicSections(prev => prev.filter(sec => sec.id !== id));
  };

  const updateDynamicSection = (id: string, field: 'title' | 'content', value: string) => {
    setDynamicSections(prev => prev.map(sec => sec.id === id ? { ...sec, [field]: value } : sec));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      formData.append("badges", JSON.stringify(badges));
      
      const netWeight = formData.get("netWeight");
      const burnTime = formData.get("burnTime");
      const material = formData.get("material");
      const fragrance = formData.get("fragrance");
      const jar = formData.get("jar");
      const specs = {
        ...(netWeight && { "Net Weight": netWeight }),
        ...(burnTime && { "Burn Time": burnTime }),
        ...(material && { "Wax Material": material }),
        ...(fragrance && { "Fragrance Notes": fragrance }),
        ...(jar && { "Jar Material & Dimensions": jar }),
      };
      
      if (Object.keys(specs).length > 0) {
        formData.append("specifications", JSON.stringify(specs));
      }
      
      formData.append("countdownTimer", toggles.countdownTimer.toString());
      
      images.forEach(img => {
        if (img.file) {
          formData.append("image", img.file);
        } else if (img.url && !img.url.startsWith("blob:")) {
          formData.append("image", img.url);
        }
      });
      
      formData.append("dynamicSections", JSON.stringify(dynamicSections));

      
      await saveProductAction(formData);
    } catch (error) {
      console.error(error);
      alert("Failed to save product.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-20">
      <input type="hidden" name="productId" value={initialData?.id || ""} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-[#faf9f6]/80 backdrop-blur-md z-10 py-4 border-b border-gray-200/50">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm border border-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{initialData ? 'Edit Product' : 'Create New Product'}</h1>
            <p className="text-gray-500 text-sm mt-0.5">Fill in the details to publish or update your product.</p>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Image Upload Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <ImageIcon className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
            </div>
            
            <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 p-8 text-center transition-colors hover:bg-gray-100/50 mb-6 relative">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                title="Click or drag to upload"
              />
              <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-700 font-medium mb-1">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400 mb-5">Supports JPG, PNG limit 5MB (Max 10 images)</p>
              
              <div className="relative z-20 flex items-center gap-2 max-w-sm mx-auto mt-4 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                <input 
                  type="text" 
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="Or paste image URL instead..." 
                  className="flex-1 text-sm outline-none bg-transparent"
                />
                <button type="button" onClick={handleAddImage} className="text-sm font-semibold text-amber-600 hover:text-amber-700">
                  Add URL
                </button>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div key={img.id} className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${img.isMain ? 'border-amber-500 shadow-md' : 'border-gray-100'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="Product preview" className="w-full h-full object-cover" />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button type="button" onClick={() => removeImage(img.id)} className="p-1.5 bg-white/20 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {!img.isMain && (
                        <button type="button" onClick={() => setMainImage(img.id)} className="w-full py-1.5 bg-white/20 hover:bg-amber-500 text-white rounded-lg backdrop-blur-md text-xs font-semibold uppercase tracking-wide transition-colors">
                          Set Main
                        </button>
                      )}
                    </div>
                    {img.isMain && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Basic Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <Layers className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Title*</label>
                <input defaultValue={initialData?.title} required name="title" type="text" className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g., Iced Coffee Scented Candle" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select name="categoryId" defaultValue={initialData?.categoryId || ""} className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none bg-white text-gray-700">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Slug</label>
                  <input defaultValue={initialData?.slug} name="slug" type="text" className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-gray-400 bg-gray-50" placeholder="iced-coffee-candle" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description</label>
                <textarea defaultValue={initialData?.description} required name="description" rows={3} className="w-full border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-gray-400" placeholder="A brief, engaging description of the scent profile and vibe..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price (₹)</label>
                  <input defaultValue={initialData?.price} required name="price" type="number" className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="1299" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">Offer Price (₹) <span className="text-gray-400 text-xs font-normal">(Optional)</span></label>
                  <input defaultValue={initialData?.discount ? Math.round(initialData.price - (initialData.price * initialData.discount / 100)) : ""} name="offerPrice" type="number" className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="999" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Product Specifics */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <Star className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">Product Specifics</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Net Weight</label>
                <input defaultValue={parsedSpecs["Net Weight"] || ""} name="netWeight" type="text" className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g., 350gm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Burn Time</label>
                <input defaultValue={parsedSpecs["Burn Time"] || ""} name="burnTime" type="text" className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g., 60 Hours" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Wax Material</label>
                <input defaultValue={parsedSpecs["Wax Material"] || ""} name="material" type="text" className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g., Soy + Gel Wax" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Fragrance Notes</label>
                <input defaultValue={parsedSpecs["Fragrance Notes"] || ""} name="fragrance" type="text" className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g., Coffee, Oud, Vanilla" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jar Material & Dimensions</label>
                <input defaultValue={parsedSpecs["Jar Material & Dimensions"] || ""} name="jar" type="text" className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g., Glass Jar - 4x3 Inches" />
              </div>
            </div>
          </div>

          {/* 4. Dynamic Sections (Accordion Creator) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
               <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-gray-900">Dynamic Sections (Tabs/Accordion)</h2>
               </div>
               <button 
                  type="button" 
                  onClick={addDynamicSection}
                  className="text-sm text-gray-900 flex items-center gap-1 font-medium hover:text-amber-600 transition-colors"
               >
                 <Plus className="w-4 h-4" /> Add Section
               </button>
            </div>

            <div className="space-y-4">
              {dynamicSections.map((sec) => (
                <div key={sec.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 group">
                  <div className="flex justify-between items-start mb-3">
                    <input 
                      type="text" 
                      value={sec.title}
                      onChange={(e) => updateDynamicSection(sec.id, 'title', e.target.value)}
                      className="font-medium bg-transparent border-b border-gray-300 focus:border-amber-500 outline-none px-1 py-1 w-1/2"
                      placeholder="Section Title (e.g., How to Use)"
                    />
                    <button type="button" onClick={() => removeDynamicSection(sec.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea 
                    rows={3}
                    value={sec.content}
                    onChange={(e) => updateDynamicSection(sec.id, 'content', e.target.value)}
                    className="w-full border-gray-200 border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                    placeholder="Enter section content here..."
                  ></textarea>
                </div>
              ))}
              {dynamicSections.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">No dynamic sections added.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar Config) */}
        <div className="space-y-8">
          
          {/* 5. Special Offers */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              🎉 Special Offers
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Offer Text banner</label>
                <input defaultValue={initialData?.offerTag} name="offerText" type="text" className="w-full border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g., BUY 1 GET 3 FREE!" />
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-amber-500 transition-colors">
                <input 
                  type="checkbox" 
                  checked={toggles.countdownTimer}
                  onChange={(e) => setToggles({...toggles, countdownTimer: e.target.checked})}
                  className="w-4 h-4 accent-amber-500" 
                />
                <span className="text-sm font-medium text-gray-800">Enable Countdown Timer</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-red-600">Triple Treat Alert Area</label>
                <textarea defaultValue={initialData?.tripleTreatAlert} name="tripleTreatAlert" rows={2} className="w-full border-red-200 border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-red-50/30 placeholder:text-red-300" placeholder="e.g., Get 1 large + 2 mini candles free..."></textarea>
              </div>
            </div>
          </div>

          {/* 6. Marketing Badges */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <Tags className="w-4 h-4" /> Marketing Badges
            </h2>
            <div className="flex flex-wrap gap-2">
              {availableBadges.map(badge => {
                const isSelected = badges.includes(badge);
                return (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => toggleBadge(badge)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all flex items-center gap-1 ${
                      isSelected 
                        ? 'bg-amber-100 border-amber-300 text-amber-800' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {badge}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 7. Shipping & Trust */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <Truck className="w-4 h-4" /> Shipping & Trust
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Instock Status</label>
                <input defaultValue={initialData?.stock ?? 50} name="stock" type="number" className="w-full border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estimated Delivery Days</label>
                <input defaultValue={initialData?.deliveryEstimate} name="deliveryDays" type="text" className="w-full border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g., 2-4 Days" />
              </div>
              
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={toggles.cod}
                    onChange={(e) => setToggles({...toggles, cod: e.target.checked})}
                    className="w-4 h-4 accent-amber-500" 
                  />
                  <span className="text-sm font-medium text-gray-700">Cash on Delivery Available</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={toggles.freeReturns}
                    onChange={(e) => setToggles({...toggles, freeReturns: e.target.checked})}
                    className="w-4 h-4 accent-amber-500" 
                  />
                  <span className="text-sm font-medium text-gray-700">7-Day Hassle-Free Returns</span>
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
