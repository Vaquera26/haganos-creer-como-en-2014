export default function Flag({ code, className = "w-6 h-4", alt = "" }) {
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={alt || code.toUpperCase()}
      className={`${className} object-cover rounded-sm`}
      loading="lazy"
    />
  );
}
