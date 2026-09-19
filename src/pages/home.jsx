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

const Home = () => {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    { value: "html-tailwind-bootstrap", label: "HTML + Tailwind CSS + Bootstarp" },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Put your key in a .env file as VITE_GEMINI_KEY=your_key (restart the dev server after)
  // Or for quick testing, replace with: apiKey: "your_key_here"
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

  async function getResponse() {
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

      console.log(response.text);

      // remove the ```html ... ``` wrapper so only code remains
      const cleaned = response.text.replace(/```html|```/g, "").trim();

      setCode(cleaned);
      setOutputScreen(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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
    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], {type: 'text/plain'});
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File Downloaded");
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center px-[100px] justify-between gap-[30px]">
        <div className="left w-[50%] h-[auto] py-[30px] rounded-xl bg-[#1d1a28] mt-5 p-[20px]">
          <h3 className="text-[25px] font-semibold sp-text">
            AI Componet Generator
          </h3>
          <p className="text-[gray] mt-2 text-[16px]">
            Describe your Component and let AI design your Component for You.
          </p>

          <p className='text-[15px] font-[700] mt-4'>Framework</p>
          <Select
            className="mt-2"
            options={options}
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
            className='w-full min-h-[200px] bg-[#09090B] mt-3 p-[10px]'
            placeholder="Describe your Component here..........."
          ></textarea>

          <div className="flex items-center justify-between">
            <p className="text-[gray]">Click to Generate Your Code </p>
            <button
              onClick={getResponse}
              className="generate flex items-center p-[20px] rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-700 mt-3 px-[20px] text-center gap-[10px] transition-all hover:opacity-[.7]"
            >
              <i><PiRocketLaunchBold /></i>
              {
                  loading === true ?
                    <>
                      
                      <ClipLoader className='text-[30px]'/>
                      
                    </>
                    : ""
                }
              Generate
            </button>
          </div>
        </div>

        <div className="right relative left w-[50%] h-[80vh] bg-[#1d1a28] mt-2 rounded-xl">
          {
            outputScreen === false ?
              <>
                
                <div className="skeleton w-full h-full flex items-center flex-col justify-center">
                  <div className="circle p-[20px] h-[70px] w-[70px] flex items-center justify-center rounded-[50%] text-[30px] bg-gradient-to-r from-purple-400 to-purple-700"><LuCodeXml /></div>
                  <p className="text-[16px] text-[gray] mt-3">Your Component & Code will Appear here</p>
                </div>
              </>
              :
              <>
                <div className="top bg-[#1d1a28] w-full h-[60px] flex items-center gap-[15px] p-[20px] rounded-xl">
                  <button
                    onClick={() => { setTab(1) }}
                    className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab === 1 ? "bg-[#333]" : "bg-purple-700"}`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => { setTab(2) }}
                    className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab === 2 ? "bg-[#333]" : "bg-purple-700"}`}
                  >
                    Preview
                  </button>
                </div>

                <div className="top-2 bg-[#1d1a28] w-full h-[60px] flex items-center justify-between gap-[15px] p-[20px] rounded-xl">
                  <div className="left">
                    <p className='font-bold'>Code Editor</p>
                  </div>
                  <div className="right flex items-center gap-[10px]">
                    {
                      tab === 1 ?
                        <>
                          <button className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-700 flex items-center justify-center transition-all hover:bg-[#333]" onClick={copyCode}><IoCopy /></button>
                          <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-700 flex items-center justify-center transition-all hover:bg-[#333]" onClick={downloadFile}><BiExport /></button>
                        </> :
                        <>
                          <button className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-700 flex items-center justify-center transition-all hover:bg-[#333]"><RxOpenInNewWindow /></button>
                          <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-700 flex items-center justify-center transition-all hover:bg-[#333]"><LuRefreshCcw /></button>
                        </>
                    }
                  </div>
                </div>

                <div className="editor h-full mt-2">
                  {
                    tab === 1 ?
                      <>
                        <Editor height="100%" theme='vs-dark' language="html" value={code} />
                      </> :
                      <>
                        <div className="preview w-full h-full bg-white text-black flex items-center justify-center">
                          <iframe srcDoc={code} title="preview" className="w-full h-full bg-white" />
                        </div>
                      </>
                  }
                </div>
              </>
          }
        </div>
      </div>
    </>
  );
};

export default Home;