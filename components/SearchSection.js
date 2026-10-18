'use client';

import { useState } from 'react';
import { 
  Search, 
  ArrowRightLeft, 
  Train, 
  Calendar, 
  AlertCircle, 
  ArrowRight, 
  MapPin, 
  Loader2, 
  Sparkles,
  ShoppingBag,
  Star,
  Volume2
} from 'lucide-react';
import { playRailwayChime } from '@/lib/audio-chime';
import StationSelect from './forms/StationSelect';
import FormInput from './forms/FormInput';
import { useCartStore } from '@/store/useCartStore';
import { useApp } from '@/context/AppContext';

export default function SearchSection({ onTrackTrain }) {
  const [searchMode, setSearchMode] = useState('stations'); // 'stations' | 'number'
  
  // Station search state
  const [selectedFrom, setSelectedFrom] = useState({ code: 'NDLS', name: 'New Delhi', state: 'Delhi' });
  const [selectedTo, setSelectedTo] = useState({ code: 'MMCT', name: 'Mumbai Central', state: 'Maharashtra' });
  
  // Direct Train number search state
  const [trainNumberInput, setTrainNumberInput] = useState('');
  
  // Results & Loading state
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Booking Modal State for Selected Train
  const [bookingTrain, setBookingTrain] = useState(null);
  const [selectedClass, setSelectedClass] = useState('3A');
  const [selectedQuota, setSelectedQuota] = useState('GN');
  const [passengerCount, setPassengerCount] = useState(1);

  const { addItem, setCartOpen } = useCartStore();
  const { watchlist, addToWatchlist, removeFromWatchlist, isWatchlisted, triggerTrainAnnouncement, addToast } = useApp();

  const handleSwapStations = () => {
    const temp = selectedFrom;
    setSelectedFrom(selectedTo);
    setSelectedTo(temp);
  };

  // Perform train search between stations
  const handleStationSearch = async (e) => {
    if (e) e.preventDefault();
    if (!selectedFrom?.code || !selectedTo?.code) {
      setErrorMessage('Please choose valid departure and arrival stations.');
      return;
    }
    if (selectedFrom.code === selectedTo.code) {
      setErrorMessage('Source and Destination stations cannot be identical.');
      return;
    }

    setErrorMessage('');
    setIsSearching(true);
    setSearchResults(null);

    try {
      const res = await fetch(`/api/search?from=${selectedFrom.code}&to=${selectedTo.code}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.data || []);
        playRailwayChime();
      } else {
        setErrorMessage(data.error || 'No trains found for this route.');
      }
    } catch (err) {
      setErrorMessage('Network or server error while querying trains. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Perform direct train number tracking
  const handleTrainNumberSubmit = (e) => {
    e.preventDefault();
    const cleanNum = trainNumberInput.trim();
    if (!cleanNum || cleanNum.length !== 5 || isNaN(cleanNum)) {
      setErrorMessage('Please enter a valid 5-digit Indian Railways train number (e.g. 12952).');
      return;
    }
    setErrorMessage('');
    playRailwayChime();
    onTrackTrain(cleanNum);
  };

  // Quick preset shortcuts
  const selectQuickRoute = (fromCode, fromName, toCode, toName) => {
    setSelectedFrom({ code: fromCode, name: fromName });
    setSelectedTo({ code: toCode, name: toName });
    setSearchMode('stations');
  };

  // Confirm booking into cart
  const handleConfirmBooking = () => {
    if (!bookingTrain) return;

    let baseFare = 1450;
    if (selectedClass === '1A') baseFare = 3850;
    else if (selectedClass === '2A') baseFare = 2450;
    else if (selectedClass === '3A') baseFare = 1680;
    else if (selectedClass === 'SL') baseFare = 640;

    addItem({
      trainNumber: bookingTrain.trainNumber,
      trainName: bookingTrain.trainName,
      fromStation: bookingTrain.fromStation || selectedFrom.code,
      toStation: bookingTrain.toStation || selectedTo.code,
      travelDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      travelClass: selectedClass,
      quota: selectedQuota,
      baseFare,
      passengers: Array.from({ length: passengerCount }).map((_, i) => ({
        name: `Passenger ${i + 1}`,
        age: 25 + i * 2,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        berthPref: 'Lower Berth',
      })),
    });

    setBookingTrain(null);
    setCartOpen(true);
    addToast(`${bookingTrain.trainNumber} added to Journey Cart!`, 'success');
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Search Type Mode Switcher */}
      <div className="station-signboard p-4 sm:p-6 rounded-2xl transition-colors shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="station-code-pill text-xs">ENQUIRY</span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-wide">
              TRAIN SEARCH & CORRIDOR ROUTE ENGINE
            </h2>
          </div>

          <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-300 dark:border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => { setSearchMode('stations'); setErrorMessage(''); }}
              className={`px-3.5 py-1.5 font-bold rounded-lg transition-all ${
                searchMode === 'stations'
                  ? 'bg-amber-500 dark:bg-station-yellow text-black shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Between Stations
            </button>
            <button
              type="button"
              onClick={() => { setSearchMode('number'); setErrorMessage(''); }}
              className={`px-3.5 py-1.5 font-bold rounded-lg transition-all ${
                searchMode === 'number'
                  ? 'bg-amber-500 dark:bg-station-yellow text-black shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Train Number
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">INQUIRY NOTICE: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* MODE A: Between Stations Search */}
        {searchMode === 'stations' && (
          <form onSubmit={handleStationSearch} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 items-center">
              {/* FROM STATION */}
              <div className="lg:col-span-5">
                <StationSelect
                  label="ORIGIN STATION (FROM)"
                  value={selectedFrom}
                  onChange={setSelectedFrom}
                  required
                />
              </div>

              {/* SWAP BUTTON */}
              <div className="lg:col-span-1 flex justify-center pt-5">
                <button
                  type="button"
                  onClick={handleSwapStations}
                  className="p-2.5 rounded-full border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-station-yellow hover:rotate-180 transition-all duration-300 text-slate-600 dark:text-zinc-300 shadow-sm"
                  title="Swap Origin and Destination"
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              {/* TO STATION */}
              <div className="lg:col-span-5">
                <StationSelect
                  label="DESTINATION STATION (TO)"
                  value={selectedTo}
                  excludeCode={selectedFrom?.code}
                  onChange={setSelectedTo}
                  required
                />
              </div>
            </div>

            {/* Quick Route Shortcuts & Search Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
                <span className="font-bold text-slate-700 dark:text-zinc-300">Popular Corridors:</span>
                <button
                  type="button"
                  onClick={() => selectQuickRoute('NDLS', 'New Delhi', 'MMCT', 'Mumbai Central')}
                  className="hover:text-black dark:hover:text-white underline underline-offset-2"
                >
                  NDLS → MMCT
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => selectQuickRoute('NDLS', 'New Delhi', 'BSB', 'Varanasi Jn')}
                  className="hover:text-black dark:hover:text-white underline underline-offset-2"
                >
                  NDLS → BSB
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => selectQuickRoute('NDLS', 'New Delhi', 'HWH', 'Howrah Jn')}
                  className="hover:text-black dark:hover:text-white underline underline-offset-2"
                >
                  NDLS → HWH
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => selectQuickRoute('MAS', 'Chennai Central', 'SBC', 'KSR Bengaluru')}
                  className="hover:text-black dark:hover:text-white underline underline-offset-2"
                >
                  MAS → SBC
                </button>
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="rail-btn-primary w-full sm:w-auto"
              >
                {isSearching ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Searching Rail Network...</span>
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    <span>Find Running Trains</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* MODE B: Direct Train Number Search */}
        {searchMode === 'number' && (
          <form onSubmit={handleTrainNumberSubmit} className="mt-5 space-y-4">
            <div className="max-w-xl">
              <label className="block text-xs font-mono text-amber-700 dark:text-station-yellow font-bold uppercase mb-1">
                Indian Railways 5-Digit Train Number
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    maxLength={5}
                    value={trainNumberInput}
                    onChange={(e) => setTrainNumberInput(e.target.value)}
                    placeholder="e.g. 12952 (Rajdhani), 22436 (Vande Bharat)..."
                    className="rail-input font-mono text-base font-bold tracking-widest !pl-12 !pr-4 !py-3 uppercase"
                  />
                  <Train size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 dark:text-station-yellow pointer-events-none z-10" />
                </div>
                <button type="submit" className="rail-btn-primary">
                  <Train size={16} />
                  <span>Track Live Status</span>
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
                <span>Sample Trains:</span>
                <button
                  type="button"
                  onClick={() => setTrainNumberInput('12952')}
                  className="font-mono text-amber-700 dark:text-station-yellow font-bold hover:underline"
                >
                  12952
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setTrainNumberInput('22436')}
                  className="font-mono text-amber-700 dark:text-station-yellow font-bold hover:underline"
                >
                  22436
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setTrainNumberInput('12002')}
                  className="font-mono text-amber-700 dark:text-station-yellow font-bold hover:underline"
                >
                  12002
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Train Search Results Board */}
      {searchResults && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400 px-1 font-mono">
            <span>
              FOUND {searchResults.length} TRAIN(S) BETWEEN{' '}
              <strong className="text-amber-700 dark:text-station-yellow">{selectedFrom.code}</strong> AND{' '}
              <strong className="text-amber-700 dark:text-station-yellow">{selectedTo.code}</strong>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">● LIVE CORRIDOR SCHEDULES</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {searchResults.map((train) => {
              const inWatchlist = isWatchlisted(train.trainNumber);
              return (
                <div
                  key={train.trainNumber}
                  className="station-signboard p-4 rounded-xl hover:border-station-yellow transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                >
                  {/* Train Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="train-number-badge">{train.trainNumber}</span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-wide">
                        {train.trainName}
                      </h3>
                      {/* Watchlist Star Toggle */}
                      <button
                        onClick={() => inWatchlist ? removeFromWatchlist(train.trainNumber) : addToWatchlist(train)}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors ${
                          inWatchlist ? 'text-amber-500' : 'text-slate-400'
                        }`}
                        title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star size={15} fill={inWatchlist ? 'currentColor' : 'none'} />
                      </button>

                      {/* Station Audio Announcement */}
                      <button
                        onClick={() => triggerTrainAnnouncement({
                          trainNumber: train.trainNumber,
                          trainName: train.trainName,
                          origin: selectedFrom.name,
                          destination: selectedTo.name,
                          platform: '1'
                        })}
                        className="p-1 rounded text-slate-400 hover:text-station-yellow hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Broadcast Voice Announcement"
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono text-slate-600 dark:text-zinc-400 pt-1 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-900 dark:text-white font-bold">{train.departureTime}</span>
                        <span className="text-amber-700 dark:text-station-yellow font-bold">({train.fromStation || selectedFrom.code})</span>
                      </div>
                      <ArrowRight size={14} className="text-slate-400 dark:text-zinc-600" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-900 dark:text-white font-bold">{train.arrivalTime}</span>
                        <span className="text-amber-700 dark:text-station-yellow font-bold">({train.toStation || selectedTo.code})</span>
                      </div>
                      <span className="hidden sm:inline text-slate-300 dark:text-zinc-700">|</span>
                      <span className="hidden sm:inline text-slate-700 dark:text-zinc-300 font-medium">{train.duration}</span>
                    </div>
                  </div>

                  {/* Available Classes & Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-zinc-800">
                    {/* Book Ticket Button */}
                    <button
                      onClick={() => setBookingTrain(train)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <ShoppingBag size={13} />
                      <span>Book / Cart</span>
                    </button>

                    {/* Track Train Live */}
                    <button
                      onClick={() => onTrackTrain(train.trainNumber)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 dark:bg-station-yellow hover:opacity-90 text-black font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Train size={13} />
                      <span>Track Live</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Booking Modal */}
      {bookingTrain && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] text-amber-600 dark:text-station-yellow font-bold uppercase">RESERVATION BOOKING</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                  {bookingTrain.trainNumber} - {bookingTrain.trainName}
                </h3>
              </div>
              <button onClick={() => setBookingTrain(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Class Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-zinc-300">SELECT TRAVEL CLASS</label>
                <div className="grid grid-cols-4 gap-2">
                  {['1A', '2A', '3A', 'SL'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedClass(c)}
                      className={`py-2 rounded-lg font-bold border transition-colors ${
                        selectedClass === c
                          ? 'border-station-yellow bg-amber-500/10 text-station-yellow ring-1 ring-station-yellow'
                          : 'border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quota Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-zinc-300">QUOTA</label>
                <select
                  value={selectedQuota}
                  onChange={(e) => setSelectedQuota(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 outline-none text-slate-900 dark:text-zinc-100"
                >
                  <option value="GN">General Quota (GN)</option>
                  <option value="TQ">Tatkal Emergency Quota (TQ)</option>
                  <option value="LD">Ladies Quota (LD)</option>
                  <option value="SS">Senior Citizen Concession (SS)</option>
                </select>
              </div>

              {/* Passenger Count */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-zinc-300">NUMBER OF PASSENGERS</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-zinc-800 font-bold"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{passengerCount}</span>
                  <button
                    type="button"
                    onClick={() => setPassengerCount(Math.min(6, passengerCount + 1))}
                    className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-zinc-800 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex gap-2">
              <button
                type="button"
                onClick={() => setBookingTrain(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-800 text-xs font-bold text-slate-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-station-yellow text-black text-xs font-black uppercase tracking-wider shadow-md"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
