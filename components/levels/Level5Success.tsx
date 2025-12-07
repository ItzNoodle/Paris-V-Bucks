
import React, { useState, useEffect, useRef } from 'react';
import { LevelProps } from '../../types';
import { ExternalLink, CheckCircle2, Music, Mail, Loader2, AlertCircle } from 'lucide-react';
import CountUp from '../CountUp';
import DecryptedText from '../DecryptedText';
import { playUISound } from '../../utils/sound';

export const Level5Success: React.FC<LevelProps> = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // We don't need controlled state for the inputs if we use native form submission
  const formRef = useRef<HTMLFormElement>(null);

  // Play success sound on mount
  useEffect(() => {
      playUISound('success');
  }, []);

  const handleRevealClick = () => {
      window.open('https://r.mtdv.me/parisvbucks', '_blank');
      setTimeout(() => {
          setRevealed(true);
          playUISound('success');
      }, 2000);
  };

  const handleSubmitStart = () => {
      setIsSending(true);
      playUISound('click');
      
      // Since we are targeting a hidden iframe, we can't know exactly when it finishes 
      // due to cross-origin security. We simulate a delay for better UX.
      setTimeout(() => {
          setIsSending(false);
          setFormSent(true);
          playUISound('sent');
          if (formRef.current) formRef.current.reset();
      }, 1500);
  };

  return (
    <div className="text-center space-y-6 animate-in fade-in duration-1000 pb-12 pt-8 w-full max-w-3xl mx-auto">
        <div className="flex flex-col items-center gap-6">
            <div className="bg-emerald-500/10 p-4 rounded-full border-4 border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.4)] mb-2 animate-bounce">
                <div className="w-16 h-16 flex items-center justify-center">
                    <CheckCircle2 className="w-full h-full text-emerald-500 drop-shadow-[0_0_10px_emerald]" />
                </div>
            </div>
            
            <h2 className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                SYSTEM <span className="text-emerald-500">OWNED</span>
            </h2>

            <div className="bg-emerald-950/40 border-2 border-emerald-500/50 p-8 rounded-2xl w-full shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden group max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-500" />
                
                <p className="text-emerald-300 text-sm mb-4 flex items-center justify-center gap-2 font-bold tracking-widest relative z-10">
                    <CountUp 
                        to={1000} 
                        duration={3} 
                        separator="," 
                        className="text-4xl font-black text-white drop-shadow-md" 
                    />
                    V-BUCKS UNLOCKED
                </p>
                
                <div className="relative z-10">
                    {revealed ? (
                        <div className="text-3xl font-mono font-black text-white tracking-[0.1em] cursor-text selection:bg-emerald-500 break-all py-4 px-6 bg-black/60 rounded-xl border border-emerald-500/30 shadow-inner">
                            <DecryptedText 
                                text="JXKT-T24B-BBSJ-WTPY" 
                                animateOn="view" 
                                speed={80} 
                                maxIterations={20}
                                characters="ABCD1234!?"
                                className="text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                                encryptedClassName="text-emerald-700 blur-[2px]"
                            />
                        </div>
                    ) : (
                        <button 
                            onClick={handleRevealClick}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-105 cursor-interactive border-2 border-emerald-400 animate-pulse"
                        >
                            CLICK TO REVEAL CODE
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4 mt-4 w-full max-w-md px-4">
                <div className="grid grid-cols-2 gap-4">
                    <a 
                        href="https://www.fortnite.com/redeem?lang=en-US" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex justify-center items-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105 cursor-interactive border border-blue-400 text-sm"
                    >
                        REDEEM <ExternalLink size={16} />
                    </a>
                    <a 
                        href="https://r.mtdv.me/random-ahh-link" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex justify-center items-center gap-2 w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105 cursor-interactive border border-purple-400 text-sm"
                    >
                        COOL SONG <Music size={16} />
                    </a>
                </div>
                
                {!showContactForm ? (
                    <button 
                        onClick={() => setShowContactForm(true)}
                        className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-bold rounded-xl border border-gray-600 hover:border-white transition-all cursor-interactive flex items-center justify-center gap-2 group shadow-md"
                    >
                        <Mail size={18} className="group-hover:text-blue-400 transition-colors" />
                        CONTACT DEV
                    </button>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                        {formSent ? (
                            <div className="bg-gray-800 border border-green-500/50 p-6 rounded-xl flex flex-col items-center gap-3 shadow-2xl relative overflow-hidden h-72 justify-center">
                                <div className="absolute top-0 right-0 p-4">
                                     <Mail className="text-gray-600 animate-bounce" />
                                </div>
                                <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center border-2 border-green-500 mb-2">
                                    <CheckCircle2 className="text-green-500 w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                                <p className="text-gray-400 text-xs mt-1 max-w-[200px] leading-relaxed">
                                    <span className="text-yellow-400 font-bold block mb-1">IMPORTANT:</span>
                                    If you haven't received it, check your <span className="text-white underline">Spam/Junk</span> folder for an activation email from FormSubmit.
                                </p>
                                <button 
                                    onClick={() => { setFormSent(false); setShowContactForm(false); }}
                                    className="mt-4 text-xs text-gray-500 hover:text-white underline cursor-interactive"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* The Hidden Iframe that catches the response to prevent redirect */}
                                <iframe name="hiddenFrame" title="hiddenFrame" style={{ display: 'none' }}></iframe>

                                <form 
                                    ref={formRef}
                                    action="https://formsubmit.co/itznoodle1@outlook.com" 
                                    method="POST"
                                    target="hiddenFrame"
                                    onSubmit={handleSubmitStart}
                                    className={`bg-gray-800 border border-gray-700 p-6 rounded-xl flex flex-col gap-4 shadow-xl text-left transition-all duration-700`}
                                >
                                    {/* FormSubmit Config Fields */}
                                    <input type="hidden" name="_subject" value="New Paris V-Bucks Feedback" />
                                    <input type="hidden" name="_captcha" value="false" />
                                    <input type="hidden" name="_template" value="table" />

                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-white">Dev Feedback</h3>
                                        <button type="button" onClick={() => setShowContactForm(false)} className="text-gray-500 hover:text-white cursor-interactive">CLOSE</button>
                                    </div>
                                    
                                    <textarea 
                                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-4 text-white focus:border-blue-500 outline-none resize-none h-32 cursor-interactive transition-colors font-mono text-sm"
                                        placeholder="Write your message here..."
                                        name="message"
                                        required
                                        disabled={isSending}
                                    />
                                    
                                    <div className="bg-blue-900/30 p-3 rounded border border-blue-500/30 flex gap-2 items-start">
                                        <AlertCircle size={16} className="text-blue-400 mt-0.5 shrink-0" />
                                        <p className="text-[10px] text-blue-200 leading-tight">
                                            First time? You MUST click the activation link sent to your email after submitting, or you won't receive the message.
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            type="submit"
                                            disabled={isSending}
                                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-interactive"
                                        >
                                            {isSending ? (
                                                <>SENDING <Loader2 className="animate-spin" size={18} /></>
                                            ) : (
                                                <>SEND 🚀</>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Dev Message - Red Box Style */}
            <div className="mt-8 bg-red-950/30 border border-red-500/30 p-6 rounded-xl max-w-lg w-full shadow-[0_0_30px_rgba(220,38,38,0.1)] backdrop-blur-sm transform rotate-1">
                 <p className="text-red-200/90 font-mono text-sm leading-relaxed italic">
                    "Listen here, Paris. I spent 20 hours of my actual life writing 4500+ lines of code for this. Do you have any idea how many matrix multiplications I had to manually calculate for these 3D CSS transforms? I optimized the WebGL fragment shaders pixel by pixel until I started dreaming in binary! And you? You just speedran my entire magnum opus in 15 minutes while probably eating chips. You didn't even pause to admire the sub-pixel cursor parallax or the custom cubic-bezier easing functions. Whatever. Just take the code. Use it wisely. I hope you buy a default skin with it."
                </p>
                <div className="flex justify-end items-center gap-2 mt-3">
                    <div className="h-px w-8 bg-red-500/50"></div>
                    <p className="text-red-500 font-bold text-sm">- The Tired Developer</p>
                </div>
            </div>
        </div>
    </div>
  );
};
