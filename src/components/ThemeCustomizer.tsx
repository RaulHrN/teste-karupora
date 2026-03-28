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
  category: "brand" | "surfaces" | "feedback" | "text";
}

const COLOR_TOKENS: ColorToken[] = [
  // Brand
  { key: "--primary", label: "Cor Primária", description: "Cor principal da marca. Usada em botões de ação, links ativos, barras de navegação e elementos de destaque. É a identidade visual da sua clínica.", category: "brand" },
  { key: "--primary-foreground", label: "Texto sobre Primária", description: "Cor do texto e ícones exibidos sobre a cor primária. Deve ter alto contraste para boa legibilidade (geralmente branco).", category: "brand" },
  { key: "--accent", label: "Cor de Destaque", description: "Cor secundária utilizada para realçar elementos interativos como itens de menu selecionados, badges e fundos de hover. Complementa a cor primária.", category: "brand" },
  { key: "--accent-foreground", label: "Texto sobre Destaque", description: "Cor do texto exibido sobre a cor de destaque. Deve contrastar bem com a cor de destaque para manter a legibilidade.", category: "brand" },
  { key: "--ring", label: "Cor de Foco", description: "Anel de foco que aparece ao navegar com teclado ou clicar em campos de formulário. Indica qual elemento está ativo. Geralmente igual à cor primária.", category: "brand" },

  // Surfaces
  { key: "--background", label: "Fundo da Página", description: "Cor de fundo principal de toda a aplicação. Define a base visual da interface. Branco para temas claros, tons escuros para temas noturnos.", category: "surfaces" },
  { key: "--card", label: "Fundo de Cartões", description: "Cor de fundo dos cartões, painéis e caixas de conteúdo. Levemente diferente do fundo da página para criar hierarquia visual e profundidade.", category: "surfaces" },
  { key: "--secondary", label: "Fundo Secundário", description: "Cor de fundo para botões secundários, abas inativas e áreas auxiliares. Mais sutil que a cor primária, usada para ações de menor destaque.", category: "surfaces" },
  { key: "--muted", label: "Fundo Suavizado", description: "Cor de fundo muito sutil para áreas de menor importância, como placeholders, inputs desabilitados e seções informativas de apoio.", category: "surfaces" },
  { key: "--border", label: "Bordas e Divisórias", description: "Cor das linhas divisórias, bordas de cartões, separadores de tabela e contornos de campos de formulário. Deve ser sutil e não competir com o conteúdo.", category: "surfaces" },
  { key: "--sidebar-background", label: "Fundo da Barra Lateral", description: "Cor de fundo exclusiva do menu lateral de navegação. Pode ser levemente diferente do fundo principal para delimitar visualmente a área de navegação.", category: "surfaces" },

  // Text
  { key: "--foreground", label: "Cor de Títulos e Texto Principal", description: "Cor dos títulos, rótulos e texto principal da interface. É a cor mais forte e legível, usada para o conteúdo mais importante da tela.", category: "text" },
  { key: "--muted-foreground", label: "Texto Secundário e Descrições", description: "Cor para textos de apoio, descrições, legendas, placeholders e informações complementares. Mais claro que o texto principal para criar hierarquia.", category: "text" },
  { key: "--card-foreground", label: "Texto dentro de Cartões", description: "Cor do texto exibido dentro de cartões e painéis. Geralmente igual ao texto principal, mas pode ser ajustado se os cartões tiverem fundo diferente.", category: "text" },
  { key: "--secondary-foreground", label: "Texto sobre Fundo Secundário", description: "Cor do texto exibido sobre fundos secundários, como botões de ação alternativa e abas inativas.", category: "text" },

  // Feedback
  { key: "--destructive", label: "Cor de Erro / Perigo", description: "Cor usada para alertas de erro, ações destrutivas (excluir, cancelar), cobranças atrasadas e indicadores de problema. Vermelho é o padrão.", category: "feedback" },
  { key: "--success", label: "Cor de Sucesso", description: "Indica ações concluídas com sucesso, pagamentos confirmados, metas atingidas e status positivos. Verde é a convenção.", category: "feedback" },
  { key: "--warning", label: "Cor de Alerta / Atenção", description: "Sinaliza avisos, pendências, prazos próximos e situações que exigem atenção sem ser um erro. Amarelo/laranja é o padrão.", category: "feedback" },
  { key: "--info", label: "Cor Informativa", description: "Usada para dicas, informações neutras, badges de status e projeções. Azul é a convenção, transmitindo neutralidade e confiança.", category: "feedback" },
];

