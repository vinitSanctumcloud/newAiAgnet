import React, { useState, ChangeEvent, useRef, useEffect, DragEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, BookOpen, Plus, Trash2, Edit, ChevronDown, ChevronUp, Search, FileText, FileCheck, Lightbulb, HelpCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AgentInfo } from '@/app/lib/type';

interface StepThreeProps {
  onAgentChange: (agent: AgentInfo) => void;
  agentInfo: AgentInfo;
}

function StepThree({ onAgentChange, agentInfo }: StepThreeProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof AgentInfo, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof AgentInfo, boolean>>>({});
  const [openFAQDialog, setOpenFAQDialog] = useState(false);
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newFAQ, setNewFAQ] = useState<{ question: string; answer: string }>({ question: '', answer: '' });
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isAddingMultiple, setIsAddingMultiple] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Removed default FAQs setting
  }, [agentInfo, onAgentChange]);

  const handleDocFilesChange = (files: File[]) => {
    if (files.length > 0) {
      setTouched((prev) => ({ ...prev, docFiles: true }));
      // If docFiles is string[], convert to File[] by starting fresh with new files
      // If docFiles is File[] or empty, append new files
      const newDocFiles = Array.isArray(agentInfo.docFiles) && agentInfo.docFiles.length > 0 && typeof agentInfo.docFiles[0] === 'string'
        ? files // Start with new files if current docFiles is string[]
        : [...(agentInfo.docFiles as File[] || []), ...files]; // Append to File[] or empty array
      const newAgentInfo = { ...agentInfo, docFiles: newDocFiles };
      onAgentChange(newAgentInfo);
      setErrors((prev) => ({ ...prev, docFiles: undefined }));
    }
  };

  const handleCsvFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && !file.name.endsWith('.csv')) {
      setErrors((prev) => ({ ...prev, csvFile: 'Please upload a CSV file' }));
      return;
    }
    const newAgentInfo = { ...agentInfo, csvFile: file };
    onAgentChange(newAgentInfo);
    if (touched.csvFile) {
      setErrors((prev) => ({ ...prev, csvFile: file ? undefined : 'CSV file is required' }));
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleDocFilesChange(files);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    handleDocFilesChange(files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeFile = (index: number) => {
    const newFiles = [...(agentInfo.docFiles || [])];
    newFiles.splice(index, 1);
    // Preserve the type of docFiles (File[] or string[])
    const newDocFiles = Array.isArray(agentInfo.docFiles) && agentInfo.docFiles.length > 0 && typeof agentInfo.docFiles[0] === 'string'
      ? newFiles as string[]
      : newFiles as File[];
    const newAgentInfo = { ...agentInfo, docFiles: newDocFiles };
    onAgentChange(newAgentInfo);
  };

  const removeCsvFile = () => {
    const newAgentInfo = { ...agentInfo, csvFile: null };
    onAgentChange(newAgentInfo);
  };

  const handleFAQChange = (field: 'question' | 'answer', value: string) => {
    setNewFAQ((prev) => ({ ...prev, [field]: value }));
  };

  const validateFAQ = (): boolean => {
    if (!newFAQ.question.trim()) {
      alert('Question is required.');
      return false;
    }
    if (!newFAQ.answer.trim()) {
      alert('Answer is required.');
      return false;
    }
    if (newFAQ.answer.length < 50) {
      alert('Answer should be at least 50 characters for better detail.');
      return false;
    }
    return true;
  };

  const addFAQ = () => {
    if (!validateFAQ()) return;

    if (editingIndex !== null) {
      const updatedFAQs = [...agentInfo.manualEntry];
      updatedFAQs[editingIndex] = newFAQ;
      onAgentChange({ ...agentInfo, manualEntry: updatedFAQs });
      setEditingIndex(null);
    } else {
      const newAgentInfo = { ...agentInfo, manualEntry: [...agentInfo.manualEntry, newFAQ] };
      onAgentChange(newAgentInfo);
    }

    if (isAddingMultiple) {
      setNewFAQ({ question: '', answer: '' });
    } else {
      setNewFAQ({ question: '', answer: '' });
      setOpenAddEditDialog(false);
    }
  };

  const addAndClose = () => {
    addFAQ();
    setOpenAddEditDialog(false);
    setIsAddingMultiple(false);
  };

  const editFAQ = (index: number) => {
    setEditingIndex(index);
    setNewFAQ(agentInfo.manualEntry[index]);
    setOpenAddEditDialog(true);
    setIsAddingMultiple(false);
  };

  const removeFAQ = (index: number) => {
    const newManualEntry = [...agentInfo.manualEntry];
    newManualEntry.splice(index, 1);
    const newAgentInfo = { ...agentInfo, manualEntry: newManualEntry };
    onAgentChange(newAgentInfo);

    if (expandedRows.has(index)) {
      const newExpanded = new Set(expandedRows);
      newExpanded.delete(index);
      setExpandedRows(newExpanded);
    }
  };

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const truncateText = (text: string, maxChars: number) => {
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars) + '...';
  };

  const filteredFAQs = agentInfo.manualEntry.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const calculateTotalFileSize = (): number => {
    let total = 0;
    if (Array.isArray(agentInfo.docFiles)) {
      total = agentInfo.docFiles.reduce((sum, file) => {
        if (file instanceof File) {
          return sum + file.size;
        }
        return sum; // Skip string URLs as they don't have size
      }, 0);
    }
    if (agentInfo.csvFile instanceof File) {
      total += agentInfo.csvFile.size;
    }
    return total;
  };

  const getTotalFileSizeMB = (): string => {
    return (calculateTotalFileSize() / (1024 * 1024)).toFixed(1);
  };

  const getFileName = (file: File | string): string => {
    if (typeof file === 'string') {
      return file.split('/').pop() || 'Unknown File';
    }
    return file.name;
  };

  const RequiredSymbol = () => <span className="text-red-500 ml-1">*</span>;

  return (
    <div className="space-y-6 border border-gray-200 rounded-2xl">
      <div className="dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Knowledge Base Management</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Enhance your AI agent's intelligence by uploading detailed documents and curating comprehensive FAQs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 pb-6">
        <Card className="border-0 overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800">
          <CardHeader className="p-5 bg-gray-100 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                  <Upload className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Document Upload Center</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                    {agentInfo.docFiles.length} file{agentInfo.docFiles.length !== 1 ? "s" : ""} uploaded • {getTotalFileSizeMB()} MB used
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {agentInfo.docFiles.length}/50 files
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5">
            <div className="mb-4">
              <Label
                htmlFor="docFiles"
                className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center mb-2"
              >
                Upload Supporting Documents <RequiredSymbol />
              </Label>

              {agentInfo.docFiles.length > 0 && (
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
                  {agentInfo.docFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                        <div className="truncate">
                          {typeof file === 'string' ? (
                            <a
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {getFileName(file)}
                            </a>
                          ) : (
                            <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                              {getFileName(file)}
                            </span>
                          )}
                          {file instanceof File && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              ({formatFileSize(file.size)})
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all duration-300 min-h-[160px] ${
                  dragOver
                    ? "border-gray-500 dark:border-gray-400 bg-gray-50 dark:bg-gray-700 scale-105"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-10 w-10 mb-3 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                <span className="text-base font-medium text-gray-600 dark:text-gray-300 text-center">
                  {agentInfo.docFiles.length > 0 ? "Click to Upload More" : "Click to Upload"}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supports all formats (PDF, DOCX, TXT, images, etc.)
                </p>
              </div>
              <Input
                id="docFiles"
                type="file"
                multiple
                accept="*/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileInputChange}
              />
              {errors.docFiles && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.docFiles}
                </p>
              )}
            </div>

        
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Storage Usage</span>
                <span>{getTotalFileSizeMB()} MB / 50 MB</span>
              </div>
              <Progress
                value={(calculateTotalFileSize() / (50 * 1024 * 1024)) * 100}
                className="h-2 bg-gray-200 dark:bg-gray-600"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Max size: 10MB/file. Total limit: 50MB.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 overflow-hidden transition-all duration-300 dark:bg-gray-800">
          <CardHeader className="p-5 bg-gray-100 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">FAQ Management Hub</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                    Curate detailed FAQs to provide quick, accurate answers
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {agentInfo.manualEntry.length} FAQs
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Well-crafted FAQs help your AI agent provide accurate and comprehensive answers to common questions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setOpenFAQDialog(true)}
                className="flex items-center gap-3 h-auto py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <FileCheck className="h-5 w-5" />
                <div className="text-left">
                  <div>View & Manage</div>
                  <div className="text-xs font-normal opacity-90">All FAQs</div>
                </div>
              </Button>
              <Button
                onClick={() => {
                  setEditingIndex(null);
                  setNewFAQ({ question: "", answer: "" });
                  setOpenAddEditDialog(true);
                  setIsAddingMultiple(false);
                }}
                className="flex items-center gap-3 h-auto py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <Plus className="h-5 w-5" />
                <div className="text-left">
                  <div>Create New</div>
                  <div className="text-xs font-normal opacity-90">FAQ Entry</div>
                </div>
              </Button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-white dark:bg-gray-600 rounded">
                  <div className="font-bold text-blue-600 dark:text-blue-400">{agentInfo.manualEntry.length}</div>
                  <div className="text-gray-500 dark:text-gray-400">Total FAQs</div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-600 rounded">
                  <div className="font-bold text-green-600 dark:text-green-400">
                    {agentInfo.manualEntry.filter(f => f.answer.length > 100).length}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">Detailed Answers</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={openFAQDialog} onOpenChange={setOpenFAQDialog}>
        <DialogContent className="sm:max-w-4xl bg-white dark:bg-gray-800 rounded-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="border-b border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Manage FAQs
                </DialogTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-400 mt-1">
                  {filteredFAQs.length} shown of {agentInfo.manualEntry.length} total FAQs
                </CardDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search FAQs by question or answer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-base"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6">
            {filteredFAQs.length > 0 ? (
              <Table>
                <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-700 z-10">
                  <TableRow>
                    <TableHead className="w-2/3 text-gray-800 dark:text-gray-200 font-bold text-left">Question & Preview</TableHead>
                    <TableHead className="text-gray-800 dark:text-gray-200 font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFAQs.map((faq, index) => (
                    <React.Fragment key={index}>
                      <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 transition-colors duration-200">
                        <TableCell className="py-4">
                          <Collapsible
                            open={expandedRows.has(index)}
                            onOpenChange={() => toggleRowExpansion(index)}
                            className="w-full"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-base text-gray-900 dark:text-gray-100">{faq.question}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {truncateText(faq.answer, 80)}
                                </p>
                              </div>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="ml-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                  {expandedRows.has(index) ? (
                                    <ChevronUp className="h-5 w-5" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
                              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-600 rounded-xl">
                                <p className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{faq.answer}</p>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editFAQ(index)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border-blue-300 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border-red-300 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-900 transition-all duration-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white dark:bg-gray-800 rounded-2xl sm:max-w-md">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Confirm Deletion</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                    Are you sure you want to delete this FAQ? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => removeFAQ(index)} className="bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-base font-medium text-gray-500 dark:text-gray-400">No FAQs match your search.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Try adjusting your search or add a new FAQ.</p>
              </div>
            )}
          </div>
          <DialogFooter className="border-t border-gray-200 dark:border-gray-700 p-6">
            <Button
              variant="outline"
              onClick={() => setOpenFAQDialog(false)}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close Manager
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openAddEditDialog} onOpenChange={setOpenAddEditDialog}>
        <DialogContent className="sm:max-w-[700px] bg-white dark:bg-gray-800 rounded-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="border-b border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                {editingIndex !== null ? <Edit className="h-6 w-6 text-blue-600 dark:text-blue-400" /> : <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editingIndex !== null ? 'Edit FAQ Entry' : 'Create New FAQ Entry'}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <Label htmlFor="faqQuestion" className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center">
                Question <RequiredSymbol />
              </Label>
              <Input
                id="faqQuestion"
                value={newFAQ.question}
                onChange={(e) => handleFAQChange('question', e.target.value)}
                placeholder="Enter a clear, concise question (e.g., What are the support services available?)"
                className="border-gray-300 dark:border-gray-600 mt-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl text-base"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Keep questions user-friendly and specific for better AI matching.</p>
            </div>
            <div>
              <Label htmlFor="faqAnswer" className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center">
                Detailed Answer <RequiredSymbol />
              </Label>
              <Textarea
                id="faqAnswer"
                value={newFAQ.answer}
                onChange={(e) => handleFAQChange('answer', e.target.value)}
                placeholder="Provide a comprehensive answer with key details, examples, and any relevant links or notes."
                rows={8}
                className="border-gray-300 dark:border-gray-600 mt-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-vertical rounded-xl text-base"
              />
              <div className="flex justify-between mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {newFAQ.answer.length} characters (recommended: 300-1000 for thorough responses)
                </p>
                {newFAQ.answer.length > 0 && (
                  <Badge variant={newFAQ.answer.length >= 300 ? "default" : "secondary"} className="text-xs">
                    {newFAQ.answer.length >= 300 ? "Good length" : "Too short"}
                  </Badge>
                )}
              </div>
            </div>

            {isAddingMultiple && agentInfo.manualEntry.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Existing FAQs ({agentInfo.manualEntry.length})
                </h3>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="max-h-60 overflow-y-auto">
                    {agentInfo.manualEntry.map((faq, index) => (
                      <div
                        key={index}
                        className="p-3 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <p className="font-medium text-gray-800 dark:text-gray-200">{faq.question}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                          {truncateText(faq.answer, 100)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="border-t border-gray-200 dark:border-gray-700 p-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              {editingIndex === null && (
                <Button
                  onClick={() => setIsAddingMultiple(!isAddingMultiple)}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  {isAddingMultiple ? (
                    <>
                      <X className="h-4 w-4" /> Single Entry Mode
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Add Multiple
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOpenAddEditDialog(false);
                  setIsAddingMultiple(false);
                }}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </Button>
              {isAddingMultiple && (
                <Button
                  onClick={addFAQ}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Another
                </Button>
              )}
              <Button
                onClick={isAddingMultiple ? addAndClose : addFAQ}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200"
              >
                {editingIndex !== null ? 'Update Entry' : isAddingMultiple ? 'Add & Close' : 'Add Entry'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StepThree;