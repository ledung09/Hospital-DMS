export default function Line({ text }: { text: string }) {
  return (
    <div className="relative flex lg:py-8 py-4 items-center">
      <div className="flex-grow border-t bg-transparent shadow-sm"></div>
      <span className="flex-shrink mx-4 text-gray-400 uppercase text-sm font-medium">
        {text}
      </span>
      <div className="flex-grow border-t bg-transparent shadow-sm"></div>
    </div>
  );
}