const CATEGORY_LABELS: Record<string, { label: string; description: string }> = {
  brand: { label: "Identidade da Marca", description: "As cores que definem a personalidade visual da sua clínica" },
  surfaces: { label: "Fundos e Superfícies", description: "Cores de fundo das diferentes áreas e camadas da interface" },
  text: { label: "Textos e Tipografia", description: "Cores aplicadas a títulos, parágrafos, descrições e rótulos" },
  feedback: { label: "Feedback e Status", description: "Cores que comunicam estados: sucesso, erro, alerta e informação" },
};

interface ThemePreset {
  name: string;
  colors: Record<string, string>;
  preview: { primary: string; accent: string; bg: string };
}

const PRESETS: ThemePreset[] = [
  {
    name: "Verde Clínico (Padrão)",
    preview: { primary: "hsl(148, 62%, 26%)", accent: "hsl(148, 40%, 93%)", bg: "hsl(0, 0%, 100%)" },
    colors: {
      "--primary": "148 62% 26%",
      "--primary-foreground": "0 0% 100%",
      "--accent": "148 40% 93%",
      "--accent-foreground": "148 62% 20%",
      "--ring": "148 62% 26%",
      "--background": "0 0% 100%",
      "--foreground": "150 10% 15%",
      "--card": "0 0% 100%",
      "--card-foreground": "150 10% 15%",
      "--secondary": "140 20% 96%",
      "--secondary-foreground": "150 10% 15%",
      "--muted": "140 10% 96%",
      "--muted-foreground": "150 5% 45%",
      "--border": "140 10% 90%",
      "--sidebar-background": "150 15% 98%",
      "--destructive": "0 72% 51%",
      "--success": "148 62% 26%",
      "--warning": "38 92% 50%",
      "--info": "210 80% 52%",
    },
  },
  {
    name: "Azul Profissional",
    preview: { primary: "hsl(220, 70%, 45%)", accent: "hsl(220, 50%, 94%)", bg: "hsl(0, 0%, 100%)" },
    colors: {
      "--primary": "220 70% 45%",
      "--primary-foreground": "0 0% 100%",
      "--accent": "220 50% 94%",
      "--accent-foreground": "220 70% 30%",
      "--ring": "220 70% 45%",
      "--background": "0 0% 100%",
      "--foreground": "220 15% 15%",
      "--card": "0 0% 100%",
      "--card-foreground": "220 15% 15%",
      "--secondary": "220 20% 96%",
      "--secondary-foreground": "220 15% 15%",
      "--muted": "220 10% 96%",
      "--muted-foreground": "220 5% 45%",
      "--border": "220 10% 90%",
      "--sidebar-background": "220 15% 98%",
      "--destructive": "0 72% 51%",
      "--success": "148 62% 30%",
      "--warning": "38 92% 50%",
      "--info": "210 80% 52%",
    },
  },
  {
    name: "Roxo Moderno",
    preview: { primary: "hsl(270, 60%, 45%)", accent: "hsl(270, 40%, 94%)", bg: "hsl(0, 0%, 100%)" },
    colors: {
      "--primary": "270 60% 45%",
      "--primary-foreground": "0 0% 100%",
      "--accent": "270 40% 94%",
      "--accent-foreground": "270 60% 30%",
      "--ring": "270 60% 45%",
      "--background": "0 0% 100%",
      "--foreground": "270 10% 15%",
      "--card": "0 0% 100%",
      "--card-foreground": "270 10% 15%",
      "--secondary": "270 15% 96%",
      "--secondary-foreground": "270 10% 15%",
      "--muted": "270 10% 96%",
      "--muted-foreground": "270 5% 45%",
      "--border": "270 10% 90%",
      "--sidebar-background": "270 10% 98%",
      "--destructive": "0 72% 51%",
      "--success": "148 62% 30%",
      "--warning": "38 92% 50%",
      "--info": "210 80% 52%",
    },
  },
  {
    name: "Coral Acolhedor",
    preview: { primary: "hsl(12, 70%, 50%)", accent: "hsl(12, 50%, 94%)", bg: "hsl(0, 0%, 100%)" },
    colors: {
      "--primary": "12 70% 50%",
      "--primary-foreground": "0 0% 100%",
      "--accent": "12 50% 94%",
      "--accent-foreground": "12 70% 30%",
      "--ring": "12 70% 50%",
      "--background": "0 0% 100%",
      "--foreground": "12 10% 15%",
      "--card": "0 0% 100%",
      "--card-foreground": "12 10% 15%",
      "--secondary": "12 15% 96%",
      "--secondary-foreground": "12 10% 15%",
      "--muted": "12 10% 96%",
      "--muted-foreground": "12 5% 45%",
      "--border": "12 10% 90%",
      "--sidebar-background": "12 10% 98%",
      "--destructive": "0 72% 51%",
      "--success": "148 62% 30%",
      "--warning": "38 92% 50%",
      "--info": "210 80% 52%",
    },
  },
  {
    name: "Dourado Elegante",
    preview: { primary: "hsl(40, 75%, 40%)", accent: "hsl(40, 50%, 94%)", bg: "hsl(0, 0%, 100%)" },
    colors: {
      "--primary": "40 75% 40%",
      "--primary-foreground": "0 0% 100%",
      "--accent": "40 50% 94%",
      "--accent-foreground": "40 75% 25%",
      "--ring": "40 75% 40%",
      "--background": "0 0% 100%",
      "--foreground": "40 10% 15%",
      "--card": "0 0% 100%",
      "--card-foreground": "40 10% 15%",
      "--secondary": "40 15% 96%",
      "--secondary-foreground": "40 10% 15%",
      "--muted": "40 10% 96%",
      "--muted-foreground": "40 5% 45%",
      "--border": "40 10% 90%",
      "--sidebar-background": "40 10% 98%",
      "--destructive": "0 72% 51%",
      "--success": "148 62% 30%",
      "--warning": "38 92% 50%",
      "--info": "210 80% 52%",
    },
  },
];

