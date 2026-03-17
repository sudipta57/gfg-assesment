import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { FadeIn, Stagger, StaggerChild, MotionButton } from '../components/MotionElements';

const PRIMARY = '#2F8D46';

export default function CsvUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };
  const handleChange = (e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); };
  const handleFile = (file) => {
    if (!file.name.endsWith('.csv')) { alert('Please upload a valid .csv file.'); return; }
    setFileName(file.name);
    Papa.parse(file, {
      header: true, dynamicTyping: true, skipEmptyLines: true,
      complete: ({ data, meta }) => {
        if (!data?.length) return;
        setParsedData(data.slice(0, 5));
        const first = data[0];
        setColumns((meta.fields || []).map(f => {
          const val = first[f];
          let type = 'STRING';
          if (typeof val === 'number') type = 'NUMBER';
          else if (typeof val === 'boolean') type = 'BOOLEAN';
          else if (typeof val === 'string' && !isNaN(Date.parse(val)) && val.includes('-')) type = 'DATE';
          return { name: f, type };
        }));
      },
    });
  };

  const barHeights = [40, 60, 75, 50, 85];

  return (
    <div className="min-h-screen bg-[#f8f6f6] text-[#1A1A1A]">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-[#f8f6f6]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl font-bold" style={{color: PRIMARY}}>bar_chart</span>
              <span className="font-mono text-xl font-bold tracking-tighter text-slate-900">QueryIQ</span>
            </Link>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:text-[#2F8D46] transition-colors"><span className="material-symbols-outlined">notifications</span></button>
              <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border" style={{backgroundColor: `${PRIMARY}22`, color: PRIMARY, borderColor: `${PRIMARY}44`}}>JD</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-14">
        {/* UPLOAD ZONE */}
        <FadeIn>
          <section className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-black mb-3 tracking-tight">Upload your data</h2>
            <p className="text-slate-500 text-lg mb-8">Import your CSV to start generating professional insights with AI-driven analysis.</p>
            <input type="file" ref={fileInputRef} onChange={handleChange} accept=".csv" className="hidden" />
            <div
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer flex flex-col items-center justify-center gap-5 rounded-xl border-2 border-dashed px-6 py-20 transition-all duration-300 shadow-sm hover:shadow-md ${isDragging ? 'bg-green-50 border-green-500' : 'bg-white border-slate-300 hover:border-[#2F8D46]'}`}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: `${PRIMARY}1A`, color: PRIMARY}}>
                <span className="material-symbols-outlined text-4xl">cloud_upload</span>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold">Drag &amp; drop your CSV file here, or <span className="underline" style={{color: PRIMARY}}>click to browse</span></p>
                <p className="text-slate-400 text-sm">Supports .csv, .xlsx files up to 50MB</p>
              </div>
              {fileName && <p className="text-sm font-semibold" style={{color: PRIMARY}}>✓ {fileName} loaded</p>}
            </div>
          </section>
        </FadeIn>

        {/* COLUMN METADATA */}
        {columns.length > 0 && (
          <section>
            <FadeIn><h3 className="text-lg font-bold flex items-center gap-2 mb-6"><span className="material-symbols-outlined" style={{color: PRIMARY}}>analytics</span> Column Metadata</h3></FadeIn>
            <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" stagger={0.06}>
              {columns.map((col, i) => (
                <StaggerChild key={i}>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-full">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate max-w-[80px]" title={col.name}>{col.name}</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{col.type}</span>
                    </div>
                    <div className="h-8 w-full rounded flex items-end overflow-hidden px-1 gap-0.5" style={{backgroundColor: `${PRIMARY}0D`}}>
                      {barHeights.map((h, j) => (
                        <div key={j} className="flex-1 rounded-t-sm" style={{backgroundColor: `${PRIMARY}88`, height: `${h}%`}}></div>
                      ))}
                    </div>
                  </div>
                </StaggerChild>
              ))}
            </Stagger>
          </section>
        )}

        {/* DATA PREVIEW */}
        {parsedData && (
          <FadeIn>
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2"><span className="material-symbols-outlined" style={{color: PRIMARY}}>table_rows</span> Data Preview</h3>
                <span className="text-sm text-slate-400 italic">Showing first {parsedData.length} rows</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse min-w-max">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {columns.map((c, i) => <th key={i} className="px-6 py-4 text-sm font-bold text-slate-700">{c.name}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedData.map((row, ri) => (
                      <tr key={ri} className="hover:bg-green-50/40 transition-colors">
                        {columns.map((c, ci) => (
                          <td key={ci} className="px-6 py-4 text-sm text-slate-600">{row[c.name] != null ? String(row[c.name]) : '—'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </FadeIn>
        )}

        {/* CTA */}
        <FadeIn>
          <section className="flex flex-col items-center pb-12">
            <MotionButton
              onClick={() => navigate('/editor')}
              className="text-white px-10 py-5 rounded-xl font-bold text-xl shadow-lg flex items-center gap-3"
              style={{backgroundColor: PRIMARY}}
            >
              Start Querying This Data
              <span className="material-symbols-outlined">auto_awesome</span>
            </MotionButton>
            <p className="mt-4 text-slate-400 text-sm">QueryIQ will automatically index your data for natural language searches.</p>
          </section>
        </FadeIn>
      </main>

      <footer className="border-t border-slate-200 py-8 px-6 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs">
        <p>© 2024 QueryIQ Analytics. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a className="hover:text-[#2F8D46]" href="#">Privacy Policy</a>
          <a className="hover:text-[#2F8D46]" href="#">Terms of Service</a>
          <a className="hover:text-[#2F8D46]" href="#">Documentation</a>
        </div>
      </footer>
    </div>
  );
}
