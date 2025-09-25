'use client';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Trash2, Plus, Edit, Search, AlertCircle, FileText, Download, X } from 'lucide-react';
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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newFAQs, setNewFAQs] = useState<FAQItem[]>([{ question: '', answer: '' }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<{ manualEntry?: string; docFiles?: string }>({});
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

      if (validFiles.length === 0) return;

      setPendingFiles(validFiles);
      setErrors((prev) => ({ ...prev, docFiles: undefined }));
      setUploadProgress(0);

      const id = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 100));
      }, 100);
      setIntervalId(id);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  useEffect(() => {
    if (uploadProgress >= 100 && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [uploadProgress, intervalId]);

  useEffect(() => {
    if (uploadProgress >= 100 && pendingFiles.length > 0) {
      onAgentChange({ docFiles: [...(agent.docFiles || []), ...pendingFiles] });
      setPendingFiles([]);
    }
  }, [uploadProgress, pendingFiles, agent.docFiles, onAgentChange]);

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

  const handleFAQChange = (index: number, field: keyof FAQItem, value: string) => {
    setNewFAQs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq))
    );
  };

  const addNewFAQField = () => {
    setNewFAQs((prev) => [...prev, { question: '', answer: '' }]);
  };

  const removeFAQField = (index: number) => {
    setNewFAQs((prev) => prev.filter((_, i) => i !== index));
  };

  const validateFAQs = () => {
    const invalidFAQs = newFAQs.some(
      (faq) => !faq.question.trim() || !faq.answer.trim()
    );
    if (invalidFAQs) {
      setErrors((prev) => ({ ...prev, manualEntry: 'All questions and answers are required' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, manualEntry: undefined }));
    return true;
  };

  const addOrUpdateFAQs = () => {
    if (!validateFAQs()) return;
    const updatedFAQs = [...(agent.manualEntry || [])];
    if (editingIndex !== null) {
      updatedFAQs[editingIndex] = newFAQs[0];
    } else {
      updatedFAQs.push(...newFAQs);
    }
    onAgentChange({ manualEntry: updatedFAQs });
    setNewFAQs([{ question: '', answer: '' }]);
    setEditingIndex(null);
  };

  const finishAddingFAQs = () => {
    setOpenAddEditDialog(false);
    setNewFAQs([{ question: '', answer: '' }]);
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
      <Card className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 min-h-[450px]">
          {/* Documents Section */}
          <div className="space-y-6 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Documents
                <span className="text-red-600 ml-1">*</span>
              </Label>
              <Badge className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200">
                {agent.docFiles?.length || 0} files
              </Badge>
            </div>
            
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer flex-grow flex items-center justify-center",
                dragOver 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 scale-105' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700'
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
              <div>
                <Upload className="mx-auto h-8 w-8 text-gray-500 dark:text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Drag and drop files here or click to upload
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Supports PDF, DOC, DOCX (Max 10MB each)
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 border-blue-300 dark:border-blue-600"
                >
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
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 bg-gray-200 dark:bg-gray-700" />
              </div>
            )}

            {errors.docFiles && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {errors.docFiles}
              </div>
            )}

            {agent.docFiles && agent.docFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800 dark:text-gray-100 text-base">Uploaded Files</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {agent.docFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100 truncate max-w-[200px]">
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
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-1"
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
          <div className="space-y-6 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Frequently Asked Questions
                <span className="text-red-600 ml-1">*</span>
              </Label>
              <Badge className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200">
                {agent.manualEntry?.length || 0} FAQs
              </Badge>
            </div>

            <div className="space-y-4 flex-grow">
              <div className="flex gap-2">
                <Button 
                  onClick={() => setOpenFAQDialog(true)}
                  className="flex-1 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Manage FAQs
                </Button>
                <Button 
                  onClick={() => {
                    setEditingIndex(null);
                    setNewFAQs([{ question: '', answer: '' }]);
                    setOpenAddEditDialog(true);
                  }}
                  className="h-12 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQs
                </Button>
              </div>

              {agent.manualEntry && agent.manualEntry.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 text-base">Recent FAQs</h4>
                  {agent.manualEntry.slice(0, 3).map((faq, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-700">
                      <p className="font-medium text-gray-800 dark:text-gray-100 mb-1 line-clamp-1">
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
                <div className="text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center h-[calc(100%-4rem)]">
                  <div>
                    <FileText className="h-8 w-8 text-gray-500 dark:text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No FAQs added yet. Click "Add FAQs" to get started.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* FAQ Management Dialog */}
        <Dialog open={openFAQDialog} onOpenChange={setOpenFAQDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
              <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Manage FAQs</DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                Search, edit, download, or delete your frequently asked questions
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 flex-1 overflow-hidden flex flex-col p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Search FAQs by question or answer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              
              <div className="flex-1 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <Table>
                  <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                      <TableHead className="w-4/12 text-sm text-gray-800 dark:text-gray-100">Question</TableHead>
                      <TableHead className="w-6/12 text-sm text-gray-800 dark:text-gray-100">Answer Preview</TableHead>
                      <TableHead className="text-right text-sm text-gray-800 dark:text-gray-100 w-2/12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFAQs.length > 0 ? (
                      filteredFAQs.map((faq, filteredIndex) => {
                        const originalIndex = agent.manualEntry?.indexOf(faq) ?? -1;
                        return (
                          <TableRow key={filteredIndex} className="hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                            <TableCell className="font-medium text-gray-800 dark:text-gray-100 line-clamp-2">{faq.question}</TableCell>
                            <TableCell>
                              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                {faq.answer}
                              </p>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        if (originalIndex !== -1) {
                                          setEditingIndex(originalIndex);
                                          setNewFAQs([faq]);
                                          setOpenAddEditDialog(true);
                                        }
                                      }}
                                      className="h-8 w-8 p-0 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
                                      className="h-8 w-8 p-0 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
                                      className="h-8 w-8 p-0 border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                        <TableCell colSpan={3} className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                          {searchTerm ? 'No FAQs match your search' : 'No FAQs added yet'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <DialogFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                variant="outline" 
                onClick={() => setOpenFAQDialog(false)} 
                className="rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit FAQs Dialog */}
        <Dialog open={openAddEditDialog} onOpenChange={setOpenAddEditDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
              <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {editingIndex !== null ? 'Edit FAQ' : 'Add FAQs'}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                {editingIndex !== null 
                  ? 'Update the question and answer for this FAQ' 
                  : 'Create multiple frequently asked questions'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 p-4">
              {newFAQs.map((faq, index) => (
                <div key={index} className="space-y-4 border-b border-gray-200 dark:border-gray-600 pb-4 relative">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      FAQ {index + 1} <span className="text-red-600">*</span>
                    </Label>
                    {newFAQs.length > 1 && editingIndex === null && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFAQField(index)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor={`question-${index}`} className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      Question
                    </Label>
                    <Input
                      id={`question-${index}`}
                      value={faq.question}
                      onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                      placeholder="Enter the question that users might ask..."
                      className={cn(
                        "h-12 rounded-lg border-2",
                        errors.manualEntry && !faq.question ? 'border-red-600 dark:border-red-400 ring-4 ring-red-600/20 dark:ring-red-400/20' : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'
                      )}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor={`answer-${index}`} className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      Answer
                    </Label>
                    <Textarea
                      id={`answer-${index}`}
                      value={faq.answer}
                      onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                      placeholder="Provide a clear and concise answer..."
                      rows={4}
                      className={cn(
                        "min-h-[120px] rounded-lg border-2",
                        errors.manualEntry && !faq.answer ? 'border-red-600 dark:border-red-400 ring-4 ring-red-600/20 dark:ring-red-400/20' : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'
                      )}
                    />
                  </div>
                </div>
              ))}
              
              {errors.manualEntry && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  {errors.manualEntry}
                </div>
              )}

              {editingIndex === null && (
                <Button
                  onClick={addNewFAQField}
                  className="w-full rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another FAQ
                </Button>
              )}
            </div>
            
            <DialogFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={finishAddingFAQs}
                className="rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={addOrUpdateFAQs}
                className="rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
              >
                {editingIndex !== null ? 'Update FAQ' : 'Add FAQs'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </TooltipProvider>
  );
}