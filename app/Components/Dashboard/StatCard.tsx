interface StatCardProps {
  title: string;
  value: number;
  color?: string;
  icon?: React.ReactNode;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color = "bg-white",
  icon,
  suffix,
}) => {
  return (
    <div className={`rounded-lg p-4 shadow-md ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-bold mt-1">
            {value}
            {suffix}
          </p>
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  );
};
export default StatCard;
