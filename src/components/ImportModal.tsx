"use client";

import { X, Upload, FileText, Search, Mail, Loader2 } from "lucide-react";
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
}

export function ImportModal({ isOpen, onClose, onImport, loading, bankLoaded, bookLoaded }: ImportModalProps) {
    const [tab, setTab] = useState<"bank" | "book">("bank");
    const [country, setCountry] = useState("Colombia 🇨🇴");
    const [source, setSource] = useState<"file" | "ai" | "gmail">("ai");
    const [text, setText] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (bankLoaded && !bookLoaded) setTab("book");
            else if (bookLoaded && !bankLoaded) setTab("bank");
        }
    }, [isOpen, bankLoaded, bookLoaded]);

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
            reader.onload = async (event) => {
                const arrayBuffer = event.target?.result as ArrayBuffer;
                try {
                    // Extract text and import immediately (One-Click)
                    const extractedText = await extractTextFromPdf(arrayBuffer);

                    if (!extractedText || extractedText.trim().length < 10) {
                        alert("Este PDF parece ser una imagen o escáner (sin texto). Por favor, usa la opción de 'Archivo' y selecciona el PDF para que la IA lo lea como imagen.");
                        return;
                    }

                    onImport(tab, "file", extractedText, false, country);
                } catch (err) {
                    console.error("PDF Extraction failed:", err);
                    alert("No se pudo extraer el texto del PDF automáticamente. Intenta con una imagen o copia el texto.");
                }
            };
            reader.readAsArrayBuffer(file);
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
                        { id: "file", label: "Archivo", icon: Upload },
                        { id: "ai", label: "Escáner IA", icon: Search },
                        { id: "gmail", label: "Gmail Sync", icon: Mail },
                    ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setSource(s.id as any)}
                            className={cn(
                                "pb-3 text-sm font-bold transition-all border-b-2",
                                source === s.id ? "border-primary text-primary" : "border-transparent text-gray-400"
                            )}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-8">
                    {source === "file" && (
                        <div className="space-y-4">
                            <label className="border-2 border-dashed border-base-200 rounded-[24px] p-12 flex flex-col items-center justify-center gap-4 bg-base-200/50 hover:bg-base-200 transition-colors cursor-pointer group">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".txt,.csv,.json,.pdf,.png,.jpg,.jpeg"
                                    onChange={handleFileChange}
                                />
                                <div className="w-12 h-12 bg-base-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-sm font-bold text-gray-500 text-center">
                                    Subir PDF, Imagen o Texto<br />
                                    <span className="text-[10px] opacity-60 font-normal">Soporta capturas de pantalla de extractos</span>
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
                            ></textarea>
                            <button
                                onClick={() => {
                                    alert(`Click en Procesar: Tab=${tab}, Source=${source}, TextLen=${text.length}`);
                                    onImport(tab, source, text, false, country);
                                }}
                                disabled={loading || !text.trim()}
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

            </div>
        </div>
    );
}
