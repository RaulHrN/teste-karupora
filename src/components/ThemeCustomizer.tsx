import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, RotateCcw, Palette, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ColorToken {
  key: string;
  label: string;
  description: string;
}

const COLOR_TOKENS: ColorToken[] = [
  { key: "--primary", label: "Cor Primária", description: "Cor principal da marca. Usada em botões de ação, links ativos, barras de navegação e elementos de destaque. É a identidade visual da sua clínica." },
  { key: "--accent", label: "Cor de Destaque", description: "Cor secundária para realçar elementos interativos como itens de menu selecionados, badges e fundos de hover." },
  { key: "--background", label: "Fundo da Página", description: "Cor de fundo principal de toda a aplicação. Define a base visual da interface." },
  { key: "--foreground", label: "Cor de Títulos e Textos", description: "Cor dos títulos, rótulos e texto principal. É a cor mais forte e legível, usada para o conteúdo mais importante." },
  { key: "--destructive", label: "Cor de Erro / Perigo", description: "Cor usada para alertas de erro, ações destrutivas (excluir, cancelar), cobranças atrasadas e indicadores de problema." },
];

interface ThemePreset {
  name: string;
  colors: Record<string, string>;
  preview: { primary: string; accent: string; bg: string };
}

const PRESETS: ThemePreset[] = [
  {
    name: "Verde Clínico (Padrão)",
    preview: { primary: "hsl(148, 62%, 26%)", accent: "hsl(148, 40%, 93%)", bg: "hsl(0, 0%, 100%)" },
    colors: { "--primary": "148 62% 26%", "--accent": "148 40% 93%", "--background": "0 0% 100%", "--foreground": "150 10% 15%", "--destructive": "0 72% 51%" },
  },
  {
    name: "Azul Profissional",
    preview: { primary: "hsl(220, 70%, 45%)", accent: "hsl(220, 50%, 94%)", bg: "hsl(0, 0%, 100%)" },
    colors: { "--primary": "220 70% 45%", "--accent": "220 50% 94%", "--background": "0 0% 100%", "--foreground": "220 15% 15%", "--destructive": "0 72% 51%" },
  },
  {
    name: "Roxo Moderno",
    preview: { primary: "hsl(270, 60%, 45%)", accent: "hsl(270, 40%, 94%)", bg: "hsl(0, 0%, 100%)" },
    colors: { "--primary": "270 60% 45%", "--accent": "270 40% 94%", "--background": "0 0% 100%", "--foreground": "270 10% 15%", "--destructive": "0 72% 51%" },
  },
  {
    name: "Coral Acolhedor",
    preview: { primary: "hsl(12, 70%, 50%)", accent: "hsl(12, 50%, 94%)", bg: "hsl(0, 0%, 100%)" },
    colors: { "--primary": "12 70% 50%", "--accent": "12 50% 94%", "--background": "0 0% 100%", "--foreground": "12 10% 15%", "--destructive": "0 72% 51%" },
  },
  {
    name: "Dourado Elegante",
    preview: { primary: "hsl(40, 75%, 40%)", accent: "hsl(40, 50%, 94%)", bg: "hsl(0, 0%, 100%)" },
    colors: { "--primary": "40 75% 40%", "--accent": "40 50% 94%", "--background": "0 0% 100%", "--foreground": "40 10% 15%", "--destructive": "0 72% 51%" },
  },
];

function parseHsl(hsl: string): { h: number; s: number; l: number } {
  const parts = hsl.trim().split(/\s+/);
  return { h: parseFloat(parts[0]) || 0, s: parseFloat(parts[1]) || 0, l: parseFloat(parts[2]) || 50 };
}

