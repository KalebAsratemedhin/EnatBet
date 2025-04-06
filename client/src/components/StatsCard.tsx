export const StatsCard = ({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) => (
    <div className="bg-white shadow-md p-4 rounded-md flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
  