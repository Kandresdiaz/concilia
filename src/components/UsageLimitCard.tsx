
import { AlertCircle, CheckCircle } from 'lucide-react';

interface UsageLimitCardProps {
    usageCount: number;
    tier: 'FREE' | 'PRO';
}

export function UsageLimitCard({ usageCount, tier }: UsageLimitCardProps) {
    const isFree = tier === 'FREE';
    const limit = 5;
    const percentage = Math.min((usageCount / limit) * 100, 100);

    return (
        <div className="card w-full bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
                <h2 className="card-title flex justify-between">
                    <span>Uso Mensual</span>
                    {isFree ? (
                        <span className="badge badge-warning">Plan Gratuito</span>
                    ) : (
                        <span className="badge badge-primary gap-2">
                            <CheckCircle className="w-4 h-4" /> PRO
                        </span>
                    )}
                </h2>

                {isFree ? (
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span>{usageCount} / {limit} conciliaciones</span>
                            <span>{limit - usageCount} restantes</span>
                        </div>
                        <progress
                            className={`progress w-full ${percentage >= 80 ? 'progress-error' : 'progress-primary'}`}
                            value={percentage}
                            max="100"
                        ></progress>

                        {usageCount >= limit ? (
                            <div role="alert" className="alert alert-error">
                                <AlertCircle className="stroke-current shrink-0 h-6 w-6" />
                                <span>Has alcanzado el límite mensual.</span>
                            </div>
                        ) : null}

                        <button className="btn btn-primary btn-block shadow-lg shadow-primary/30 animate-pulse hover:animate-none">
                            Guardar historial para siempre (PRO)
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="alert alert-success">
                            <CheckCircle className="h-6 w-6" />
                            <span>Historial Sincronizado</span>
                        </div>
                        <p className="text-sm opacity-70">
                            Todas tus conciliaciones se guardan automáticamente y son accesibles desde el historial.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
