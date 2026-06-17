type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-black text-slate-900">
        {title}
      </h2>

      {subtitle && (
        <p className="text-gray-600 text-sm mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}