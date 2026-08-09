'use client';

import { useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowUpDown,
  PackageX,
  Plus,
  SlidersHorizontal,
  Truck,
  Package,
} from 'lucide-react';

import { Header } from '@/components/layout/Header';
import { StatCard, StatCardGrid } from '@/components/layout/StatCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const CORES = [
  { token: '--background', valor: '#FFFFFF', classe: 'bg-background' },
  { token: '--muted', valor: '#F8F9FB', classe: 'bg-muted' },
  { token: '--foreground', valor: '#1A1A1A', classe: 'bg-foreground' },
  { token: '--muted-foreground', valor: '#6B7280', classe: 'bg-muted-foreground' },
  { token: '--border', valor: '#E5E7EB', classe: 'bg-border' },
  { token: '--primary', valor: '#111111', classe: 'bg-primary' },
  { token: '--success', valor: '#16A34A', classe: 'bg-success' },
  { token: '--warning', valor: '#EA580C', classe: 'bg-warning' },
  { token: '--destructive', valor: '#DC2626', classe: 'bg-destructive' },
  { token: '--sidebar', valor: '#111111', classe: 'bg-sidebar' },
];

const ESPACAMENTO = [
  { classe: 'p-1', px: '4px', w: 'w-1' },
  { classe: 'p-2', px: '8px', w: 'w-2' },
  { classe: 'p-3', px: '12px', w: 'w-3' },
  { classe: 'p-4', px: '16px', w: 'w-4' },
  { classe: 'p-5', px: '20px', w: 'w-5' },
  { classe: 'p-6', px: '24px', w: 'w-6' },
  { classe: 'p-8', px: '32px', w: 'w-8' },
  { classe: 'p-10', px: '40px', w: 'w-10' },
];

const PRODUTOS_EXEMPLO = [
  { nome: 'Notebook 14"', categoria: 'Eletrônicos', qtd: 92, status: 'Em estoque' as const },
  { nome: 'Café torrado 500g', categoria: 'Alimentos', qtd: 8, status: 'Estoque baixo' as const },
  { nome: 'Camiseta básica P', categoria: 'Vestuário', qtd: 0, status: 'Esgotado' as const },
];

