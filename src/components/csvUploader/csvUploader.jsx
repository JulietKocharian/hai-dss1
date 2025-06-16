import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useData } from '../../context/DataContext'; // ADD THIS IMPORT

const CSVUploaderr = ({ maxSize = 10 }) => { // REMOVE onFileUpload prop since we'll use context
    const { setRawData, setDataSource, rawData } = useData(); // ADD THIS LINE
    
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handle drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    // Validate and process file
    const handleFile = (file) => {
        setError('');

        // Check file type
        if (!file.name.toLowerCase().endsWith('.csv')) {
            setError('Խնդրում ենք ընտրել CSV ֆայլ');
            return;
        }

        // Check file size (convert MB to bytes)
        if (file.size > maxSize * 1024 * 1024) {
            setError(`Ֆայլի չափը չպետք է գերազանցի ${maxSize}MB`);
            return;
        }

        setUploadedFile(file);
        // AUTOMATICALLY READ THE FILE WHEN SELECTED
        readFileContent(file);
    };

    // ADD THIS NEW FUNCTION TO READ FILE CONTENT
    const readFileContent = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvContent = e.target.result;
            console.log('📁 CSV file loaded successfully');
            console.log('📊 First 100 characters:', csvContent.substring(0, 100));
            
            // SET THE RAW DATA IN CONTEXT
            setRawData(csvContent);
            setDataSource('file');
        };
        reader.onerror = (error) => {
            console.error('❌ Error reading file:', error);
            setError('Ֆայլի կարդալու ժամանակ սխալ առաջացավ');
        };
        reader.readAsText(file);
    };

    // SIMPLIFY THE UPLOAD FUNCTION - now it just confirms the file is ready
    const handleUpload = async () => {
        if (!uploadedFile) return;

        setUploading(true);
        try {
            // Simulate brief processing delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setUploading(false);
            
            // File content is already read and set in context
            console.log('✅ File processing complete');
        } catch (err) {
            setError('Ֆայլի մշակումը ձախողվեց');
            setUploading(false);
        }
    };

    // Remove file
    const removeFile = () => {
        setUploadedFile(null);
        setError('');
        // CLEAR THE RAW DATA FROM CONTEXT
        setRawData('');
        setDataSource('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-2">
            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                    dragActive
                        ? 'border-[#1c92d2] bg-[#1c92d2]/10'
                        : uploadedFile
                        ? 'border-green-400 bg-green-400/10'
                        : error
                        ? 'border-red-400 bg-red-400/10'
                        : 'border-[#1c92d2]/50 hover:border-[#1c92d2] hover:bg-[#1c92d2]/5'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {!uploadedFile ? (
                    <>
                        <div className="space-y-2">
                            <div className={`w-12 h-0 mx-auto rounded-full flex items-center justify-center ${
                                error && 'bg-red-400/20'
                            }`}>
                                {error && (
                                    <AlertCircle className="w-6 h-4 text-red-400" />
                                )}
                            </div>

                            <div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-xl hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300 transform hover:scale-105"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Ընտրել ֆայլ
                                </button>
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </>
                ) : (
                    <div className="space-y-3">
                        <div className="w-12 h-12 mx-auto bg-green-400/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>

                        <div>
                            <p className="text-green-400">
                                {uploadedFile.name} ({formatFileSize(uploadedFile.size)})
                            </p>
                        </div>

                        <div className="flex justify-center space-x-2">
                            <button
                                onClick={removeFile}
                                className="inline-flex items-center px-3 py-2 border border-white/30 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Հեռացնել
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-800/30 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-red-400">{error}</span>
                </div>
            )}
        </div>
    );
};

export default CSVUploaderr;