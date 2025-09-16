import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, Palette, Info, AlertCircle, Eye, ImageIcon } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AgentInfo } from '@/app/lib/type'; // Import AgentInfo

interface StepOneProps {
  onAgentChange: (agent: AgentInfo) => void;
  agentInfo: AgentInfo;
}

function StepOne({ onAgentChange, agentInfo }: StepOneProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof AgentInfo, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof AgentInfo, boolean>>>({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

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
    if (agentInfo.logoFile) {
      if (typeof agentInfo.logoFile === 'string') {
        setLogoPreview(agentInfo.logoFile); // Use URL directly
      } else if (agentInfo.logoFile instanceof File) {
        const reader = new FileReader();
        reader.onload = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(agentInfo.logoFile);
      }
    } else {
      setLogoPreview(null);
    }

    if (agentInfo.bannerFile) {
      if (typeof agentInfo.bannerFile === 'string') {
        setBannerPreview(agentInfo.bannerFile); // Use URL directly
      } else if (agentInfo.bannerFile instanceof File) {
        const reader = new FileReader();
        reader.onload = () => setBannerPreview(reader.result as string);
        reader.readAsDataURL(agentInfo.bannerFile);
      }
    } else {
      setBannerPreview(null);
    }
  }, [agentInfo.logoFile, agentInfo.bannerFile]);

  const validate = (field: keyof AgentInfo, value: any): string | undefined => {
    if (field === 'aiAgentName' && !value.trim()) return 'Agent name is required';
    if (field === 'agentDescription' && !value.trim()) return 'Agent description is required';
    if (field === 'domainExpertise' && !value.trim()) return 'Domain expertise is required';
    if (field === 'logoFile' && !value) return 'Logo is required';
    return undefined;
  };

  const handleTextChange = (field: keyof AgentInfo, value: string) => {
    const newAgentInfo = { ...agentInfo, [field]: value };
    onAgentChange(newAgentInfo);
    if (touched[field]) {
      const error = validate(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleFileChange = (field: 'logoFile' | 'bannerFile', e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && !file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, [field]: 'Please upload an image file' }));
      return;
    }
    const newAgentInfo = { ...agentInfo, [field]: file };
    onAgentChange(newAgentInfo);
    if (touched[field]) {
      const error = validate(field, file);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleColorChange = (newColor: string) => {
    const newAgentInfo = { ...agentInfo, colorTheme: newColor };
    onAgentChange(newAgentInfo);
    if (touched.colorTheme) {
      const error = validate('colorTheme', newColor);
      setErrors((prev) => ({ ...prev, colorTheme: error }));
    }
  };

  const handleBlur = (field: keyof AgentInfo) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validate(field, agentInfo[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const removeFile = (field: 'logoFile' | 'bannerFile') => {
    const newAgentInfo = { ...agentInfo, [field]: null };
    onAgentChange(newAgentInfo);
    if (field === 'logoFile') setLogoPreview(null);
    else setBannerPreview(null);
  };

  const triggerFileInput = (field: 'logoFile' | 'bannerFile') => {
    const inputRef = field === 'logoFile' ? logoFileInputRef : bannerFileInputRef;
    inputRef.current?.click();
  };

  const RequiredSymbol = () => <span className="text-red-500 ml-1">*</span>;

  // Note: Form submission logic should be in the parent component.
  // Example submission handler (add this in the parent component):
  /*
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('userId', userId); // Replace with actual userId
    formData.append('aiAgentName', agentInfo.aiAgentName);
    formData.append('agentDescription', agentInfo.agentDescription);
    formData.append('domainExpertise', agentInfo.domainExpertise);
    formData.append('colorTheme', agentInfo.colorTheme);

    if (agentInfo.logoFile instanceof File) {
      formData.append('logoFile', agentInfo.logoFile);
    } else if (typeof agentInfo.logoFile === 'string') {
      formData.append('logoFileUrl', agentInfo.logoFile);
    }

    if (agentInfo.bannerFile instanceof File) {
      formData.append('bannerFile', agentInfo.bannerFile);
    } else if (typeof agentInfo.bannerFile === 'string') {
      formData.append('bannerFileUrl', agentInfo.bannerFile);
    }

    const response = await fetch('/api/step1', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    if (result.success) {
      console.log('Step 1 saved:', result);
      // Proceed to next step
    } else {
      console.error('Error:', result.message);
    }
  };
  */

  return (
    <div className="dark:bg-gray-900 flex items-center justify-center">
      <Card className="w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Info className="h-7 w-7 text-blue-500" />
            Agent Configuration
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Configure your AI agent's core details and branding for a seamless user experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm h-full">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Agent Details
              </h3>
              <div>
                <Label htmlFor="aiAgentName" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  Agent Name <RequiredSymbol />
                </Label>
                <Input
                  id="aiAgentName"
                  className={`mt-2 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 ${errors.aiAgentName ? 'border-red-500' : ''}`}
                  value={agentInfo.aiAgentName}
                  onChange={(e) => handleTextChange('aiAgentName', e.target.value)}
                  onBlur={() => handleBlur('aiAgentName')}
                  placeholder="e.g., AI Agent Assistant"
                />
                {errors.aiAgentName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.aiAgentName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="domainExpertise" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  Domain Expertise <RequiredSymbol />
                </Label>
                <Input
                  id="domainExpertise"
                  className={`mt-2 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 ${errors.domainExpertise ? 'border-red-500' : ''}`}
                  value={agentInfo.domainExpertise}
                  onChange={(e) => handleTextChange('domainExpertise', e.target.value)}
                  onBlur={() => handleBlur('domainExpertise')}
                  placeholder="e.g., Customer Support, Technical Assistance"
                />
                {errors.domainExpertise && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.domainExpertise}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="agentDescription" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  Agent Description <RequiredSymbol />
                </Label>
                <Textarea
                  id="agentDescription"
                  className={`mt-2 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 ${errors.agentDescription ? 'border-red-500' : ''}`}
                  value={agentInfo.agentDescription}
                  onChange={(e) => handleTextChange('agentDescription', e.target.value)}
                  onBlur={() => handleBlur('agentDescription')}
                  placeholder="Describe your AI agent's purpose and capabilities"
                  rows={6}
                />
                {errors.agentDescription && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.agentDescription}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color Theme</Label>
                <div className="flex items-center gap-3 mt-2 relative">
                  <div
                    className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 dark:border-gray-600 shadow-sm transition-transform hover:scale-105"
                    style={{ backgroundColor: agentInfo.colorTheme }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  />
                  <Input
                    value={agentInfo.colorTheme}
                    onChange={(e) => handleColorChange(e.target.value)}
                    onBlur={() => handleBlur('colorTheme')}
                    placeholder="#007bff"
                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  />
                  {showColorPicker && (
                    <div ref={colorPickerRef} className="absolute z-10 -top-52 left-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600">
                      <HexColorPicker color={agentInfo.colorTheme} onChange={handleColorChange} />
                      <Button
                        size="sm"
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        onClick={() => setShowColorPicker(false)}
                      >
                        Done
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm h-full">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Palette className="h-5 w-5 text-blue-500" />
                Branding & Media
              </h3>
              <div>
                <Label htmlFor="logoFile" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  Logo <RequiredSymbol />
                </Label>
                <div className="mt-2">
                  {agentInfo.logoFile ? (
                    <div className="flex flex-col gap-3">
                      <div className="relative">
                        <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="object-contain max-h-36 w-full"
                            />
                          ) : (
                            <ImageIcon className="h-16 w-16 text-gray-400" />
                          )}
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2 rounded-full bg-white/90 hover:bg-white text-gray-800"
                          onClick={() => setShowLogoModal(true)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[80%]">
                          {typeof agentInfo.logoFile === 'string' ? agentInfo.logoFile.split('/').pop() : agentInfo.logoFile?.name || 'No file selected'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile('logoFile')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-300 h-40"
                      onClick={() => triggerFileInput('logoFile')}
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Click to upload logo</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, SVG (max 5MB)</p>
                      <Input
                        id="logoFile"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange('logoFile', e)}
                        onBlur={() => handleBlur('logoFile')}
                        ref={logoFileInputRef}
                      />
                    </div>
                  )}
                  {errors.logoFile && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.logoFile}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="bannerFile" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  Banner (Optional)
                </Label>
                <div className="mt-2">
                  {agentInfo.bannerFile ? (
                    <div className="flex flex-col gap-3">
                      <div className="relative">
                        <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                          {bannerPreview ? (
                            <img
                              src={bannerPreview}
                              alt="Banner preview"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2 rounded-full bg-white/90 hover:bg-white text-gray-800"
                          onClick={() => setShowBannerModal(true)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[80%]">
                          {typeof agentInfo.bannerFile === 'string' ? agentInfo.bannerFile.split('/').pop() : agentInfo.bannerFile?.name || 'No file selected'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile('bannerFile')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-300 h-24"
                      onClick={() => triggerFileInput('bannerFile')}
                    >
                      <Upload className="h-6 w-6 text-gray-400 mb-1" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Upload Banner</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, SVG (max 10MB)</p>
                      <Input
                        id="bannerFile"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange('bannerFile', e)}
                        ref={bannerFileInputRef}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showLogoModal} onOpenChange={setShowLogoModal}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Logo Preview</DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              View your uploaded logo in full detail.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo preview"
                className="max-h-64 w-full object-contain rounded-lg shadow-md"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBannerModal} onOpenChange={setShowBannerModal}>
        <DialogContent className="max-w-md sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Banner Preview</DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              View your uploaded banner in full detail.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="w-full h-auto max-h-72 object-contain rounded-lg shadow-md"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StepOne;