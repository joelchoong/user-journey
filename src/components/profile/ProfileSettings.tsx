import { useState, useEffect } from "react";
import { UserProfile } from "@/types/journey";
import {
    X,
    User,
    Mail,
    CreditCard,
    Calendar,
    ShieldCheck,
    Save,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ProfileSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile;
    onUpdate: (updates: Partial<UserProfile>) => void;
}

export const ProfileSettings = ({
    isOpen,
    onClose,
    user,
    onUpdate,
}: ProfileSettingsProps) => {
    const [formData, setFormData] = useState<UserProfile>(user);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(user);
        }
    }, [isOpen, user]);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        onUpdate(formData);
        setIsSaving(false);
        toast.success("Profile updated successfully");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-display font-bold text-foreground">Account Settings</h2>
                                <p className="text-xs text-muted-foreground">Manage your profile and billing information</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-thin">
                        {/* Profile Section */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                            placeholder="Your name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Billing Section */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-primary" />
                                Billing Information
                            </h3>
                            <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground ml-1">Cardholder Name</label>
                                    <input
                                        type="text"
                                        value={formData.billingInfo.cardHolder}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            billingInfo: { ...formData.billingInfo, cardHolder: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground ml-1">Card Number</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                            <input
                                                type="text"
                                                value={formData.billingInfo.cardNumber}
                                                readOnly
                                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm text-muted-foreground cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground ml-1">Expiry</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                            <input
                                                type="text"
                                                value={formData.billingInfo.expiry}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    billingInfo: { ...formData.billingInfo, expiry: e.target.value }
                                                })}
                                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Plan Status */}
                        <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs uppercase">
                                    {formData.plan}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground uppercase tracking-tight">
                                        {formData.plan} Plan
                                    </p>
                                    <p className="text-[10px] text-muted-foreground tracking-wide font-medium">Your subscription is active</p>
                                </div>
                            </div>
                            <button className="px-4 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary/20 uppercase tracking-wider">
                                Manage Plan
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
