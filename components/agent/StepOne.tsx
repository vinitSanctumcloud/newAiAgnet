'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, Palette, AlertCircle, Eye, Trash2, Check } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IAIAgent } from '@/store/slice/agentSlice';
import { cn } from '@/lib/utils';

interface StepOneProps {
  agent: IAIAgent;
  onAgentChange: (agent: Partial<IAIAgent>) => void;
}

export default function StepOne({ agent, onAgentChange }: StepOneProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof IAIAgent, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof IAIAgent, boolean>>>({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  // Predefined color palette
  const colorPalette = [
    '#007bff', // Blue
    '#28a745', // Green
    '#dc3545', // Red
    '#6610f2', // Purple
    '#ffc107', // Yellow
    '#17a2b8', // Cyan
    '#fd7e14', // Orange
    '#6c757d', // Gray
    '#e83e8c', // Pink
    '#20c997', // Teal
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const setPreview = (file: string | File | null, setPreviewFn: (url: string | null) => void) => {
      if (!file) {
        setPreviewFn(null);
        return;
      }
      if (typeof file === 'string') {
        const domain = 'https://qkkso80gw8ss0kscc8c4skkg.prod.sanctumcloud.com';
        const isAbsoluteUrl = /^https?:\/\//i.test(file);
        const cleanedUrl = isAbsoluteUrl
          ? file
          : file.startsWith('/')
            ? `${domain}${file.replace(/([^:]\/)\/+/g, '$1')}`
            : `${domain}/${file.replace(/([^:]\/)\/+/g, '$1')}`;
        setPreviewFn(cleanedUrl);
      } else if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = () => setPreviewFn(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    setPreview(agent.logoFile ?? null, setLogoPreview);
    setPreview(agent.bannerFile ?? null, setBannerPreview);
  }, [agent.logoFile, agent.bannerFile]);

  const validateField = (field: keyof IAIAgent, value: any): string | undefined => {
    if (['aiAgentName', 'agentDescription', 'domainExpertise'].includes(field) && (!value || !value.trim())) {
      return `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
    }
    if (field === 'colorTheme' && (!value || !/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value))) {
      return 'Valid hex color code is required';
    }
    if (field === 'logoFile' && !value) {
      return 'Logo file is required';
    }
    return undefined;
  };

  const handleChange = (field: keyof IAIAgent, value: any) => {
    onAgentChange({ [field]: value });
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleFileChange = (field: 'logoFile' | 'bannerFile', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, [field]: 'Please upload an image file (JPEG, PNG, GIF)' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [field]: 'File size exceeds 5MB' }));
        return;
      }
    }
    handleChange(field, file);
    if (field === 'logoFile' && touched.logoFile) {
      setErrors((prev) => ({ ...prev, logoFile: validateField('logoFile', file) }));
    }
  };

  const handleBlur = (field: keyof IAIAgent) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, agent[field]) }));
  };

  const removeFile = (field: 'logoFile' | 'bannerFile') => {
    handleChange(field, null);
    if (field === 'logoFile') setLogoPreview(null);
    else setBannerPreview(null);
    if (touched.logoFile && field === 'logoFile') {
      setErrors((prev) => ({ ...prev, logoFile: validateField('logoFile', null) }));
    }
  };

  const handleColorSelect = (color: string) => {
    handleChange('colorTheme', color);
    setShowColorPicker(false);
  };

  return (
    <Card className="w-full bg-gradient-to-br dark:from-slate-900 dark:via-blue-900/10 dark:to-indigo-900/10 border-none rounded-2xl sm:rounded-3xl">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
          {/* Form Fields */}
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:gap-8">
              {/* Agent Name */}
              <div>
                <Label htmlFor="aiAgentName" className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mb-2 sm:mb-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                  Agent Name <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="aiAgentName"
                    value={agent.aiAgentName}
                    onChange={(e) => handleChange('aiAgentName', e.target.value)}
                    onBlur={() => handleBlur('aiAgentName')}
                    placeholder="e.g., Customer Support Bot"
                    className={cn(
                      "h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl border-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm",
                      "transition-all duration-300 border-slate-200 dark:border-slate-700",
                      "focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 dark:focus:ring-blue-500/20",
                      "text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm sm:text-base",
                      errors.aiAgentName ? 'border-red-400 focus:border-red-400 focus:ring-red-200/50' : ''
                    )}
                  />
                </div>
                {errors.aiAgentName && (
                  <p className="text-red-400 text-xs sm:text-sm mt-2 sm:mt-3 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
                    <span className="break-words">{errors.aiAgentName}</span>
                  </p>
                )}
              </div>

              {/* Domain Expertise */}
              <div>
                <Label htmlFor="domainExpertise" className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mb-2 sm:mb-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex-shrink-0"></div>
                  Domain Expertise <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="domainExpertise"
                  value={agent.domainExpertise || ''}
                  onChange={(e) => handleChange('domainExpertise', e.target.value)}
                  onBlur={() => handleBlur('domainExpertise')}
                  placeholder="e.g., Customer Support, Sales, Marketing"
                  className={cn(
                    "h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl border-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm",
                    "transition-all duration-300 border-slate-200 dark:border-slate-700",
                    "focus:border-green-500 focus:ring-4 focus:ring-green-200/50 dark:focus:ring-green-500/20",
                    "text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm sm:text-base",
                    errors.domainExpertise ? 'border-red-400 focus:border-red-400 focus:ring-red-200/50' : ''
                  )}
                />
                {errors.domainExpertise && (
                  <p className="text-red-400 text-xs sm:text-sm mt-2 sm:mt-3 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
                    <span className="break-words">{errors.domainExpertise}</span>
                  </p>
                )}
              </div>

              {/* Color Theme */}
              <div>
                <Label className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mb-2 sm:mb-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
                  Brand Color <span className="text-red-400">*</span>
                </Label>
                <div className="flex flex-col gap-4 sm:gap-6">
                  <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4">
                    <div className="relative group flex-shrink-0">
                      <div
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl border-3 border-white dark:border-slate-800 shadow-lg cursor-pointer 
                                 transition-all duration-300 hover:scale-110 hover:rotate-12 group-hover:shadow-xl"
                        style={{ backgroundColor: agent.colorTheme || '#007bff' }}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                      />
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-purple-600 to-pink-600 p-1.5 sm:p-2 rounded-full shadow-lg">
                        <Palette className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                    </div>

                    <div className="relative flex-1 w-full min-w-0">
                      <Input
                        value={agent.colorTheme || '#007bff'}
                        onChange={(e) => handleChange('colorTheme', e.target.value)}
                        onBlur={() => handleBlur('colorTheme')}
                        placeholder="#007bff"
                        className={cn(
                          "h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl border-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm font-mono text-sm sm:text-lg font-bold",
                          "transition-all duration-300 border-slate-200 dark:border-slate-700",
                          "focus:border-purple-500 focus:ring-4 focus:ring-purple-200/50 dark:focus:ring-purple-500/20",
                          errors.colorTheme ? 'border-red-400 focus:border-red-400 focus:ring-red-200/50' : ''
                        )}
                      />
                      {showColorPicker && (
                        <div
                          ref={colorPickerRef}
                          className="absolute z-20 mt-2 shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden border-3 border-white dark:border-slate-800"
                        >
                          <HexColorPicker
                            color={agent.colorTheme || '#007bff'}
                            onChange={(color) => handleChange('colorTheme', color)}
                            style={{ width: '200px', height: '200px' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Predefined Color Palette */}
                  <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 sm:gap-2">
                    {colorPalette.map((color) => (
                      <button
                        key={color}
                        className={cn(
                          "w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl border-2 border-white dark:border-slate-800 shadow-sm relative",
                          "transition-all duration-300 hover:scale-110 hover:shadow-md",
                          agent.colorTheme === color ? 'scale-110 ring-2 ring-purple-500 dark:ring-purple-400' : ''
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                        title={color}
                      >
                        {agent.colorTheme === color && (
                          <Check className="absolute inset-0 m-auto h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 text-white drop-shadow-md" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.colorTheme && (
                  <p className="text-red-400 text-xs sm:text-sm mt-2 sm:mt-3 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
                    <span className="break-words">{errors.colorTheme}</span>
                  </p>
                )}
              </div>

              {/* Agent Description */}
              <div>
                <Label htmlFor="agentDescription" className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mb-2 sm:mb-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex-shrink-0"></div>
                  Agent Description <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="agentDescription"
                  value={agent.agentDescription || ''}
                  onChange={(e) => handleChange('agentDescription', e.target.value)}
                  onBlur={() => handleBlur('agentDescription')}
                  placeholder="Describe your AI agent's purpose, capabilities, and target audience..."
                  rows={3}
                  className={cn(
                    "min-h-[100px] sm:min-h-[120px] p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm resize-none",
                    "transition-all duration-300 border-slate-200 dark:border-slate-700",
                    "focus:border-orange-500 focus:ring-4 focus:ring-orange-200/50 dark:focus:ring-orange-500/20",
                    "text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm sm:text-base",
                    errors.agentDescription ? 'border-red-400 focus:border-red-400 focus:ring-red-200/50' : ''
                  )}
                />
                {errors.agentDescription && (
                  <p className="text-red-400 text-xs sm:text-sm mt-2 sm:mt-3 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
                    <span className="break-words">{errors.agentDescription}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Media Uploads */}
          <div className="space-y-6 sm:space-y-8">
            {/* Logo Upload */}
            <div>
              <Label className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-4">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex-shrink-0"></div>
                Agent Logo <span className="text-red-400">*</span>
                <span className="text-xs sm:text-sm text-slate-500 font-normal ml-0 sm:ml-1">(Square ratio recommended)</span>
              </Label>
              <div className="space-y-3 sm:space-y-4">
                {logoPreview ? (
                  <div className="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg transition-all duration-500 hover:shadow-xl">
                    <div className="flex flex-col xs:flex-row items-center gap-4 sm:gap-6">
                      <div className="relative flex-shrink-0">
                        <Image
                          src={logoPreview}
                          alt="Logo Preview"
                          width={80}
                          height={80}
                          className="rounded-xl sm:rounded-2xl object-contain bg-white dark:bg-slate-700 p-2 sm:p-3 shadow-lg transition-transform duration-500 group-hover:scale-110 ring-3 ring-emerald-100 dark:ring-emerald-900"
                          unoptimized={logoPreview.startsWith('data:')}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-400/20 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="flex gap-2 sm:gap-3 w-full xs:w-auto justify-center xs:justify-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowLogoModal(true)}
                          className="h-9 sm:h-11 px-3 sm:px-4 text-xs sm:text-sm border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 
                                   hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all duration-300 
                                   rounded-lg sm:rounded-xl shadow-md hover:shadow-lg flex items-center gap-1.5"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Preview</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile('logoFile')}
                          className="h-9 sm:h-11 px-3 sm:px-4 text-xs sm:text-sm text-red-500 dark:text-red-400 hover:text-white border-red-200 dark:border-red-800
                                   hover:bg-red-500 dark:hover:bg-red-600 transition-all duration-300 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg flex items-center gap-1.5"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all duration-500",
                      "bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-blue-900/20",
                      "hover:border-blue-400 hover:bg-blue-100/30 dark:hover:bg-blue-900/30 hover:scale-[1.02]",
                      "border-slate-300 dark:border-slate-600 shadow-lg hover:shadow-xl",
                      errors.logoFile ? 'border-red-300 bg-red-50/50 dark:bg-red-900/20' : ''
                    )}
                    onClick={() => logoFileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                      <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-110">
                        <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 sm:mb-2">
                          Upload Your Logo
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-tight">
                          PNG, JPG, GIF up to 5MB • Square ratio works best
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-1 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 
                                 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all duration-300
                                 rounded-lg sm:rounded-xl px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm font-semibold shadow-md"
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                )}
                <Input
                  id="logoFile"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  ref={logoFileInputRef}
                  onChange={(e) => handleFileChange('logoFile', e)}
                  onBlur={() => handleBlur('logoFile')}
                />
                {errors.logoFile && (
                  <p className="text-red-400 text-xs sm:text-sm flex items-center gap-2 mt-2 sm:mt-3 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> 
                    <span className="break-words">{errors.logoFile}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Banner Upload */}
            <div>
              <Label className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-4">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex-shrink-0"></div>
                Banner Image
                <span className="text-xs sm:text-sm text-slate-500 font-normal ml-0 sm:ml-1">(Optional - 16:9 ratio recommended)</span>
              </Label>
              <div className="space-y-3 sm:space-y-4">
                {bannerPreview ? (
                  <div className="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-violet-200 dark:border-violet-800 shadow-lg transition-all duration-500 hover:shadow-xl">
                    <div className="flex flex-col xs:flex-row items-center gap-4 sm:gap-6">
                      <div className="relative flex-shrink-0">
                        <Image
                          src={bannerPreview}
                          alt="Banner Preview"
                          width={100}
                          height={60}
                          className="rounded-lg sm:rounded-xl object-cover shadow-lg transition-transform duration-500 group-hover:scale-105"
                          unoptimized={bannerPreview.startsWith('data:')}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-violet-400/20 to-transparent rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="flex-1 min-w-0 text-center xs:text-left">
                        <p className="text-sm sm:text-lg font-bold text-slate-800 dark:text-slate-100 truncate bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                          Banner Looking Great!
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 sm:mt-2 leading-tight">
                          Perfect for making a strong first impression
                        </p>
                      </div>
                      <div className="flex gap-2 sm:gap-3 w-full xs:w-auto justify-center xs:justify-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowBannerModal(true)}
                          className="h-9 sm:h-11 px-3 sm:px-4 text-xs sm:text-sm border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 
                                   hover:bg-violet-500 hover:text-white dark:hover:bg-violet-600 transition-all duration-300 rounded-lg sm:rounded-xl flex items-center gap-1.5"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Preview</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile('bannerFile')}
                          className="h-9 sm:h-11 px-3 sm:px-4 text-xs sm:text-sm text-red-500 dark:text-red-400 hover:text-white border-red-200 dark:border-red-800
                                   hover:bg-red-500 dark:hover:bg-red-600 transition-all duration-300 rounded-lg sm:rounded-xl flex items-center gap-1.5"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all duration-500",
                      "bg-gradient-to-br from-white to-violet-50/50 dark:from-slate-800 dark:to-violet-900/20",
                      "hover:border-violet-400 hover:bg-violet-100/30 dark:hover:bg-violet-900/30 hover:scale-[1.02]",
                      "border-slate-300 dark:border-slate-600 shadow-lg hover:shadow-xl"
                    )}
                    onClick={() => bannerFileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                      <div className="p-2 sm:p-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl sm:rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-110">
                        <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 sm:mb-2">
                          Add a Banner Image
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-tight">
                          Optional - PNG, JPG, GIF up to 5MB • 16:9 ratio recommended
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-1 border-violet-300 dark:border-violet-600 text-violet-600 dark:text-violet-400 
                                hover:bg-violet-500 hover:text-white dark:hover:bg-violet-600 transition-all duration-300
                                rounded-lg sm:rounded-xl px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm font-semibold shadow-md"
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                )}
                <Input
                  id="bannerFile"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  ref={bannerFileInputRef}
                  onChange={(e) => handleFileChange('bannerFile', e)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Modals for Image Previews */}
      <Dialog open={showLogoModal} onOpenChange={setShowLogoModal}>
        <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl sm:rounded-3xl shadow-3xl border-0 mx-2">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 text-center">
              Logo Preview
            </DialogTitle>
          </DialogHeader>
          {logoPreview && (
            <div className="flex justify-center p-4 sm:p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl sm:rounded-2xl">
              <Image
                src={logoPreview}
                alt="Logo Preview"
                width={150}
                height={150}
                className="max-w-full h-auto"
                unoptimized={logoPreview.startsWith('data:')}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showBannerModal} onOpenChange={setShowBannerModal}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-3xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl sm:rounded-3xl shadow-3xl border-0 mx-2">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 text-center">
              Banner Preview
            </DialogTitle>
          </DialogHeader>
          {bannerPreview && (
            <div className="flex justify-center p-3 sm:p-6 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-xl sm:rounded-2xl">
              <Image
                src={bannerPreview}
                alt="Banner Preview"
                width={600}
                height={150}
                className="max-w-full h-auto max-h-40 sm:max-h-56 object-contain rounded-lg shadow-xl"
                unoptimized={bannerPreview.startsWith('data:')}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}