type AdBoxProps = {
  title?: string;
  height?: string;
};

export default function AdBox({
  title = "Advertisement",
  height = "h-28",
}: AdBoxProps) {
  return (
    <div
      className={`w-full ${height} bg-gradient-to-br from-gray-50 to-gray-100 border border-dashed border-gray-300 rounded-3xl flex items-center justify-center my-6`}
    >
      <div className="text-center px-4">
        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
          {title}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Ad space will appear here after approval
        </p>
      </div>
    </div>
  );
}