const STATUS_VARIANT = {
  'Em estoque': 'success',
  'Estoque baixo': 'warning',
  Esgotado: 'destructive',
} as const;

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-h2">{title}</h2>
      {description && <p className="mt-1 text-body text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/**
 * Vitrine do design system: mostra os tokens aplicados e todos os componentes
 * disponíveis. Serve de referência visual ao construir novas telas.
 */
export default function DesignSystemPage() {
  const [busca, setBusca] = useState('');

  return (
    <>
      <Header
        title="Design System"
        description="Tokens e componentes usados nas telas do sistema."
        searchPlaceholder="Buscar componente..."
        searchValue={busca}
        onSearchChange={setBusca}
        actions={
          <>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              <ArrowUpDown aria-hidden />
              Ordenar
            </Button>
            <Button variant="outline" size="sm">
              <SlidersHorizontal aria-hidden />
              <span className="hidden sm:inline">Filtrar</span>
            </Button>
            <Button size="sm">
              <Plus aria-hidden />
              Ação primária
            </Button>
          </>
        }
      />

      <Section title="Cores" description="Tokens declarados em app/globals.css.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {CORES.map((cor) => (
            <div key={cor.token} className="rounded-lg border border-border p-3">
              <div className={`h-12 rounded-md border border-border ${cor.classe}`} />
              <p className="mt-2 font-mono text-xs text-foreground">{cor.token}</p>
              <p className="font-mono text-xs text-muted-foreground">{cor.valor}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tipografia" description="Escala aplicada com utilitários do Tailwind.">
        <Card className="divide-y divide-border">
          {[
            { classe: 'text-h1', amostra: 'Título de página (28px / 600)' },
            { classe: 'text-h2', amostra: 'Subtítulo de seção (20px / 600)' },
            { classe: 'text-h3', amostra: 'Título de card (16px / 600)' },
            { classe: 'text-body', amostra: 'Texto padrão (14px / 400)' },
            { classe: 'caption', amostra: 'Rótulo em caixa alta (12px)' },
            { classe: 'text-stat', amostra: '1.284' },
          ].map((linha) => (
            <div key={linha.classe} className="flex flex-wrap items-baseline gap-4 p-4">
              <code className="w-32 shrink-0 font-mono text-xs text-muted-foreground">
                {linha.classe}
              </code>
              <span className={linha.classe}>{linha.amostra}</span>
            </div>
          ))}
        </Card>
      </Section>

      <Section title="Espaçamento, raio e sombra">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <p className="caption">Escala de 4px</p>
            <div className="mt-4 space-y-2">
              {ESPACAMENTO.map((item) => (
                <div key={item.classe} className="flex items-center gap-3">
                  <code className="w-10 font-mono text-xs text-muted-foreground">
                    {item.classe}
                  </code>
                  <span className={`h-3 ${item.w} rounded-sm bg-foreground`} />
                  <span className="text-xs text-muted-foreground">{item.px}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <p className="caption">Raio e sombra</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="text-center">
                <div className="grid size-20 place-items-center rounded-sm border border-border bg-muted text-xs">
                  6px
                </div>
                <code className="mt-2 block font-mono text-xs text-muted-foreground">
                  rounded-sm
                </code>
              </div>
              <div className="text-center">
                <div className="grid size-20 place-items-center rounded-md border border-border bg-muted text-xs">
                  8px
                </div>
                <code className="mt-2 block font-mono text-xs text-muted-foreground">
                  rounded-md
                </code>
              </div>
              <div className="text-center">
                <div className="grid size-20 place-items-center rounded-lg border border-border bg-muted text-xs">
                  12px
                </div>
                <code className="mt-2 block font-mono text-xs text-muted-foreground">
                  rounded-lg
                </code>
              </div>
              <div className="text-center">
                <div className="grid size-20 place-items-center rounded-lg bg-card text-xs shadow-card">
                  card
                </div>
                <code className="mt-2 block font-mono text-xs text-muted-foreground">
                  shadow-card
                </code>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section
        title="StatCard"
        description="Faixa de indicadores no topo das listagens (dados ilustrativos)."
      >
        <StatCardGrid>
          <StatCard label="Total de produtos" value="352" unit="itens" icon={Package} />
          <StatCard
            label="Estoque baixo"
            value="14"
            hint="abaixo do mínimo"
            tone="warning"
            icon={AlertTriangle}
          />
          <StatCard label="Esgotados" value="3" tone="destructive" icon={PackageX} />
          <StatCard label="Fornecedores ativos" value="27" tone="success" icon={Truck} />
        </StatCardGrid>
      </Section>

      <Section title="Botões">
        <Card className="flex flex-wrap items-center gap-3 p-5">
          <Button>Primária</Button>
          <Button variant="secondary">Secundária</Button>
          <Button variant="outline">Contorno</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button variant="destructive">Excluir</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Pequeno</Button>
          <Button size="icon" aria-label="Adicionar">
            <Plus aria-hidden />
          </Button>
          <Button disabled>Desabilitado</Button>
        </Card>
      </Section>

      <Section title="Formulário">
        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="ds-nome" className="text-body font-medium">
              Nome do produto
            </label>
            <Input id="ds-nome" placeholder="Ex.: Café torrado 500g" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="ds-categoria" className="text-body font-medium">
              Categoria
            </label>
            <Select>
              <SelectTrigger id="ds-categoria">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                <SelectItem value="alimentos">Alimentos</SelectItem>
                <SelectItem value="vestuario">Vestuário</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </Section>

      <Section title="Badges de status">
        <Card className="flex flex-wrap items-center gap-3 p-5">
          <Badge variant="success" dot>
            Em estoque
          </Badge>
          <Badge variant="warning" dot>
            Estoque baixo
          </Badge>
          <Badge variant="destructive" dot>
            Esgotado
          </Badge>
          <Badge variant="secondary">Eletrônicos</Badge>
          <Badge variant="outline">Sem fornecedor</Badge>
          <Badge>Novo</Badge>
        </Card>
      </Section>

      <Section title="Tabela">
        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRODUTOS_EXEMPLO.map((produto) => (
                <TableRow key={produto.nome}>
                  <TableCell className="font-medium">{produto.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{produto.categoria}</TableCell>
                  <TableCell className="text-right tabular-nums">{produto.qtd}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[produto.status]} dot>
                      {produto.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Section>

      <Section title="Sobreposições e carregamento">
        <Card className="flex flex-wrap items-center gap-3 p-5">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Abrir Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo produto</DialogTitle>
                <DialogDescription>
                  Formulários de cadastro e edição usam este modal.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-1.5">
                <label htmlFor="ds-dialog-nome" className="text-body font-medium">
                  Nome
                </label>
                <Input id="ds-dialog-nome" placeholder='Ex.: Notebook 14"' />
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Abrir Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Detalhes</SheetTitle>
                <SheetDescription>
                  Painel lateral usado para detalhes e para o menu em telas pequenas.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            onClick={() => toast.success('Fornecedor cadastrado com sucesso!')}
          >
            Toast de sucesso
          </Button>
          <Button variant="outline" onClick={() => toast.error('CNPJ já cadastrado no sistema.')}>
            Toast de erro
          </Button>

          <div className="flex w-full flex-col gap-2 pt-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </Card>
      </Section>
    </>
  );
}
