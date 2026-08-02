import useLanguage from "../../hooks/useLanguage";
import SeamlessLoop from "../common/SeamlessLoop";

const englishItems = [
  "ONLINE STORES",
  "BUSINESS WEBSITES",
  "LANDING PAGES",
  "CUSTOM SYSTEMS",
  "BUILT WITH CLARITY",
  "DESIGNED TO CONVERT",
];

const arabicItems = [
  "متاجر إلكترونية",
  "مواقع أعمال",
  "صفحات هبوط",
  "أنظمة مخصصة",
  "مبنية بوضوح",
  "مصممة لتحقيق النتائج",
];

function GoldMarquee() {
  const { effectiveLanguage, isArabic } = useLanguage();
  const items = isArabic ? arabicItems : englishItems;

  return (
    <section
      className={`wd-gold-marquee${isArabic ? " is-arabic" : ""}`}
      aria-label={isArabic ? "خدمات Web District" : "Web District services"}
    >
      <SeamlessLoop
        key={effectiveLanguage}
        items={items}
        direction={isArabic ? "left-to-right" : "right-to-left"}
        duration={34}
        className="wd-gold-marquee__loop"
        setClassName="wd-gold-marquee__set"
        renderItem={(item, { hidden, repeatIndex }) => (
          <span
            key={`${item}-${repeatIndex}`}
            dir={isArabic ? "rtl" : "ltr"}
            aria-hidden={hidden || undefined}
          >
            {item}
          </span>
        )}
      />
    </section>
  );
}

export default GoldMarquee;
