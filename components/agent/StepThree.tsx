'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Trash2, Plus, Edit, Search, AlertCircle, FileText, Download, FileSpreadsheet } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IAIAgent, FAQItem } from '@/store/slice/agentSlice';
import { cn } from '@/lib/utils';

interface StepThreeProps {
  agent: IAIAgent;
  onAgentChange: (agent: Partial<IAIAgent>) => void;
}

export default function StepThree({ agent, onAgentChange }: StepThreeProps) {
  const [openFAQDialog, setOpenFAQDialog] = useState(false);
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newFAQ, setNewFAQ] = useState<FAQItem>({ question: '', answer: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<{ manualEntry?: string; docFiles?: string; bulkUpload?: string }>({});
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const bulkFileInputRef = React.useRef<HTMLInputElement>(null);

  const filteredFAQs = useMemo(() => {
    return (agent.manualEntry || []).filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [agent.manualEntry, searchTerm]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const validFiles = files.filter((file) => {
        if (file.size > 10 * 1024 * 1024) {
          setErrors((prev) => ({ ...prev, docFiles: `File ${file.name} exceeds 10MB` }));
          return false;
        }
        return true;
      });

      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onAgentChange({ docFiles: [...(agent.docFiles || []), ...validFiles] });
            setErrors((prev) => ({ ...prev, docFiles: undefined }));
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    },
    [agent.docFiles, onAgentChange]
  );

  const handleBulkFAQUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.name.endsWith('.csv')) {
        setErrors((prev) => ({ ...prev, bulkUpload: 'Please upload a CSV file' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        try {
          const rows = text.split('\n').map((row) => row.split(',').map((cell) => cell.trim()));
          const newFAQs: FAQItem[] = rows.slice(1).filter(row => row.length >= 2).map((row) => ({
            question: row[0],
            answer: row[1]
          })).filter(faq => faq.question && faq.answer);

          if (newFAQs.length === 0) {
            setErrors((prev) => ({ ...prev, bulkUpload: 'No valid FAQs found in CSV' }));
            return;
          }

          onAgentChange({ manualEntry: [...(agent.manualEntry || []), ...newFAQs] });
          setErrors((prev) => ({ ...prev, bulkUpload: undefined }));
          setOpenBulkUploadDialog(false);
        } catch (error) {
          setErrors((prev) => ({ ...prev, bulkUpload: 'Error parsing CSV file' }));
        }
      };
      reader.readAsText(file);
    },
    [agent.manualEntry, onAgentChange]
  );

  const downloadFAQ = useCallback((faq: FAQItem) => {
    const csvContent = `Question,Answer\n"${faq.question.replace(/"/g, '""')}","${faq.answer.replace(/"/g, '""')}"`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `faq_${faq.question.slice(0, 20)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = [...(agent.docFiles || [])];
      newFiles.splice(index, 1);
      onAgentChange({ docFiles: newFiles });
    },
    [agent.docFiles, onAgentChange]
  );

  const handleFAQChange = (field: keyof FAQItem, value: string) => {
    setNewFAQ((prev) => ({ ...prev, [field]: value }));
  };

  const validateFAQ = () => {
    if (!newFAQ.question.trim()) {
      setErrors((prev) => ({ ...prev, manualEntry: 'Question is required' }));
      return false;
    }
    if (!newFAQ.answer.trim()) {
      setErrors((prev) => ({ ...prev, manualEntry: 'Answer is required' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, manualEntry: undefined }));
    return true;
  };

  const addOrUpdateFAQ = () => {
    if (!validateFAQ()) return;
    const updatedFAQs = [...(agent.manualEntry || [])];
    if (editingIndex !== null) {
      updatedFAQs[editingIndex] = newFAQ;
    } else {
      updatedFAQs.push(newFAQ);
    }
    onAgentChange({ manualEntry: updatedFAQs });
    setNewFAQ({ question: '', answer: '' }); // Reset form for next entry
    setEditingIndex(null); // Clear editing mode
    // Dialog remains open for adding more FAQs
  };

  const finishAddingFAQs = () => {
    setOpenAddEditDialog(false);
    setNewFAQ({ question: '', answer: '' });
    setEditingIndex(null);
    setErrors({});
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <TooltipProvider>
      <Card className="w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6">
          {/* Documents Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <Label className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Documents
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                {agent.docFiles?.length || 0} files
              </Badge>
            </div>
            
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-4 sm:p-6 text-center transition-all duration-200 cursor-pointer",
                dragOver 
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-105' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFileChange({ target: { files: e.dataTransfer.files } } as any);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-2 sm:mb-3" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Drag and drop files here or click to upload
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
                Supports PDF, DOC, DOCX (Max 10MB each)
              </p>
              <Button variant="outline" size="sm" className="rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50">
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
              
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange} 
              />
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 bg-blue-100 dark:bg-blue-900/30" />
              </div>
            )}

            {errors.docFiles && (
              <div className="flex items-center gap-2 text-red-500 text-xs sm:text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {errors.docFiles}
              </div>
            )}

            {agent.docFiles && agent.docFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Uploaded Files</h4>
                <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto pr-2">
                  {agent.docFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs sm:text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-600/50">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px]">
                            {typeof file === 'string' ? file.split('/').pop() : file.name}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">
                            {typeof file !== 'string' && formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove file</TooltipContent>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* FAQs Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <Label className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Frequently Asked Questions
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                {agent.manualEntry?.length || 0} FAQs
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => setOpenFAQDialog(true)}
                  className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Manage FAQs
                </Button>
                <Button 
                  onClick={() => {
                    setEditingIndex(null);
                    setNewFAQ({ question: '', answer: '' });
                    setOpenAddEditDialog(true);
                  }}
                  className="h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              
              </div>

              {agent.manualEntry && agent.manualEntry.length > 0 ? (
                <div className="space-y-3 max-h-48 sm:max-h-60 overflow-y-auto pr-2">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Recent FAQs</h4>
                  {agent.manualEntry.slice(0, 3).map((faq, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs sm:text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-600/50">
                      <p className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {faq.question}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                  {agent.manualEntry.length > 3 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      +{agent.manualEntry.length - 3} more FAQs
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center p-4 sm:p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    No FAQs added yet. Click "Add FAQ" or "Bulk Upload" to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* FAQ Management Dialog */}
        <Dialog open={openFAQDialog} onOpenChange={setOpenFAQDialog}>
          <DialogContent className="max-w-md sm:max-w-3xl md:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
              <DialogTitle className="text-lg sm:text-xl font-bold">Manage FAQs</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Search, edit, download, or delete your frequently asked questions
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 flex-1 overflow-hidden flex flex-col p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search FAQs by question or answer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                />
              </div>
              
              <div className="flex-1 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <Table>
                  <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                      <TableHead className="w-4/12 text-xs sm:text-sm">Question</TableHead>
                      <TableHead className="w-6/12 text-xs sm:text-sm">Answer Preview</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm w-2/12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFAQs.length > 0 ? (
                      filteredFAQs.map((faq, filteredIndex) => {
                        const originalIndex = agent.manualEntry?.indexOf(faq) ?? -1;
                        return (
                          <TableRow key={filteredIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 text-xs sm:text-sm">
                            <TableCell className="font-medium line-clamp-2">{faq.question}</TableCell>
                            <TableCell>
                              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                {faq.answer}
                              </p>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-1 sm:gap-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        if (originalIndex !== -1) {
                                          setEditingIndex(originalIndex);
                                          setNewFAQ(faq);
                                          setOpenAddEditDialog(true);
                                        }
                                      }}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit FAQ</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => downloadFAQ(faq)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Download FAQ</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        if (originalIndex !== -1) {
                                          const newFAQs = agent.manualEntry?.filter((_, i) => i !== originalIndex) || [];
                                          onAgentChange({ manualEntry: newFAQs });
                                        }
                                      }}
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete FAQ</TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                          {searchTerm ? 'No FAQs match your search' : 'No FAQs added yet'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <DialogFooter className="mt-4 p-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setOpenFAQDialog(false)} className="rounded-lg">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit FAQ Dialog */}
        <Dialog open={openAddEditDialog} onOpenChange={setOpenAddEditDialog}>
          <DialogContent className="max-w-md sm:max-w-lg md:max-w-2xl rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
              <DialogTitle className="text-lg sm:text-xl font-bold">
                {editingIndex !== null ? 'Edit FAQ' : 'Add New FAQ'}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                {editingIndex !== null 
                  ? 'Update the question and answer for this FAQ' 
                  : 'Create new frequently asked questions one by one'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 sm:space-y-6 p-4">
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="question" className="text-sm font-medium">
                  Question <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="question"
                  value={newFAQ.question}
                  onChange={(e) => handleFAQChange('question', e.target.value)}
                  placeholder="Enter the question that users might ask..."
                  className={cn(
                    "h-12 rounded-xl border-2",
                    errors.manualEntry && !newFAQ.question ? 'border-red-500 ring-4 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'
                  )}
                />
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="answer" className="text-sm font-medium">
                  Answer <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="answer"
                  value={newFAQ.answer}
                  onChange={(e) => handleFAQChange('answer', e.target.value)}
                  placeholder="Provide a clear and concise answer..."
                  rows={4}
                  className={cn(
                    "min-h-[120px] rounded-xl border-2",
                    errors.manualEntry && !newFAQ.answer ? 'border-red-500 ring-4 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'
                  )}
                />
              </div>
              
              {errors.manualEntry && (
                <div className="flex items-center gap-2 text-red-500 text-xs sm:text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  {errors.manualEntry}
                </div>
              )}
            </div>
            
            <DialogFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={finishAddingFAQs}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  addOrUpdateFAQ();
                  // Show a success message or visual feedback
                  // Dialog stays open for adding more FAQs
                }}
                className="bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                {editingIndex !== null ? 'Update FAQ' : 'Add FAQ and Continue'}
              </Button>
              {!editingIndex && (
                <Button
                  onClick={finishAddingFAQs}
                  className="bg-green-600 hover:bg-green-700 rounded-lg"
                >
                  Finish Adding FAQs
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Upload Dialog */}
        <Dialog open={openBulkUploadDialog} onOpenChange={setOpenBulkUploadDialog}>
          <DialogContent className="max-w-md sm:max-w-lg rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
              <DialogTitle className="text-lg sm:text-xl font-bold">Bulk Upload FAQs</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Upload a CSV file containing FAQs (format: Question,Answer)
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 p-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer",
                  dragOver 
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-105' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleBulkFAQUpload({ target: { files: e.dataTransfer.files } } as any);
                }}
                onClick={() => bulkFileInputRef.current?.click()}
              >
                <FileSpreadsheet className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Drag and drop CSV file here or click to upload
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  CSV format: Question,Answer (Max 10MB)
                </p>
                <Button variant="outline" size="sm" className="rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose CSV File
                </Button>
                
                <Input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  ref={bulkFileInputRef}
                  onChange={handleBulkFAQUpload}
                />
              </div>

              {errors.bulkUpload && (
                <div className="flex items-center gap-2 text-red-500 text-xs sm:text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  {errors.bulkUpload}
                </div>
              )}
            </div>
            
            <DialogFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setOpenBulkUploadDialog(false);
                  setErrors((prev) => ({ ...prev, bulkUpload: undefined }));
                }}
                className="rounded-lg"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </TooltipProvider>
  );
}