function hslStringToHex(hsl: string): string {
  const parts = hsl.trim().split(/\s+/);
  if (parts.length < 3) return "#1A6B3C";
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
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

  if (max === min) {
    h = s = 0;
  } else {
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

function getStoredColors(): Record<string, string> {
  try {
    const stored = localStorage.getItem("app-custom-colors");
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function applyColors(colors: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
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
      applyColors(stored);
    }
  }, []);

  const handleColorChange = useCallback((key: string, hex: string) => {
    const hsl = hexToHsl(hex);
    setColors((prev) => ({ ...prev, [key]: hsl }));
    setActivePreset(null);
    document.documentElement.style.setProperty(key, hsl);
  }, []);

  const handleApplyPreset = (preset: ThemePreset) => {
    setColors(preset.colors);
    setActivePreset(preset.name);
    applyColors(preset.colors);
    toast({ title: "Paleta aplicada", description: `Tema "${preset.name}" aplicado com sucesso.` });
  };

  const handleSave = () => {
    localStorage.setItem("app-custom-colors", JSON.stringify(colors));
    toast({ title: "Cores salvas", description: "Sua paleta personalizada foi salva com sucesso." });
  };

  const handleReset = () => {
    const defaultColors = PRESETS[0].colors;
    setColors(defaultColors);
    setActivePreset(PRESETS[0].name);
    applyColors(defaultColors);
    localStorage.removeItem("app-custom-colors");
    // Remove inline styles to go back to CSS defaults
    const root = document.documentElement;
    Object.keys(defaultColors).forEach((key) => root.style.removeProperty(key));
    toast({ title: "Cores restauradas", description: "Paleta padrão restaurada." });
  };

  const categories = ["brand", "surfaces", "text", "feedback"] as const;

  return (
    <div className="space-y-6">
      {/* Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Paletas Predefinidas
          </CardTitle>
          <CardDescription>Escolha uma paleta pronta ou personalize cada cor individualmente abaixo.</CardDescription>
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
          <CardDescription>Veja como as cores aplicadas ficam em elementos reais da interface.</CardDescription>
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

      {/* Per-category color editors */}
      {categories.map((cat) => {
        const meta = CATEGORY_LABELS[cat];
        const tokens = COLOR_TOKENS.filter((t) => t.category === cat);
        return (
          <Card key={cat}>
            <CardHeader>
              <CardTitle className="text-lg">{meta.label}</CardTitle>
              <CardDescription>{meta.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tokens.map((token, i) => (
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
                        <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{token.key}</code>
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
        );
      })}

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
