export function ZoneLegend() {
  return (
    <div className="absolute bottom-6 right-6 z-[1000] bg-white p-3 rounded-md shadow-md border text-xs">
      <h4 className="font-semibold mb-2">Stress Zone Severity</h4>
      <div className="flex items-center mb-1">
        <span className="w-3 h-3 rounded-full bg-green-500 mr-2 inline-block"></span> Low
      </div>
      <div className="flex items-center mb-1">
        <span className="w-3 h-3 rounded-full bg-orange-500 mr-2 inline-block"></span> Moderate
      </div>
      <div className="flex items-center">
        <span className="w-3 h-3 rounded-full bg-red-500 mr-2 inline-block"></span> High
      </div>
      <div className="mt-2 pt-2 border-t text-slate-500 italic">
        Size corresponds to area
      </div>
    </div>
  )
}
