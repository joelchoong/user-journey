import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Link, FileDown, Check, Info } from "lucide-react";
import { toast } from "sonner";

interface ShareDropdownProps {
    onSaveAsPDF?: () => void;
}

export const ShareDropdown = ({ onSaveAsPDF }: ShareDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveAsPDF = () => {
        setIsOpen(false);
        if (onSaveAsPDF) {
            onSaveAsPDF();
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${isOpen
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
            >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Share</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full right-0 mt-2 z-50 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="p-1">
                                <button
                                    onClick={handleCopyLink}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <Link className="w-4 h-4 text-muted-foreground" />
                                    )}
                                    {copied ? "Copied!" : "Copy Link"}
                                </button>
                                <div className="relative group">
                                    <button
                                        onClick={handleSaveAsPDF}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                                    >
                                        <FileDown className="w-4 h-4 text-muted-foreground" />
                                        <span className="flex-1 text-left">Save as PDF</span>
                                        <div className="relative">
                                            <Info className="w-3.5 h-3.5 text-muted-foreground" />
                                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50">
                                                <div className="bg-foreground text-background text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                                                    Will shrink to fit the page width
                                                    <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
