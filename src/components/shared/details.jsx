const DetailItem = ({ label, value }) => (
  <div>
    <label className="text-[#212C25] text-xs font-semibold">{label}</label>
    <p className="text-sm text-gray-700">{value || "N/A"}</p>
  </div>
);
