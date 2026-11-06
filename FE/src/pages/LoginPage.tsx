import { Glasses, PackageCheck, ReceiptText, ShieldCheck } from "lucide-react"
import { Navigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { useAuth } from "@/features/auth/hooks/use-auth"

const OPERATIONAL_PILLARS = [
  {
    icon: PackageCheck,
    title: "Katalog & Kartu Stok Terlacak",
    description: "Setiap frame, lensa jadi, dan kacamata jadi memiliki SKU otomatis dan riwayat mutasi yang dapat direkonsiliasi.",
  },
  {
    icon: ReceiptText,
    title: "Pencatatan Faktur Supplier Atomik",
    description: "Pembelian dari supplier tercatat lengkap bersama nomor faktur, harga beli satuan, dan penambahan stok otomatis.",
  },
  {
    icon: ShieldCheck,
    title: "Otorisasi & Jejak Aktivitas",
    description: "Pembagian wewenang Owner dan Pegawai ditegakkan di server beserta pencatatan log aktivitas penting.",
  },
] as const

export function LoginPage() {
  const { status } = useAuth()

  if (status === "authenticated") {
    return <Navigate to="/" replace />
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4 md:p-8">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border bg-card shadow-xs lg:grid-cols-12">
        <section
          aria-label="Identitas sistem Optik Raihan"
          className="flex flex-col justify-between gap-6 border-b bg-secondary/45 p-6 md:p-8 lg:col-span-7 lg:border-r lg:border-b-0"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground ring-2 ring-brand-accent/40"
              >
                <Glasses className="size-5" />
              </span>
              <div>
                <p className="text-[11px] font-semibold tracking-widest text-primary-text uppercase">
                  Toko Kacamata Raihan
                </p>
                <p className="font-serif text-xl font-semibold tracking-tight">Optik Raihan</p>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <h2 className="font-serif text-2xl leading-snug font-semibold tracking-tight md:text-3xl">
                Ruang Kerja Operasional Katalog, Pembelian &amp; Inventaris Optik
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Dirancang khusus untuk ketelitian stok toko optik—mulai dari pencatatan master barang, verifikasi faktur
                pembelian supplier, hingga kartu stok per model.
              </p>
            </div>
          </div>

          <dl className="grid gap-3 border-t pt-5">
            {OPERATIONAL_PILLARS.map((pillar) => (
              <div key={pillar.title} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border bg-card text-primary-text"
                >
                  <pillar.icon className="size-3.5" />
                </span>
                <div className="text-xs leading-relaxed">
                  <dt className="font-semibold text-foreground">{pillar.title}</dt>
                  <dd className="text-muted-foreground">{pillar.description}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        <div className="flex flex-col justify-center p-6 md:p-8 lg:col-span-5">
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 pt-0">
              <span className="text-[11px] font-semibold tracking-widest text-primary-text uppercase">
                Autentikasi Internal
              </span>
              <CardTitle>
                <h1 className="font-serif text-2xl font-semibold tracking-tight">Masuk</h1>
              </CardTitle>
              <CardDescription>Gunakan akun resmi yang diberikan oleh owner toko.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <LoginForm />
              <p className="mt-6 border-t pt-4 text-xs leading-relaxed text-muted-foreground">
                Sesi kerja diamankan dengan cookie HttpOnly. Hubungi owner toko apabila Anda memerlukan pembuatan akun
                baru atau pengaturan ulang password.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
