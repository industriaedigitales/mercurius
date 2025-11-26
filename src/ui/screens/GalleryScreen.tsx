import React from 'react';
import { Link } from 'react-router-dom';

export function GalleryScreen() {
  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-hidden font-display">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-6 sm:px-10 py-3 fixed top-0 left-0 right-0 z-20 bg-background-dark/80 backdrop-blur-sm">
          <div className="flex items-center gap-4 text-white">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"></path>
                <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z"></path>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">FileDrop</h2>
          </div>
          <Link to="/" className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-white/10 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-10 px-2.5">
            <span className="material-symbols-outlined text-white text-xl">close</span>
          </Link>
        </header>
        <main className="flex-1 flex justify-center items-center h-full pt-[60px] pb-5">
          <div className="layout-content-container flex flex-col max-w-lg w-full h-full justify-center relative">
            <div className="absolute inset-y-0 -left-20 flex items-center z-10">
              <button className="flex shrink-0 items-center justify-center rounded-full size-12 bg-white/10 text-white hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-3xl">arrow_back_ios_new</span>
              </button>
            </div>
            <div className="absolute inset-y-0 -right-20 flex items-center z-10">
              <button className="flex shrink-0 items-center justify-center rounded-full size-12 bg-white/10 text-white hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-3xl">arrow_forward_ios</span>
              </button>
            </div>
            <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
              <div className="relative flex items-center justify-center w-full h-full bg-cover bg-center rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA79zk8O0wj0PCHS884WOSKfUuFm33kYDHEu6dt9IBhIJinNw-0zF9vCk6APlo9YO95jiUilSMqlxzHRqW59yprhJau4sgFEyixwHD1VQ9mHYLFrV_7NE1r9t0x3zURMYwIx_tv1soh8wzVm2-6UnJGyVuyPjg3k3XvBD9yRAUWsSW0fHCgMLaTolvhL9Qkkq4ww7Uscyi32C_4_8y77iG_RHEsE8PLh6taWtDgY4HfQ-PwPJP9VLLOswaaEqowhazHsirs8r6PpC4")' }}>
                <div className="absolute inset-0 bg-black/20"></div>
                <button className="relative flex shrink-0 items-center justify-center rounded-full size-20 bg-black/50 text-white backdrop-blur-sm">
                  <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </button>
                <div className="absolute inset-x-0 bottom-0 p-6 space-y-4 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="w-full">
                    <div className="flex h-4 items-center justify-center">
                      <div className="h-1 flex-1 rounded-full bg-primary"></div>
                      <div className="relative"><div className="absolute -left-2 -top-2 size-4 rounded-full bg-primary ring-2 ring-background-dark"></div></div>
                      <div className="h-1 flex-1 rounded-full bg-white/40"></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-white text-xs font-medium leading-normal">0:37</p>
                      <p className="text-white text-xs font-medium leading-normal">2:23</p>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-[auto_1fr] gap-x-6 bg-black/30 rounded backdrop-blur-md">
                    <div className="col-span-2 grid grid-cols-subgrid border-b border-b-white/10 py-3">
                      <p className="text-white/70 text-sm font-normal leading-normal">Filename</p>
                      <p className="text-white text-sm font-normal leading-normal text-right">tokyo_night_drive.mp4</p>
                    </div>
                    <div className="col-span-2 grid grid-cols-subgrid border-b border-b-white/10 py-3">
                      <p className="text-white/70 text-sm font-normal leading-normal">Size</p>
                      <p className="text-white text-sm font-normal leading-normal text-right">14.5 MB</p>
                    </div>
                    <div className="col-span-2 grid grid-cols-subgrid pt-3">
                      <p className="text-white/70 text-sm font-normal leading-normal">From</p>
                      <p className="text-white text-sm font-normal leading-normal text-right">Jane's iPhone</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-stretch pt-2">
                    <button className="flex flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-white/10 text-white/80 text-base font-bold leading-normal tracking-[0.015em] w-full hover:bg-white/20 transition-colors group">
                      <span className="material-symbols-outlined mr-2 text-2xl text-red-500/80 group-hover:text-red-500">delete</span>
                      <span className="truncate">Delete</span>
                    </button>
                    <button className="flex flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full hover:bg-blue-500 transition-colors group">
                      <span className="material-symbols-outlined mr-2 text-2xl">download_done</span>
                      <span className="truncate">Keep</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
