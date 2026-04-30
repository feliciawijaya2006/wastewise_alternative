<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\PesananDet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PesananController extends Controller
{
    /**
     * Show all pesanan for the authenticated user (pelanggan only).
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Only pelanggan can view their own orders
        if ($user->Restoran) {
            return response()->json(['message' => 'Unauthorized. Only pelanggan can view orders.'], 403);
        }

        $pesanan = Pesanan::with(['detail.menu', 'resto'])
            ->where('Plg', $user->KodeRestoPlg)
            ->orderByDesc('Tgl')
            ->get()
            ->map(function ($p) {
                return [
                    'NoPesanan'   => $p->NoPesanan,
                    'Tgl'         => $p->Tgl,
                    'KodeResto'   => $p->KodeResto,
                    'NamaResto'   => $p->resto?->Nama,
                    'Status'      => $p->Status,
                    'NoUrutPesan' => $p->NoUrutPesan,
                    'detail'      => $p->detail->map(fn($d) => [
                        'KodeMenu'  => $d->Kode,
                        'NamaMenu'  => $d->menu?->NamaMenu,
                        'Jumlah'    => $d->Jumlah,
                        'Harga'     => $d->Harga,
                        'Subtotal'  => $d->Jumlah * $d->Harga,
                    ]),
                    'Total' => $p->detail->sum(fn($d) => $d->Jumlah * $d->Harga),
                ];
            });

        return response()->json(['data' => $pesanan]);
    }

    /**
     * Create a new pesanan with its detail lines.
     *
     * Request body:
     * {
     *   "NoPesanan": "PES001",
     *   "KodeResto": "R001",
     *   "items": [
     *     { "Kode": "M001", "Jumlah": 2, "Harga": 25000 },
     *     { "Kode": "M002", "Jumlah": 1, "Harga": 15000 }
     *   ]
     * }
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->Restoran) {
            return response()->json(['message' => 'Unauthorized. Only pelanggan can place orders.'], 403);
        }

        $request->validate([
            'NoPesanan'        => 'required|string|max:13|unique:pesanan,NoPesanan',
            'KodeResto'        => 'required|string|max:5|exists:mresto,KodeResto',
            'items'            => 'required|array|min:1',
            'items.*.Kode'     => 'required|string|max:5|exists:mmenu,KodeMenu',
            'items.*.Jumlah'   => 'required|integer|min:1',
            'items.*.Harga'    => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($request, $user) {
            // Count existing orders today for this resto to get NoUrutPesan
            $urutToday = Pesanan::where('KodeResto', $request->KodeResto)
                ->whereDate('Tgl', today())
                ->count() + 1;

            $pesanan = Pesanan::create([
                'NoPesanan'   => $request->NoPesanan,
                'Tgl'         => today(),
                'Plg'         => $user->KodeRestoPlg,
                'KodeResto'   => $request->KodeResto,
                'Status'      => 0, // 0 = pending
                'NoUrutPesan' => $urutToday,
            ]);

            foreach ($request->items as $item) {
                PesananDet::create([
                    'NoPesanan' => $pesanan->NoPesanan,
                    'Kode'      => $item['Kode'],
                    'Jumlah'    => $item['Jumlah'],
                    'Harga'     => $item['Harga'],
                ]);
            }

            $this->createdPesanan = $pesanan->load('detail.menu', 'resto');
        });

        $p = $this->createdPesanan;

        return response()->json([
            'message' => 'Pesanan created successfully.',
            'data'    => [
                'NoPesanan'   => $p->NoPesanan,
                'Tgl'         => $p->Tgl,
                'KodeResto'   => $p->KodeResto,
                'NamaResto'   => $p->resto?->Nama,
                'Status'      => $p->Status,
                'NoUrutPesan' => $p->NoUrutPesan,
                'detail'      => $p->detail->map(fn($d) => [
                    'KodeMenu' => $d->Kode,
                    'NamaMenu' => $d->menu?->NamaMenu,
                    'Jumlah'   => $d->Jumlah,
                    'Harga'    => $d->Harga,
                    'Subtotal' => $d->Jumlah * $d->Harga,
                ]),
                'Total' => $p->detail->sum(fn($d) => $d->Jumlah * $d->Harga),
            ],
        ], 201);
    }

    /**
     * Show a single pesanan (must belong to authenticated user).
     */
    public function show(Request $request, string $noPesanan)
    {
        $user = $request->user();

        $pesanan = Pesanan::with(['detail.menu', 'resto'])
            ->where('NoPesanan', $noPesanan)
            ->where('Plg', $user->KodeRestoPlg)
            ->firstOrFail();

        return response()->json([
            'data' => [
                'NoPesanan'   => $pesanan->NoPesanan,
                'Tgl'         => $pesanan->Tgl,
                'KodeResto'   => $pesanan->KodeResto,
                'NamaResto'   => $pesanan->resto?->Nama,
                'Status'      => $pesanan->Status,
                'NoUrutPesan' => $pesanan->NoUrutPesan,
                'detail'      => $pesanan->detail->map(fn($d) => [
                    'KodeMenu' => $d->Kode,
                    'NamaMenu' => $d->menu?->NamaMenu,
                    'Jumlah'   => $d->Jumlah,
                    'Harga'    => $d->Harga,
                    'Subtotal' => $d->Jumlah * $d->Harga,
                ]),
                'Total' => $pesanan->detail->sum(fn($d) => $d->Jumlah * $d->Harga),
            ],
        ]);
    }
}