function hslStringToHex(hsl: string): string {
  const { h, s, l } = parseHsl(hsl);
  const sn = s / 100, ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0 0% 0%";
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s: number;
  const l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** Generate all derived CSS variables (light + dark) from 5 base colors */
export function generateDerivedColors(base: Record<string, string>): { light: Record<string, string>; dark: Record<string, string> } {
  const primary = parseHsl(base["--primary"] || "148 62% 26%");
  const accent = parseHsl(base["--accent"] || "148 40% 93%");
  const bg = parseHsl(base["--background"] || "0 0% 100%");
  const fg = parseHsl(base["--foreground"] || "150 10% 15%");
  const destructive = parseHsl(base["--destructive"] || "0 72% 51%");

  const hsl = (h: number, s: number, l: number) => `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;

  const light: Record<string, string> = {
    "--primary": base["--primary"],
    "--primary-foreground": primary.l > 50 ? hsl(primary.h, 10, 10) : "0 0% 100%",
    "--accent": base["--accent"],
    "--accent-foreground": hsl(primary.h, primary.s, Math.max(primary.l - 6, 15)),
    "--background": base["--background"],
    "--foreground": base["--foreground"],
    "--card": hsl(bg.h, bg.s, bg.l),
    "--card-foreground": base["--foreground"],
    "--popover": hsl(bg.h, bg.s, bg.l),
    "--popover-foreground": base["--foreground"],
    "--secondary": hsl(primary.h, 20, 96),
    "--secondary-foreground": base["--foreground"],
    "--muted": hsl(primary.h, 10, 96),
    "--muted-foreground": hsl(fg.h, 5, 45),
    "--border": hsl(primary.h, 10, 90),
    "--input": hsl(primary.h, 10, 90),
    "--ring": base["--primary"],
    "--destructive": base["--destructive"],
    "--destructive-foreground": "0 0% 100%",
    "--sidebar-background": hsl(primary.h, 15, 98),
    "--sidebar-foreground": hsl(primary.h, 10, 30),
    "--sidebar-primary": base["--primary"],
    "--sidebar-primary-foreground": "0 0% 100%",
    "--sidebar-accent": hsl(primary.h, 30, 94),
    "--sidebar-accent-foreground": hsl(primary.h, primary.s, Math.max(primary.l - 6, 15)),
    "--sidebar-border": hsl(primary.h, 10, 92),
    "--sidebar-ring": base["--primary"],
    "--success": base["--primary"],
    "--success-foreground": "0 0% 100%",
    "--warning": "38 92% 50%",
    "--warning-foreground": "0 0% 100%",
    "--info": "210 80% 52%",
    "--info-foreground": "0 0% 100%",
    "--surface": hsl(primary.h, 15, 97),
    "--surface-foreground": hsl(primary.h, 10, 25),
  };

  const dark: Record<string, string> = {
    "--primary": hsl(primary.h, primary.s, Math.min(primary.l + 14, 55)),
    "--primary-foreground": "0 0% 100%",
    "--accent": hsl(accent.h, Math.max(accent.s - 10, 20), 18),
    "--accent-foreground": hsl(accent.h, 40, 80),
    "--background": hsl(fg.h, 10, 10),
    "--foreground": hsl(primary.h, 10, 92),
    "--card": hsl(fg.h, 10, 12),
    "--card-foreground": hsl(primary.h, 10, 92),
    "--popover": hsl(fg.h, 10, 12),
    "--popover-foreground": hsl(primary.h, 10, 92),
    "--secondary": hsl(fg.h, 10, 16),
    "--secondary-foreground": hsl(primary.h, 10, 92),
    "--muted": hsl(fg.h, 10, 18),
    "--muted-foreground": hsl(primary.h, 5, 55),
    "--border": hsl(fg.h, 10, 20),
    "--input": hsl(fg.h, 10, 20),
    "--ring": hsl(primary.h, primary.s, Math.min(primary.l + 14, 55)),
    "--destructive": hsl(destructive.h, Math.max(destructive.s - 10, 50), Math.max(destructive.l - 6, 40)),
    "--destructive-foreground": "0 0% 100%",
    "--sidebar-background": hsl(fg.h, 10, 8),
    "--sidebar-foreground": hsl(primary.h, 10, 80),
    "--sidebar-primary": hsl(primary.h, primary.s, Math.min(primary.l + 14, 55)),
    "--sidebar-primary-foreground": "0 0% 100%",
    "--sidebar-accent": hsl(primary.h, 20, 16),
    "--sidebar-accent-foreground": hsl(primary.h, 40, 80),
    "--sidebar-border": hsl(fg.h, 10, 18),
    "--sidebar-ring": hsl(primary.h, primary.s, Math.min(primary.l + 14, 55)),
    "--success": hsl(primary.h, primary.s, Math.min(primary.l + 14, 55)),
    "--success-foreground": "0 0% 100%",
    "--warning": "38 80% 50%",
    "--warning-foreground": "0 0% 100%",
    "--info": "210 70% 55%",
    "--info-foreground": "0 0% 100%",
    "--surface": hsl(fg.h, 10, 8),
    "--surface-foreground": hsl(primary.h, 10, 85),
  };

  return { light, dark };
}

function getStoredColors(): Record<string, string> {
  try {
    const stored = localStorage.getItem("app-custom-colors");
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

export function ThemeCustomizer() {
  const { toast } = useToast();
  const [colors, setColors] = useState<Record<string, string>>(() => {
    const stored = getStoredColors();
    if (Object.keys(stored).length > 0) return stored;
    return PRESETS[0].colors;
  });
  const [activePreset, setActivePreset] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredColors();
    if (Object.keys(stored).length > 0) {
      applyAllColors(stored);
    }
  }, []);

  const applyAllColors = (baseColors: Record<string, string>) => {
    const { light, dark } = generateDerivedColors(baseColors);
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const toApply = isDark ? dark : light;
    Object.entries(toApply).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    // Store derived for theme toggle
    localStorage.setItem("app-custom-colors-light", JSON.stringify(light));
    localStorage.setItem("app-custom-colors-dark", JSON.stringify(dark));
  };

  const handleColorChange = useCallback((key: string, hex: string) => {
    const hsl = hexToHsl(hex);
    const newColors = { ...colors, [key]: hsl };
    setColors(newColors);
    setActivePreset(null);
    applyAllColors(newColors);
  }, [colors]);

  const handleApplyPreset = (preset: ThemePreset) => {
    setColors(preset.colors);
    setActivePreset(preset.name);
    applyAllColors(preset.colors);
    toast({ title: "Paleta aplicada", description: `Tema "${preset.name}" aplicado com sucesso.` });
  };

  const handleSave = () => {
    localStorage.setItem("app-custom-colors", JSON.stringify(colors));
    applyAllColors(colors);
    toast({ title: "Cores salvas", description: "Sua paleta personalizada foi salva com sucesso." });
  };

  const handleReset = () => {
    const defaultColors = PRESETS[0].colors;
    setColors(defaultColors);
    setActivePreset(PRESETS[0].name);
    localStorage.removeItem("app-custom-colors");
    localStorage.removeItem("app-custom-colors-light");
    localStorage.removeItem("app-custom-colors-dark");
    const root = document.documentElement;
    // Remove all inline styles
    const { light } = generateDerivedColors(defaultColors);
    Object.keys(light).forEach((key) => root.style.removeProperty(key));
    toast({ title: "Cores restauradas", description: "Paleta padrão restaurada." });
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Paletas Predefinidas
          </CardTitle>
          <CardDescription>Escolha uma paleta pronta ou personalize as 5 cores principais abaixo.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleApplyPreset(preset)}
                className={`relative flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                  activePreset === preset.name
                    ? "border-primary bg-accent/50 shadow-sm"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex gap-1 shrink-0">
                  <div className="w-6 h-6 rounded-full border border-border/50" style={{ backgroundColor: preset.preview.primary }} />
                  <div className="w-6 h-6 rounded-full border border-border/50" style={{ backgroundColor: preset.preview.accent }} />
                </div>
                <span className="text-sm font-medium text-foreground">{preset.name}</span>
                {activePreset === preset.name && (
                  <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Pré-visualização
          </CardTitle>
          <CardDescription>Veja como as cores ficam em elementos reais da interface.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 space-y-4 bg-background">
            <div className="flex items-center gap-3 flex-wrap">
              <Button>Botão Primário</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="outline">Contorno</Button>
              <Button variant="destructive">Excluir</Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge>Ativo</Badge>
              <Badge variant="secondary">Pendente</Badge>
              <Badge variant="outline">Rascunho</Badge>
              <Badge variant="destructive">Atrasado</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-md bg-card border p-3">
                <p className="text-sm font-medium text-card-foreground">Cartão</p>
                <p className="text-xs text-muted-foreground">Texto secundário</p>
              </div>
              <div className="rounded-md bg-accent p-3">
                <p className="text-sm font-medium text-accent-foreground">Destaque</p>
                <p className="text-xs text-muted-foreground">Elemento ativo</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-medium text-foreground">Suavizado</p>
                <p className="text-xs text-muted-foreground">Área auxiliar</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5 Main Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cores Principais</CardTitle>
          <CardDescription>Altere as 5 cores base e todas as variações serão geradas automaticamente, inclusive para o modo escuro.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {COLOR_TOKENS.map((token, i) => (
            <div key={token.key}>
              {i > 0 && <Separator className="mb-4" />}
              <div className="flex items-start gap-4">
                <div className="shrink-0 pt-0.5">
                  <label htmlFor={`color-${token.key}`} className="cursor-pointer">
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-border shadow-sm relative overflow-hidden"
                      style={{ backgroundColor: `hsl(${colors[token.key] || "0 0% 50%"})` }}
                    >
                      <input
                        id={`color-${token.key}`}
                        type="color"
                        value={hslStringToHex(colors[token.key] || "0 0% 50%")}
                        onChange={(e) => handleColorChange(token.key, e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  </label>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-semibold">{token.label}</Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{token.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <code className="text-[11px] bg-muted px-2 py-1 rounded text-muted-foreground block">
                    {hslStringToHex(colors[token.key] || "0 0% 50%").toUpperCase()}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleReset} className="gap-1.5">
          <RotateCcw className="h-4 w-4" />
          Restaurar Padrão
        </Button>
        <Button onClick={handleSave} className="gap-1.5">
          <Check className="h-4 w-4" />
          Salvar Paleta
        </Button>
      </div>
    </div>
  );
}
