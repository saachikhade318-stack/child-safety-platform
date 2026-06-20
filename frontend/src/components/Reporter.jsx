import React, { useState } from 'react';
import { ShieldAlert, FileCode, CheckCircle, Search, Upload, Copy, Info, RefreshCw, Paperclip, ChevronRight, ChevronLeft } from 'lucide-react';
import { submitReport, trackReport } from '../api';

export default function Reporter() {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'track'
  
  // Create Report Wizard States
  const [step, setStep] = useState(1);
  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null); // stores trackingCode response

  // Track Report States
  const [trackCode, setTrackCode] = useState('');
  const [trackedReport, setTrackedReport] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [isTrackLoading, setIsTrackLoading] = useState(false);

  const categories = [
    { value: 'Physical Abuse', label: 'Physical Abuse', desc: 'Hitting, kicking, shaking, or causing bodily harm.' },
    { value: 'Emotional Abuse', label: 'Emotional Abuse', desc: 'Constant criticism, threats, rejection, or isolation.' },
    { value: 'Neglect', label: 'Neglect / Deprivation', desc: 'Failure to provide basic food, shelter, clothing, or safety.' },
    { value: 'Cyber Bullying', label: 'Online / Cyber Bullying', desc: 'Digital harassment, threat messages, or grooming.' },
    { value: 'Unsafe Touch', label: 'Unsafe Physical Contact', desc: 'Inappropriate touch or grooming behaviors by adults.' }
  ];

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  // Submit Report to FastAPI
  const handleReportSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('incidentType', incidentType);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('location', location || 'Anonymous');
    formData.append('senderContact', senderContact || 'Anonymous');
    
    files.forEach((file) => {
      formData.append('attachments', file);
    });

    try {
      const data = await submitReport(formData);
      setSubmissionSuccess(data);
      // Reset inputs
      setStep(5);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch Report status from FastAPI
  const handleTrackSearch = async () => {
    if (!trackCode.trim()) return;
    setIsTrackLoading(true);
    setTrackError('');
    setTrackedReport(null);

    try {
      const data = await trackReport(trackCode);
      setTrackedReport(data);
    } catch (err) {
      setTrackError(err.message || 'Tracking code invalid or expired.');
    } finally {
      setIsTrackLoading(false);
    }
  };

  const copyCodeToClipboard = () => {
    if (submissionSuccess?.trackingCode) {
      navigator.clipboard.writeText(submissionSuccess.trackingCode);
      alert('Tracking Code copied to clipboard securely!');
    }
  };

  const resetForm = () => {
    setStep(1);
    setIncidentType('');
    setDescription('');
    setDate('');
    setLocation('');
    setSenderContact('');
    setFiles([]);
    setSubmissionSuccess(null);
  };

  return (
    <section id="reporter" className="py-24 relative overflow-hidden bg-navy-dark border-b border-white/5">
      {/* Background spotlights */}
      <div className="absolute left-1/4 top-10 w-96 h-96 bg-glow-purple/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Toggle tabs */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-xl font-bold tracking-wide text-sm transition-all flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-glow-cyan to-glow-purple text-navy-dark shadow-cyan-glow/15'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            File Anonymous Report
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-6 py-3 rounded-xl font-bold tracking-wide text-sm transition-all flex items-center gap-2 ${
              activeTab === 'track'
                ? 'bg-gradient-to-r from-glow-cyan to-glow-purple text-navy-dark shadow-cyan-glow/15'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            Track Existing Report
          </button>
        </div>

        {/* Tab 1: Create Report Form */}
        {activeTab === 'create' && (
          <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative">
            
            {/* Step Stepper Header (Only visible if not on success screen) */}
            {step < 5 && (
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="flex items-center flex-1 last:flex-none">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-300 ${
                      step >= num 
                        ? 'bg-glow-cyan text-navy-dark shadow-cyan-glow/30' 
                        : 'bg-white/5 border border-white/10 text-gray-500'
                    }`}>
                      {num}
                    </div>
                    {num < 4 && (
                      <div className={`h-[2px] flex-1 mx-2 transition-all duration-500 ${
                        step > num ? 'bg-glow-cyan' : 'bg-white/5'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: Category Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold font-sans text-white mb-2">Select Abuse Category</h3>
                  <p className="text-xs text-gray-400">Choose the type of incident you want to report. Your selection helps route the file correctly.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setIncidentType(cat.value)}
                      className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                        incidentType === cat.value
                          ? 'border-glow-cyan bg-glow-cyan/5 shadow-cyan-glow/10'
                          : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="font-bold text-white mb-1.5 text-sm">{cat.label}</span>
                      <span className="text-[11px] text-gray-400 leading-relaxed">{cat.desc}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    disabled={!incidentType}
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-glow-cyan hover:bg-glow-cyan/95 text-navy-dark font-extrabold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Description & Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold font-sans text-white mb-2">Describe the Incident</h3>
                  <p className="text-xs text-gray-400">Share as much detail as you can. Avoid names if you feel unsafe sharing them.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Incident Description</label>
                    <textarea
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What happened? Write dates, descriptions, behaviors, or any specific threats..."
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-glow-cyan/50 text-white placeholder-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date / Time (Approximate)</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-glow-cyan/50 text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location (City, State, School, or Digital Platform)</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Springfield High or Instagram"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-glow-cyan/50 text-white placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 px-5 py-3 rounded-xl border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    disabled={!description.trim()}
                    onClick={() => setStep(3)}
                    className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-glow-cyan hover:bg-glow-cyan/95 text-navy-dark font-extrabold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: File Attachments */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold font-sans text-white mb-2">Upload Evidence (Optional)</h3>
                  <p className="text-xs text-gray-400">Attach photos, chat logs, voice recordings, or screenshots to back up your report.</p>
                </div>

                {/* Drag zone */}
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all ${
                    dragActive 
                      ? 'border-glow-cyan bg-glow-cyan/5 shadow-cyan-glow/10 scale-[0.99]' 
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <Upload className="w-12 h-12 text-glow-cyan mb-4 animate-bounce" />
                  <p className="text-sm text-gray-200 font-bold mb-1.5">Drag and drop files here</p>
                  <p className="text-xs text-gray-400 mb-4">Supporting PNG, JPG, PDF, MP3, MP4 up to 10MB</p>
                  
                  <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white font-bold transition-all">
                    Browse Files
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileSelect} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* File checklist */}
                {files.length > 0 && (
                  <div className="space-y-2 bg-navy-light/30 border border-white/5 p-4 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <Paperclip className="w-3.5 h-3.5 text-glow-cyan" />
                      Attached Files ({files.length})
                    </p>
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1 border-b border-white/5 last:border-none text-xs text-gray-300">
                        <span className="truncate max-w-[80%]">{file.name}</span>
                        <button 
                          onClick={() => removeFile(idx)} 
                          className="text-glow-pink hover:underline font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1 px-5 py-3 rounded-xl border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-glow-cyan hover:bg-glow-cyan/95 text-navy-dark font-extrabold text-sm transition-all"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Submission Settings */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold font-sans text-white mb-2">Secure Submission</h3>
                  <p className="text-xs text-gray-400">Choose if you want to provide contact details. Leaving it blank maintains 100% anonymity.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Details (Optional & Encrypted)</label>
                    <input
                      type="text"
                      value={senderContact}
                      onChange={(e) => setSenderContact(e.target.value)}
                      placeholder="e.g. Phone, email, or telegram handle. Leave blank to stay anonymous."
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-glow-cyan/50 text-white placeholder-gray-500"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-glow-cyan/5 border border-glow-cyan/20 flex gap-3 text-xs text-gray-300 leading-relaxed">
                    <Info className="w-6 h-6 text-glow-cyan shrink-0" />
                    <div>
                      <p className="font-bold text-white mb-1">Encrypted Tunnel Active</p>
                      Your IP address and hardware metadata will be stripped from this transmission packet. Submission is cryptographically signed and tracked using a randomly generated token code.
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-1 px-5 py-3 rounded-xl border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={handleReportSubmit}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-glow-cyan to-glow-purple text-navy-dark font-extrabold text-sm transition-all hover:opacity-90 shadow-cyan-glow/15"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating secure token...
                      </>
                    ) : (
                      <>
                        Submit Encrypted Report
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Success & Tracking Code */}
            {step === 5 && submissionSuccess && (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-glow-emerald/10 border border-glow-emerald/40 flex items-center justify-center mx-auto shadow-emerald-glow/20">
                  <CheckCircle className="w-8 h-8 text-glow-emerald" />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold font-sans text-white mb-2">Report Transmitted</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                    Your report was scrubbed of all identity nodes and successfully routed. Copy the unique tracking code below.
                  </p>
                </div>

                {/* Tracking Token Display */}
                <div className="max-w-xs mx-auto p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 font-mono shadow-inner relative">
                  <span className="text-lg font-bold text-glow-cyan tracking-wider">{submissionSuccess.trackingCode}</span>
                  <button
                    onClick={copyCodeToClipboard}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[10px] text-glow-pink font-bold max-w-xs mx-auto">
                  ⚠️ SAVE THIS CODE. We cannot retrieve it for you if you lose it.
                </p>

                <div className="pt-6">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-bold hover:bg-white/10 transition-all"
                  >
                    File Another Report
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Track Existing Report Status */}
        {activeTab === 'track' && (
          <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative space-y-6">
            <div>
              <h3 className="text-2xl font-bold font-sans text-white mb-2">Check Report Status</h3>
              <p className="text-xs text-gray-400">Enter your secure report token below to view response progress logs.</p>
            </div>

            {/* Input Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                value={trackCode}
                onChange={(e) => setTrackCode(e.target.value)}
                placeholder="e.g. SAFE-H4B9-A2C3"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-glow-cyan/50 text-white placeholder-gray-500 font-mono tracking-widest uppercase"
              />
              <button
                disabled={isTrackLoading || !trackCode.trim()}
                onClick={handleTrackSearch}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-glow-cyan to-glow-purple text-navy-dark font-extrabold text-sm transition-all hover:opacity-90 flex items-center gap-2"
              >
                {isTrackLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Track Case
                    <Search className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Error state */}
            {trackError && (
              <p className="text-xs text-glow-pink font-bold bg-glow-pink/5 border border-glow-pink/20 p-3.5 rounded-xl">
                {trackError}
              </p>
            )}

            {/* Report Tracked details */}
            {trackedReport && (
              <div className="pt-4 space-y-6 border-t border-white/5">
                
                {/* Header overview */}
                <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl text-xs text-gray-300">
                  <div>
                    <span className="text-gray-400 block mb-0.5">Category</span>
                    <span className="font-bold text-white">{trackedReport.incidentType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Current Status</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${
                      trackedReport.status === 'Received'
                        ? 'bg-glow-cyan/20 text-glow-cyan'
                        : trackedReport.status === 'Reviewed'
                          ? 'bg-glow-purple/20 text-glow-purple'
                          : 'bg-glow-emerald/20 text-glow-emerald'
                    }`}>
                      {trackedReport.status}
                    </span>
                  </div>
                </div>

                {/* Progress updates logs */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Incident History Logs</h4>
                  
                  <div className="relative pl-6 border-l border-white/10 space-y-6">
                    {trackedReport.updates.map((log, idx) => (
                      <div key={idx} className="relative">
                        
                        {/* Dot indicator */}
                        <div className={`absolute -left-[30px] top-1 w-4 h-4 rounded-full flex items-center justify-center bg-navy-dark border-2 ${
                          idx === trackedReport.updates.length - 1 ? 'border-glow-cyan scale-110' : 'border-white/20'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            idx === trackedReport.updates.length - 1 ? 'bg-glow-cyan animate-pulse' : 'bg-gray-500'
                          }`} />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-white">{log.message}</p>
                          <span className="text-[10px] text-gray-500 font-mono block mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
