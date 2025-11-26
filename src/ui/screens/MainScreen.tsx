import React, { useState } from 'react';
import { TopNavBar } from '../components/TopNavBar';
import { Link } from 'react-router-dom';

export function MainScreen() {
  const [serverEnabled, setServerEnabled] = useState(true);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#101622] group/design-root overflow-hidden p-4">
      <div className="flex h-full w-full max-w-lg flex-col rounded-lg bg-[#111722] shadow-2xl ring-1 ring-white/10">
        <TopNavBar />
        
        <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6 md:p-10">
          <div className="text-center">
            <h1 className="text-text-light tracking-light text-[32px] font-bold leading-tight">Scan to Connect</h1>
            <p className="text-text-medium text-base font-normal leading-normal pt-2">Use your smartphone camera to scan the QR code and connect instantly.</p>
          </div>
          
          <div className="flex w-full max-w-64 grow-0 bg-[#111722] @container">
            <div className="w-full gap-1 overflow-hidden rounded-lg bg-white p-4 @[480px]:gap-2">
              <div className="aspect-square w-full bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCeoFhZJ5fynMr0Qg8NIofw0y5UCe2DVV0kmL7ngELeY9Zbu_ZtPyRQka9HoEmsrQpS02xmsvOg_YBDFGdaYFgzpFqym0tRG3iGtNNNvchdvbsVtdHtFfM5TXKoGl5MKLOmK-PChq2xXt2JkuoEIDpUSasYh0Mf9Jv-B4M1W-e4wn0wLpBTDcaeQVRZHx3aoDmAW15InnyQOHkATDRMD823uzPCb8mE17-Stq3MCedry-kRea1D6FP7hcK4gHgLnZUcajZihZOcy7c")' }}></div>
            </div>
          </div>
          
          <div className="w-full max-w-md p-4 @container">
            <div className="flex flex-1 flex-col items-center justify-between gap-4 rounded-lg border border-[#324467] bg-[#111722] p-5 @[480px]:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-base font-bold leading-tight text-text-light">Server Status</p>
                  <p className="text-sm font-normal leading-normal text-text-medium">Toggle the server to start or stop sharing.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${serverEnabled ? 'bg-accent-green' : 'bg-red-500'}`}></div>
                <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-accent-green p-0.5 has-[:checked]:justify-end has-[:checked]:bg-accent-green has-[:not(:checked)]:bg-[#232f48]">
                  <div className="h-full w-[27px] rounded-full bg-white transition-transform" style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px' }}></div>
                  <input 
                    checked={serverEnabled} 
                    onChange={(e) => setServerEnabled(e.target.checked)} 
                    className="invisible absolute" 
                    type="checkbox"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
             <Link to="/settings" className="text-blue-400 hover:underline">Settings</Link>
             <Link to="/gallery" className="text-blue-400 hover:underline">Gallery</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
