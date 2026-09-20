import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Select from "react-select";
import { PiRocketLaunchBold } from "react-icons/pi";
import { LuCodeXml, LuRefreshCcw } from "react-icons/lu";
import Editor from '@monaco-editor/react';
import { IoCopy } from "react-icons/io5";
import { BiExport } from "react-icons/bi";
import { RxOpenInNewWindow } from 'react-icons/rx';
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { IoMdCloseCircleOutline } from 'react-icons/io';

// Key comes from your .env file: VITE_GEMINI_KEY=your_key
// Created once here (outside the component) so it isn't rebuilt on every render
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

const suggestions = [
  "A modern login form with a gradient button",
  "A pricing card with three plans",
  "A responsive navbar with a mobile menu",
  "A product card with hover effects",
  "A contact form with validation styling",
];

const Home = () => {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    { value: "html-tailwind-bootstrap", label: "HTML + Tailwind CSS + Bootstrap" },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  async function getResponse() {
    if (!prompt.trim()) {
      toast.error("Please describe your component first");
      return;
    }

    try {
      setLoading(true);

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: `You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}
Framework to use: ${frameWork.value}

Requirements:
- The code must be clean, well-structured, and easy to understand.
- Optimize for SEO where applicable.
- Focus on creating a modern, animated, and responsive UI design.
- Include high-quality hover effects, shadows, animations, colors, and typography.
- Return ONLY the code, formatted properly in Markdown fenced code blocks.
- Do NOT include explanations, text, comments, or anything else besides the code.
- And give the whole code in a single HTML file.`,
      });

      const text = response.text || "";

      if (!text) {
        toast.error("No code was returned, please try again");
        return;
      }

      // remove the ```html ... ``` wrapper so only code remains
      const cleaned = text.replace(/```html|```/g, "").trim();

      setCode(cleaned);
      setOutputScreen(true);
    } catch (err) {
      console.error(err);
      const msg = String(err.message || "");
      if (msg.includes("429")) {
        toast.error("Free limit reached. Please wait a minute and try again.");
      } else if (msg.includes("404")) {
        toast.error("Model not available. Check the model name in the code.");
      } else {
        toast.error("Something went wrong. Check the console for details.");
      }
    } finally {
      setLoading(false);
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code Copied to Clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    const fileName = "GenUI-Code.html";
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File Downloaded");
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center px-4 md:px-10 lg:px-[100px] justify-between gap-[30px] pb-8">
        <div className="left w-full lg:w-[50%] h-[auto] py-[30px] rounded-xl bg-[#1d1a28] mt-5 p-[20px] border border-zinc-800 shadow-lg">
          <h3 className="text-[25px] font-semibold sp-text">
            AI Component Generator
          </h3>
          <p className="text-[gray] mt-2 text-[16px]">
            Describe your Component and let AI design your Component for You.
          </p>

          <p className='text-[15px] font-[700] mt-4'>Framework</p>
          <Select
            className="mt-2"
            options={options}
            value={frameWork}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: "#1f1f1f",
                borderColor: state.isFocused ? "#6366f1" : "#444",
                color: "white",
                boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
                "&:hover": {
                  borderColor: "#6366f1",
                },
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#1f1f1f",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#6366f1"
                  : state.isFocused
                  ? "#333"
                  : "#1f1f1f",
                color: "white",
                cursor: "pointer",
              }),
              singleValue: (base) => ({
                ...base,
                color: "white",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#888",
              }),
              input: (base) => ({
                ...base,
                color: "white",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "#aaa",
                "&:hover": {
                  color: "white",
                },
              }),
              indicatorSeparator: (base) => ({
                ...base,
                backgroundColor: "#444",
              }),
            }}
            onChange={(e) => {
              setFrameWork(e);
            }}
          />

          <p className='text-[15px] font-[700] mt-5'>Describe your Component.</p>
          <textarea
            onChange={(e) => { setPrompt(e.target.value) }}
            value={prompt}
            className='w-full min-h-[200px] bg-[#09090B] mt-3 p-[10px] rounded-lg border border-zinc-700 focus:border-[#6366f1] outline-none text-white resize-none transition-all'
            placeholder="Describe your Component here..........."
          ></textarea>

          <div className="flex flex-wrap gap-2 mt-3">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPrompt(s)}
                className="text-[13px] px-3 py-1 rounded-full border border-zinc-700 text-zinc-300 transition-all hover:border-[#6366f1] hover:bg-[#2a2640]">
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[gray]">Click to Generate Your Code </p>
            <button
              onClick={getResponse}
              disabled={loading}
              className="generate flex items-center p-[20px] rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-700 mt-3 px-[20px] text-center gap-[10px] transition-all hover:opacity-[.7] disabled:opacity-60 disabled:cursor-not-allowed">
              {
                loading === false ?
                  <i><PiRocketLaunchBold /></i>
                  :
                  <ClipLoader color='white' size={20} />
              }
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        <div className="right relative w-full lg:w-[50%] h-[calc(80vh+128px)] bg-[#1d1a28] mt-2 rounded-xl flex flex-col overflow-hidden border border-zinc-800 shadow-lg">
          {
            outputScreen === false ?
              <>
                <div className="skeleton w-full h-full flex items-center flex-col justify-center">
                  <div className="circle p-[20px] h-[70px] w-[70px] flex items-center justify-center rounded-[50%] text-[30px] bg-gradient-to-r from-purple-400 to-purple-700"><LuCodeXml /></div>
                  <p className="text-[16px] text-[gray] mt-3">
                    {loading ? "Generating your component..." : "Your Component & Code will Appear here"}
                  </p>
                </div>
              </>
              :
              <>
                <div className="top bg-[#1d1a28] w-full h-[60px] shrink-0 flex items-center gap-[15px] p-[20px] rounded-xl">
                  <button
                    onClick={() => { setTab(1) }}
                    className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab === 1 ? "bg-purple-700" : "bg-[#333] hover:bg-[#444]"}`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => { setTab(2) }}
                    className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab === 2 ? "bg-purple-700" : "bg-[#333] hover:bg-[#444]"}`}
                  >
                    Preview
                  </button>
                </div>

                <div className="top-2 bg-[#1d1a28] w-full h-[60px] shrink-0 flex items-center justify-between gap-[15px] p-[20px] rounded-xl">
                  <div className="left">
                    <p className='font-bold'>{tab === 1 ? "Code Editor" : "Live Preview"}</p>
                  </div>
                  <div className="right flex items-center gap-[10px]">
                    {
                      tab === 1 ?
                        <>
                          <button title="Copy code" className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-700 flex items-center justify-center transition-all hover:bg-[#333]" onClick={copyCode}><IoCopy /></button>
                          <button title="Download as HTML" className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-700 flex items-center justify-center transition-all hover:bg-[#333]" onClick={downloadFile}><BiExport /></button>
                        </> :
                        <>
                          <button title="Open full screen" className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-700 flex items-center justify-center transition-all hover:bg-[#333]" onClick={() => { setIsNewTabOpen(true) }}><RxOpenInNewWindow /></button>
                          <button title="Refresh preview" className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-700 flex items-center justify-center transition-all hover:bg-[#333]" onClick={() => { setPreviewKey((k) => k + 1) }}><LuRefreshCcw /></button>
                        </>
                    }
                  </div>
                </div>

                <div className="editor flex-1 min-h-0 mt-2">
                  {
                    tab === 1 ?
                      <>
                        <Editor height="100%" theme='vs-dark' language="html" value={code} />
                      </> :
                      <>
                        <div className="preview w-full h-full bg-white text-black overflow-hidden rounded-b-xl">
                          <iframe
                            key={previewKey}
                            srcDoc={code}
                            title="preview"
                            sandbox="allow-scripts allow-forms allow-modals allow-popups"
                            className="w-full h-full bg-white border-0"
                          />
                        </div>
                      </>
                  }
                </div>
              </>
          }
        </div>
      </div>

      {
        isNewTabOpen === true ?
          <>
            <div className="fixed inset-0 z-[9999] bg-white w-full h-full flex flex-col">
              <div className="top text-black w-full h-[60px] shrink-0 flex items-center justify-between px-[20px] border-b border-zinc-200">
                <div className="left">
                  <p className='font-bold'>Preview</p>
                </div>
                <div className="right flex items-center gap-[10px]">
                  <button
                    title="Close preview"
                    className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-300 text-[20px] flex items-center justify-center transition-all hover:bg-zinc-200"
                    onClick={() => { setIsNewTabOpen(false) }}
                  >
                    <IoMdCloseCircleOutline />
                  </button>
                </div>
              </div>
              <iframe
                srcDoc={code}
                title="full preview"
                sandbox="allow-scripts allow-forms allow-modals allow-popups"
                className="w-full flex-1 min-h-0 bg-white border-0"
              ></iframe>
            </div>
          </>
          : ""
      }
    </>
  );
};

export default Home;