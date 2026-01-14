import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, LogOut } from "lucide-react";
import { toast } from "sonner";

export const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Mock user data - replace with actual auth later
    const userName = "John Doe";
    const userInitials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProfileSettings = () => {
        setIsOpen(false);
        toast.info("Profile settings coming soon!");
    };

    const handleSignOut = () => {
        setIsOpen(false);
        toast.info("Sign out coming soon!");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors ${isOpen ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : ""
                    }`}
            >
                {userInitials}
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
                            className="absolute top-full left-0 mt-2 z-50 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="p-3 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                                        {userInitials}
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground text-sm">{userName}</p>
                                        <p className="text-xs text-muted-foreground">john@example.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-1">
                                <button
                                    onClick={handleProfileSettings}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                                >
                                    <Settings className="w-4 h-4 text-muted-foreground" />
                                    Profile Settings
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
