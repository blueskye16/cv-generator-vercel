import { LuExternalLink } from "react-icons/lu";
import { GoDash } from "react-icons/go";
import { useCvStore } from "@stores/index.mjs";
import DOMPurify from "dompurify";

const safeHtml = (dangerousHtml) => DOMPurify.sanitize(dangerousHtml);

const useAiHighlight = (sectionKey, entryId, currentDescription) => {
  const realCvData = useCvStore((state) => state.cvData);

  if (!sectionKey || !entryId) return { isChanged: false, highlightClass: "" };

  const originalEntry = realCvData[sectionKey]?.entries.find(
    (e) => e.id === entryId,
  );

  const isChanged =
    originalEntry && originalEntry.description !== currentDescription;

  const highlightClass = isChanged
    ? "bg-green-50 dark:bg-green-900/20 relative transition-all duration-300"
    : "relative transition-all duration-300";

  return { isChanged, highlightClass };
};

export const EntryDescription = ({
  id,
  sectionKey,
  entry,
  description,
  configCv,
}) => {
  const { highlightClass } = useAiHighlight(sectionKey, id, description);

  return (
    <div
      className={`${highlightClass}`}
      style={{
        fontSize: configCv.fontSize,
        lineHeight: configCv.leadingSize,
        marginTop: configCv.gapHeading,
      }}
      dangerouslySetInnerHTML={{
        __html: safeHtml(description),
      }}
    />
  );
};

export const EntryNormal = ({
  id,
  sectionKey,
  entry,
  title,
  url,
  subtitle,
  description,
  date,
  location,
  configCv,
}) => {
  const { highlightClass } = useAiHighlight(sectionKey, id, description);

  return (
    <div
      className={`flex items-start justify-between gap-4 ${highlightClass}`}
      style={{ marginTop: configCv.gapHeading }}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        {!url ? (
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-semibold">{title}</span>
            {subtitle && (
              <span className="flex items-end leading-tight font-medium text-gray-700 italic dark:text-gray-400">
                — {subtitle}
              </span>
            )}
          </div>
        ) : (
          <a
            href={url}
            rel="noreferrer"
            className="group flex cursor-pointer items-center gap-1 rounded-sm no-underline hover:bg-yellow-100 dark:hover:bg-gray-700 print:bg-transparent print:no-underline"
          >
            <span className="font-semibold group-hover:border-black print:border-none">
              {title}
            </span>
            {subtitle && (
              <span className="flex items-end leading-tight font-medium text-gray-700 italic dark:text-gray-400">
                — {subtitle}
                <LuExternalLink
                  className="ml-1 text-gray-400 group-hover:text-black dark:group-hover:text-white"
                  size={12}
                />
              </span>
            )}
          </a>
        )}
        <div
          className="text-justify text-black dark:text-gray-300"
          style={{
            lineHeight: configCv?.leadingSize,
          }}
          dangerouslySetInnerHTML={{ __html: safeHtml(description) }}
        />
      </div>
      <div className="flex w-30 shrink-0 flex-col items-end text-right">
        <span className="font-medium whitespace-nowrap">{date}</span>
        <span
          className="wrap-break-words leading-tight text-gray-600 dark:text-gray-300"
          style={{ fontSize: configCv.fontSize }}
        >
          {location}
        </span>
      </div>
    </div>
  );
};

export const EntrySimple = ({
  id,
  sectionKey,
  entry,
  title,
  description,
  date,
  url,
  configCv,
  templateType,
}) => {
  const plainText = description.replace(/<[^>]+>/g, "");
  const isLongText = plainText.length > 60;

  const { highlightClass } = useAiHighlight(sectionKey, id, description);

  const EntryOneLine = () => (
    <div
      className={`flex items-start justify-between gap-4 ${highlightClass}`}
      style={{ marginTop: configCv.gapHeading }}
    >
      {!url ? (
        <div className={!isLongText ? "flex" : ""}>
          <span className="mr-1 font-semibold">{title},</span>
          <span dangerouslySetInnerHTML={{ __html: safeHtml(description) }} />
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className={`group ${!isLongText ? "flex" : ""} w-full cursor-pointer hover:bg-yellow-100 dark:hover:bg-gray-700 print:bg-transparent print:no-underline`}
        >
          <span className="pr-2 font-semibold">{title},</span>
          <span
            className={isLongText ? "inline-block" : ""}
            dangerouslySetInnerHTML={{ __html: safeHtml(description) }}
          />
          <LuExternalLink
            size={12}
            className="ml-1 inline text-gray-400 group-hover:text-black dark:group-hover:text-white"
          />
        </a>
      )}
      <span className="shrink-0 font-medium whitespace-nowrap">{date}</span>
    </div>
  );

  const EntryMultiLine = () => (
    <div
      className={`grid w-[80%] grid-cols-[120px_20px_1fr] items-baseline ${highlightClass}`}
      style={{ marginTop: configCv?.gapHeading || "4px" }}
    >
      <span className="text-left leading-snug font-bold text-black dark:text-white">
        {title}
      </span>

      <span className="flex justify-center text-gray-500 dark:text-gray-300">
        <GoDash size={14} className="translate-y-0.5" />
      </span>

      <div
        className="text-justify leading-snug text-gray-900 dark:text-gray-300 [&_p]:m-0"
        dangerouslySetInnerHTML={{ __html: safeHtml(description) }}
      />
    </div>
  );

  return (
    <>{templateType === "simple" ? <EntryOneLine /> : <EntryMultiLine />}</>
  );
};
