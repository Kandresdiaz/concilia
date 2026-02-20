"use client";

import { X, Upload, FileText, Search, Mail, Loader2, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { extractTextFromPdf } from "@/lib/pdf";

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (type: "bank" | "book", source: string, content: string, isImage: boolean, country: string) => void;
    loading: boolean;
    bankLoaded?: boolean;
    bookLoaded?: boolean;
    usageCount: number;
    limit: number;
    role?: string;
    onUpgrade: () => void;
}

export function ImportModal({
    isOpen,
    onClose,
    onImport,
    loading,
    bankLoaded,
    bookLoaded,
    usageCount,
    limit,
    role,
    onUpgrade
}: ImportModalProps) {
    const isAdmin = role === "admin" || role === "superadmin";
    const isLimited = !isAdmin && usageCount >= limit;
    const [tab, setTab] = useState<"bank" | "book">("bank");
    const [country, setCountry] = useState("Colombia 🇨🇴");
    const [source, setSource] = useState<"file" | "ai" | "gmail">("file");
    const [text, setText] = useState("");
    const [password, setPassword] = useState("");
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (bankLoaded && !bookLoaded) setTab("book");
            else if (bookLoaded && !bankLoaded) setTab("bank");
        }
    }, [isOpen, bankLoaded, bookLoaded]);

    const processPdf = async (file: File, pwd?: string) => {
        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            if (!arrayBuffer) {
                alert("No se pudo leer el contenido del archivo.");
                setIsProcessing(false);
                return;
            }

            try {
                const extractedText = await extractTextFromPdf(arrayBuffer, pwd);

                if (!extractedText || extractedText.trim().length < 5) {
                    alert("No logramos extraer texto de este documento. Si es un escaneo o imagen, por favor súbelo como Imagen directa.");
                    setIsProcessing(false);
                    return;
                }

                await onImport(tab, "file", extractedText, false, country);
                setPendingFile(null);
                setShowPasswordInput(false);
                setPassword("");
            } catch (err: any) {
                console.error("PDF extraction error details:", err);
                const isPasswordError = err.name === 'PasswordException' ||
                    err.message?.toLowerCase().includes('password') ||
                    err.code === 1;

                if (isPasswordError) {
                    setPendingFile(file);
                    setShowPasswordInput(true);
                } else {
                    alert(`Ocurrió un error al procesar el PDF: ${err.message || "Error desconocido"}`);
                }
            } finally {
                setIsProcessing(false);
            }
        };
        reader.onerror = () => {
            alert("Error crítico al leer el archivo desde tu dispositivo.");
            setIsProcessing(false);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isImage = file.type.startsWith("image/");
        const isPdf = file.type === "application/pdf";
        const reader = new FileReader();

        if (isImage) {
            reader.onload = (event) => {
                const base64 = (event.target?.result as string).split(",")[1];
                onImport(tab, "file", base64, true, country);
            };
            reader.readAsDataURL(file);
        } else if (isPdf) {
            processPdf(file);
        } else {
            // Text files (CSV, TXT, etc.)
            reader.onload = (event) => {
                const content = event.target?.result as string;
                onImport(tab, "file", content, false, country);
            };
            reader.readAsText(file);
        }
    };

    const countries = [
        { name: "Colombia", emoji: "🇨🇴" },
        { name: "México", emoji: "🇲🇽" },
        { name: "Chile", emoji: "🇨🇱" },
        { name: "Perú", emoji: "🇵🇪" },
        { name: "Argentina", emoji: "🇦🇷" },
        { name: "Otros", emoji: "🌎" }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-base-100 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-8 pb-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Upload className="w-6 h-6 text-primary" />
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">Cargar Datos</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">La IA usará formatos de {country} para mayor precisión</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-base-200 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Country Selector */}
                <div className="px-8 pb-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {countries.map((c) => (
                            <button
                                key={c.name}
                                onClick={() => setCountry(`${c.name} ${c.emoji}`)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border",
                                    country.includes(c.name)
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                                        : "bg-base-200 text-gray-500 border-transparent hover:bg-base-300"
                                )}
                            >
                                {c.emoji} {c.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bank/Book Switcher */}
                <div className="px-8 pb-6">
                    <div className="flex bg-base-200 rounded-2xl p-1.5">
                        <button
                            onClick={() => setTab("bank")}
                            disabled={bankLoaded}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all relative overflow-hidden",
                                tab === "bank" ? "bg-base-100 shadow-sm text-primary" : "text-gray-500 hover:text-gray-700",
                                bankLoaded && "opacity-50 grayscale cursor-not-allowed bg-base-300/30"
                            )}
                        >
                            <FileText className="w-4 h-4" />
                            <span>Banco</span>
                            {bankLoaded && (
                                <span className="absolute top-1 right-2 text-[8px] bg-success text-white px-1.5 rounded-full font-black uppercase">Cargado</span>
                            )}
                        </button>
                        <button
                            onClick={() => setTab("book")}
                            disabled={bookLoaded}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all relative overflow-hidden",
                                tab === "book" ? "bg-base-100 shadow-sm text-primary" : "text-gray-500 hover:text-gray-700",
                                bookLoaded && "opacity-50 grayscale cursor-not-allowed bg-base-300/30"
                            )}
                        >
                            <FileText className="w-4 h-4" />
                            <span>Libro</span>
                            {bookLoaded && (
                                <span className="absolute top-1 right-2 text-[8px] bg-success text-white px-1.5 rounded-full font-black uppercase">Cargado</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Source Switcher */}
                <div className="px-8 flex gap-6 border-b border-base-200">
                    {[
                        { id: "file", label: "Subir Archivo", icon: Upload },
                        { id: "ai", label: "Pegar Texto", icon: Search },
                        { id: "gmail", label: "Gmail Sync", icon: Mail },
                    ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setSource(s.id as any)}
                            className={cn(
                                "pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2",
                                source === s.id ? "border-primary text-primary" : "border-transparent text-gray-400"
                            )}
                        >
                            <s.icon className="w-4 h-4" />
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-8 relative">
                    {isLimited && (
                        <div className="absolute inset-0 z-40 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                            <div className="w-16 h-16 bg-slate-900 rounded-[20px] shadow-2xl flex items-center justify-center text-white mb-6 -rotate-6 animate-bounce">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Límite Alcanzado</h3>
                            <p className="text-sm text-slate-500 font-medium max-w-[280px] mb-8 leading-relaxed">
                                Has consumido tus {limit} conciliaciones mensuales. Actualiza tu plan para seguir ahorrando horas de trabajo.
                            </p>
                            <button
                                onClick={onUpgrade}
                                className="w-full max-w-[280px] bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                            >
                                Actualizar a PRO
                            </button>
                            <button
                                onClick={onClose}
                                className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
                            >
                                Quizás más tarde
                            </button>
                        </div>
                    )}

                    <div className={cn(isLimited && "opacity-20 pointer-events-none")}>
                        {source === "file" && (
                            <div className="space-y-4">
                                <label className="border-2 border-dashed border-base-200 rounded-[24px] p-12 flex flex-col items-center justify-center gap-4 bg-base-200/50 hover:bg-base-200 transition-colors cursor-pointer group">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".txt,.csv,.json,.pdf,.png,.jpg,.jpeg"
                                        onChange={handleFileChange}
                                        disabled={isLimited}
                                    />
                                    <div className="w-12 h-12 bg-base-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        {isProcessing ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : <FileText className="w-6 h-6 text-primary" />}
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 text-center">
                                        {isProcessing ? "Leyendo PDF..." : "Subir PDF, Imagen o Texto"}<br />
                                        <span className="text-[10px] opacity-60 font-normal">{isProcessing ? "Extrayendo texto del documento..." : "Soporta capturas de pantalla de extractos"}</span>
                                    </p>
                                </label>
                            </div>
                        )}

                        {source === "ai" && (
                            <div className="space-y-4">
                                <textarea
                                    className="textarea textarea-bordered w-full h-40 rounded-2xl font-mono text-sm"
                                    placeholder="Pega aquí el texto extraído o cualquier dato desordenado..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    disabled={isLimited}
                                ></textarea>
                                <button
                                    onClick={() => {
                                        onImport(tab, source, text, false, country);
                                    }}
                                    disabled={loading || !text.trim() || isLimited}
                                    className="btn btn-primary btn-block rounded-xl font-bold"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : "Procesar con IA"}
                                </button>
                            </div>
                        )}

                        {source === "gmail" && (
                            <div className="text-center py-12 space-y-4">
                                <Mail className="w-12 h-12 mx-auto text-gray-300" />
                                <p className="text-sm text-gray-500 px-12">Estamos trabajando en la integración con Gmail para automatizar tus extractos.</p>
                                <button className="btn btn-disabled btn-sm rounded-lg">Próximamente</button>
                            </div>
                        )}
                    </div>

                    {showPasswordInput && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full space-y-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900">PDF Protegido</h3>
                                    <p className="text-sm text-slate-500 mt-1">Este archivo requiere contraseña para abrirse.</p>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Contraseña del documento"
                                    className="input input-bordered w-full rounded-xl"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && pendingFile) processPdf(pendingFile, password);
                                    }}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setShowPasswordInput(false);
                                            setPendingFile(null);
                                            setPassword("");
                                        }}
                                        className="btn btn-ghost flex-1 rounded-xl"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => pendingFile && processPdf(pendingFile, password)}
                                        className="btn btn-primary flex-1 rounded-xl font-bold"
                                        disabled={!password || isProcessing}
                                    >
                                        {isProcessing ? <Loader2 className="animate-spin" /> : "Desbloquear"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
