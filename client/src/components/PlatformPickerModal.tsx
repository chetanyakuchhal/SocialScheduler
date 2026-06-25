import { CheckCircleIcon, ExternalLinkIcon, XIcon } from "lucide-react";
import { PLATFORMS } from "../assets/assets";


interface PlatformPickerModalProps{
    connectedIds: string[];
    connecting: string | null;
    onClose: () => void;
    onConnect: (platformId: string) => void;
}

const PlatformPickerModal = ({connectedIds, connecting, onClose, onConnect} : PlatformPickerModalProps) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-slate-950 dark:text-white font-semibold">Choose a Platform</h3>
                <button aria-label="Close platform picker" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                    <XIcon className="size-4" />
                </button>
            </div>

            {/* Platform list */}
            <div className="p-6 flex flex-col gap-2">
                {PLATFORMS.map((p)=>{
                    const isConnected = connectedIds.includes(p.id);
                    const isConnecting = connecting === p.id;
                    return (
                        <button key={p.id}
                        disabled={isConnected || isConnecting}
                        onClick={()=>onConnect(p.id)}
                        className={`flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all ${isConnected ? "border-teal-200 bg-teal-50 dark:border-teal-400/30 dark:bg-teal-400/10 cursor-default" : "border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950 dark:hover:border-teal-500 cursor-pointer"} ${isConnecting && "opacity-60"}`}>

                            {/* Icon */}
                            <div className="p-2">
                                <p.icon className={`size-5 ${isConnected ? "text-teal-700 dark:text-teal-300" : "text-slate-500 dark:text-slate-400"}`}/>
                            </div>

                            {/* Label */}
                            <div className="flex-1 min-w-0">
                                <div className={`text-sm ${isConnected ? "text-teal-800 dark:text-teal-200" : "text-slate-800 dark:text-slate-100"}`}>
                                    {p.name}
                                </div>
                                <div className="text-xs text-slate-500 truncate">
                                    {isConnected ? "Already connected" : p.description}
                                </div>
                            </div>

                            
                              {/* Status */}
                            {isConnected && <CheckCircleIcon className="size-4 text-teal-600 shrink-0"/>}
                            {isConnecting && <div className="size-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin shrink-0"/>}
                            {!isConnected && !isConnecting && <ExternalLinkIcon className="size-3.5 text-slate-400 shrink-0"/>}
                        </button>
                    )
                })}

            </div>

        </div>
    </div>
  )
}

export default PlatformPickerModal
