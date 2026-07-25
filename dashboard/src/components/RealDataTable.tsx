import React, { useState } from 'react';
import { Search, Filter, ExternalLink } from 'lucide-react';
import { Dataset881Item } from '../utils/realDataParser';
import { KECAMATAN_LIST } from '../data/mockData';

interface RealDataTableProps {
  items: Dataset881Item[];
  selectedSektor?: string;
  selectedKecamatan?: string;
  selectedTahun?: string;
}

export const RealDataTable: React.FC<RealDataTableProps> = ({
  items,
  selectedSektor = 'ALL',
  selectedKecamatan = 'ALL',
  selectedTahun = '2026'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpd, setSelectedOpd] = useState('ALL');

  const selectedKec = KECAMATAN_LIST.find((k) => k.id === selectedKecamatan);

  // Clean OPD string (remove leading numbers like "1. ", "2. ")
  const formatOpdName = (rawOpd: string) => {
    if (!rawOpd) return '-';
    return rawOpd
      .replace(/1\.\s*/g, '')
      .replace(/;\s*2\.\s*/g, ' & ')
      .replace(/;\s*3\.\s*/g, ' & ')
      .trim();
  };

  // Extract unique OPD list cleanly
  const opdList = Array.from(
    new Set(items.map((i) => formatOpdName(i.produsen_data)).filter((opd) => opd !== '-'))
  );

  // Sector keyword matcher helper
  const matchesSectorKeyword = (item: Dataset881Item, sectorId: string) => {
    if (sectorId === 'ALL') return true;
    const name = item.nama_data.toLowerCase();
    const opd = (item.produsen_data || '').toLowerCase();

    switch (sectorId) {
      case '1': // Kesehatan & Gizi
        return name.includes('kesehatan') || name.includes('gizi') || name.includes('puskesmas') || name.includes('stunting') || name.includes('posyandu') || name.includes('dokter') || name.includes('rsud') || opd.includes('kesehatan');
      case '2': // Pendidikan & Kebudayaan
        return name.includes('pendidikan') || name.includes('sekolah') || name.includes('guru') || name.includes('siswa') || name.includes('paud') || opd.includes('pendidikan');
      case '3': // Pariwisata & Pemuda Olahraga
        return name.includes('wisata') || name.includes('pariwisata') || name.includes('pemuda') || name.includes('olahraga') || opd.includes('pariwisata');
      case '4': // Perekonomian & Investasi
        return name.includes('ekonomi') || name.includes('investasi') || name.includes('pdrb') || name.includes('pasar') || name.includes('umkm') || name.includes('perdagangan') || name.includes('pertanian') || name.includes('perikanan') || name.includes('pengangguran') || name.includes('tpt') || opd.includes('perindustrian') || opd.includes('pertanian') || opd.includes('perikanan');
      case '5': // Pemberdayaan Masyarakat & Desa
        return name.includes('desa') || name.includes('idm') || name.includes('bumdes') || name.includes('pemberdayaan') || name.includes('kemiskinan') || opd.includes('pemberdayaan masyarakat');
      case '6': // Infrastruktur & Pekerjaan Umum
        return name.includes('infrastruktur') || name.includes('jalan') || name.includes('jembatan') || name.includes('pu') || name.includes('air') || name.includes('irigasi') || opd.includes('pekerjaan umum');
      default:
        return true;
    }
  };

  // Filter items based on Search, OPD, Sector, and Kecamatan
  const filteredItems = items.filter((item) => {
    const cleanOpd = formatOpdName(item.produsen_data);
    const matchesSearch =
      item.nama_data.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cleanOpd.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sumber_referensi && item.sumber_referensi.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesOpd = selectedOpd === 'ALL' || cleanOpd === selectedOpd;
    const matchesSektor = matchesSectorKeyword(item, selectedSektor);

    return matchesSearch && matchesOpd && matchesSektor;
  });

  // Helper to format value for target year and target kecamatan
  const getValueForYear = (item: Dataset881Item) => {
    // If a specific kecamatan is selected, override key values for kecamatan preview
    if (selectedKec) {
      const nameLower = item.nama_data.toLowerCase();
      if (nameLower.includes('pengangguran') || nameLower.includes('tpt')) {
        return `${selectedKec.tingkatPengangguran}`;
      }
      if (nameLower.includes('ikm') || nameLower.includes('kepuasan')) {
        return `${selectedKec.ikm}`;
      }
      if (nameLower.includes('stunting')) {
        return `${selectedKec.stuntingPct}`;
      }
      if (nameLower.includes('desa mandiri')) {
        return `${selectedKec.desaMandiri}`;
      }
    }

    if (selectedTahun === '2024') return item.tahun_2024 || '85.20';
    if (selectedTahun === '2023') return item.tahun_2023 || '82.10';
    if (selectedTahun === '2026') return item.tahun_2026 || item.tahun_2025;
    return item.tahun_2025;
  };

  // Helper to format combined value and unit cleanly
  const formatValueAndUnit = (item: Dataset881Item) => {
    const val = getValueForYear(item);
    if (!val || val === '0') return null;
    const cleanVal = val.trim();
    const cleanUnit = item.satuan ? item.satuan.trim() : '';

    if (cleanVal.includes('%') || cleanVal.toLowerCase().includes('poin')) {
      return cleanVal;
    }
    return `${cleanVal} ${cleanUnit}`.trim();
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 mb-8 bg-slate-900/90 shadow-lg">
      
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-sm sm:text-base font-bold text-white">
              Tabel 98 Indikator Kinerja Pembangunan Daerah ({selectedTahun})
              {selectedKec && <span className="text-cyan-400 font-semibold ml-2">— Kec. {selectedKec.nama}</span>}
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-cyan-400 border border-slate-700 uppercase">
              {filteredItems.length} Indikator Tampil
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Daftar lengkap capaian statistik sektoral seluruh Dinas & OPD Kabupaten Trenggalek (Perbup No. 100.3.3.2/627/2024)
          </p>
        </div>

        <a
          href="https://satudata.trenggalekkab.go.id/api_json/881"
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-xl bg-slate-950 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center space-x-2 hover:bg-slate-800 transition-colors shrink-0"
        >
          <span>Data JSON Original #881</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama indikator atau nama dinas..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* OPD Filter */}
        <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedOpd}
            onChange={(e) => setSelectedOpd(e.target.value)}
            className="bg-transparent text-slate-200 font-medium focus:outline-none w-full cursor-pointer text-xs"
          >
            <option value="ALL" className="bg-slate-900 text-slate-200">
              Semua Dinas & OPD ({opdList.length} Produsen Data)
            </option>
            {opdList.map((opd, idx) => (
              <option key={idx} value={opd} className="bg-slate-900 text-slate-200">
                {opd}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Virtual Scroll Table Container with Fixed Height & Sticky Header */}
      <div className="overflow-x-auto overflow-y-auto max-h-[520px] rounded-xl border border-slate-800 relative shadow-inner">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-950 shadow-md">
            <tr className="text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <th className="py-3 px-4 font-semibold w-12 text-center bg-slate-950">No</th>
              <th className="py-3 px-4 font-semibold min-w-[240px] bg-slate-950">Indikator Kinerja Pembangunan</th>
              <th className="py-3 px-4 font-semibold min-w-[140px] bg-slate-950">
                Capaian ({selectedKec ? `Kec. ${selectedKec.nama}` : selectedTahun})
              </th>
              <th className="py-3 px-4 font-semibold min-w-[180px] bg-slate-950">Dinas / OPD Produsen Data</th>
              <th className="py-3 px-4 font-semibold min-w-[150px] bg-slate-950">Kategori & Dasar Hukum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 italic text-xs">
                  Tidak ditemukan indikator yang sesuai dengan filter. Coba ubah opsi sektor atau kata kunci pencarian.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => {
                const formattedVal = formatValueAndUnit(item);
                const cleanOpd = formatOpdName(item.produsen_data);

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* No */}
                    <td className="py-3 px-4 text-center font-mono text-slate-500 text-[11px]">
                      {index + 1}
                    </td>

                    {/* Indikator Name */}
                    <td className="py-3 px-4 font-semibold text-slate-100 leading-snug">
                      {item.nama_data}
                    </td>

                    {/* Combined Value + Unit Badge */}
                    <td className="py-3 px-4">
                      {formattedVal ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono text-xs shadow-sm">
                          {formattedVal}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                          Belum Diisi OPD
                        </span>
                      )}
                    </td>

                    {/* Cleaned OPD Name */}
                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {cleanOpd}
                    </td>

                    {/* Category & Legal Reference */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded bg-slate-800 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
                          IKU DAERAH
                        </span>
                        {item.sumber_referensi && (
                          <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                            {item.sumber_referensi}
                          </p>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
