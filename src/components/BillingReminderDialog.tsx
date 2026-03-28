import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, MessageCircle, Copy, Check, Send, QrCode, FileText } from "lucide-react";
import { Transaction } from "@/data/financeiro";
import { format, parseISO, differenceInDays } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface BillingReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
}

const MOCK_PIX_CODE = "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540525.005802BR5925CLINICA NUTRICAO SAUDE6009SAO PAULO62070503***6304A1B2";
const MOCK_BOLETO_CODE = "23793.38128 60000.000003 00000.000402 1 92340000025000";

function generatePixQRData() {
  return MOCK_PIX_CODE;
}

export function BillingReminderDialog({ open, onOpenChange, transaction }: BillingReminderDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "boleto">("pix");
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedBoleto, setCopiedBoleto] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingWhatsapp, setSendingWhatsapp] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);

  const daysOverdue = differenceInDays(new Date(), parseISO(transaction.dueDate));

  const copyToClipboard = (text: string, type: "pix" | "boleto") => {
    navigator.clipboard.writeText(text);
    if (type === "pix") {
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    } else {
      setCopiedBoleto(true);
      setTimeout(() => setCopiedBoleto(false), 2000);
    }
    toast({ title: "Copiado!", description: `Código ${type === "pix" ? "Pix" : "do boleto"} copiado.` });
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSendingEmail(false);
    setEmailSent(true);
    toast({
      title: "Email enviado",
      description: `Cobrança enviada por email para ${transaction.patientName}.`,
    });
  };

  const handleSendWhatsapp = async () => {
    setSendingWhatsapp(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSendingWhatsapp(false);
    setWhatsappSent(true);
    toast({
      title: "WhatsApp enviado",
      description: `Cobrança enviada por WhatsApp para ${transaction.patientName}.`,
    });
  };

  const messagePreview = `Olá ${transaction.patientName.split(" ")[0]}, tudo bem?\n\nIdentificamos que a cobrança referente a "${transaction.description}" no valor de R$ ${transaction.value.toFixed(2)}, com vencimento em ${format(parseISO(transaction.dueDate), "dd/MM/yyyy")}, encontra-se em aberto há ${daysOverdue} dias.\n\nSegue abaixo os dados para pagamento via ${paymentMethod === "pix" ? "Pix" : "Boleto"}:\n\n${paymentMethod === "pix" ? `Código Pix:\n${MOCK_PIX_CODE.slice(0, 50)}...` : `Linha digitável:\n${MOCK_BOLETO_CODE}`}\n\nCaso já tenha efetuado o pagamento, desconsidere esta mensagem.\n\nAtenciosamente,\nClínica Nutrição & Saúde`;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setEmailSent(false); setWhatsappSent(false); } }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Enviar Cobrança
          </DialogTitle>
          <DialogDescription>
            Envie um lembrete de pagamento para <strong>{transaction.patientName}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Transaction Summary */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Descrição</span>
              <span className="text-sm font-medium">{transaction.description}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Valor</span>
              <span className="text-sm font-bold text-foreground">R$ {transaction.value.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Vencimento</span>
              <span className="text-sm">{format(parseISO(transaction.dueDate), "dd/MM/yyyy")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Atraso</span>
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                {daysOverdue} dias
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Método de pagamento</h4>
          <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "pix" | "boleto")}>
            <TabsList className="w-full">
              <TabsTrigger value="pix" className="flex-1 gap-1.5">
                <QrCode className="h-4 w-4" />
                Pix
              </TabsTrigger>
              <TabsTrigger value="boleto" className="flex-1 gap-1.5">
                <FileText className="h-4 w-4" />
                Boleto
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pix" className="space-y-3 mt-3">
              {/* Mock QR Code */}
              <div className="flex justify-center">
                <div className="w-40 h-40 bg-muted rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">QR Code Pix</span>
                </div>
              </div>
              <div className="relative">
                <code className="block text-xs bg-muted p-3 rounded-md break-all text-muted-foreground leading-relaxed max-h-20 overflow-y-auto">
                  {MOCK_PIX_CODE}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 h-7 w-7 p-0"
                  onClick={() => copyToClipboard(MOCK_PIX_CODE, "pix")}
                >
                  {copiedPix ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="boleto" className="space-y-3 mt-3">
              <div className="flex justify-center">
                <div className="w-full h-20 bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center gap-2">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Boleto bancário (simulado)</span>
                </div>
              </div>
              <div className="relative">
                <code className="block text-xs bg-muted p-3 rounded-md break-all text-muted-foreground leading-relaxed">
                  {MOCK_BOLETO_CODE}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 h-7 w-7 p-0"
                  onClick={() => copyToClipboard(MOCK_BOLETO_CODE, "boleto")}
                >
                  {copiedBoleto ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Separator />

        {/* Message Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Prévia da mensagem</h4>
          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground whitespace-pre-line max-h-32 overflow-y-auto border">
            {messagePreview}
          </div>
        </div>

        <Separator />

        {/* Send Buttons */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleSendEmail}
            disabled={sendingEmail || emailSent}
            className="gap-2"
          >
            {emailSent ? (
              <><Check className="h-4 w-4" /> Email enviado</>
            ) : sendingEmail ? (
              <><span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" /> Enviando...</>
            ) : (
              <><Mail className="h-4 w-4" /> Enviar por Email</>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleSendWhatsapp}
            disabled={sendingWhatsapp || whatsappSent}
            className="gap-2 border-green-500/30 text-green-700 hover:bg-green-50 hover:text-green-800"
          >
            {whatsappSent ? (
              <><Check className="h-4 w-4" /> WhatsApp enviado</>
            ) : sendingWhatsapp ? (
              <><span className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full" /> Enviando...</>
            ) : (
              <><MessageCircle className="h-4 w-4" /> Enviar por WhatsApp</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
